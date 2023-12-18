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
                  <div>{dc?.chart_date}</div>
                  {/* <div>{dc["Intervals"]}</div> */}
                  View Chart
                </div>
              </NavLink>
            </div>
          );
        })}
    </>
  );
};

export default DailyCharts;
