import ButtonComponent from "../ButtonComponent";
import "./main-display.css";

const MainDisplay = () => {
  return (
    <div className="mainDisplayContain">
      <h1>Main Display</h1>
      <ButtonComponent btnText={"Manage Clients"} btnStyle={"manageClient"} />
      <ButtonComponent btnText={"View Reports"} btnStyle={"viewReports"} />
      <ButtonComponent btnText={"Daily Charts"} btnStyle={"dailyCharts"} />
      <ButtonComponent btnText={"Discreet Trials"} btnStyle={"dtTrials"} />
    </div>
  );
};

export default MainDisplay;
