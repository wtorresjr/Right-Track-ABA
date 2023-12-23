import { NavLink, Link } from "react-router-dom";
import "./daily-chart.css";
import LegendComponent from "./LegendComponent";
const DailyCharts = ({ clientCharts }) => {
  let dayColorRating;
  return (
    <>
      <h1>Daily Performance Charts</h1>
      <LegendComponent />
      {clientCharts &&
        clientCharts?.Daily_Charts.map((dc) => {
          dayColorRating =
            parseFloat(dc?.avgForChart) >= 4
              ? "green" // Green
              : parseFloat(dc?.avgForChart) >= 3
              ? "yellowgreen"
              : parseFloat(dc?.avgForChart) >= 2
              ? "yellow"
              : parseFloat(dc?.avgForChart) >= 1
              ? "orange"
              : "red";

          return (
            <div key={dc?.id} className="clientDCdata">
              <Link to={`/daily-chart/${dc.id}`} className="navLinkStyleDC">
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
              </Link>
            </div>
          );
        })}
    </>
  );
};

export default DailyCharts;
