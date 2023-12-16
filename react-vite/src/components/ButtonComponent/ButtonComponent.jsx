import { useNavigate } from "react-router-dom";
import "./button-component.css";

const ButtonComponent = ({
  btnText,
  btnStyle,
  btnClass,
  faAwesomeStyle,
  urlProp,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(urlProp);
  };

  return (
    <div className={btnClass} id={btnStyle} onClick={handleClick}>
      <h2>{btnText}</h2>
      <i className={faAwesomeStyle} style={{ color: "#ffffff" }}></i>
    </div>
  );
};

export default ButtonComponent;
