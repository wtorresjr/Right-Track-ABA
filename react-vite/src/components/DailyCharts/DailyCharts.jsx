import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./daily-chart.css";
import LegendComponent from "./LegendComponent";
import { useModal } from "../../context/Modal";
import { DeleteChartModal } from "../DeleteModal";
import { CreateDailyChart, UpdateDailyChart } from "../CreateDailyChart";
import returnColor from "../helpers/returnColor";
import { useSelector, useDispatch } from "react-redux";
import { getClientByIDThunk } from "../../redux/clients";
import Paginator from "../PaginationComp/Paginator";
import "../PaginationComp/bootstrap.css";

const DailyCharts = ({ clientCharts }) => {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredCharts, setFilteredCharts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [filteredAvg, setFilteredAvg] = useState();

  const numOfCharts = useSelector(
    (state) => state?.clients?.client_by_id?.Num_Of_Charts
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await dispatch(
          getClientByIDThunk(clientCharts?.id, currentPage, perPage)
        );

        if (data?.ok) {
          setFilteredCharts(data?.payload?.Daily_Charts || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [currentPage, perPage, clientCharts?.id]);

  useEffect(() => {
    const dateResults = clientCharts?.Daily_Charts?.filter((charts) =>
      Object.values(charts).some(
        (value) =>
          typeof value === "string" &&
          value?.toLowerCase().includes(searchFilter?.toLowerCase())
      )
    );

    if (dateResults) {
      let avgTotals = 0;
      for (let chart of dateResults) {
        avgTotals += chart.avgForChart;
      }
      let filtChartAvg = (avgTotals / dateResults.length).toFixed(2);
      isNaN(filtChartAvg) ? setFilteredAvg("No Charts") : setFilteredAvg(filtChartAvg);
      setFilteredCharts(dateResults);
    }
  }, [searchFilter, clientCharts]);

  const openDeleteModal = (chart) => {
    setModalContent(<DeleteChartModal chartInfo={chart} />);
  };

  const openCreateChartModal = () => {
    setModalContent(<CreateDailyChart />);
  };

  const openUpdateChartModal = (dc) => {
    setModalContent(<UpdateDailyChart dc={dc} />);
  };

  let dayColorRating;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="chartsContain">
      <h1>
        Daily Performance Charts
        <button id="createNewChartBtn" onClick={openCreateChartModal}>
          Create New Chart
        </button>
      </h1>

      <div className="dcHeader">
        <LegendComponent />
      </div>

      <div
        className="chartTotalsContain"
        style={{
          border: `3px solid ${returnColor(clientCharts?.All_Charts_Avg)}`,
        }}
      >
        <h2>
          Total Charts: {numOfCharts}
          {searchFilter ? ` (${filteredCharts?.length} - Filtered)` : ""}
        </h2>
        <div>
          <h2 style={{ color: returnColor(clientCharts?.All_Charts_Avg) }}>
            Avg For All Charts: {clientCharts?.All_Charts_Avg}
          </h2>
          <h2
            style={{ color: returnColor(clientCharts?.Paginated_Charts_Avg) }}
          >
            Avg For Displayed Charts:{" "}
            {filteredAvg || clientCharts?.Paginated_Charts_Avg}
          </h2>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search Daily Charts (By Date)"
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
      />

      <div className="paginationDiv">
        <label>Page:</label>
        <Paginator
          numOfCharts={numOfCharts}
          perPage={perPage}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
        <label>Charts Per Page:</label>
        <input
          className="perPageInput"
          type="number"
          value={perPage}
          onChange={(e) => setPerPage(e.target.value)}
        />
      </div>

      <div className="chartsContain">
        {filteredCharts &&
          filteredCharts?.map((dc) => {
            dayColorRating = returnColor(dc?.avgForChart, "float");

            if (dc) {
              dc?.chart_complete === false ? (dayColorRating = "white") : null;

              return (
                <div key={dc?.id} className="clientDCdata">
                  <Link
                    to={`/daily-chart/${dc?.id}`}
                    className="navLinkStyleDC"
                  >
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
                    <button
                      onClick={() => {
                        openUpdateChartModal(dc);
                      }}
                    >
                      Edit Chart
                    </button>
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
            }

            return null;
          })}
      </div>
    </div>
  );
};

export default DailyCharts;
