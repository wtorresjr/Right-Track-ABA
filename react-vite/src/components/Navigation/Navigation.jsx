import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  return (
    <>
      {sessionUser && (
        <>
          <NavLink to="/">
            <img
              className="logo-image"
              src="../right-track-aba-logo.png"
              alt="Logo"
            />
          </NavLink>

          <ProfileButton />
        </>
      )}
    </>
  );
}

export default Navigation;
