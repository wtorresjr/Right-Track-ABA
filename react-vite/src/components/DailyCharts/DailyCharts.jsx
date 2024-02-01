import { Link } from "react-router-dom";
import "./daily-chart.css";
import LegendComponent from "./LegendComponent";
import { useModal } from "../../context/Modal";
import { DeleteChartModal } from "../DeleteModal";
import { CreateDailyChart, UpdateDailyChart } from "../CreateDailyChart";
import returnColor from "../helpers/returnColor";
import { useEffect, useState } from "react";
import Paginator from "../PaginationComp";

const DailyCharts = ({ clientCharts }) => {
  const { setModalContent } = useModal();
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredCharts, setFilteredCharts] = useState([]);

  useEffect(() => {
    setFilteredCharts(clientCharts);
  }, [clientCharts]);

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

      <input
        type="text"
        placeholder="Search Daily Charts (By Date)"
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
      />
      <div className="chartTotalsContain">
        <h2>
          Total Charts: {filteredCharts.length}
          {searchFilter ? " (Filtered)" : ""}
        </h2>
        <h2 style={{ color: returnColor(clientCharts?.All_Charts_Avg) }}>
          Avg For All Charts: {clientCharts?.All_Charts_Avg}
        </h2>
      </div>
      <div className="paginator-contain">
        <Paginator charts={clientCharts} />
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
