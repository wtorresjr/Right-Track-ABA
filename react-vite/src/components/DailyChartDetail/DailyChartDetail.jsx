import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { completeTheChartThunk, getChartByIdThunk } from "../../redux/charts";
import { useParams, NavLink } from "react-router-dom";
import { getClientByIDThunk } from "../../redux/clients";
import "./daily-chart-detail.css";
import AddIntervalComp from "../AddIntervalComponent/AddIntervalComp";
import { useNavigate } from "react-router-dom";
import { LegendComponent } from "../DailyCharts";
import returnColor from "../helpers/returnColor";
import { useModal } from "../../context/Modal";
import DeleteIntervalModal from "../DeleteModal/DeleteIntervalModal";

const DailyChartDetail = () => {
  const dispatch = useDispatch();
  const { chart_id } = useParams();
  const navigate = useNavigate();
  const clientInfo = useSelector((state) => state?.clients?.client_by_id);
  const currentChart = useSelector((state) => state?.chart?.chart?.Chart);
  const currentIntervals = useSelector(
    (state) => state?.chart?.chart?.Chart_Intervals
  );

  const [ratingColor, setRatingColor] = useState("white");
  const [isIncomplete, setIsIncomplete] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const { setModalContent } = useModal();

  useEffect(() => {
    dispatch(getClientByIDThunk(currentChart?.client_id));
    dispatch(getChartByIdThunk(chart_id));

    if (currentChart) {
      const chartColor = returnColor(currentChart?.Chart_Avg_Rating, "float");
      setRatingColor(chartColor);
    }
  }, [
    dispatch,
    chart_id,
    currentChart?.id,
    currentChart?.client_id,
    currentIntervals?.length,
    ratingColor,
    currentChart?.Chart_Avg_Rating,
    refresh,
  ]);

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

  const openDeleteModal = (interval) => {
    setModalContent(<DeleteIntervalModal interval={interval} />);
  };

  const handleCrudClick = async (interval, actionType) => {
    if (actionType === "edit") {
      console.log("You want to edit ID:", interval);
    }
    if (actionType === "delete") {
      openDeleteModal(interval);
    }
  };

  return (
    <div className="mainDisplayContain">
      <div className="chartDetailHeader">
        <div>
          <h1>Daily Chart Detail - {currentChart?.chart_date} </h1>
        </div>
        <div>
          <NavLink
            to={`/client/${clientInfo?.id}`}
            className="navLinkStyle"
            style={{ fontWeight: "bold" }}
          >
            <div>
              <i className="fa-solid fa-arrow-left fa-xl"></i> Back To{" "}
              {clientInfo?.first_name}'s Detail Page
            </div>
          </NavLink>
        </div>
      </div>

      <AddIntervalComp client={clientInfo} />

      <div id="chartOptionsDiv">
        <h2>
          Client: {clientInfo?.first_name} {clientInfo?.last_name}
        </h2>

        <h2
          style={{ color: ratingColor, border: `2px solid ${ratingColor}` }}
          id="ratingBg"
        >
          <div>
            Number of Intervals:{" "}
            {currentChart?.Num_Intervals ? currentChart?.Num_Intervals : 0}
          </div>
          Average Interval Rating:{" "}
          {currentChart?.Chart_Avg_Rating || "No Intervals Yet"}
        </h2>

        <div className="dcHeader">
          <LegendComponent />
        </div>
        {isIncomplete && currentIntervals?.length > 0 ? (
          <button onClick={submitChart} id="setChartBtn">
            Set Chart As Complete
          </button>
        ) : (
          ""
        )}
      </div>
      {currentIntervals &&
        currentIntervals?.map((interval) => {
          return (
            <div key={interval?.id} className="intervalInfoContain">
              <div
                className="intervalHeader"
                style={{
                  borderColor: returnColor(interval?.interval_rating, "whole"),
                }}
              >
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
              <div className="intervalCrudBtns">
                <button onClick={() => handleCrudClick(interval, "edit")}>
                  Edit
                </button>
                <button onClick={() => handleCrudClick(interval, "delete")}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default DailyChartDetail;
