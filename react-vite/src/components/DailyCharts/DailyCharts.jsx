import { NavLink } from "react-router-dom";
import "./daily-chart.css";
const DailyCharts = ({ clientCharts }) => {
  let dayColorRating;
  return (
    <>
      <h1>Daily Performance Charts</h1>
      {clientCharts &&
        clientCharts?.Daily_Charts.map((dc) => {
          dayColorRating =
            parseFloat(dc?.avgForChart) >= 1.5
              ? "green"
              : parseFloat(dc?.avgForChart) > 1
              ? "yellow"
              : parseFloat(dc?.avgForChart) <= 1
              ? "red"
              : "black";
          return (
            <div key={dc?.id} className="clientDCdata">
              <NavLink to={`/daily-chart/${dc.id}`} className="navLinkStyleDC">
                <div
                  className="dcButtons"
                  style={{
                    border: `5px solid ${dayColorRating}`,
                  }}
                >
                  <p>{dc?.chart_date}</p>
                  <div>Total Intervals: {dc?.interval_count}</div>
                  <div>Avg Rating: {dc?.avgForChart}</div>
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
