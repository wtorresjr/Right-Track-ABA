import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate, NavLink } from "react-router-dom";
import "./LoginForm.css";
import { useModal } from "../../context/Modal";
import SignupFormModal from "../SignupFormModal";

function LoginFormPage() {
  const { setModalContent } = useModal();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/home" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/home");
    }
  };

  const openSignUpModal = () => {
    setModalContent(<SignupFormModal />);
  };

  const demoLogIn = async (e) => {
    e.preventDefault();
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
          <img className="logo-image-login" src="../right-track-aba-logo.png" />
          {Object.keys(errors).length ? (
            <p className="errorsPtag">Login incorrect</p>
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
          {/* {errors.password && <p className="errorsPtag">{errors.password}</p>} */}
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
