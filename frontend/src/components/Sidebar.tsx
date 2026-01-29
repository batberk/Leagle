import type { SidebarProps } from "../types";

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Leagle</h2>
        <button onClick={onNew} className="new-chat-btn">
          + New
        </button>
      </div>
      <div className="conversation-list">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            className={`conv-item ${conv.id === activeId ? "active" : ""}`}
            onClick={() => onSelect(conv.id)}
          >
            <span className="conv-doc">{conv.document.filename}</span>
            <span className="conv-date">
              {new Date(conv.created_at).toLocaleDateString()}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
