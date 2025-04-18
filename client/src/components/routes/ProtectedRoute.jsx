import { Outlet } from "react-router-dom";

// DEV MODE BYPASS
export default function ProtectedRoute() {
  return <Outlet />;
}
