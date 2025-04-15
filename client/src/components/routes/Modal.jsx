import React from "react";
import classes from "./styles/Modal.module.css";

const Modal = ({ closeModal }) => {
  return (
    <div className={classes["modal-overlay"]}>
      <div className={classes["modal-content"]}>
        <h2>Emergency Contact</h2>
        <div className={classes["buttons-container"]}>
          <button className={classes["modal-btn"]} onClick={closeModal}>
            Security Guard: +1234567890
          </button>
          <button className={classes["modal-btn"]} onClick={closeModal}>
            Fire Department: +0987654321
          </button>
          <button className={classes["modal-btn"]} onClick={closeModal}>
            University Admin: +1122334455
          </button>
          <button className={classes["modal-btn"]} onClick={closeModal}>
            Hospital: +5566778899
          </button>
        </div>
        <button className={classes["close-btn"]} onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
