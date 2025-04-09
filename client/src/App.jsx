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
import BookingDetailsPage, { loader as bookingDetailsLoader } from "./components/routes/BookingDetailsPage";
import ProfilePage from "./components/routes/ProfilePage";
import AdminProfile from "./components/routes/AdminProfile";
import AdminDashboard from "./components/routes/AdminDashboard";
import ManageRooms from "./components/routes/ManageRoomPage"; 
import AddRoom from "./components/routes/AddRoomsPage";
import ManageEvents from "./components/routes/ManageEventsPage";
import AddEvent from "./components/routes/AddEventsPage";
import RoomDetails from "./components/routes/RoomDetails";


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
            ],
          },
          { path: "signup", element: <SignupPage />, action: signupAction },
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
            children: [
              { path: "bookings/:id/edit" },
            ],
          },
          { path: "profile", element: <ProfilePage /> },
          { path: "admin", element: <AdminProfile /> },
          { path: "admin/dashboard", element: <AdminDashboard /> },
          { path: "manage-rooms", element: <ManageRooms /> },
          { path: "manage-events", element: <ManageEvents /> },
          { path: "manage-rooms/add-rooms", element: <AddRoom /> },
          { path: "manage-events/add-events", element: <AddEvent /> },
          { path: "manage-rooms/room-details/:id", element: <RoomDetails /> },      
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
