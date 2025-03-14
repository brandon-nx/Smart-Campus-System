import { useFetcher, useSearchParams } from "react-router-dom";
import { use, useEffect } from "react";
import Modal from "./UI/Modal";
import AccountRecoveryContext from "./store/AccountRecoveryContext";

export default function PasswordRecoveryWindow() {
  const [searchParam] = useSearchParams();
  const step = searchParam.get("step");
  const isForgot =
    step === "forgot" ||
    step === "otp" ||
    step === "reset" ||
    step === "success" ||
    step === "failed";

  const accountRecoveryCtx = use(AccountRecoveryContext);

  function handleCloseRecoveryWindow() {
    accountRecoveryCtx.hideForgot();
  }

  function handleGoToCheckout() {
    userProgressCtx.showCheckout();
  }

  const fetcher = useFetcher();

  const { data, state } = fetcher;

  function handleCloseForgotWindow() {
    closeForgotWindow();
  }

  useEffect(() => {
    if (state === "idle" && data && data.message) {
      window.alert(data.message);
    }
  }, [data, state]);

  return (
    <Modal
      className="cart"
      open={userProgressCtx.progress === "cart"}
      onClose={userProgressCtx.progress === "cart" ? handleCloseCart : null}
    >
      <fetcher.Form method="post" action="/forgotpassword" className="form">
        <input
          type="email"
          placeholder="Sign up for newsletter..."
          aria-label="Sign up for newsletter"
        />
        <button onClick={closeForgotWindow}>Sign up</button>
      </fetcher.Form>
    </Modal>
  );
}
