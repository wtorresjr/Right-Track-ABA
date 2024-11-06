import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./delete-modal.css";
import { Stack, Typography } from "@mui/material";

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
          clearInterval(intervalId);
        }
      }, 500);

      return () => clearInterval(intervalId);
    } else {
      setTimeout(closeTheMessage, 1500);
    }
  }, [dispatch, closeModal]);

  return (
    <Stack sx={{ width: "300px", padding: "10px" }}>
      <Typography variant="h5" sx={{ color: "green", textAlign: "center" }}>
        {message}
      </Typography>
    </Stack>
  );
};

export default DeleteMessage;
