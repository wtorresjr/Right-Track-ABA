import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import MainDisplay from "../components/MainDisplay";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import ManageClients from "../components/ManageClients/ManageClients";
import ClientDetails from "../components/ClientDetails";
import CreateClient from "../components/CreateClientPage";

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
            <MainDisplay />
          </PrivateRoute>
        ),
      },
      {
        path: "/manage-clients",
        element: (
          <PrivateRoute>
            <ManageClients />
          </PrivateRoute>
        ),
      },
      {
        path: "/client/:client_id",
        element: (
          <PrivateRoute>
            <ClientDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/create-client",
        element: (
          <PrivateRoute>
            <CreateClient />
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
