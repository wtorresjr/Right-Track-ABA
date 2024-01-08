import { useNavigate } from "react-router-dom";
import "./button-component.css";

const ButtonComponent = ({
  btnText,
  scndText,
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
      <div>
        <h2>{btnText}</h2>
        <h3>{scndText}</h3>
      </div>
      <i className={faAwesomeStyle} style={{ color: "#ffffff" }}></i>
    </div>
  );
};

export default ButtonComponent;
