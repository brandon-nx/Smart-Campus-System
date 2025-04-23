import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute({ redirectPath = "/" }) {
  const accountType = useSelector((state) => state.auth.type);

  if (accountType !== "admin") {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
