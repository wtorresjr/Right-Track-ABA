import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { completeTheChartThunk, getChartByIdThunk } from "../../redux/charts";
import { useParams, NavLink } from "react-router-dom";
import { getClientByIDThunk } from "../../redux/clients";
import "./daily-chart-detail.css";
import AddIntervalComp from "../AddIntervalComponent/AddIntervalComp";
import { useNavigate } from "react-router-dom";

const DailyChartDetail = () => {
  const dispatch = useDispatch();
  const { chart_id } = useParams();
  const navigate = useNavigate();

  const clientInfo = useSelector((state) => state?.clients?.client_by_id);
  const currentChart = useSelector((state) => state?.chart?.chart?.Chart);
  const currentIntervals = useSelector(
    (state) => state?.chart?.chart?.Chart_Intervals
  );
  const [isIncomplete, setIsIncomplete] = useState(false);

  useEffect(() => {
    dispatch(getClientByIDThunk(currentChart?.client_id));
    dispatch(getChartByIdThunk(chart_id));
  }, [dispatch, chart_id, currentChart?.client_id, currentIntervals?.length]);

  useEffect(() => {
    if (!currentChart?.chart_complete) {
      setIsIncomplete(true);
    } else {
      setIsIncomplete(false);
    }
  }, [dispatch, chart_id, currentChart?.id]);

  const submitChart = async () => {
    const completedChartInfo = {
      chart_complete: true,
    };

    const finished = await dispatch(
      completeTheChartThunk(completedChartInfo, chart_id)
    );
    if (finished) {
      navigate(`/client/${clientInfo?.id}`);
    }
  };

  return (
    <div className="mainDisplayContain">
      <div>
        <h1>Daily Chart Detail - {currentChart?.chart_date} </h1>
        <NavLink
          to={`/client/${clientInfo?.id}`}
          className="navLinkStyle"
          style={{ fontWeight: "bold" }}
        >
          <p>Back To {clientInfo?.first_name}'s Detail Page</p>
        </NavLink>

        <AddIntervalComp client={clientInfo} />
        <h2>
          Chart Rating: {currentChart?.Chart_Avg_Rating || "No Intervals Yet"}
        </h2>
        <h2>
          {clientInfo?.last_name}, {clientInfo?.first_name}
        </h2>
        {isIncomplete && currentIntervals?.length > 0 ? (
          <button onClick={submitChart}>Set Chart As Complete</button>
        ) : (
          ""
        )}
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

                {Object.keys(interval?.interval_tags ?? {}).length ? (
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
