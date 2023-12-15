import "./button-component.css";

const ButtonComponent = ({ btnText, btnStyle, btnClass }) => {
  return (
    <div className={btnClass} id={btnStyle}>
      <h2>{btnText}</h2>
    </div>
  );
};

export default ButtonComponent;
