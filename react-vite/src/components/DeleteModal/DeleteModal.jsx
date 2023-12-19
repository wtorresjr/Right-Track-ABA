import "./delete-modal.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";

const DeleteModal = ({ client }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [isDisabled, setIsDisabled] = useState(true);
  const [confirmDelText, setConfirmDelText] = useState("");
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    setConfirmDelText(`CONFIRM DELETE ${client?.first_name}`);
  }, [dispatch]);

  useEffect(() => {
    if (userInput.length && userInput === confirmDelText) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [userInput]);

  const deleteClient = () => {};

  return (
    <div className="deleteModalContain">
      <h1>
        Delete Client {client?.first_name} {client?.last_name}?
      </h1>
      <p>
        To delete {client?.first_name} {client?.last_name} and all their related
        data, please enter the text below into the input:
        <p style={{ fontWeight: "bolder", color: "red", fontSize: "18px" }}>
          {confirmDelText}
        </p>
      </p>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <button disabled={isDisabled} onClick={deleteClient}>
        Delete
      </button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  );
};

export default DeleteModal;
