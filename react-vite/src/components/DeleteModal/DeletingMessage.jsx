import { useEffect } from "react";
import { useModal } from "../../context/Modal";
import "./delete-modal.css";
const DeleteMessage = ({ message, timeOutLength, isVisible, origin }) => {
  const { closeModal } = useModal();

  const closeTheMessage = () => {
    closeModal();
  };

  useEffect(() => {
    if (!isVisible && origin === "loginPage") {
      closeModal();
    } else {
      setTimeout(closeTheMessage, 1500);
    }
  }, [isVisible]);

  return (
    <div className="deleteMessageContain">
      <h1>{message}</h1>
    </div>
  );
};

export default DeleteMessage;
