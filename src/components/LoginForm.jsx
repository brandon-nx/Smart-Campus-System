import { Form, useActionData, useNavigation } from "react-router-dom";
import Input from "./UI/Input";
import Button from "./UI/Button";

export default function LoginForm() {
  const navigation = useNavigation();
  const data = useActionData();
  const isSubmitting = navigation.state === "submitting";
  return (
    <Form method="post" className="form">
      <Input
        id="email"
        type="email"
        name="email"
        placeholder="Email"
        error={data && data.message}
      />
      <Input
        id="password"
        type="password"
        name="password"
        placeholder="Enter Password"
        error={data && data.message}
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
