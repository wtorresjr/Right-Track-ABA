import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
// import MainDisplay from "../components/MainDisplay";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import ManageClients from "../components/ManageClients/ManageClients";
import ClientDetails from "../components/ClientDetails";
// import CreateClient from "../components/CreateClientPage";
import DailyChartDetail from "../components/DailyChartDetail/DailyChartDetail";
import CreateDailyChart from "../components/CreateDailyChart/CreateDailyChart";
import { DailyCharts } from "../components/DailyCharts";
import DailyChartAll from "../components/ReportViewer";
import DiscreetTrialDetail from "../components/DiscreetTrials/DiscreetTrialDetail";
import { AI_Suggest_Comp } from "../components/AI-Suggest-Comp";

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
            <ManageClients />
          </PrivateRoute>
        ),
      },
      {
        path: "/ai_suggest",
        element: (
          <PrivateRoute>
            <AI_Suggest_Comp />
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
        path: "/view-reports",
        element: (
          <PrivateRoute>
            <DailyChartAll />
          </PrivateRoute>
        ),
      },
      {
        path: "/daily-chart/:chart_id",
        element: (
          <PrivateRoute>
            <DailyChartDetail />
          </PrivateRoute>
        ),
      },
      {
        path: "/new-daily-chart/:client_id",
        element: (
          <PrivateRoute>
            <CreateDailyChart />
          </PrivateRoute>
        ),
      },
      {
        path: "/discreet-trial/:dt_id",
        element: (
          <PrivateRoute>
            <DiscreetTrialDetail />
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
