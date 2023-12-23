import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChartByIdThunk } from "../../redux/charts";
import { useParams, NavLink } from "react-router-dom";
import { getClientByIDThunk } from "../../redux/clients";
import "./daily-chart-detail.css";

const DailyChartDetail = () => {
  const dispatch = useDispatch();
  const { chart_id } = useParams();
  const chartIntervals = useSelector(
    (state) => state?.chart?.chart?.Chart_Intervals
  );
  const clientInfo = useSelector((state) => state?.clients?.client_by_id);
  const currentChart = clientInfo?.Daily_Charts?.filter(
    (chart) => +chart.id === +chart_id
  );

  const currentIntervals = currentChart[0]?.intervals;

  // console.log(clientInfo?.Daily_Charts, "<------- Client Info");
  console.log(currentChart, "<------- Current Chart");
  const [avgForDate, setAvgForDate] = useState();
  useEffect(() => {
    dispatch(getClientByIDThunk(clientInfo?.id));
  }, [dispatch]);

  return (
    <div className="mainDisplayContain">
      <div>
        <h1>Daily Chart Detail - {currentChart[0]?.chart_date} </h1>
        <NavLink
          to={`/client/${clientInfo?.id}`}
          className="navLinkStyle"
          style={{ fontWeight: "bold" }}
        >
          <p>Back To {clientInfo?.first_name}'s Detail Page</p>
        </NavLink>
        <h2>Avg For Day: {currentChart[0]?.avgForChart || "Fail"}</h2>
        <h2>
          {clientInfo?.last_name}, {clientInfo?.first_name}
        </h2>
        {currentIntervals &&
          currentIntervals?.map((interval) => {
            return (
              <div key={interval?.id} className="intervalInfoContain">
                <div className="intervalHeader">
                  <label>
                    Interval Time: {interval?.start_interval} -{" "}
                    {interval?.end_interval}
                  </label>{" "}
                  |<label> Activity: {interval?.activity} </label>|
                  <label> Interval Rating: {interval?.interval_rating}</label>
                </div>
                <p>
                  <label>Interval Notes:</label> {interval?.interval_notes}
                </p>
                <label>Problem Behaviors: </label>

                {Object.keys(interval?.interval_tags).length ? (
                  <div className="behaviorsTag">
                    {Object.entries(interval?.interval_tags || {}).map(
                      ([behavior, count]) => (
                        <div key={behavior}>
                          <div>
                            {behavior}: {count}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  "None."
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DailyChartDetail;
