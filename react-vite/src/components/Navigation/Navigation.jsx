import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <ul>
      <NavLink to="/">
        <img className="logo-image" src="../right-track-aba-logo.png" />
      </NavLink>

      <ProfileButton />
    </ul>
  );
}

export default Navigation;
