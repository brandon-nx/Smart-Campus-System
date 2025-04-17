import { Form, useActionData, useNavigation } from "react-router-dom";
import Input from "./UI/Input";
import Button from "./UI/Button";
import { useEffect, useRef } from "react";

export default function EventForm() {
  const navigation = useNavigation();
  const data = useActionData();
  const isSubmitting = navigation.state === "submitting";

  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    if (data && data.errors) {
      if (
        data.errors.find((err) => err.field === "eventname") &&
        eventNameRef.current
      ) {
        emailRef.current.value = "";
        emailRef.current.focus();
      } else if (
        data.errors.find((err) => err.field === "password") &&
        passwordRef.current
      ) {
        passwordRef.current.value = "";
        passwordRef.current.focus();
      }
    }
  }, [data]);

  return (
    <Form method="post" className="form">
      <Input
        id="Event Name"
        type="eventname"
        name="eventname"
        ref={emailRef}
        placeholder="Email"
        error={
          data?.errors?.find((err) => err.field === "email")?.message || null
        }
      />
      <Input
        id="password"
        type="password"
        name="password"
        ref={passwordRef}
        placeholder="Enter Password"
        error={
          data?.errors?.find((err) => err.field === "password")?.message || null
        }
      />

      <Input
        id="remember-me"
        type="checkbox"
        name="remember-me"
        label="Remember Me"
      />

      <p className="form-actions">
        <Button disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </p>
    </Form>
  );
}
