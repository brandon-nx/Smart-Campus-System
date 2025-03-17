import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login, { action as loginAction } from "./components/routes/LoginPage";
import RootLayout from "./components/routes/RootLayout";
import NavigationPage from "./components/routes/NavigationPage";
import SignupPage, {
  action as signupAction,
} from "./components/routes/SignupPage";
import AccountRecoveryContextLayout from "./components/routes/AccountRecoveryContextLayout";
import { action as forgotPasswordAction } from "./components/routes/ForgotPasswordPage";
import PublicRoute from "./components/routes/PublicRoute";
import LogoutPage from "./components/routes/LogoutPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    id: "root",
    children: [
      { index: true, element: <NavigationPage /> },
      {
        element: <PublicRoute />,
        children: [
          {
            element: <AccountRecoveryContextLayout />,
            children: [
              { path: "login", element: <Login />, action: loginAction },
            ],
          },

          { path: "signup", element: <SignupPage />, action: signupAction },
        ],
      },
    ],
  },
  { path: "forgotpassword", action: forgotPasswordAction },
  { path: "logout", element: <LogoutPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
