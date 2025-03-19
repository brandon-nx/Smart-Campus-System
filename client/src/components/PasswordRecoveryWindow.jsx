import { useNavigate } from "react-router-dom";
import { use } from "react";
import Modal from "./UI/Modal";
import AccountRecoveryContext from "./store/AccountRecoveryContext";
import AccountRecoveryForm from "./AccountRecoveryForm";

export default function PasswordRecoveryWindow() {
  const navigate = useNavigate();

  const accountRecoveryCtx = use(AccountRecoveryContext);

  function handleCloseWindow() {
    accountRecoveryCtx.hideWindow();
    navigate("/login");
  }

  return (
    <Modal open={accountRecoveryCtx.isOpen} onClose={handleCloseWindow}>
      <AccountRecoveryForm />
    </Modal>
  );
}
