export default function Input({ id, label, error, type, ...props }) {
  if (type === "checkbox") {
    return (
      <div className="check-box">
        {label && <label htmlFor={id}>{label}</label>}
        <input id={id} type={type} {...props} />
      </div>
    );
  }

  return (
    <div className="input-box">
      {label && <label htmlFor={id}>{label}</label>}
      <input className={error ? "invalid" : undefined} id={id} type={type} {...props}/>
      {error && (
        <div className="input-error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
