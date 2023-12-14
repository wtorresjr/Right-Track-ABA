import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import MainDisplay from "../components/MainDisplay";

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
        element: <MainDisplay />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
    ],
  },
]);
