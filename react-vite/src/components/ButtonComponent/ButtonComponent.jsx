import "./button-component.css";

const ButtonComponent = ({ btnText, btnStyle, btnClass }) => {
  return (
    <div className={btnClass} id={btnStyle}>
      <h2>{btnText}</h2>
      <i
        className="fa-solid fa-people-roof fa-2xl"
        style={{ color: "#ffffff" }}
      ></i>
    </div>
  );
};

export default ButtonComponent;
