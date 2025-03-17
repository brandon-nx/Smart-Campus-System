import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { authActions } from "../store/auth-slice";

export default function LogoutPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.logout());
  }, [dispatch]);

  return <Navigate to="/" replace />;
}
