export async function action({ request }) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const step = searchParams.get("step");

  const data = await request.formData();

  const authData = {};

  if (step === "request-otp") {
    authData.recoveryEmail = data.get("recovery-email");
  } else if (step === "verify-otp") {
    const otpCode = [
      data.get("otp-code-1"),
      data.get("otp-code-2"),
      data.get("otp-code-3"),
      data.get("otp-code-4"),
    ].join("");
    authData.recoveryEmail = data.get("recovery-email");
    authData.otp = otpCode;
  } else {
    authData.recoveryEmail = data.get("recovery-email");
    authData.newPassword = data.get("reset-password");
    authData.newConfirmPassword = data.get("reset-confirm-password");
  }

  const response = await fetch(`http://localhost:8080/${step}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 400) {
    return response;
  }

  if (!response.ok) {
    throw new Response(
      { message: "Something is wrong, requesting OTP failed." },
      { status: 500 }
    );
  }

  return response;
}
