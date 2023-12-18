import { NavLink } from "react-router-dom";
import "./daily-chart.css";
const DailyCharts = ({ clientCharts }) => {
  return (
    <>
      <h1>Daily Charts</h1>
      {clientCharts &&
        clientCharts?.Daily_Charts.map((dc) => {
          return (
            <div key={dc?.id} className="clientDCdata">
              <NavLink to={`/daily-chart/${dc.id}`} className="navLinkStyleDC">
                <div className="dcButtons">
                  <p>{dc?.chart_date}</p>
                  <div>Days Rating: {dc?.avgForChart}</div>
                  <div>Total Intervals: {dc?.interval_count}</div>
                  <p>View Chart</p>
                </div>
              </NavLink>
            </div>
          );
        })}
    </>
  );
};

export default DailyCharts;
