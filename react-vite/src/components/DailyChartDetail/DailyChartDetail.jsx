import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChartByIdThunk } from "../../redux/charts";
import { useParams, NavLink } from "react-router-dom";
import { getClientByIDThunk } from "../../redux/clients";
import "./daily-chart-detail.css";
import AddIntervalComp from "../AddIntervalComponent/AddIntervalComp";
import { LegendComponent } from "../DailyCharts";
import { returnColor } from "../helpers/returnColor";
import { useModal } from "../../context/Modal";
import DeleteIntervalModal from "../DeleteModal/DeleteIntervalModal";
import UpdateIntervalComp from "../AddIntervalComponent/UpdateIntervalComp";

const DailyChartDetail = () => {
  const dispatch = useDispatch();
  const { chart_id } = useParams();
  const clientInfo = useSelector((state) => state?.clients?.client_by_id);
  const currentChart = useSelector((state) => state?.chart?.chart?.Chart);
  const currentIntervals = useSelector(
    (state) => state?.chart?.chart?.Chart_Intervals
  );

  const [ratingColor, setRatingColor] = useState("white");
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
    window.scrollTo(0, 0);
  }, []);

  const openDeleteModal = (interval) => {
    setModalContent(<DeleteIntervalModal interval={interval} />);
  };

  const openEditIntervalModal = (interval) => {
    setModalContent(
      <UpdateIntervalComp client={clientInfo} intervalToEdit={interval} />
    );
  };

  const handleCrudClick = async (interval, actionType) => {
    if (actionType === "edit") {
      openEditIntervalModal(interval);
    }
    if (actionType === "delete") {
      openDeleteModal(interval);
    }
  };

  const openAddIntModal = () => {
    setModalContent(
      <AddIntervalComp
        client={clientInfo}
        currentIntervals={currentIntervals}
      />
    );
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
      </div>{" "}
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
      </div>
      <div style={{ display: "flex", justifyContent: "right" }}>
        <button id="createNewChartBtn" onClick={openAddIntModal}>
          <i className="fa-solid fa-file-circle-plus fa-xl"></i>
          Add New Interval
          <i className="fa-solid fa-file-circle-plus fa-xl"></i>
        </button>
      </div>
      {currentIntervals &&
        currentIntervals?.map((interval) => {
          return (
            <div
              key={interval?.id - interval?.chart_id}
              className="intervalInfoContain"
            >
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
                          {<strong>{behavior}</strong>}: {count}
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
                  Edit Interval
                </button>
                <button onClick={() => handleCrudClick(interval, "delete")}>
                  Delete Interval
                </button>
              </div>
            </div>
          );
        })}
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
      </div>{" "}
    </div>
  );
};

export default DailyChartDetail;
