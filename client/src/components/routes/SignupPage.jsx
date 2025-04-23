import React from "react";
import classes from "./styles/SignupPage.module.css";
import profilepic from "../../assets/images/profilePic.png";
import { Link, useActionData, useNavigate } from "react-router-dom";
import SignupForm from "../SignupForm";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";
import SuccessIcon from "../../assets/icons/confirm-icon.svg";
import Modal from "../UI/Modal";
import Button from "../UI/Button";

export default function SignupPage() {
  const data = useActionData();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleCloseWindow() {
    console.log("Successfully sign up!");
    localStorage.setItem("accessToken", data.token);
    dispatch(authActions.login(data));
    navigate("/");
  }

  return (
    <>
      {data && data.success && (
        <Modal open={data.success} onClose={handleCloseWindow}>
          <div className="form">
            <img
              src={SuccessIcon}
              className="icon-success"
              alt="Success Icon"
            />
            <h1 className="modal-title-success">Success!</h1>
            <p className="modal-message">
              Your account has been created successfully!
            </p>
            <Button className="success-btn" onClick={handleCloseWindow}>
              OK
            </Button>
          </div>
        </Modal>
      )}
      <div className={classes["signup-container"]}>
        <div className={classes["top-bar"]}>
          <Link to={"/login"} className={classes["back-btn"]}>
            ←
          </Link>
          <span className={classes["top-bar-text"]}>Sign Up</span>
        </div>

        <div className={classes["profile-section"]}>
          <img
            src={profilepic}
            alt="Profile"
            className={classes["profile-pic"]}
          />
        </div>
        <SignupForm />
      </div>
    </>
  );
}

export async function action({ request }) {
  const data = await request.formData();

  const authData = {
    name: data.get("name"),
    email: data.get("email"),
    gender: data.get("gender"),
    dateOfBirth: data.get("date-of-birth"),
    password: data.get("password"),
    confirmPassword: data.get("confirm-password"),
    image: "some_url",
  };

  const response = await fetch(`/api/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422) {
    return response;
  }

  if (!response.ok) {
    throw new Response(
      { message: "Something is wrong, signing up failed." },
      { status: 500 }
    );
  }

  return response;
}
