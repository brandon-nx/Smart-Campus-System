import React, { useRef, useEffect, useState } from "react";
import classes from "./styles/VerifyPage.module.css";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchOTP, queryClient, verifyAccount } from "../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import SuccessIcon from "../../assets/icons/confirm-icon.svg";
import MessageBox from "../UI/MessageBox";
import Modal from "../UI/Modal";
import Button from "../UI/Button";

export default function VerifyPage() {
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const [status, setStatus] = useState({
    message: "",
    type: "",
    show: false,
  });

  const [success, setSuccess] = useState(false);

  const accountEmail = useSelector((state) => state.auth.email);

  const { mutate, isPending: isPendingUpdating } = useMutation({
    mutationFn: verifyAccount,
    onSuccess: (data) => {
      // {successes:
      if (data && data.success) {
        setSuccess(true);
      }

      queryClient.invalidateQueries({ queryKey: ["otp"] });
    },

    onError: (error) => {
      // {successes: [{field: fieldname}]}
      if (error) {
        setStatus({
          message: error.message,
          type: "error",
          show: true,
        });

        setTimeout(() => setStatus((s) => ({ ...s, show: false })), 3000);
      }
    },
  });

  const {
    data: otpData,
    isLoading: isOTPLoading,
    isError: isOTPError,
    error: otpError,
  } = useQuery({
    queryKey: ["otp", accountEmail],
    queryFn: ({ signal }) => fetchOTP({ signal, accountEmail }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (isOTPError) {
    setStatus({
      message: otpError.message,
      type: "error",
      show: true,
    });

    setTimeout(() => setStatus((s) => ({ ...s, show: false })), 3000);
  }

  // Focus the first input on mount
  useEffect(() => {
    if (inputsRef.current[0]) inputsRef.current[0].focus();
  }, []);

  // Handle user input: accept only digits and move focus
  const handleInput = (e, idx) => {
    const val = e.target.value.replace(/\D/, "");
    e.target.value = val;
    if (val && idx < inputsRef.current.length - 1) {
      inputsRef.current[idx + 1].focus();
    }
  };

  // Handle backspace to move focus back
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !e.target.value && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  function onResend() {}

  function handleVerify() {
    const code = inputsRef.current.map((input) => input.value).join("");
    mutate({otpCode: code, email: accountEmail});
  }

  function onCancel() {
    navigate("/");
  }

  function handleClose() {
    navigate("/profile");
  }

  return (
    <>
      {success && (
        <Modal open={success} onClose={handleClose}>
          <div className="form">
            <img
              src={SuccessIcon}
              className="icon-success"
              alt="Success Icon"
            />
            <h1 className="modal-title-success">Success!</h1>
            <p className="modal-message">Successfully Verified Account!</p>
            <Button className="success-btn" onClick={handleClose}>
              OK
            </Button>
          </div>
        </Modal>
      )}
      {isOTPLoading && <LoadingIndicator />}
      {otpData && otpData.success && (
        <div className={classes.container}>
          {status.show && (
            <MessageBox
              message={status.message}
              type={status.type}
              isVisible={status.show}
            />
          )}
          <h2 className={classes.title}>Enter OTP</h2>
          <div className={classes.inputs}>
            {[0, 1, 2, 3].map((_, idx) => (
              <input
                key={idx}
                type="text"
                maxLength="1"
                className={classes.input}
                ref={(el) => (inputsRef.current[idx] = el)}
                onChange={(e) => handleInput(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              />
            ))}
          </div>
          <p
            disabled={isPendingUpdating}
            className={classes.resend}
            onClick={onResend}
          >
            Resend OTP
          </p>
          <div className={classes.actions}>
            <button
              disabled={isPendingUpdating}
              className={classes.cancelBtn}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              disabled={isPendingUpdating}
              className={classes.verifyBtn}
              onClick={handleVerify}
            >
              Verify Account
            </button>
          </div>
        </div>
      )}
    </>
  );
}
