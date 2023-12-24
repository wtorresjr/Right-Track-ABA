import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import "./add-interval.css";
import { LegendComponent } from "../DailyCharts";

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

const activities = [
  "Reading",
  "Writing",
  "Math",
  "Science",
  "Recess",
  "Free Time",
  "Circle Time",
  "Clean Up",
  "Art",
  "Lunch",
  "Snack",
  "P.E.",
];

const AddIntervalComp = () => {
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [currBehavior, setCurrBehavior] = useState(behaviors[0]);
  const [currIntervalBehaviors, setCurrIntervalBehavior] = useState({});
  const [isDisabled, setDisabled] = useState(true);
  const [currActivity, setCurrActivity] = useState();
  // const dispatch = useDispatch();
  const [errors, setErrors] = useState();

  const errorCollector = {};
  useEffect(() => {
    if (!startTime) {
      errorCollector["startTime"] = "Start Required";
    }
    if (!endTime) {
      errorCollector["endTime"] = "End Required";
    }
    if (!currActivity) {
      errorCollector["activity"] = "Activity is required";
    }
    if (Object.keys(errorCollector).length) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    setErrors(errorCollector);
  }, [startTime, endTime, errorCollector]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let newIntervalData = {};
    newIntervalData = {
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
  };

  return (
    <div id="outerCompContain">
      <div className="intervalCompContain">
        <h1>Add New Interval</h1>
        <div className="timeDiv">
          <label>
            Start Time
            <input type="time" onChange={(e) => setStartTime(e.target.value)} />
            {errors?.startTime && (
              <p className="errorsPtag">{errors?.startTime}</p>
            )}
          </label>
          <label>
            End Time
            <input type="time" onChange={(e) => setEndTime(e.target.value)} />
            {errors?.endTime && <p className="errorsPtag">{errors?.endTime}</p>}
          </label>
        </div>

        <h2>Problem Behaviors</h2>
        <div className="behaviorsDiv">
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
        </div>

        {Object.keys(currIntervalBehaviors).length ? (
          <div className="behaviorCountItem">
            {Object.entries(currIntervalBehaviors || {}).map(
              ([behavior, count]) => (
                <div key={behavior} className="countItem">
                  {behavior}:
                  <div className="addMinusBtns">
                    <button
                      className="addMinus"
                      onClick={(e) => {
                        e.stopPropagation();
                        newBehavior(behavior, "remove");
                      }}
                    >
                      -
                    </button>
                    <div className="countBox">{count}</div>

                    <button
                      className="addMinus"
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
          ""
        )}
      </div>
      <div className="noteActivityRating">

        <label>Activity:</label>
        <div className="behaviorsDiv">
          <select
            onChange={(e) => setCurrActivity(e.target.value)}
            defaultValue="Choose Activity"
          >
            <option value="" selected>
              Choose an Activity
            </option>
            {activities &&
              activities?.map((activity) => {
                return <option key={activity}>{activity}</option>;
              })}
          </select>
        </div>
        {errors?.activity && <p className="errorsPtag">{errors?.activity}</p>}
        <label>Interval Notes:</label>
        <textarea className="intervalNotes" rows="7"></textarea>

        <label>Interval Rating:</label>
        <LegendComponent />
        <div className="ratingButtons">

        </div>
      </div>
      <button
        type="Submit"
        disabled={isDisabled}
        onClick={handleSubmit}
        id="addIntervalBtn"
      >
        Add Interval
      </button>
    </div>
  );
};

export default AddIntervalComp;

// const NoteActivityRating = ({ currIntervaData }) => {

//   return (

//   );
// };
