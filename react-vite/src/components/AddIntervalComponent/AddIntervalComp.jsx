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
  const [isDisabled, setDisabled] = useState(true);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState();

  const errorCollector = {};
  useEffect(() => {
    if (!startTime) {
      errorCollector["startTime"] = "Start Required";
    }
    if (!endTime) {
      errorCollector["endTime"] = "End Required";
    }
    if (Object.keys(errorCollector).length) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    setErrors(errorCollector);
  }, [dispatch, startTime, endTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIntervalData = {
      start_interval: startTime,
      end_interval: endTime,
      interval_tags: currIntervalBehaviors,
    };

    console.log(newIntervalData, "New Handle Submit");
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

    // console.log(behavior, "Current Behavior");
  };

  return (
    <div className="intervalCompContain">
      <h1>Add New Interval</h1>

      {/* <form onSubmit={handleSubmit}> */}
      <input type="time" onChange={(e) => setStartTime(e.target.value)} />
      {errors?.startTime && <p>{errors?.startTime}</p>}
      <input type="time" onChange={(e) => setEndTime(e.target.value)} />
      {errors?.endTime && <p>{errors?.endTime}</p>}

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
      <button
        onClick={(e) => {
          e.stopPropagation();
          newBehavior(currBehavior, "add");
        }}
      >
        Add Behavior
      </button>

      {Object.keys(currIntervalBehaviors).length ? (
        <div className="behaviorCountItem">
          {Object.entries(currIntervalBehaviors || {}).map(
            ([behavior, count]) => (
              <div key={behavior}>
                <div>
                  {behavior}: {count}
                </div>
                <div className="addMinusBtns">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      newBehavior(behavior, "remove");
                    }}
                  >
                    -
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
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

      <button type="Submit" disabled={isDisabled} onClick={handleSubmit}>
        Add Interval
      </button>
      {/* </form> */}
    </div>
  );
};

export default AddIntervalComp;
