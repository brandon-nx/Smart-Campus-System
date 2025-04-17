import { Form, useActionData, useNavigation } from "react-router-dom";
import Input from "./UI/Input";
import InputSelect from "./UI/InputSelect";
import Button from "./UI/Button";
import { useEffect, useRef } from "react";

export default function SignupForm() {
  const navigation = useNavigation();
  const data = useActionData();
  const isSubmitting = navigation.state === "submitting";

  const today = new Date().toISOString().split("T")[0];
  const minDate = "1900-01-01";

  const nameRef = useRef();
  const emailRef = useRef();
  const genderRef = useRef();
  const dateOfBirthRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  useEffect(() => {
    if (data && data.errors) {
      if (data.errors.find((err) => err.field === "name") && nameRef.current) {
        nameRef.current.value = "";
        nameRef.current.focus();
      } else if (
        data.errors.find((err) => err.field === "email") &&
        emailRef.current
      ) {
        emailRef.current.value = "";
        emailRef.current.focus();
      } else if (
        data.errors.find((err) => err.field === "gender") &&
        genderRef.current
      ) {
        genderRef.current.focus();
      } else if (
        data.errors.find((err) => err.field === "dateOfBirth") &&
        dateOfBirthRef.current
      ) {
        dateOfBirthRef.current.value = "";
        dateOfBirthRef.current.focus();
      } else if (
        data.errors.find((err) => err.field === "password") &&
        passwordRef.current
      ) {
        passwordRef.current.value = "";
        passwordRef.current.focus();
      } else if (
        data.errors.find((err) => err.field === "confirmPassword") &&
        confirmPasswordRef.current
      ) {
        confirmPasswordRef.current.value = "";
        confirmPasswordRef.current.focus();
      }
    }
  }, [data]);

  return (
    <Form method="post" className="form">
      <Input
        id="name"
        type="text"
        name="name"
        placeholder="Enter Your Name"
        ref={nameRef}
        error={
          data?.errors?.find((err) => err.field === "name")?.message || null
        }
      />
      <Input
        id="email"
        type="email"
        name="email"
        placeholder="Enter University Email"
        ref={emailRef}
        error={
          data?.errors?.find((err) => err.field === "email")?.message || null
        }
      />
      <InputSelect
        id="gender"
        name="gender"
        defaultValue=""
        ref={genderRef}
        error={
          data?.errors?.find((err) => err.field === "gender")?.message || null
        }
      >
        <option value="" disabled>
          Select Your Gender
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="others">Others</option>
      </InputSelect>
      <Input
        id="date-of-birth"
        type="date"
        name="date-of-birth"
        ref={dateOfBirthRef}
        min={minDate}
        max={today}
        error={
          data?.errors?.find((err) => err.field === "dateOfBirth")?.message ||
          null
        }
      />
      <Input
        id="password"
        type="password"
        name="password"
        placeholder="Enter Your Password"
        ref={passwordRef}
        error={
          data?.errors?.find((err) => err.field === "password")?.message || null
        }
      />
      <Input
        id="confirm-password"
        type="password"
        name="confirm-password"
        placeholder="Confirm Your Password"
        ref={confirmPasswordRef}
        error={
          data?.errors?.find((err) => err.field === "confirmPassword")
            ?.message || null
        }
      />

      <p className="form-actions">
        <Button className="signup-btn" disabled={isSubmitting}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>
      </p>
    </Form>
  );
}
