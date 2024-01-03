import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dispatch = useDispatch();

  const [isDisabled, setIsDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const errorCollector = {};

    if (!first_name.length) {
      errorCollector.firstName =
        "First name must be between 2 to 30 characters";
    }
    if (!last_name.length) {
      errorCollector.lastName = "Last name must be between 2 to 35 characters";
    }
    if (!email.match(emailRegex)) {
      errorCollector.email = "Invalid email address";
    }

    if (!password) {
      errorCollector.password = "Password is required";
    }

    if (password !== confirmPassword) {
      errorCollector.confirmPassword =
        "Confirm Password field must be the same as the Password field.";
    }

    setErrors(errorCollector);

    if (!Object.keys(errorCollector).length) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [dispatch, first_name, last_name, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        first_name,
        last_name,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="signUpFormContain">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        {errors.server && <p>{errors.server}</p>}
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="errorsPtag">{errors.email}</p>}
        <label>
          First Name
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        {errors.firstName && <p className="errorsPtag">{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        {errors.lastName && <p className="errorsPtag">{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="errorsPtag">{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className="errorsPtag">{errors.confirmPassword}</p>
        )}
        <button type="submit" disabled={isDisabled}>
          Sign Up
        </button>
        <button onClick={() => closeModal()}>Cancel</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
