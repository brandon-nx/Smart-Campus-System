import { useFetcher, useNavigate, useSearchParams } from "react-router-dom";
import { use, useEffect } from "react";
import Modal from "./UI/Modal";
import AccountRecoveryContext from "./store/AccountRecoveryContext";
import Button from "./UI/Button";
import Input from "./UI/Input";

export default function PasswordRecoveryWindow() {
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const step = searchParam.get("step");

  const accountRecoveryCtx = use(AccountRecoveryContext);

  function handleCloseWindow() {
    accountRecoveryCtx.hideWindow();
    navigate("/login");
  }

  const fetcher = useFetcher();

  const { data, state } = fetcher;

  useEffect(() => {
    if (state === "idle" && data && data.message) {
      window.alert(data.message);
    }
  }, [data, state]);

  return (
    <Modal open={accountRecoveryCtx.isOpen} onClose={handleCloseWindow}>
      <h1>Forgot Password</h1>
      <h2>OTP Verification</h2>
      <p>Enter your email address to receive OTP.</p>
      <fetcher.Form method="post" action="/forgotpassword" className="form">
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          error={data && data.message}
        />
        <p className="form-actions">
          <Button disabled={state === "loading"}>
            {state === "loading" ? "LOADING..." : "NEXT"}
          </Button>
        </p>
      </fetcher.Form>
      <Button onClick={handleCloseWindow}>CANCEL</Button>
    </Modal>
  );
}
