import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./add-interval.css";
import { LegendComponent } from "../DailyCharts";
import { editIntervalThunk, getChartByIdThunk } from "../../redux/charts";
import returnColor from "../helpers/returnColor";
import { useModal } from "../../context/Modal";
import { DeleteMessage } from "../DeleteModal";
import { behaviors } from "../helpers/dropdown-data";
import { activities } from "../helpers/dropdown-data";

const UpdateIntervalComp = ({ intervalToEdit }) => {
  const [startTime, setStartTime] = useState(intervalToEdit.start_interval);
  const [endTime, setEndTime] = useState(intervalToEdit.end_interval);
  const [currBehavior, setCurrBehavior] = useState(behaviors[0]);
  const [currIntervalBehaviors, setCurrIntervalBehavior] = useState(
    intervalToEdit?.interval_tags
  );
  const [isDisabled, setDisabled] = useState(true);
  const [currActivity, setCurrActivity] = useState(intervalToEdit.activity);
  const [intervalRating, setIntervalRating] = useState(
    intervalToEdit.interval_rating
  );
  const [currentRatingColor, setCurrentRatingColor] = useState(
    returnColor(intervalRating)
  );
  const [currIntNotes, setCurrIntNotes] = useState(
    intervalToEdit.interval_notes
  );
  const dispatch = useDispatch();
  const [errors, setErrors] = useState();
  const { closeModal } = useModal();
  const { setModalContent } = useModal();

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
    if (intervalRating === "") {
      errorCollector["intervalRating"] = "Interval rating is required";
    }
    if (!currIntNotes || currIntNotes.trim().length < 5) {
      errorCollector["intervalNotes"] = "Notes required";
    }
    if (Object.keys(errorCollector).length) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    setErrors(errorCollector);
  }, [
    startTime,
    endTime,
    intervalRating,
    currIntNotes,
    currActivity,
    currBehavior,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const intervalUpdateData = {
      start_interval: startTime,
      end_interval: endTime,
      interval_tags: currIntervalBehaviors,
      interval_notes: currIntNotes,
      interval_rating: intervalRating,
      activity: currActivity,
    };

    const updateIntv = dispatch(
      editIntervalThunk(
        intervalUpdateData,
        intervalToEdit.id,
        intervalToEdit.chart_id
      )
    );
    if (updateIntv) {
      closeModal();
      setModalContent(
        <DeleteMessage message={"Interval Updated Succesfully!"} />
      );
    }
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
    <>
      <div
        id="outerCompContain"
        style={{ border: `10px solid ${currentRatingColor}` }}
      >
        <div className="intervalCompContain">
          <h1>Edit Interval Number {intervalToEdit.id}</h1>
          <div className="timeDiv">
            <label>
              Start Time
              <input
                type="time"
                onChange={(e) => setStartTime(e.target.value)}
                value={startTime}
              />
              {errors?.startTime && (
                <p className="errorsPtag">{errors?.startTime}</p>
              )}
            </label>
            <label>
              End Time
              <input
                type="time"
                onChange={(e) => setEndTime(e.target.value)}
                value={endTime}
              />
              {errors?.endTime && (
                <p className="errorsPtag">{errors?.endTime}</p>
              )}
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
          <div className="narWrap">
            <div className="behaviorsDiv2">
              <label>Activity:</label>
              <select
                onChange={(e) => setCurrActivity(e.target.value)}
                defaultValue="Choose an Activity"
                value={currActivity}
              >
                <option value="">Choose an Activity</option>
                {activities &&
                  activities?.map((activity) => {
                    return <option key={activity}>{activity}</option>;
                  })}
              </select>
            </div>
            <label>Current Interval Rating:</label>
            <div
              className="irDisplay"
              style={{ color: `${currentRatingColor}` }}
            >
              {intervalRating}
            </div>
          </div>
          {errors?.activity && <p className="errorsPtag">{errors?.activity}</p>}
          <label>Interval Notes:</label>
          <textarea
            className="intervalNotes"
            rows="7"
            value={currIntNotes}
            onChange={(e) => setCurrIntNotes(e.target.value)}
          ></textarea>
          {errors?.intervalNotes && (
            <p className="errorsPtag">{errors?.intervalNotes}</p>
          )}
          <LegendComponent />
          <div className="ratingButtons">
            <label>Interval Rating:</label>
            <select
              onChange={(e) => {
                setIntervalRating(e.target.value);
                setCurrentRatingColor(returnColor(e.target.value));
              }}
              value={intervalRating}
              className="ratingDropDown"
            >
              <option value={""}>Select a rating</option>
              <option value={0} style={{ backgroundColor: "red" }}>
                0
              </option>
              <option value={1} style={{ backgroundColor: "red" }}>
                1
              </option>
              <option value={2} style={{ backgroundColor: "orange" }}>
                2
              </option>
              <option value={3} style={{ backgroundColor: "yellow" }}>
                3
              </option>
              <option value={4} style={{ backgroundColor: "yellowgreen" }}>
                4
              </option>
              <option value={5} style={{ backgroundColor: "green" }}>
                5
              </option>
            </select>
          </div>
          {errors?.intervalRating && (
            <p className="errorsPtag">{errors?.intervalRating}</p>
          )}
        </div>
        <button
          type="Submit"
          disabled={isDisabled}
          onClick={handleSubmit}
          id="modalDelBtn"
        >
          Update Interval
        </button>
        <button onClick={closeModal} id="modalCancelBtn">
          Cancel
        </button>
      </div>
    </>
  );
};

export default UpdateIntervalComp;
