import "../DeleteModal/delete-modal.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import DeleteMessage from "../DeleteModal/DeletingMessage";
import { useNavigate } from "react-router-dom";
import { getChartByIdThunk, updateTheChartThunk } from "../../redux/charts";

const ConfirmModal = ({ infoToUpdate, dc, clientList }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent, closeModal } = useModal();
  const [clientName, setClientName] = useState("");
  const [newChartCompleted, setNewChartCompleted] = useState(null);

  const openMessageDiag = () => {
    setModalContent(<DeleteMessage message={"Updated Chart Data...."} />);
  };

  useEffect(() => {
    if (newChartCompleted) {
      closeModal();
      openMessageDiag();
      dispatch(getChartByIdThunk(dc?.id));
      navigate(`/daily-chart/${dc?.id}`);
    }
  }, [newChartCompleted, navigate]);

  useEffect(() => {
    const thisClient = clientList.filter(
      (client) => client.id === +infoToUpdate.client_id
    );
    setClientName(thisClient[0].first_name + " " + thisClient[0].last_name);
  }, []);

  const handleConfirm = async () => {
    const newChartResult = await dispatch(
      updateTheChartThunk(infoToUpdate, dc?.id)
    );
    setNewChartCompleted(newChartResult);
  };

  return (
    <div className="deleteModalContain">
      <h1>Confirm Chart Changes...</h1>

      <p>Please confirm the changes below are correct</p>
      <p>Updated Date: {infoToUpdate.chart_date}</p>
      <p>For Client: {clientName}</p>
      <div className="createBtnsDiv">
        <button id="createChartBtn" onClick={handleConfirm}>
          Confirm
        </button>
        <button onClick={closeModal} id="cancelBtn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
