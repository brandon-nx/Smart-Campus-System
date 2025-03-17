import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({redirectPath = "/login"}) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

    if(!isAuthenticated) {
        return <Navigate to={redirectPath} replace />
    }

    return <Outlet />;
}