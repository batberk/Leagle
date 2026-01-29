from rest_framework import serializers
from .models import Document, Conversation, ChatMessage


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ["id", "filename", "uploaded_at"]


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "role", "content", "page_number", "reference_text", "created_at"]


class ConversationSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    document = DocumentSerializer(read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "document", "messages", "created_at"]


class AskQuestionSerializer(serializers.Serializer):
    question = serializers.CharField(max_length=2000)
