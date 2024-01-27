import { useModal } from "../../context/Modal";
import "./delete-modal.css";
const DeleteMessage = ({ message, timeOutLength }) => {
  const { closeModal } = useModal();

  const closeTheMessage = () => {
    closeModal();
  };

  setTimeout(closeTheMessage, timeOutLength || 1500);

  return (
    <div className="deleteMessageContain">
      <h1>{message}</h1>
    </div>
  );
};

export default DeleteMessage;
