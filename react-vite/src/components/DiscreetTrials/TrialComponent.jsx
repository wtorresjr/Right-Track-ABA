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
      <div>Trial Target: {trial.trial_target}</div>
      <div>
        Trial Score: {trial.trial_score} out of {trial.trial_count} -{" "}
        {trialPercent}%
      </div>
      <div>Trial Count: {trial.trial_count}</div>
      <div>Trial Notes: {trial.trial_notes}</div>
    </div>
  );
};

export default TrialComponent;
