import { useEffect } from "react";
import { useModal } from "../../context/Modal";
import "./delete-modal.css";
const DeleteMessage = () => {
  const { closeModal } = useModal();

  //Add timer to close delete message
  // useEffect(() => {

  // },[dispatch])

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
