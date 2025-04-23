// EditButton.jsx
import { FiEdit } from "react-icons/fi";
import classes from "../styles/EditButton.module.css";

export default function EditButton({ isActive, onClick, ...props }) {
  return (
    <button
      {...props}
      className={`${classes.btn} ${isActive ? classes.active : ""}`}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label="Edit"
    >
      <FiEdit className={classes.icon} />
    </button>
  );
}
