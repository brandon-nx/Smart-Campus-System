export default function Input({
  id,
  label,
  error,
  type,
  showErrorMsg = true,
  className,
  ...props
}) {

  let inputClasses = className;

  if(error) {
    inputClasses += " invalid"
  }

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
      <input
        className={inputClasses}
        id={id}
        type={type}
        {...props}
      />
      {error && (
        <div className="input-error">{showErrorMsg && <p>{error}</p>}</div>
      )}
    </div>
  );
}
