import fitz
from typing import Optional, List, Dict
from django.conf import settings
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from pydantic import BaseModel, Field

from .models import ChatMessage


class AnswerResponse(BaseModel):
    answer: str = Field(description="A natural language answer to the question")
    page_number: Optional[int] = Field(
        default=None,
        description="The page number where the answer was found (1-indexed)",
    )
    reference_text: Optional[str] = Field(
        default=None,
        description="A short verbatim quote from the document that supports the answer",
    )


class PDFExtractor:
    @staticmethod
    def extract(file_path: str) -> List[Dict]:
        pages = []
        with fitz.open(file_path) as doc:
            for page_num in range(len(doc)):
                text = doc[page_num].get_text()
                if text.strip():
                    pages.append({"page": page_num + 1, "text": text})
        return pages

    @staticmethod
    def build_context(pages: List[Dict]) -> str:
        return "\n\n".join(f"--- Page {p['page']} ---\n{p['text']}" for p in pages)


class DocumentQAService:
    SYSTEM_PROMPT = (
        "You are a helpful document assistant. Answer questions based on "
        "the provided document content. Always cite the page number and include "
        "a short reference quote from the document when possible."
    )

    def __init__(self):
        self.llm = ChatOpenAI(
            model=settings.OPENAI_MODEL,
            temperature=0,
            api_key=settings.OPENAI_API_KEY,
        )
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self.SYSTEM_PROMPT),
            ("system", "DOCUMENT CONTENT:\n{context}"),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{question}"),
        ])

    def _get_conversation_history(self, conversation) -> List:
        messages = ChatMessage.objects.filter(conversation=conversation).order_by("created_at")
        history = []
        for msg in messages:
            if msg.role == "human":
                history.append(HumanMessage(content=msg.content))
            else:
                history.append(AIMessage(content=msg.content))
        return history

    def ask(self, document_path: str, conversation, question: str) -> Dict:
        pages = PDFExtractor.extract(document_path)
        context = PDFExtractor.build_context(pages)
        history = self._get_conversation_history(conversation)

        structured_llm = self.llm.with_structured_output(AnswerResponse)
        chain = self.prompt | structured_llm

        result: AnswerResponse = chain.invoke({
            "context": context,
            "history": history,
            "question": question,
        })

        return result.model_dump()
