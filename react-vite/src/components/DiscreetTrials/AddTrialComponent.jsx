import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "../AddIntervalComponent/add-interval.css";
// import { LegendComponent } from "../DailyCharts";
import { useParams } from "react-router-dom";
// import { addIntervalToChart } from "../../redux/charts";
// import { returnColor } from "../helpers/returnColor";
import { useModal } from "../../context/Modal";
// import { DeleteMessage } from "../DeleteModal";
// import { activities } from "../helpers/dropdown-data";
// import { behaviors } from "../helpers/dropdown-data";
import {
  trial_target_shapes,
  trial_target_colors,
  // trial_target_sizes,
  // trial_target_letter,
} from "../helpers/dropdown-data";

const AddTrialComponent = ({ dtInfo }) => {
  const { dt_id } = useParams();
  const [isDisabled, setDisabled] = useState(true);
  const [programDD, setProgramDD] = useState();
  const [targetItem, setTargetItem] = useState();

  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const { setModalContent } = useModal();
  const [errors, setErrors] = useState();

  useEffect(() => {
    console.log(dtInfo, "INFO");
    if (dtInfo?.program_name === "Identify Shapes") {
      setProgramDD(trial_target_shapes);
    }
    if (dtInfo?.program_name === "Identify Colors") {
      setProgramDD(trial_target_colors);
    }
  }, [dtInfo]);

  const errorCollector = {};

  const handleSubmit = async (e) => {};

  return (
    <div
      id="outerCompContain"
      // style={{ border: `10px solid ${currentRatingColor}` }}
    >
      <div className="intervalCompContain">
        <h1>Add New Trial</h1>

        <select
          onChange={(e) => setTargetItem(e.target.value)}
          value={targetItem}
        >
          {programDD &&
            programDD?.map((progOption) => {
              return (
                <option key={progOption} value={progOption}>
                  {progOption}
                </option>
              );
            })}
        </select>

        <button
          type="Submit"
          disabled={isDisabled}
          onClick={handleSubmit}
          id="modalDelBtn"
        >
          Add Trial
        </button>
        <button onClick={closeModal} id="modalCancelBtn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddTrialComponent;
