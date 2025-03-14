import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login, { action as loginAction } from "./components/routes/LoginPage";
import RootLayout from "./components/routes/RootLayout";
import NavigationPage from "./components/routes/NavigationPage";
import SignupPage, {action as signupAction } from "./components/routes/SignupPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    id: "root",
    children: [
      { index: true, element: <NavigationPage /> },
      { path: "login", element: <Login />, action: loginAction },
      { path: "signup", element: <SignupPage />, action: signupAction },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
