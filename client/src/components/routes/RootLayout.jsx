import { Outlet } from "react-router-dom";
import RootNavigation from "../RootNavigation";

export default function RootLayout() {
  return (
    <div className="root-container">
      <div className="root-content">
        <Outlet />
      </div>
      <RootNavigation />
    </div>
  );
}
