export const ROLES = {
  HUMAN: "human",
  AI: "ai",
} as const;

export const FILE_TYPES = {
  PDF: "application/pdf",
} as const;

export interface Document {
  id: string;
  filename: string;
  uploaded_at: string;
}

export interface ChatMessage {
  id: string;
  role: "human" | "ai";
  content: string;
  page_number: number | null;
  reference_text: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  document: Document;
  messages: ChatMessage[];
  created_at: string;
}

export interface UploadResponse {
  document: Document;
  conversation: Conversation;
}

export interface FileUploadProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSend: (question: string) => void;
  isLoading: boolean;
  documentName: string;
}

export interface MessageBubbleProps {
  message: ChatMessage;
}

export interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function createUserMessage(content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: ROLES.HUMAN,
    content,
    page_number: null,
    reference_text: null,
    created_at: new Date().toISOString(),
  };
}

export function isValidPdf(file: File): boolean {
  return file.type === FILE_TYPES.PDF;
}
