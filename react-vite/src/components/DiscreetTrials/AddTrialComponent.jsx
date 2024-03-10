import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "../AddIntervalComponent/add-interval.css";
import "../CreateDailyChart/create-daily-chart.css";
import { useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { DeleteMessage } from "../DeleteModal";

import {
  trial_target_shapes,
  trial_target_colors,
  trial_target_sizes,
  trial_target_letters,
  trial_target_sorting_sizes,
} from "../helpers/dropdown-data";
import { addTrialThunk, editTrialThunk } from "../../redux/dts";
import { getClientByIDThunk } from "../../redux/clients";

const AddTrialComponent = ({ dtInfo, trialInfo }) => {
  const { dt_id } = useParams();
  const [isDisabled, setDisabled] = useState(true);
  const [programDD, setProgramDD] = useState();
  const [targetItem, setTargetItem] = useState();
  const [trialCount, setTrialCount] = useState();
  const [trialScore, setTrialScore] = useState();
  const [trialNotes, setTrialNotes] = useState();

  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const { setModalContent } = useModal();
  const [errors, setErrors] = useState();
  const errorCollector = {};

  useEffect(() => {
    if (dtInfo?.program_name === "Identify Shapes") {
      setProgramDD(trial_target_shapes);
    }
    if (dtInfo?.program_name === "Identify Colors") {
      setProgramDD(trial_target_colors);
    }
    if (dtInfo?.program_name === "Identify Sizes") {
      setProgramDD(trial_target_sizes);
    }
    if (dtInfo?.program_name === "Sorting Sizes") {
      setProgramDD(trial_target_sorting_sizes);
    }
    if (dtInfo?.program_name === "Identify Letters") {
      setProgramDD(trial_target_letters);
    }
  }, [dtInfo]);

  useEffect(() => {
    console.log(trialInfo, "trial info");
    const checkIfEditing = () => {
      setTargetItem(trialInfo.trial_target);
      setTrialCount(trialInfo.trial_count);
      setTrialScore(trialInfo.trial_score);
      setTrialNotes(trialInfo.trial_notes);
    };
    if (trialInfo) {
      checkIfEditing();
    }
  }, []);

  useEffect(() => {
    setErrors();
    if (!trialScore) {
      errorCollector.trialScoreMissing = "Trial score required";
    }
    if (!trialCount) {
      errorCollector.trialCountMissing = "Trial count required";
    }
    if (+trialScore > +trialCount) {
      errorCollector.trialCountError =
        "Trial score cannot be larger than trial count";
    }

    if (Object.keys(errorCollector).length) {
      setDisabled(true);
      setErrors(errorCollector);
    } else {
      setDisabled(false);
    }
  }, [trialCount, trialScore]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTrial = {
      trial_target: targetItem,
      trial_count: trialCount,
      trial_score: trialScore,
      trial_notes: trialNotes,
      client_id: dtInfo.client_id,
    };

    let trialAdded;

    if (trialInfo) {
      trialAdded = await dispatch(editTrialThunk(newTrial, trialInfo.id));
    } else {
      trialAdded = await dispatch(addTrialThunk(newTrial, dt_id));
    }

    if (trialAdded) {
      closeModal();
      setModalContent(
        <DeleteMessage
          message={
            trialInfo
              ? "Trial Updated Successfully!"
              : "Trial Added Successfully!"
          }
        />
      );
      await dispatch(getClientByIDThunk(dtInfo.client_id));
    }
  };

  return (
    <div id="outerCompContain">
      <div className="intervalCompContain">
        <div className="modalHeading">
          <h1 style={{ padding: "0 0 20px 0" }}>
            Add New Trial for {dtInfo.program_name}
          </h1>
          <i
            className="fa-solid fa-circle-xmark fa-2xl"
            // id="closeBtn"
            onClick={closeModal}
          ></i>
        </div>
        <>
          <div className="dividedDivs">
            <label>Target *</label>
            <select
              id="clientSelector"
              style={{ height: "40px" }}
              onChange={(e) => setTargetItem(e.target.value)}
              value={targetItem}
            >
              {programDD
                ? programDD?.map((progOption) => (
                    <option key={progOption} value={progOption}>
                      {progOption}
                    </option>
                  ))
                : [...Array(11).keys()].map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
            </select>
          </div>
          <div className="dividedDivs">
            <label>Trial Count * </label>
            <label className="errorsPtag">
              {errors && errors.trialCountMissing && errors.trialCountMissing}
            </label>
            <input
              type="Number"
              value={trialCount}
              onChange={(e) => setTrialCount(e.target.value)}
            />
          </div>
          <div
            style={{ display: "flex", justifyContent: "space-evenly" }}
          ></div>
          <div className="dividedDivs">
            <label>Trial Score *</label>
            <label className="errorsPtag">
              {errors && errors.trialScoreMissing && errors.trialScoreMissing}
              {errors && errors.trialCountError && errors.trialCountError}
            </label>
            <div id="trialScoreDiv">
              <input
                type="Number"
                value={trialScore}
                onChange={(e) => setTrialScore(e.target.value)}
              />
              <div>Out Of</div>
              <div>
                <label>Trial Count</label>
                <input type="Number" value={trialCount} />
              </div>
            </div>
          </div>
          <div className="dividedDivs">
            <label>Trial Notes</label>(Optional)
            <textarea
              className="intervalNotes"
              rows="7"
              value={trialNotes}
              onChange={(e) => setTrialNotes(e.target.value)}
            ></textarea>
          </div>
        </>

        <button
          type="Submit"
          disabled={isDisabled}
          onClick={handleSubmit}
          id="modalDelBtn"
        >
          {trialInfo ? "Update Trial" : "Add Trial"}
        </button>
        <button onClick={closeModal} id="modalCancelBtn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddTrialComponent;
