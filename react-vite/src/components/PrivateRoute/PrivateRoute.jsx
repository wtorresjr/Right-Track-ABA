import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const user = useSelector((state) => state.session.user);

  if (!user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
