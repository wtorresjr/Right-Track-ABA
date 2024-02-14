import { useEffect, useState } from "react";
import "./dt-comp-styles.css";

const TrialComponent = ({ trial }) => {
  const [trialPercent, setTrialPercent] = useState(0);
  const [passOrFail, setPassOrFail] = useState();
  useEffect(() => {
    const result = (100 / trial.trial_count) * trial.trial_score;
    setTrialPercent(result.toFixed(2));
    if (result < 100) {
      setPassOrFail("red");
    } else {
      setPassOrFail("green");
    }
  }, [trial]);

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
      </div>
      <div
        className="trialScoreDiv"
        style={{ backgroundColor: `${passOrFail}` }}
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
