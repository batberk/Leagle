from django.db import transaction
from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from .models import Document, Conversation, ChatMessage
from .serializers import (
    DocumentSerializer,
    ConversationSerializer,
    ChatMessageSerializer,
    AskQuestionSerializer,
)
from .services import DocumentQAService


class DocumentViewSet(viewsets.ViewSet):
    parser_classes = [MultiPartParser]

    def create(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response(
                {"error": "No file provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not file.name.lower().endswith(".pdf"):
            return Response(
                {"error": "Only PDF files are accepted."},
                status=status.HTTP_400_BAD_REQUEST
            )

        document = Document.objects.create(file=file, filename=file.name)
        conversation = Conversation.objects.create(document=document)

        return Response(
            {
                "document": DocumentSerializer(document).data,
                "conversation": ConversationSerializer(conversation).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ConversationViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    queryset = Conversation.objects.select_related("document").order_by("-created_at")
    serializer_class = ConversationSerializer
    lookup_field = "pk"

    @action(detail=True, methods=["post"])
    def ask(self, request, pk=None):
        conversation = self.get_object()

        serializer = AskQuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = serializer.validated_data["question"]
        document_path = conversation.document.file.path

        try:
            service = DocumentQAService()
            result = service.ask(document_path, conversation, question)
        except Exception as e:
            return Response(
                {"error": f"Failed to process question: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        with transaction.atomic():
            ChatMessage.objects.create(
                conversation=conversation,
                role="human",
                content=question
            )
            ai_message = ChatMessage.objects.create(
                conversation=conversation,
                role="ai",
                content=result["answer"],
                page_number=result.get("page_number"),
                reference_text=result.get("reference_text"),
            )

        return Response(ChatMessageSerializer(ai_message).data)
