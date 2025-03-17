import React from "react";
import classes from "./styles/Signup.module.css";
import profilepic from "../../assets/images/profilePic.png";
import { Link, useActionData, useNavigate } from "react-router-dom";
import SignupForm from "../SignupForm";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";

export default function SignupPage() {
  const data = useActionData()
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(data)
    if(data && data.success) {
      dispatch(authActions.login(data))
      navigate("/")
    }


  return (
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

  const response = await fetch(`http://localhost:8080/signup`, {
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
