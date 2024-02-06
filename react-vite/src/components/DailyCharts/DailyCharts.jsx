import { Link } from "react-router-dom";
import "./daily-chart.css";
import LegendComponent from "./LegendComponent";
import { useModal } from "../../context/Modal";
import { DeleteChartModal } from "../DeleteModal";
import { CreateDailyChart, UpdateDailyChart } from "../CreateDailyChart";
import returnColor from "../helpers/returnColor";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import Paginator from "../PaginationComp";

const DailyCharts = ({ clientCharts }) => {
  const { setModalContent } = useModal();
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredCharts, setFilteredCharts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const numOfCharts = useSelector(
    (state) => state?.clients?.client_by_id?.Num_Of_Charts
  );

  //Use effect to get page or per_page after change

  useEffect(() => {
    const startIdx = (currentPage - 1) * perPage;
    const endIdx = startIdx + perPage;
    setFilteredCharts(clientCharts?.Daily_Charts?.slice(startIdx, endIdx));
  }, [currentPage, perPage, clientCharts]);

  useEffect(() => {
    const dateResults = clientCharts?.Daily_Charts?.filter((charts) =>
      Object.values(charts).some(
        (value) =>
          typeof value === "string" &&
          value?.toLowerCase().includes(searchFilter?.toLowerCase())
      )
    );

    if (dateResults) {
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
        <h2 style={{ color: returnColor(clientCharts?.All_Charts_Avg) }}>
          Avg For All Charts: {clientCharts?.All_Charts_Avg}
        </h2>
      </div>
      <input
        type="text"
        placeholder="Search Daily Charts (By Date)"
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
      />

      {/* Pagination */}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(numOfCharts / perPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          )
        )}
      </div>

      <div className="perPageDropdown">
        <label>Charts Per Page:</label>
        <input
          value={perPage}
          onChange={(e) => setPerPage(parseInt(e.target.value))}
          type="Number"
        >
          {/* Add more options as needed */}
        </input>
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
