export default function InputSelect({
  name,
  id,
  error,
  children,
  label,
  ...props
}) {
  return (
    <div className="input-box">
      {label && <label htmlFor={id}>{label}</label>}
      <select
        className={error ? "invalid" : undefined}
        name={name}
        id={id}
        {...props}
      >
        {children}
      </select>
      {error && (
        <div className="input-error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
