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

const AddTrialComponent = () => {
  const { dt_id } = useParams();

  const [isDisabled, setDisabled] = useState(true);

  const dispatch = useDispatch();
  const [errors, setErrors] = useState();
  const { closeModal } = useModal();
  const { setModalContent } = useModal();

  const errorCollector = {};

  const handleSubmit = async (e) => {};

  return (
    <div
      id="outerCompContain"
      // style={{ border: `10px solid ${currentRatingColor}` }}
    >
      <div className="intervalCompContain">
        <h1>Add New Trial</h1>

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
