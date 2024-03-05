import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./delete-modal.css";

const DeleteMessage = ({ message, isVisible, origin }) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const closeTheMessage = () => {
    closeModal();
  };

  useEffect(() => {
    if (origin === "loginPage") {
      const intervalId = setInterval(() => {
        if (window.location.pathname === "/home") {
          closeModal();
          clearInterval(intervalId); // stop the interval once you've done what you need
        }
      }, 500); // check every 3 seconds, you can adjust the interval as needed

      return () => clearInterval(intervalId);
    } else {
      setTimeout(closeTheMessage, 1500);
    }
  }, [dispatch, closeModal]);

  return (
    <div className="deleteMessageContain">
      <h1>{message}</h1>
    </div>
  );
};

export default DeleteMessage;
