import "./delete-modal.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteAClientThunk } from "../../redux/clients";
import { useNavigate } from "react-router-dom";
import DeleteMessage from "./DeletingMessage";

const DeleteModal = ({ client }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const [isDisabled, setIsDisabled] = useState(true);
  const [confirmDelText, setConfirmDelText] = useState("");
  const [userInput, setUserInput] = useState("");
  const { setModalContent } = useModal();

  useEffect(() => {
    setConfirmDelText(`CONFIRM DELETE ${client?.first_name}`);
  }, [dispatch, client?.first_name]);

  useEffect(() => {
    if (userInput.length && userInput === confirmDelText) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [userInput, confirmDelText]);

  const openDeleteMessage = () => {
    setModalContent(<DeleteMessage message={"Client was deleted."} />);
  };

  const deleteClient = () => {
    const successDelete = dispatch(deleteAClientThunk(client?.id));
    if (successDelete) {
      closeModal();
      openDeleteMessage();
      navigate("/manage-clients");
    } else {
      throw new Error("Error deleting client...");
    }
  };

  return (
    <div className="deleteModalContain">
      <h1>
        Delete Client {client?.first_name} {client?.last_name}?
      </h1>
      <p>
        To delete {client?.first_name} {client?.last_name} and all their related
        data, please enter the text below into the input:
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
      <button disabled={isDisabled} onClick={deleteClient} id="modalDelBtn">
        Delete
      </button>
      <button onClick={closeModal} id="modalCancelBtn">
        Cancel
      </button>
    </div>
  );
};

export default DeleteModal;
