import { createContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelOTPRequest } from "./account-recovery-actions.jsx";

const AccountRecoveryContext = createContext({
  showWindow: () => {},
  hideWindow: () => {},
});

export function AccountRecoveryContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const recoveryEmail = useSelector((state) => state.accountRecovery.email);
  const dispatch = useDispatch();

  function showWindow() {
    if (!isOpen) {
      setIsOpen(true);
    }
  }

  function hideWindow() {
    if (isOpen) {
      dispatch(cancelOTPRequest(recoveryEmail));
      setIsOpen(false);
    }
  }

  const accountRecoveryCtx = {
    isOpen,
    showWindow,
    hideWindow,
  };

  return (
    <AccountRecoveryContext.Provider value={accountRecoveryCtx}>
      {children}
    </AccountRecoveryContext.Provider>
  );
}

export default AccountRecoveryContext;
