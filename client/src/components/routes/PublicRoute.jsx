import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute ({redirectPath = "/"}) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

    if(isAuthenticated) {
        return <Navigate to={redirectPath} replace />
    }

    return <Outlet />;
}