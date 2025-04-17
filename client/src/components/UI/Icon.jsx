export default function Icon({ label, children, ...props }) {
  return (
    <button className="icon-button" {...props}>
      <span className="icon" aria-label={label}>
        {children}
      </span>
    </button>
  );
}
