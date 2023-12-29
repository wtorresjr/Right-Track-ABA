import { useModal } from "../../context/Modal";
import "./delete-modal.css";
const DeleteMessage = () => {
  const { closeModal } = useModal();

  const closeTheMessage = () => {
    closeModal();
  };

  setTimeout(closeTheMessage, 1000);

  return (
    <div className="deleteMessageContain">
      <h1>Successfully Deleted</h1>
    </div>
  );
};

export default DeleteMessage;
