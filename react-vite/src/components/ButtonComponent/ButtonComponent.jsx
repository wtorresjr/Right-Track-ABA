import { useNavigate, Navigate } from "react-router-dom";
import "./button-component.css";

const ButtonComponent = ({
  btnText,
  btnStyle,
  btnClass,
  faAwesomeStyle,
  urlProp,
}) => {
  const navigate = useNavigate();
  return (
    <div className={btnClass} id={btnStyle} onClick={() => navigate(urlProp)}>
      <h2>{btnText}</h2>
      <i className={faAwesomeStyle} style={{ color: "#ffffff" }}></i>
    </div>
  );
};

export default ButtonComponent;
