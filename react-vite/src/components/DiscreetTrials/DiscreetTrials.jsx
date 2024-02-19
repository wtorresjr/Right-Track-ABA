import { NavLink, useParams } from "react-router-dom";
import "../DailyCharts/daily-chart.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllDTsThunk } from "../../redux/dts";
import { returnPercentColor } from "../helpers/returnColor";
import { DeleteChartModal } from "../DeleteModal";
import { useModal } from "../../context/Modal";

const DiscreetTrials = () => {
  const { setModalContent } = useModal();
  const { client_id } = useParams();
  const dispatch = useDispatch();
  const clientDT = useSelector((state) => state?.dt?.Discreet_Trials);

  useEffect(() => {
    dispatch(getAllDTsThunk(client_id));
  }, []);

  const openDeleteModal = (chart) => {
    setModalContent(<DeleteChartModal chartInfo={chart} typeToDelete={"DT"} />);
  };

  return (
    <div className="chartsContain">
      <h1>
        Discreet Trials
        <button id="createNewChartBtn">New Discreet Trial</button>
      </h1>

      {clientDT && clientDT?.length
        ? clientDT.map((dt) => {
            return (
              <div key={dt.id}>
                <NavLink
                  to={`/discreet-trial/${dt.id}`}
                  className="navLinkStyleDC"
                >
                  <div
                    className="dcButtons"
                    style={{
                      border: `3px solid ${returnPercentColor(dt?.trials_avg)}`,
                    }}
                  >
                    <div> {dt?.trial_date}</div>
                    <div>{dt?.program_name}</div>
                    <div>Mastery: {dt?.trials_avg}%</div>
                    View Trial(s)
                  </div>
                </NavLink>
                <div className="chartCrudBtns">
                  <button
                  // onClick={() => {
                  //   openUpdateChartModal(dc);
                  // }}
                  >
                    Edit DT
                  </button>
                  <button
                    // onClick={() => alert("Clicked DT")}
                    onClick={() => {
                      openDeleteModal(dt);
                    }}
                  >
                    Delete DT
                  </button>
                </div>
              </div>
            );
          })
        : "No Discreet Trials Yet"}
    </div>
  );
};

export default DiscreetTrials;
