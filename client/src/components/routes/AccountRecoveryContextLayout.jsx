import { Outlet } from "react-router-dom";
import { AccountRecoveryContextProvider } from "../store/AccountRecoveryContext";

export default function AccountRecoveryContextLayout() {
  return (
    <AccountRecoveryContextProvider>
      <Outlet />
    </AccountRecoveryContextProvider>
  );
}
