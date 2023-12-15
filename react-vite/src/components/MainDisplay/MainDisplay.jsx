import ButtonComponent from "../ButtonComponent";
import "./main-display.css";

const MainDisplay = () => {
  return (
    <div className="mainDisplayContain">
      <ButtonComponent
        btnText={"Manage Clients"}
        btnStyle={"manageClient"}
        btnClass={"button-comp-container btnHover"}
      />
      <ButtonComponent
        btnText={"View Reports"}
        btnStyle={"viewReports"}
        btnClass={"button-comp-container btnHover"}
      />
      <ButtonComponent
        btnText={"Daily Charts"}
        btnStyle={"dailyCharts"}
        btnClass={"button-comp-container btnHover"}
      />
      <ButtonComponent
        btnText={"Discreet Trials"}
        btnStyle={"dtTrials"}
        btnClass={"button-comp-container btnHover"}
      />
    </div>
  );
};

export default MainDisplay;
