import { accountRecoveryActions } from "./account-recovery-slice";

export const cancelOTPRequest = (recoveryEmail) => {
  return async (dispatch) => {
    const cancelRequest = async () => {
      const response = await fetch("/api/cancel-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recoveryEmail }),
      });

      if (!response.ok) {
        throw new Response(
          JSON.stringify({ message: "Could not cancel otp request." }),
          {
            status: 500,
          }
        );
      }
    };

    await cancelRequest();
    dispatch(accountRecoveryActions.clear());
  };
};
