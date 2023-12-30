// import { NavLink, Link, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./daily-chart.css";
import LegendComponent from "./LegendComponent";
// import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { DeleteChartModal } from "../DeleteModal";
import CreateDailyChart from "../CreateDailyChart";
// import { getClientByIDThunk } from "../../redux/clients";

const DailyCharts = ({ clientCharts }) => {
  // const { client_id } = useParams();
  // const dispatch = useDispatch();
  const { setModalContent } = useModal();
  // const currentClient = useSelector((state) => state?.clients?.client_by_id);

  const openDeleteModal = (chart) => {
    setModalContent(<DeleteChartModal chartInfo={chart} />);
  };

  const openCreateChartModal = () => {
    setModalContent(<CreateDailyChart />);
  };

  let dayColorRating;

  return (
    <>
      <h1>Daily Performance Charts</h1>
      <div className="dcHeader">
        <LegendComponent />
        <button id="createNewChartBtn" onClick={openCreateChartModal}>
          Create New Chart
        </button>
      </div>
      <div className="chartsContain">
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
                : parseFloat(dc?.avgForChart) < 1
                ? "red"
                : null;

            {
              dc?.chart_complete === false ? (dayColorRating = "white") : null;
            }

            return (
              <div key={dc?.id} className="clientDCdata">
                <Link to={`/daily-chart/${dc.id}`} className="navLinkStyleDC">
                  <div
                    className="dcButtons"
                    style={{
                      border: `5px solid ${dayColorRating}`,
                    }}
                  >
                    <div className="folderText">
                      <p>
                        <label>Date: {dc?.chart_date}</label>
                      </p>
                      <div>Total Intervals: {dc?.interval_count}</div>
                      <div>Avg Rating: {dc?.avgForChart}</div>
                      <p>View Chart</p>
                    </div>
                  </div>
                </Link>
                <div className="chartCrudBtns">
                  <button>Edit Chart</button>
                  <button
                    onClick={() => {
                      openDeleteModal(dc);
                    }}
                  >
                    Delete Chart
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default DailyCharts;
