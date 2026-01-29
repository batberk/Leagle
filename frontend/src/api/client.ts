import type { UploadResponse, Conversation, ChatMessage } from "../types";

const BASE_URL = "/api";

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${BASE_URL}/upload/`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload failed");
  }
  return response.json();
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(`${BASE_URL}/conversations/`);
  if (!response.ok) throw new Error("Failed to load conversations");
  return response.json();
}

export async function getConversation(id: string): Promise<Conversation> {
  const response = await fetch(`${BASE_URL}/conversations/${id}/`);
  if (!response.ok) throw new Error("Failed to load conversation");
  return response.json();
}

export async function askQuestion(
  conversationId: string,
  question: string
): Promise<ChatMessage> {
  const response = await fetch(`${BASE_URL}/conversations/${conversationId}/ask/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get answer");
  }
  return response.json();
}
