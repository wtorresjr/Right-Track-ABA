import "./delete-modal.css";
import "../CreateDailyChart/create-daily-chart.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteAClientThunk } from "../../redux/clients";
import { useNavigate } from "react-router-dom";
import DeleteMessage from "./DeletingMessage";

import { Stack, Typography, TextField, Button } from "@mui/material";

const DeleteModal = ({ client }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const [isDisabled, setIsDisabled] = useState(true);
  const [confirmDelText, setConfirmDelText] = useState("");
  const [userInput, setUserInput] = useState("");
  const { setModalContent } = useModal();

  useEffect(() => {
    setConfirmDelText(`DELETE ${client?.guardian_email}`);
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
    <Stack
      sx={{ padding: "10px", width: "50ch", textAlign: "center" }}
      spacing={2}
    >
      <Typography variant="h5">
        Delete Client: {client?.first_name} {client?.last_name}?
      </Typography>
      <Typography variant="p">
        To delete {client?.first_name} {client?.last_name} and all their related
        data, please enter the text below into the input:
      </Typography>
      <Typography variant="h6" sx={{ textAlign: "center", color: "red" }}>
        {confirmDelText}
      </Typography>
      <TextField
        fullWidth
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      ></TextField>
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" color="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={isDisabled}
          onClick={deleteClient}
        >
          Delete
        </Button>
      </Stack>
    </Stack>
    // <div className="deleteModalContain">
    //   <h1>
    //     Delete Client {client?.first_name} {client?.last_name}?
    //   </h1>
    //   <p>
    //     To delete {client?.first_name} {client?.last_name} and all their related
    //     data, please enter the text below into the input:
    //   </p>
    //   <p style={{ fontWeight: "bolder", color: "red", fontSize: "18px" }}>
    //     {confirmDelText}
    //   </p>
    //   <input
    //     id="confirmInput"
    //     type="text"
    //     value={userInput}
    //     onChange={(e) => setUserInput(e.target.value)}
    //   />
    //   <div className="createBtnsDiv">
    //     <button
    //       disabled={isDisabled}
    //       onClick={deleteClient}
    //       id="createChartBtn"
    //     >
    //       Delete
    //     </button>
    //     <button onClick={closeModal} id="cancelBtn">
    //       Cancel
    //     </button>
    //   </div>
    // </div>
  );
};

export default DeleteModal;
