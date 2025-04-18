import { useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";

export default function SearchBar({ open, value, onChange, onClose, placeholderMsg }) {
  const inputRef = useRef(null);

  // Focus the input when the bar is opened
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Close when user taps/clicks outside the bar
  useEffect(() => {
    function handlePointer(e) {
      if (open && !e.target.closest(".search-bar-container")) {
        onClose();
      }
    }
    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, [open, onClose]);

  return (
    <div className={`search-backdrop ${open ? "show" : ""}`}>
      <div className={`search-bar-container ${open ? "show" : ""}`}>
        <input
          ref={inputRef}
          maxLength="20"
          type="text"
          placeholder={placeholderMsg}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          className="search-close"
          onClick={onClose}
          aria-label="Close search"
        >
          <IoClose size={24} />
        </button>
      </div>
    </div>
  );
}