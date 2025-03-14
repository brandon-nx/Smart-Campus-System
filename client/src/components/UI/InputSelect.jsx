export default function InputSelect({ name, id, error, children, ...props }) {
  return (
    <div className="input-box">
      <select className={error ? "invalid" : undefined} name={name} id={id} {...props}>
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
