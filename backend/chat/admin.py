from django.contrib import admin
from .models import Document, Conversation, ChatMessage


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("filename", "uploaded_at")
    search_fields = ("filename",)


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ("id", "document", "created_at")
    list_filter = ("created_at",)


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("role", "conversation", "created_at")
    list_filter = ("role", "created_at")
