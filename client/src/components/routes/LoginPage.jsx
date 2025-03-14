import React, { use } from "react";
import { Link, redirect } from "react-router-dom";
import classes from "./styles/Login.module.css";
import logo from "../../assets/images/logo.png";
import LoginForm from "../LoginForm";
import AccountRecoveryContext from "../store/AccountRecoveryContext";
import PasswordRecoveryWindow from "../PasswordRecoveryWindow";

export default function Login() {
  const accountRecoveryCtx = use(AccountRecoveryContext);

  function handleOpenWindow() {
    accountRecoveryCtx.showWindow();
  }

  return (
    <>
      <PasswordRecoveryWindow />
      <div className={classes["login-container"]}>
        <div className={classes["top-bar"]}>
          <Link to="/" className={classes["back-btn"]}>
            ←
          </Link>
          <span className={classes["top-bar-text"]}>Member of UOSM</span>
        </div>

        <img src={logo} alt="URoute Logo" className={classes["logo"]} />

        <div className={classes["login-title"]}>
          <div className={classes["welcome"]}>Welcome to</div>
          <div className={classes["app-name"]}>URoute</div>
        </div>

        <LoginForm />

        <Link
          onClick={handleOpenWindow}
          to="?step=forgotpassword"
          className={classes["forgot-password"]}
        >
          Forgot Password?
        </Link>

        <div className={classes["signup-link"]}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </>
  );
}

export async function action({ request }) {
  console.log(request);

  const data = await request.formData();

  console.log(data);

  const authData = {
    email: data.get("email"),
    password: data.get("password"),
    rememberMe: data.get("remember-me") !== null,
  };

  console.log(authData);

  const response = await fetch(`http://localhost:8080/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 400 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw new Response(
      { message: "Something is wrong, authentication failed." },
      { status: 500 }
    );
  }

  // if(response.ok && authData.rememberMe){
  //   response.json().then(data => {
  //     //Cookies goes here
  //   });
  // }

  return redirect("/");
}
