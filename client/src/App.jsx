import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyToken } from "./components/store/auth-actions";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./components/util/http";

// Importing routes
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
import ProtectedRoute from "./components/routes/ProtectedRoute";
import BookingPage, {
  loader as bookingLoader,
} from "./components/routes/BookingPage";

import BookingDetailsPage, {
  loader as bookingDetailsLoader,
  action as bookingDetailsAction,
} from "./components/routes/BookingDetailsPage";
import EventPage, {
  loader as eventsLoader,
} from "./components/routes/EventPage";
import EventDetailsPage, {
  loader as eventDetailsLoader,
  action as eventDetailsAction,
} from "./components/routes/EventDetailsPage";
import ProfilePage from "./components/routes/ProfilePage";
import AdminProfile from "./components/routes/AdminProfile";
import AdminDashboard, {
  loader as adminDashboardLoader,
} from "./components/routes/AdminDashboard";
import ManageRooms, {
  loader as manageRoomsLoader,
} from "./components/routes/ManageRoomPage";
import AddRoom from "./components/routes/AddRoomsPage";
import ManageEvents, {
  loader as manageEventsLoader,
} from "./components/routes/ManageEventsPage";
import AddEvent from "./components/routes/AddEventsPage";
import RoomDetails from "./components/routes/RoomDetails";
import EventDetails from "./components/routes/EventDetails";
import ManageBookings from "./components/routes/ManageBookings";
import ManageBookingsDetails from "./components/routes/ManageBookingsDetails";
import AdminBookings from "./components/routes/AdminBookings";
import EditProfilePage from "./components/routes/EditProfilePage";
import AdminRoute from "./components/routes/AdminRoute";
import ErrorBoundary from "./components/routes/ErrorBoundary";
import VerifiedRoute from "./components/routes/VerifiedRoute";
import UnverifiedRoute from "./components/routes/UnverifiedRoute";
import VerifyPage from "./components/routes/VerifyPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <NavigationPage /> },
      {
        element: <PublicRoute />,
        children: [
          {
            element: <AccountRecoveryContextLayout />,
            children: [
              { path: "login", element: <Login />, action: loginAction },
              { path: "signup", element: <SignupPage />, action: signupAction },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <VerifiedRoute />,
            children: [
              {
                path: "bookings",
                element: <BookingPage />,
                loader: bookingLoader,
              },
              {
                path: "bookings/:id",
                element: <BookingDetailsPage />,
                loader: bookingDetailsLoader,
                action: bookingDetailsAction,
                children: [{ path: "edit", element: <BookingDetailsPage /> }],
              },
              { path: "events", element: <EventPage />, loader: eventsLoader },
              {
                path: "events/:id",
                element: <EventDetailsPage />,
                loader: eventDetailsLoader,
                action: eventDetailsAction,
                children: [
                  {
                    path: "events/:id/edit",
                  },
                ],
              },
              {
                path: "profile",
                children: [
                  { index: true, element: <ProfilePage /> },
                  { path: "edit", element: <EditProfilePage /> },
                ],
              },
              {
                element: <AdminRoute />,
                children: [
                  {
                    path: "admin",
                    children: [
                      {
                        index: true,
                        element: <AdminDashboard />,
                        loader: adminDashboardLoader,
                      },
                      {
                        path: "manage-rooms",
                        element: <ManageRooms />,
                        loader: manageRoomsLoader,
                      },
                      {
                        path: "manage-events",
                        element: <ManageEvents />,
                        loader: manageEventsLoader,
                      },
                      { path: "manage-rooms/add-rooms", element: <AddRoom /> },
                      {
                        path: "manage-events/add-events",
                        element: <AddEvent />,
                      },
                      {
                        path: "manage-rooms/room-details/:id",
                        element: <RoomDetails />,
                      },
                      {
                        path: "manage-events/event-details/:id",
                        element: <EventDetails />,
                      },
                      { path: "manage-bookings", element: <AdminBookings /> },
                      {
                        path: "manage-bookings/:id",
                        element: <ManageBookingsDetails />,
                      },
                    ],
                  },
                ],
              },
            ],
          }, {
            element: <UnverifiedRoute />, children: [
              {
                path: "verify",
                element: <VerifyPage />
              }
            ]
          }
        ],
      },
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
