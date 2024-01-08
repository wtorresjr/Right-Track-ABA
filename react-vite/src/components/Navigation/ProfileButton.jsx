import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useModal } from "../../context/Modal";
import { CreateDailyChart } from "../CreateDailyChart";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const { setModalContent } = useModal();

  const openCreateChartModal = () => {
    setModalContent(<CreateDailyChart />);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <div className="hamburger-menu">
      <button onClick={toggleMenu} id="burger">
        <i className="fa-solid fa-bars fa-lg"></i>
      </button>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <>
              <p>
                Hi {user.first_name} {user.last_name},
              </p>
              <li>
                <NavLink
                  to="/manage-clients"
                  className="navLinks"
                  onClick={closeMenu}
                >
                  Manage Clients
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/view-reports"
                  className="navLinks"
                  onClick={closeMenu}
                >
                  View Reports
                </NavLink>
              </li>
              {/* <li className="navLinks" onClick={openCreateChartModal}>
                Create Daily Chart
              </li> */}
              {/* <li>
                <NavLink
                  to="/daily-charts"
                  className="navLinks"
                  onClick={closeMenu}
                >
                  Daily Charts
                </NavLink>
              </li> */}
              {/* <li>
                <NavLink
                  to="/discreet-trials"
                  className="navLinks"
                  onClick={closeMenu}
                >
                  Discreet Trials
                </NavLink>
              </li> */}
              <li>
                <button onClick={logout} className="logoutBtn">
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
