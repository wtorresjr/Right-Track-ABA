import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  return (
    <>
      {sessionUser && (
        <div className="navContainer">
          <NavLink to="/">
            <img
              className="logo-image"
              src="../right-track-aba-logo.png"
              alt="Logo"
            />
          </NavLink>

          <ProfileButton />
        </div>
      )}
    </>
  );
}

export default Navigation;
