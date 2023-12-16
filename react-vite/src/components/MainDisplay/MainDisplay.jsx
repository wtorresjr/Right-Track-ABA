import ButtonComponent from "../ButtonComponent";
import { NavLink } from "react-router-dom";
import "./main-display.css";

const MainDisplay = () => {
  return (
    <div className="mainDisplayContain">
      {/* <ButtonComponent
        btnText={"Manage Clients"}
        btnStyle={"manageClient"}
        btnClass={"button-comp-container btnHover"}
        faAwesomeStyle={"fa-solid fa-people-roof fa-2xl"}
        urlProp={"/manage-clients"}
      />
      <ButtonComponent
        btnText={"View Reports"}
        btnStyle={"viewReports"}
        btnClass={"button-comp-container btnHover"}
        faAwesomeStyle={"fa-solid fa-chart-column fa-2xl"}
        urlProp={"/view-reports"}
      />
      <ButtonComponent
        btnText={"Daily Charts"}
        btnStyle={"dailyCharts"}
        btnClass={"button-comp-container btnHover"}
        faAwesomeStyle={"fa-regular fa-calendar-days fa-2xl"}
        urlProp={"/daily-charts"}
      />
      <ButtonComponent
        btnText={"Discreet Trials"}
        btnStyle={"dtTrials"}
        btnClass={"button-comp-container btnHover"}
        faAwesomeStyle={"fa-solid fa-list-check fa-2xl"}
        urlProp={"/discreet-trials"}
      /> */}
    </div>
  );
};

export default MainDisplay;
