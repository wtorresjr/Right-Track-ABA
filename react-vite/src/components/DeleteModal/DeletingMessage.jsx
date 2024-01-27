import { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
import "./delete-modal.css";

const DeleteMessage = ({ message, timeOutLength }) => {
  const { closeModal } = useModal();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
      closeModal();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [timeOutLength, closeModal]);

  return isVisible ? (
    <div className="deleteMessageContain">
      <h1>{message}</h1>
    </div>
  ) : null;
};

export default DeleteMessage;
