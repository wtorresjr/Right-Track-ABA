import { NavLink, useParams } from "react-router-dom";
import "../DailyCharts/daily-chart.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { getAllDTsThunk } from "../../redux/dts";
import { returnPercentColor } from "../helpers/returnColor";
import { DeleteChartModal } from "../DeleteModal";
import { useModal } from "../../context/Modal";
import CreateDailyChart from "../CreateDailyChart/CreateDailyChart";
import Paginator from "../PaginationComp/Paginator";
import "../PaginationComp/bootstrap.css";

import InfoBar from "../InfoBarComponent";

const DiscreetTrials = () => {
  const { setModalContent } = useModal();
  const { client_id } = useParams();
  const dispatch = useDispatch();
  const clientDT = useSelector((state) => state?.dt?.Discreet_Trials);
  const dtCount = useSelector(
    (state) => state?.clients?.client_by_id?.Total_DTs
  );
  const [totalDTs, setTotalDTs] = useState();
  const [pagLoaded, setPagLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  useEffect(() => {
    setPagLoaded(false);
    const getDTdata = async () => {
      const thunkLoaded = await dispatch(
        getAllDTsThunk(+client_id, currentPage, perPage)
      );
      if (thunkLoaded) {
        setPagLoaded(true);
      }
    };

    getDTdata();
  }, [currentPage, perPage, client_id]);

  useEffect(() => {
    setTotalDTs(dtCount);
  }, [dtCount]);

  const openDeleteModal = (chart) => {
    setModalContent(<DeleteChartModal chartInfo={chart} typeToDelete={"DT"} />);
  };

  const openCreateDTModal = () => {
    setModalContent(<CreateDailyChart isDT={"True"} />);
  };

  const openUpdateChartModal = (dt) => {
    setModalContent(
      <CreateDailyChart isDTupdate={"True"} isDT={"True"} dtInfo={dt} />
    );
  };

  const handlePageChange = (pageNumber, rowsPerPage) => {
    setCurrentPage(pageNumber);
    setPerPage(rowsPerPage);
  };

  return (
    <>
      <h1>
        Discreet Trials
        <button id="createNewChartBtn" onClick={openCreateDTModal}>
          <i className="fa-solid fa-puzzle-piece fa-xl"></i>
          Create Discreet Trial
          <i className="fa-solid fa-puzzle-piece fa-xl"></i>
        </button>
      </h1>
      {dtCount > 0 ? (
        <div className="chartsContain">
          <Paginator
            numOfCharts={totalDTs}
            perPage={perPage}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />

          {/* <InfoBar numOfCharts={totalDTs} type={"discreetTrials"} /> */}

          {pagLoaded ? (
            clientDT && clientDT.length ? (
              clientDT.map((dt) => (
                <div key={dt.id} className="dtItemsDiv">
                  <NavLink
                    to={`/discreet-trial/${dt.id}`}
                    className="navLinkStyleDC"
                  >
                    <div
                      className="dcButtons"
                      style={{
                        border: `3px solid ${returnPercentColor(
                          dt?.trials_avg
                        )}`,
                      }}
                    >
                      <div>{dt?.trial_date}</div>
                      <div>{dt?.program_name}</div>
                      <div>Mastery: {dt?.trials_avg}%</div>
                      View Trial(s)
                    </div>
                  </NavLink>
                  <div className="chartCrudBtns">
                    <button onClick={() => openUpdateChartModal(dt)}>
                      Edit DT
                    </button>
                    <button onClick={() => openDeleteModal(dt)}>
                      Delete DT
                    </button>
                  </div>
                </div>
              ))
            ) : (
              "No Discreet Trials Yet"
            )
          ) : (
            <div className="pagLoadingDiv">
              <h2>Discreet Trials Loading...</h2>
            </div>
          )}
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
          No Discreet Trials Yet.
        </h2>
      )}
    </>
  );
};

export default DiscreetTrials;
