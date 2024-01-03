import { useModal } from "../../context/Modal";
import "./delete-modal.css";
const DeleteMessage = ({ message }) => {
  const { closeModal } = useModal();

  const closeTheMessage = () => {
    closeModal();
  };

  setTimeout(closeTheMessage, 1000);

  return (
    <div className="deleteMessageContain">
      <h1>{message}</h1>
    </div>
  );
};

export default DeleteMessage;
