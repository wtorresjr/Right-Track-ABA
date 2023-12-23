import { NavLink, Link } from "react-router-dom";
import "./daily-chart.css";
import LegendComponent from "./LegendComponent";
import { useSelector } from "react-redux";
const DailyCharts = ({ clientCharts }) => {
  const currentClient = useSelector((state) => state?.clients?.client_by_id);
  let dayColorRating;
  return (
    <>
      <h1>Daily Performance Charts</h1>
      <div className="dcHeader">
        <LegendComponent />
        <NavLink to={`/new-daily-chart/${currentClient?.id}`}>
          <button id="createNewChartBtn">Create New Chart</button>
        </NavLink>
      </div>
      {clientCharts &&
        clientCharts?.Daily_Charts.map((dc) => {
          dayColorRating =
            parseFloat(dc?.avgForChart) >= 4
              ? "green"
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
              <div className="chartCrudBtns">
                <button>Edit Chart</button>
                <button>Delete Chart</button>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default DailyCharts;
