import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "../AddIntervalComponent/add-interval.css";
import { LegendComponent } from "../DailyCharts";
import { useParams } from "react-router-dom";
import { addIntervalToChart } from "../../redux/charts";
import { returnColor } from "../helpers/returnColor";
import { useModal } from "../../context/Modal";
import { DeleteMessage } from "../DeleteModal";
import { activities } from "../helpers/dropdown-data";
import { behaviors } from "../helpers/dropdown-data";

const AddTrialComponent = ({ client, currentIntervals }) => {
  const { chart_id } = useParams();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [currBehavior, setCurrBehavior] = useState(behaviors[0]);
  const [currIntervalBehaviors, setCurrIntervalBehavior] = useState({});
  const [isDisabled, setDisabled] = useState(true);
  const [currActivity, setCurrActivity] = useState();
  const [intervalRating, setIntervalRating] = useState("");
  const [currentRatingColor, setCurrentRatingColor] = useState("white");
  const [currIntNotes, setCurrIntNotes] = useState("");
  const dispatch = useDispatch();
  const [errors, setErrors] = useState();
  const { closeModal } = useModal();
  const { setModalContent } = useModal();

  const [intTimes, setIntTimes] = useState();

  useEffect(() => {
    const intervalTimes = currentIntervals.map((interval) => {
      return { start: interval.start_interval, end: interval.end_interval };
    });
    setIntTimes(intervalTimes);
  }, []);

  const resetAfterSubmit = () => {
    setStartTime();
    setEndTime();
    setCurrBehavior();
    setCurrIntervalBehavior({});
    setCurrActivity();
    setCurrIntNotes("");
    setIntervalRating("");
    setCurrentRatingColor("white");
  };

  const errorCollector = {};
  useEffect(() => {
    if (intTimes && startTime && endTime) {
      intTimes.forEach((startEnd) => {
        if (!(startTime >= startEnd.end || endTime <= startEnd.start)) {
          errorCollector["timeOverlap"] =
            "Start time or End Time overlaps existing interval time.";
        }
      });
    }

    if (startTime > endTime) {
      errorCollector["invalidDate"] = "End Time cannot be before Start Time.";
    }
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
      errorCollector["intervalNotes"] = "Interval Notes required";
    }
    if (Object.keys(errorCollector).length) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }

    setErrors(errorCollector);
  }, [startTime, endTime, intervalRating, currIntNotes, currActivity]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newIntervalData = {
      start_interval: startTime,
      end_interval: endTime,
      interval_tags: currIntervalBehaviors,
      interval_notes: currIntNotes,
      interval_rating: intervalRating,
      chart_id: chart_id,
      client_id: client?.id,
      activity: currActivity,
    };

    const addIntv = dispatch(addIntervalToChart(newIntervalData));
    if (addIntv) {
      resetAfterSubmit();
      closeModal();
      setModalContent(
        <DeleteMessage message={"Interval Added Succesfully!"} />
      );
    }
  };

  const newBehavior = (behavior, addOrRemove) => {
    setCurrIntervalBehavior((prevBehaviors) => {
      const updatedBehaviors = { ...prevBehaviors };

      if (updatedBehaviors[behavior]) {
        updatedBehaviors[behavior] += addOrRemove === "add" ? 1 : -1;

        if (updatedBehaviors[behavior] === 0 || addOrRemove === "delete") {
          delete updatedBehaviors[behavior];
        }
      } else {
        updatedBehaviors[behavior] = 1;
      }

      return updatedBehaviors;
    });
  };

  return (
    <div
      id="outerCompContain"
      style={{ border: `10px solid ${currentRatingColor}` }}
    >
      <div className="intervalCompContain">
        <h1>Add New Interval</h1>
        <div className="timeDiv">
          <label>
            Start Time*
            <input type="time" onChange={(e) => setStartTime(e.target.value)} />
            {errors?.startTime && (
              <p className="errorsPtag">{errors?.startTime}</p>
            )}
          </label>
          <label>
            End Time*
            <input type="time" onChange={(e) => setEndTime(e.target.value)} />
            {errors?.endTime && <p className="errorsPtag">{errors?.endTime}</p>}
            {errors?.invalidDate && (
              <p className="errorsPtag">{errors?.invalidDate}</p>
            )}
            {errors?.timeOverlap && (
              <p className="errorsPtag">{errors?.timeOverlap}</p>
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
                  <div id="delAddMinusBtn">
                    <button
                      id="pbDeleteBtn"
                      className="addMinus"
                      onClick={(e) => {
                        e.stopPropagation();
                        newBehavior(behavior, "delete");
                      }}
                    >
                      Delete
                    </button>
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
                </div>
              )
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="noteActivityRating">
        <div className="activityRating">
          <div className="activityDiv">
            <label>Activity*</label>
            <div className="behaviorsDiv">
              <div id="activitySelect">
                <select
                  onChange={(e) => setCurrActivity(e.target.value)}
                  defaultValue="Choose an Activity"
                >
                  <option value="">Choose an Activity</option>
                  {activities &&
                    activities?.map((activity) => {
                      return <option key={activity}>{activity}</option>;
                    })}
                </select>
                <div className="narWrap">
                  {/* <div className="activityError"> */}
                  {/* </div> */}
                  {errors?.activity && (
                    <p className="errorsPtag">{errors?.activity}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="currIntervalDiv">
            <label>Current Interval Rating:</label>
            <div
              className="irDisplay"
              style={{ color: `${currentRatingColor}` }}
            >
              {intervalRating ? (
                intervalRating
              ) : (
                <p id="notAvailable-msg">{"N/A"}</p>
              )}
            </div>
            {/* </div> */}
          </div>
        </div>
        <div className="intervalNotesDiv">
          <label>Interval Notes*</label>
          <textarea
            className="intervalNotes"
            rows="7"
            value={currIntNotes}
            onChange={(e) => setCurrIntNotes(e.target.value)}
          ></textarea>
          {errors?.intervalNotes && (
            <p className="errorsPtag">{errors?.intervalNotes}</p>
          )}
        </div>
        <LegendComponent />
        <div id="intervalRatingLabel">
          <div className="behaviorsDiv">
            <label>Interval Rating:</label>
            <select
              onChange={(e) => {
                setIntervalRating(e.target.value);
                setCurrentRatingColor(returnColor(e.target.value));
              }}
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
      </div>
      <button
        type="Submit"
        disabled={isDisabled}
        onClick={handleSubmit}
        id="modalDelBtn"
      >
        Add Interval
      </button>
      <button onClick={closeModal} id="modalCancelBtn">
        Cancel
      </button>
    </div>
  );
};

export default AddTrialComponent;
