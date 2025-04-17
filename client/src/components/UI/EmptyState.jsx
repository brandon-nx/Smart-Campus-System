export default function EmptyState({ title, message }) {
  return (
    <div className="empty-state-container">
      <div className="empty-state-content">
        <div className="empty-state-icon">{"\u2639"}</div>
        <h2 className="empty-state-title">{title}</h2>
        <p className="empty-state-message">{message}</p>
      </div>
    </div>
  );
}
