import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  const goHome = () => {
    navigate("/");
  };
  return (
    <>
      {sessionUser && (
        <div className="navContainer">
          <img
            className="logo-image"
            src="../right-track-aba-logo.png"
            alt="Logo"
            onClick={goHome}
          />
          <ProfileButton />
        </div>
      )}
    </>
  );
}

export default Navigation;
