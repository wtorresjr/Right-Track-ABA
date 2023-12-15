import "./button-component.css";

const ButtonComponent = ({ btnText, btnStyle, btnClass, faAwesomeStyle }) => {
  return (
    <div className={btnClass} id={btnStyle}>
      <h2>{btnText}</h2>
      <i className={faAwesomeStyle} style={{ color: "#ffffff" }}></i>
    </div>
  );
};

export default ButtonComponent;



