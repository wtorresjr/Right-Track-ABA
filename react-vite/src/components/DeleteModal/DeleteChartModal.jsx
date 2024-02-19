import "./delete-modal.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import DeleteMessage from "./DeletingMessage";
import { delDailyChartThunk } from "../../redux/charts";
import { getClientByIDThunk } from "../../redux/clients";
import {
  deleteDTThunk,
  deleteTrialThunk,
  getDiscreetTrialThunk,
} from "../../redux/dts";

const DeleteChartModal = ({ chartInfo, typeToDelete }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [isDisabled, setIsDisabled] = useState(true);
  const [confirmDelText, setConfirmDelText] = useState("");
  const [userInput, setUserInput] = useState("");
  const { setModalContent } = useModal();

  useEffect(() => {
    setConfirmDelText(`YES DELETE`);
  }, [dispatch, chartInfo?.id]);

  useEffect(() => {
    if (userInput.length && userInput === confirmDelText) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [userInput, confirmDelText]);

  const openDeleteMessage = () => {
    setModalContent(<DeleteMessage message={"Successfully Deleted."} />);
  };

  const deleteChart = async () => {
    let successDelete;

    if (typeToDelete === "TRIAL") {
      successDelete = await dispatch(
        deleteTrialThunk(chartInfo.id, chartInfo.dt_id)
      );
    }

    if (typeToDelete === "DT") {
      successDelete = await dispatch(
        deleteDTThunk(chartInfo.id, chartInfo.client_id)
      );
    }

    if (!typeToDelete) {
      successDelete = await dispatch(delDailyChartThunk(chartInfo?.id));
    }

    if (successDelete) {
      // console.log(chartInfo.dt_id, "DT ID");
      closeModal();
      openDeleteMessage();
      await dispatch(getClientByIDThunk(chartInfo?.client_id));
    } else {
      throw new Error("Error deleting chart...");
    }
  };

  return (
    <div className="deleteModalContain">
      <h1>Delete This Chart ?</h1>
      <p>
        To delete {typeToDelete || "Chart"} number {chartInfo?.id} and all
        related data, please enter the text below into the input:
      </p>
      <p style={{ fontWeight: "bolder", color: "red", fontSize: "18px" }}>
        {confirmDelText}
      </p>
      <input
        id="confirmInput"
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <button disabled={isDisabled} onClick={deleteChart} id="modalDelBtn">
        Delete
      </button>
      <button onClick={closeModal} id="modalCancelBtn">
        Cancel
      </button>
    </div>
  );
};

export default DeleteChartModal;
