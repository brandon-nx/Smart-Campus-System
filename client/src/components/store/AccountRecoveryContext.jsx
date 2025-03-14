import { createContext, useState } from "react";

const AccountRecoveryContext = createContext({
  showWindow: () => {},
  hideWindow: () => {},
});

export function AccountRecoveryContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  function showWindow() {
    if (!isOpen) {
      setIsOpen(true);
    }
  }

  function hideWindow() {
    if (isOpen) {
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