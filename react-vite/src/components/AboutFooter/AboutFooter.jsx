import "./footer.css";

const AboutFooter = () => {
  const navigateToHub = () => {
    window.open("https://github.com/wtorresjr", "_blank");
  };
  return (
    <div className="footer">
      <div>Built With:</div>
      <span>Javascript</span>
      <span>Python</span>
      <span>JSX</span>
      <span>CSS</span>
      <span>React</span>
      <span>Redux</span>
      <span>Flask</span>
      <span>SQLAlchemy</span>
      <span>Docker</span>
      <div className="identFoot">
        <span onClick={navigateToHub} style={{ cursor: "pointer" }}>
          Created By: Will Torres
        </span>
        <span>© 2023-24 Right Track ABA</span>
      </div>
    </div>
  );
};

export default AboutFooter;
