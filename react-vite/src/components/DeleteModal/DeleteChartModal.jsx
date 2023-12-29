import "./delete-modal.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteMessage from "./DeletingMessage";
import { delDailyChartThunk } from "../../redux/charts";
import { getClientByIDThunk } from "../../redux/clients";

const DeleteChartModal = ({ chartInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const [isDisabled, setIsDisabled] = useState(true);
  const [confirmDelText, setConfirmDelText] = useState("");
  const [userInput, setUserInput] = useState("");
  const { setModalContent } = useModal();

  useEffect(() => {
    setConfirmDelText(`CONFIRM DELETE ${chartInfo?.id}`);
  }, [dispatch, chartInfo?.id]);

  useEffect(() => {
    if (userInput.length && userInput === confirmDelText) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [userInput, confirmDelText]);

  const openDeleteMessage = () => {
    setModalContent(<DeleteMessage />);
  };

  const deleteChart = async () => {
    const successDelete = await dispatch(delDailyChartThunk(chartInfo?.id));
    if (successDelete) {
      closeModal();
      openDeleteMessage();
      dispatch(getClientByIDThunk(chartInfo?.client_id));
      // navigate(`/client/${chartInfo?.client_id}`);
    } else {
      throw new Error("Error deleting chart...");
    }
  };

  return (
    <div className="deleteModalContain">
      <h1>Delete Chart Number {chartInfo?.id}?</h1>
      <p>
        To delete chart number {chartInfo?.id} and all related data, please
        enter the text below into the input:
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
