import type { MessageBubbleProps } from "../types";
import { ROLES } from "../types";

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAi = message.role === ROLES.AI;

  return (
    <div className={`message ${message.role}`}>
      <div className="bubble">
        <p className="content">{message.content}</p>

        {isAi && (message.page_number || message.reference_text) && (
          <div className="reference">
            {message.page_number && (
              <span className="page-badge">Page {message.page_number}</span>
            )}
            {message.reference_text && (
              <blockquote className="ref-text">
                {message.reference_text}
              </blockquote>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
