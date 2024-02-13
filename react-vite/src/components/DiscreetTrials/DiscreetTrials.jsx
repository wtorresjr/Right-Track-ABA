import { NavLink } from "react-router-dom";
import "../DailyCharts/daily-chart.css";

const DiscreetTrials = ({ clientDT }) => {
  return (
    <div className="chartsContain">
      <h1>
        Discreet Trials
        <button id="createNewChartBtn">New Discreet Trial</button>
      </h1>

      {clientDT &&
        clientDT?.Discreet_Trials?.map((dt) => {
          return (
            <div key={dt.id}>
              <NavLink
                to={`/discreet-trial/${dt.id}`}
                className="navLinkStyleDC"
              >
                <div className="dcButtons">
                  <div> {dt?.trial_date}</div>
                  <div>{dt?.program_name}</div>
                  View Trial(s)
                </div>
              </NavLink>
            </div>
          );
        })}
    </div>
  );
};

export default DiscreetTrials;
