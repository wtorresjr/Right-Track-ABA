import { NavLink } from "react-router-dom";
import "./daily-chart.css";
const DailyCharts = ({ clientCharts }) => {
  return (
    <>
      <h1>Daily Charts</h1>
      {clientCharts &&
        clientCharts?.Daily_Charts.map((dt) => {
          return (
            <div key={dt?.id} className="clientDCdata">
              <NavLink to={`/daily-chart/${dt.id}`} className="navLinkStyleDC">
                <div className="dcButtons">
                  <div>{dt?.chart_date}</div>
                  View Intervals
                </div>
              </NavLink>
            </div>
          );
        })}
    </>
  );
};

export default DailyCharts;
