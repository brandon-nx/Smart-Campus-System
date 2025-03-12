import { Outlet } from "react-router-dom";
import RootNavigation from "../RootNavigation";

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <RootNavigation />
    </>
  );
}
