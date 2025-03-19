import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { removeToken } from "../store/auth-actions";

export default function LogoutPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(removeToken());
  }, [dispatch]);

  return <Navigate to="/" replace />;
}
