import "./delete-modal.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteMessage from "./DeletingMessage";
import { deleteIntervalThunk } from "../../redux/charts";

const DeleteIntervalModal = ({ interval }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const [isDisabled, setIsDisabled] = useState(true);
  const [confirmDelText, setConfirmDelText] = useState("");
  const [userInput, setUserInput] = useState("");
  const { setModalContent } = useModal();

  useEffect(() => {
    setConfirmDelText(`YES DELETE`);
  }, [dispatch, interval?.id]);

  useEffect(() => {
    if (userInput.length && userInput === confirmDelText) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [userInput, confirmDelText]);

  const openDeleteMessage = () => {
    setModalContent(<DeleteMessage message={"Interval was deleted."} />);
  };

  const deleteInterval = async () => {
    const successDelete = await dispatch(deleteIntervalThunk(interval?.id));
    if (successDelete) {
      closeModal();
      openDeleteMessage();
      // navigate("/manage-clients");
    } else {
      throw new Error("Error deleting Interval...");
    }
  };

  return (
    <div className="deleteModalContain">
      <h1>
        Delete This Interval ?
      </h1>
      <p>
        To delete this interval and all of it's related
        data, please enter the text below in the input:
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
      <button disabled={isDisabled} onClick={deleteInterval} id="modalDelBtn">
        Delete
      </button>
      <button onClick={closeModal} id="modalCancelBtn">
        Cancel
      </button>
    </div>
  );
};

export default DeleteIntervalModal;
