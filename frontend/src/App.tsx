import { useState, useEffect, useCallback } from "react";
import type { Conversation, ChatMessage } from "./types";
import { createUserMessage } from "./types";
import {
  uploadDocument,
  getConversations,
  getConversation,
  askQuestion,
} from "./api/client";
import FileUpload from "./components/FileUpload";
import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(true);

  const loadConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch {}
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  async function handleUpload(file: File) {
    setIsUploading(true);
    setError(null);
    try {
      const result = await uploadDocument(file);
      setActiveConversation(result.conversation);
      setMessages([]);
      setShowUpload(false);
      await loadConversations();
    } catch {
      setError("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSelectConversation(id: string) {
    setError(null);
    try {
      const conv = await getConversation(id);
      setActiveConversation(conv);
      setMessages(conv.messages);
      setShowUpload(false);
    } catch {
      setError("Failed to load conversation.");
    }
  }

  async function handleSend(question: string) {
    if (!activeConversation) return;

    const userMsg = createUserMessage(question);
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const aiMsg = await askQuestion(activeConversation.id, question);
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setError("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewChat() {
    setActiveConversation(null);
    setMessages([]);
    setShowUpload(true);
    setError(null);
  }

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeId={activeConversation?.id ?? null}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
      />

      <main className="main">
        {error && <div className="error-banner">{error}</div>}

        {showUpload ? (
          <div className="upload-page">
            <h1>Upload a Document</h1>
            <p>Upload a PDF to start asking questions about it.</p>
            <FileUpload onUpload={handleUpload} isUploading={isUploading} />
          </div>
        ) : activeConversation ? (
          <ChatInterface
            messages={messages}
            onSend={handleSend}
            isLoading={isLoading}
            documentName={activeConversation.document.filename}
          />
        ) : null}
      </main>
    </div>
  );
}
