import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./daily-chart.css";
import LegendComponent from "./LegendComponent";
import { useModal } from "../../context/Modal";
import { DeleteChartModal } from "../DeleteModal";
import { CreateDailyChart, UpdateDailyChart } from "../CreateDailyChart";
import { returnColor } from "../helpers/returnColor";
import { useSelector, useDispatch } from "react-redux";
import { getClientByIDThunk } from "../../redux/clients";
import Paginator from "../PaginationComp/Paginator";
import "../PaginationComp/bootstrap.css";
import InfoBar from "../InfoBarComponent";

const DailyCharts = ({ clientCharts }) => {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredCharts, setFilteredCharts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [filteredAvg, setFilteredAvg] = useState();
  const [allCharts, setAllCharts] = useState();
  const [pagLoading, setPagLoading] = useState(false);

  const numOfCharts = useSelector(
    (state) => state?.clients?.client_by_id?.Num_Of_Charts
  );

  useEffect(() => {
    setPagLoading(false);
    const getAllCharts = async () => {
      const allData = await dispatch(
        getClientByIDThunk(clientCharts?.id, 1, 1000)
      );

      if (allData?.ok) {
        setAllCharts(allData?.payload);
      }
    };

    if (searchFilter.length) {
      getAllCharts();
    }

    const getData = async () => {
      try {
        const data = await dispatch(
          getClientByIDThunk(clientCharts?.id, currentPage, perPage)
        );

        if (data?.ok) {
          setFilteredCharts(data?.payload?.Daily_Charts || []);
          setPagLoading(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!searchFilter.length) {
      getData();
    }

    const dateResults = allCharts?.Daily_Charts?.filter((charts) =>
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

      isNaN(filtChartAvg)
        ? setFilteredAvg("No Charts")
        : setFilteredAvg(filtChartAvg);

      setFilteredCharts(dateResults);
    }
  }, [searchFilter, currentPage, perPage, clientCharts?.id, numOfCharts]);

  useEffect(() => {
    let avgTotals = 0;

    if (filteredCharts) {
      for (let chart of filteredCharts) {
        avgTotals += chart.avgForChart;
      }
      let filtChartAvg = (avgTotals / filteredCharts.length).toFixed(2);
      isNaN(filtChartAvg)
        ? setFilteredAvg("No Charts")
        : setFilteredAvg(filtChartAvg);
    }
  }, [filteredCharts]);

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

  const handlePageChange = (pageNumber, rowsPerPage) => {
    setCurrentPage(pageNumber);
    setPerPage(rowsPerPage);
  };

  return (
    <>
      <h1>
        Daily Performance Charts
        <button id="createNewChartBtn" onClick={openCreateChartModal}>
          <i className="fa-solid fa-folder-plus fa-xl"></i>
          Create New Chart
          <i className="fa-solid fa-folder-plus fa-xl"></i>
        </button>
      </h1>
      {numOfCharts > 0 ? (
        <div className="chartsContain">
          <div className="dcHeader">
            <LegendComponent />
          </div>

          <input
            type="text"
            placeholder="Search Daily Charts (By Date)"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />

          {/* <div className="paginationDiv">
            <label>Page:</label> */}
            <Paginator
              numOfCharts={numOfCharts}
              perPage={perPage}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
            {/* <label>Charts Per Page:</label>
            <input
              className="perPageInput"
              type="number"
              value={perPage}
              onChange={(e) => setPerPage(e.target.value)}
            /> */}
          {/* </div> */}

          <InfoBar
            clientCharts={clientCharts}
            numOfCharts={numOfCharts}
            searchFilter={searchFilter}
            filteredAvg={filteredAvg}
            filteredCharts={filteredCharts}
            type={"dailyCharts"}
          />
          {pagLoading ? (
            <div className="chartsContain">
              {filteredCharts &&
                filteredCharts?.map((dc) => {
                  dayColorRating = returnColor(dc?.avgForChart, "float");

                  if (dc) {
                    dc?.chart_complete === false
                      ? (dayColorRating = "white")
                      : null;

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
          ) : (
            <div className="pagLoadingDiv">
              <h2>Loading Charts...</h2>
            </div>
          )}
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
        </div>
      ) : (
        <h2
          style={{
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
            borderRadius: "15px",
            padding: "10px 0",
            width: "100%",
          }}
        >
          No Daily Charts Yet.
        </h2>
      )}
    </>
  );
};

export default DailyCharts;
