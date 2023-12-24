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
  return (
    <div className="intervalCompContain">
      <h1>Add New Interval</h1>
      <TimeAndBehaviorComp />
    </div>
  );
};
export default AddIntervalComp;

const currIntBehaviors = {};

const TimeAndBehaviorComp = ({ client }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getClientByIDThunk());
  });

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [currBehavior, setCurrBehavior] = useState(behaviors[0]);
  const [currIntervalBehaviors, setCurrIntervalBehavior] = useState({});

  const addToBehaviors = () => {
    setCurrIntervalBehavior((prevBehaviors) => {
      const updatedBehaviors = { ...prevBehaviors };

      if (updatedBehaviors[currBehavior]) {
        updatedBehaviors[currBehavior] += 1;
      } else {
        updatedBehaviors[currBehavior] = 1;
      }

      return updatedBehaviors;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newIntervalData = {
      start_interval: startTime,
      end_interval: endTime,
      interval_tags: currIntervalBehaviors,
    };

    console.log(newIntervalData, "<--- handle submit test");
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="timeContain">
        <div className="strEndTimes-inputs">
          <label>
            Start:
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>
          <label>
            End:
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </label>
        </div>
        <div className="behaviorDiv">
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
          <button onClick={() => addToBehaviors(currBehavior)}>
            Add Behavior
          </button>
        </div>
        <button type="Submit">Add Interval</button>
      </div>
    </form>
  );
};

// const BehaviorsComponent = () => {
//   return (

//   );
// };
