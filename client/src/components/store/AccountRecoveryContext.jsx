import { createContext, useState } from "react";

const AccountRecoveryContext = createContext({
  progress: "", // 'forgot', 'otp'
  showForgot: () => {},
  hideForgot: () => {},
  showOtp: () => {},
  hideOtp: () => {},
  showReset: () => {},
  hideReset: () => {},
  showSuccess: () => {},
  hideSuccess: () => {},
  showFailure: () => {},
  hideFailure: () => {}
});

export function AccountRecoveryContextProvider({ children }) {
  const [accountRecovery, setAccountRecovery] = useState("");

  function showForgot() {
    setAccountRecovery("forgot");
  }

  function hideForgot() {
    setAccountRecovery("");
  }

  function showOtp() {
    setAccountRecovery("otp");
  }

  function hideOtp() {
    setAccountRecovery("");
  }

  function showReset() {
    setAccountRecovery("reset");
  }

  function hideReset() {
    setAccountRecovery("");
  }

  function showSuccess() {
    setAccountRecovery("success");
  }

  function hideSuccess() {
    setAccountRecovery("");
  }

  function showFailure() {
    setAccountRecovery("failure");
  }

  function hideFailure() {
    setAccountRecovery("");
  }

  const accountRecoveryCtx = {
    progress: accountRecovery,
    showForgot,
    hideForgot,
    showOtp,
    hideOtp,
    showReset,
    hideReset,
    showSuccess,
    hideSuccess,
    showFailure,
    hideFailure
  }

  return (
    <AccountRecoveryContext.Provider value={accountRecoveryCtx}>{children}</AccountRecoveryContext.Provider>
  );
}

export default AccountRecoveryContext;