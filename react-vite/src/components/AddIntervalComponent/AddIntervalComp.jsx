import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./add-interval.css";
import { getClientByIDThunk } from "../../redux/clients";

const behaviors = [
  "Tantrums",
  "Throwing",
  "Self-Injurious Behiavior",
  "Biting",
  "Aggression",
  "Crying",
  "Vocal Stereotypy",
  "Property Destruction",
  "Kicking",
  "Spitting",
  "Non-Compliance",
  "Elopement",
  "Task Refusal",
  "Outbursts",
  "Mouthing",
  "Negative Statements",
  "Inappropriate Language",
  "Hitting",
  "PICA",
  "Food Refusal",
];

const AddIntervalComp = ({ client }) => {
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [currBehavior, setCurrBehavior] = useState(behaviors[0]);
  const [currIntervalBehaviors, setCurrIntervalBehavior] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIntervalData = {
      start_interval: startTime,
      end_interval: endTime,
      interval_tags: currIntervalBehaviors,
    };

    console.log(newIntervalData);
  };

  const newBehavior = (behavior, addOrRemove) => {
    setCurrIntervalBehavior((prevBehaviors) => {
      const updatedBehaviors = { ...prevBehaviors };

      if (updatedBehaviors[behavior]) {
        updatedBehaviors[behavior] += addOrRemove === "add" ? 1 : -1;

        if (updatedBehaviors[behavior] === 0) {
          delete updatedBehaviors[behavior];
        }
      } else {
        updatedBehaviors[behavior] = 1;
      }

      return updatedBehaviors;
    });

    console.log(behavior, "Current Behavior");
  };

  return (
    <div className="intervalCompContain">
      <h1>Add New Interval</h1>

      <form onSubmit={handleSubmit}>
        <input type="time" onChange={(e) => setStartTime(e.target.value)} />
        <input type="time" onChange={(e) => setEndTime(e.target.value)} />

        <select onChange={(e) => setCurrBehavior(e.target.value)}>
          {behaviors &&
            behaviors?.map((behavior) => {
              return (
                <option key={behavior} value={behavior}>
                  {behavior}
                </option>
              );
            })}
        </select>
        <button onClick={() => newBehavior(currBehavior, "add")}>
          Add Behavior
        </button>

        {Object.keys(currIntervalBehaviors).length ? (
          <div className="behaviorCountItem">
            {Object.entries(currIntervalBehaviors || {}).map(
              ([behavior, count]) => (
                <div key={behavior} onClick={() => setCurrBehavior(behavior)}>
                  <div>
                    {behavior}: {count}
                  </div>
                  <div className="addMinusBtns">
                    <button
                      onClick={() => {
                        newBehavior(behavior, "remove");
                      }}
                    >
                      -
                    </button>
                    <button
                      onClick={() => {
                        newBehavior(behavior, "add");
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          "None"
        )}

        <button type="Submit">Add Interval</button>
      </form>
    </div>
  );
};

export default AddIntervalComp;
