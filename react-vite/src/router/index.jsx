import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import MainDisplay from "../components/MainDisplay";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LoginFormPage />,
      },
      {
        path: "/home",
        element: (
          <PrivateRoute>
            <MainDisplay />,
          </PrivateRoute>
        ),
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
    ],
  },
]);
