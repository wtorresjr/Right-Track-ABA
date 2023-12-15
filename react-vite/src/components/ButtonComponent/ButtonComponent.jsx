import "./button-component.css";

const ButtonComponent = ({ btnText, btnStyle }) => {
  return (
    <div className="button-comp-container" id={btnStyle}>
      <h2>{btnText}</h2>
    </div>
  );
};

export default ButtonComponent;
