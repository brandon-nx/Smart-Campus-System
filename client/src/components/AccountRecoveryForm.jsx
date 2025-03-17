import { useFetcher, useNavigate, useSearchParams } from "react-router-dom";
import AccountRecoveryContext from "./store/AccountRecoveryContext";
import { use, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "./UI/Input";
import Button from "./UI/Button";
import { accountRecoveryActions } from "./store/account-recovery-slice";

export default function AccountRecoveryForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParam, setSearchParams] = useSearchParams();
  const step = searchParam.get("step");

  const recoveryEmailRef = useRef();
  const otpRefs = useRef([]);
  otpRefs.current = [];
  const recoveryEmail = useSelector((state) => state.accountRecovery.email);

  const accountRecoveryCtx = use(AccountRecoveryContext);

  const updateStep = useCallback(
    (newStep) => {
      searchParam.set("step", newStep);
      setSearchParams(searchParam, { replace: true });
    },
    [searchParam, setSearchParams]
  );

  function handleCloseWindow() {
    if (step === "verify-otp" || step === "reset-password") {
      updateStep("failed");
    }

    if (step === "success" || step === "failed" || step === "request-otp") {
      accountRecoveryCtx.hideWindow();
      navigate("/login");
    }
  }

  const fetcher = useFetcher();
  const { data, state } = fetcher;

  useEffect(() => {
    if (step === "request-otp" && data?.requestSuccess) {
      dispatch(accountRecoveryActions.setEmail(data.recoveryEmail));
      updateStep("verify-otp");
    }

    if (step === "verify-otp" && data?.verifySuccess) {
      dispatch(accountRecoveryActions.setInputOtp(data.otp));
      updateStep("reset-password");
    }

    if (step === "reset-password" && data?.resetSuccess) {
      updateStep("success");
    }
  }, [data, step, dispatch, updateStep]);

  useEffect(() => {
    const recoveryError = data?.errors?.find(
      (err) => err.field === "recoveryEmail"
    );
    if (recoveryError && recoveryEmailRef.current) {
      recoveryEmailRef.current.value = "";
      recoveryEmailRef.current.focus();
    }
  }, [data]);

  useEffect(() => {
    const otpError = data?.errors?.find((err) => err.field === "otp");
    if (
      data &&
      step === "verify-otp" &&
      otpError &&
      otpRefs.current.length === 4
    ) {
      otpRefs.current.forEach((ref) => {
        if (ref) ref.value = "";
      });
      otpRefs.current[0]?.focus();
    }
  }, [data, step]);

  let buttonLabel =
    step === "request-otp"
      ? "NEXT"
      : step === "verify-otp"
      ? "VERIFY"
      : "CONFIRM";

  if (step === "success" || step === "failed") {
    return (
      <div>
        <h1>{step === "success" ? "Sucess!" : "Sorry :("}</h1>
        <p>
          {step === "success"
            ? "Successfully changed password!"
            : "Recovery Process is cancelled!"}
        </p>
        <Button onClick={handleCloseWindow}>
          {step === "success" || step === "failed" ? "OK" : "CANCEL"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <h1>Forgot Password</h1>
      {(step === "request-otp" ||
        step === "verify-otp" ||
        step === "reset-password") && (
        <h2>
          {step === "reset-password" ? "Reset Password" : "OTP Verification"}
        </h2>
      )}
      <p>
        {step === "request-otp"
          ? "Enter your email address to receive OTP."
          : step === "verify-otp"
          ? `Enter the 4 digit code OTP sent to ${
              data?.requestSuccess && data.recoveryEmail
            }. Note that it will expire in 10 minutes.`
          : "Enter new password"}
      </p>
      {(data?.errors?.find((err) => err.field === "general")?.message ||
        null) && (
        <div className="input-error">
          <p>{data?.errors?.find((err) => err.field === "general")?.message}</p>
        </div>
      )}
      {(step === "request-otp" ||
        step === "verify-otp" ||
        step === "reset-password") && (
        <fetcher.Form
          method="post"
          action={`/forgotpassword?step=${step}`}
          className="form"
        >
          {step === "request-otp" && (
            <Input
              id="recovery-email"
              type="email"
              ref={recoveryEmailRef}
              name="recovery-email"
              placeholder="Recovery Email"
              error={
                data?.errors?.find((err) => err.field === "recoveryEmail")
                  ?.message || null
              }
            />
          )}

          {step === "verify-otp" && (
            <div className="otp-wrapper">
              <input
                id="recovery-email"
                type="hidden"
                name="recovery-email"
                value={recoveryEmail}
              />
              <div className="otp-input-group">
                {[0, 1, 2, 3].map((index) => (
                  <Input
                    key={index}
                    id={`otp-code-${index + 1}`}
                    type="tel"
                    inputMode="numeric"
                    ref={(el) => (otpRefs.current[index] = el)}
                    name={`otp-code-${index + 1}`}
                    className="otp-input"
                    maxLength="1"
                    showErrorMsg={false}
                    error={
                      data?.errors?.find((err) => err.field === "otp")
                        ?.message || null
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {step === "reset-password" && (
            <>
              <input
                id="recovery-email"
                type="hidden"
                name="recovery-email"
                value={recoveryEmail}
              />
              <Input
                id="reset-password"
                type="password"
                ref={recoveryEmailRef}
                name="reset-password"
                placeholder="New Password"
                error={
                  data?.errors?.find((err) => err.field === "newPassword")
                    ?.message || null
                }
              />

              <Input
                id="reset-confirm-password"
                type="password"
                ref={recoveryEmailRef}
                name="reset-confirm-password"
                placeholder="Confirm New Password"
                error={
                  data?.errors?.find(
                    (err) => err.field === "newConfirmPassword"
                  )?.message || null
                }
              />
            </>
          )}
          <p className="form-actions">
            <Button disabled={state === "loading"}>
              {state === "loading" ? "LOADING..." : buttonLabel}
            </Button>
          </p>
        </fetcher.Form>
      )}
      <Button onClick={handleCloseWindow}>
        {step === "success" || step === "failed" ? "OK" : "CANCEL"}
      </Button>
    </>
  );
}
