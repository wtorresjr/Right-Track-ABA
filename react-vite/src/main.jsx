import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import configureStore from "./redux/store";
import { router } from "./router";
import * as sessionActions from "./redux/session";
import "./index.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme();

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReduxProvider store={store}>
        <RouterProvider router={router} />
      </ReduxProvider>
    </ThemeProvider>
  </React.StrictMode>
);
