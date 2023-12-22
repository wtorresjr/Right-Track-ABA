import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChartByIdThunk } from "../../redux/charts";
import { useParams, NavLink } from "react-router-dom";
import { getClientByIDThunk } from "../../redux/clients";
import "./daily-chart-detail.css";

const DailyChartDetail = () => {
  const dispatch = useDispatch();
  const { chart_id } = useParams();
  const clientChart = useSelector((state) => state?.chart?.chart);
  const currentChart = useSelector(
    (state) => state?.clients?.clients_by_id?.Daily_Charts
  );
  const chartIntervals = useSelector(
    (state) => state?.chart?.chart?.Chart_Intervals
  );
  const clientInfo = useSelector((state) => state?.clients?.client_by_id);
  const avg = useSelector((state) => state?.avgForDate);

  useEffect(() => {
    dispatch(getChartByIdThunk(chart_id));
    dispatch(getClientByIDThunk(clientInfo?.id));
  }, [dispatch]);

  return (
    <div className="mainDisplayContain">
      <div>
        <h1>Daily Chart Detail - {clientChart?.Chart?.chart_date} </h1>
        <NavLink
          to={`/client/${clientInfo?.id}`}
          className="navLinkStyle"
          style={{ fontWeight: "bold" }}
        >
          Back To {clientInfo?.first_name}'s Detail Page
        </NavLink>
        {/* {avg} */}
        <p>Avg For Day:{chart_id || "Fail"}</p>
      </div>
      {clientInfo?.last_name}, {clientInfo?.first_name}
      {chartIntervals &&
        chartIntervals?.map((interval) => {
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
                <p className="behaviorsTag">
                  {Object.entries(interval?.interval_tags || {}).map(
                    ([behavior, count]) => (
                      <div key={behavior}>
                        <div>
                          {behavior}: {count}
                        </div>
                      </div>
                    )
                  )}
                </p>
              ) : (
                "None."
              )}
            </div>
          );
        })}
    </div>
  );
};

export default DailyChartDetail;
