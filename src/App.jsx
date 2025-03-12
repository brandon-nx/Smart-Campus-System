import { createBrowserRouter } from "react-router-dom";
import Login from "./components/routes/Login";
import Signup from "./components/routes/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    id: 'root',
    children: [
      { index: true, element: <NavigationPage /> },
      {path: "login", element: <Login />},
      {path: "signup", element: <Signup />}
    ],
  },
]);

function App() {
  return (<RouterProvider router={router} />);
}

export default App;
