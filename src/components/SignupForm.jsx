import { Form, useActionData, useNavigation } from "react-router-dom";
import Input from "./UI/Input";
import InputSelect from "./UI/InputSelect";
import Button from "./UI/Button";

export default function SignupForm() {
  const navigation = useNavigation();
  const data = useActionData();
  const isSubmitting = navigation.state === "submitting";

  console.log(data ? data.errors : "no")

  return (
    <Form method="post" className="form">
      <Input
        id="name"
        type="text"
        name="name"
        placeholder="Enter Your Name"
        error={data && data.errors.name}
      />
      <Input
        id="email"
        type="email"
        name="email"
        placeholder="Enter University Email"
        error={data && data.errors.email}
      />
      <InputSelect
        id="gender"
        name="gender"
        defaultValue=""
        error={data && data.errors.gender}
      >
        <option value="" disabled>Select Your Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="others">Others</option>
      </InputSelect>
      <Input
        id="date-of-birth"
        type="date"
        name="date-of-birth"
        error={data && data.errors.dateOfBirth}
      />
      <Input
        id="password"
        type="password"
        name="password"
        placeholder="Enter Your Password"
        error={data && data.errors.password}
      />
      <Input
        id="confirm-password"
        type="password"
        name="confirm-password"
        placeholder="Confirm Your Password"
        error={data && data.errors.confirmPassword}
      />

      <p className="form-actions">
        <Button disabled={isSubmitting}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>
      </p>
    </Form>
  );
}
