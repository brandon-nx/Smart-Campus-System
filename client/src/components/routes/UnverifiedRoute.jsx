import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { verifyToken } from "../store/auth-actions";
import { useEffect } from "react";

export default function UnverifiedRoute({ redirectPath = "/" }) {
  const dispatch = useDispatch();
  const accountVerified = useSelector((state) => state.auth.verified);

  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  if (accountVerified) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
