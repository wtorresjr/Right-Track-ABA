import React, { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate, NavLink } from "react-router-dom";
import "./LoginForm.css";
import SignupFormModal from "../SignupFormModal";
import { useModal } from "../../context/Modal";
import DeletingMessage from "../DeleteModal/DeletingMessage";

function LoginFormPage() {
  const { setModalContent } = useModal();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  if (sessionUser) return <Navigate to="/home" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    openLoggingInMessage();

    try {
      const serverResponse = await dispatch(
        thunkLogin({
          email,
          password,
        })
      );

      if (serverResponse) {
        setErrors(serverResponse);
        setIsVisible(true);
      } else {
        navigate("/home");
        setIsVisible(false);
      }
    } catch (error) {
      // Handle errors, if any, from the thunkLogin action
      console.error("Error during login:", error);
      setIsVisible(false); // Make sure to hide the message on error as well
    }
  };


  const openLoggingInMessage = () => {
    setModalContent(
      <DeletingMessage
        message={"Logging In..."}
        isVisible={isVisible}
        origin={"loginPage"}
      />
    );
  };

  const openSignUpModal = () => {
    setModalContent(<SignupFormModal />);
  };

  const demoLogIn = async (e) => {
    e.preventDefault();
    openLoggingInMessage();
    dispatch(
      thunkLogin({
        email: "demo@demo.com",
        password: "password",
      })
    );
  };

  return (
    <div className="loginFormModal">
      {errors.length > 0 &&
        errors.map((message) => (
          <p key={message} className="errorsPtag">
            {message}
          </p>
        ))}
      <div className="formContain">
        <form onSubmit={handleSubmit} className="loginForm">
          <img
            className="logo-image-login"
            src="../right-track-aba-logo.png"
            alt="Logo"
          />
          {Object.keys(errors).length ? (
            <p className="errorsPtag">Email or Password is Incorrect</p>
          ) : (
            ""
          )}
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Log In</button>
          <button type="submit" onClick={demoLogIn}>
            Demo Login
          </button>
          <p>
            <NavLink onClick={openSignUpModal}>Sign Up</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginFormPage;
