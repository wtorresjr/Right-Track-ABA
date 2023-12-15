import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const sessionUser = useSelector((state) => state?.session?.user);

  if (!sessionUser) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
