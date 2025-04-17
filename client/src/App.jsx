import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login, { action as loginAction } from "./components/routes/LoginPage";
import RootLayout from "./components/routes/RootLayout";
import NavigationPage from "./components/routes/NavigationPage";
import SignupPage, { action as signupAction } from "./components/routes/SignupPage";
import AccountRecoveryContextLayout from "./components/routes/AccountRecoveryContextLayout";
import { action as forgotPasswordAction } from "./components/routes/ForgotPasswordPage";
import PublicRoute from "./components/routes/PublicRoute";
import LogoutPage from "./components/routes/LogoutPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyToken } from "./components/store/auth-actions";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import BookingPage, { loader as bookingLoader } from "./components/routes/BookingPage";
import { queryClient } from "./components/util/http";
import { QueryClientProvider } from "@tanstack/react-query";
import BookingDetailsPage, {
  loader as bookingDetailsLoader,
  action as bookingDetailsAction
} from "./components/routes/BookingDetailsPage";
import EventCalendarPage, { loader as eventCalendarloader } from "./components/routes/eventcalenderpage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
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
              { path: "signup", element: <SignupPage />, action: signupAction }
            ],
          }
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "bookings", element: <BookingPage />, loader: bookingLoader },
          {
            path: "bookings/:id",
            element: <BookingDetailsPage />,
            loader: bookingDetailsLoader,
            action: bookingDetailsAction,
            children: [
              {
                path: "bookings/:id/edit",
              },
            ],
          },
        ],
      },
      { path: "events", element: <EventCalendarPage />,loader: eventCalendarloader }, // Added Events Route
    ],
  },
  { path: "forgotpassword", action: forgotPasswordAction },
  { path: "logout", element: <LogoutPage /> },
]);

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
