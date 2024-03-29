import { useEffect, useState } from "react";
import "./dt-comp-styles.css";
import { returnPercentColor } from "../helpers/returnColor";
import { useModal } from "../../context/Modal";
import { DeleteChartModal } from "../DeleteModal";
import AddTrialComponent from "./AddTrialComponent";

const TrialComponent = ({ trial, dtInfo }) => {
  const { setModalContent } = useModal();
  const [trialPercent, setTrialPercent] = useState(0);
  const [passOrFail, setPassOrFail] = useState();

  useEffect(() => {
    const result = (100 / trial?.trial_count) * trial?.trial_score;
    setTrialPercent(result.toFixed(2));
    setPassOrFail(returnPercentColor(trialPercent));
  }, [trial, trialPercent]);

  const openDeleteModal = (chart) => {
    setModalContent(
      <DeleteChartModal chartInfo={chart} typeToDelete={"TRIAL"} />
    );
  };

  const openUpdateTrialModal = () => {
    setModalContent(
      <AddTrialComponent dtInfo={dtInfo} trialInfo={trial} isEdit={"True"} />
    );
  };

  return (
    <div className="trialDeets" style={{ border: `3px solid ${passOrFail}` }}>
      <div className="trialInfo">
        <div>
          <label>Trial Target:</label>
          {trial.trial_target}
        </div>
        <div>
          <label>Trial Count:</label>
          {trial.trial_count}
        </div>
        <div>
          <label>Trial Notes:</label>
          {trial.trial_notes}
        </div>

        <div
          className="chartCrudBtns"
          // style={{
          //   display: "flex",
          //   justifyContent: "left",
          //   margin: "15px 0 0 0",
          // }}
        >
          <button
            style={{ padding: "0 5px" }}
            onClick={() => {
              openDeleteModal(trial);
            }}
          >
            Delete Trial
          </button>
          <button
            onClick={() => {
              openUpdateTrialModal(trial);
            }}
          >
            Edit Trial
          </button>
        </div>
      </div>
      <div
        className="trialScoreDiv"
        style={{ border: `5px solid ${passOrFail}` }}
      >
        <div className="trialAttempts">
          Trial Score:
          <br></br>
          {trial.trial_score} / {trial.trial_count}
        </div>
        <div className="percent">{trialPercent}%</div>
      </div>
    </div>
  );
};

export default TrialComponent;
