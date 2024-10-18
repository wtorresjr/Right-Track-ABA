import "./delete-modal.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import DeleteMessage from "./DeletingMessage";
import { delDailyChartThunk } from "../../redux/charts";
import { getClientByIDThunk } from "../../redux/clients";
import {
  deleteDTThunk,
  deleteTrialThunk,
  getDiscreetTrialThunk,
} from "../../redux/dts";

import {
  Typography,
  Stack,
  Button,
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  TextField,
} from "@mui/material";

const DeleteChartModal = ({ chartInfo, typeToDelete }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [isDisabled, setIsDisabled] = useState(true);
  const [confirmDelText, setConfirmDelText] = useState("");
  const [userInput, setUserInput] = useState("");
  const { setModalContent } = useModal();

  useEffect(() => {
    setConfirmDelText(`YES DELETE`);
  }, [dispatch, chartInfo?.id]);

  useEffect(() => {
    if (userInput.length && userInput === confirmDelText) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [userInput, confirmDelText]);

  const openDeleteMessage = () => {
    setModalContent(<DeleteMessage message={"Successfully Deleted."} />);
  };

  const deleteChart = async () => {
    let successDelete;

    if (typeToDelete === "TRIAL") {
      successDelete = await dispatch(
        deleteTrialThunk(chartInfo.id, chartInfo.dt_id)
      );
    }

    if (typeToDelete === "DT") {
      successDelete = await dispatch(
        deleteDTThunk(chartInfo.id, chartInfo.client_id)
      );
    }

    if (!typeToDelete) {
      successDelete = await dispatch(delDailyChartThunk(chartInfo?.id));
    }

    if (successDelete) {
      closeModal();
      openDeleteMessage();
      await dispatch(getClientByIDThunk(chartInfo?.client_id));
    } else {
      throw new Error("Error deleting chart...");
    }
  };

  return (
    <Stack width="40ch" padding={2} textAlign="center" spacing={2}>
      <Typography variant="h5">Delete This Chart?</Typography>
      <Typography>
        To delete {typeToDelete || "Chart"} number {chartInfo?.id} and all
        related data, please enter the text below into the input:
      </Typography>
      <Typography sx={{ fontWeight: "bolder", color: "red", fontSize: "18px" }}>
        {confirmDelText}
      </Typography>
      <TextField
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <Stack direction="row" justifyContent="space-between">
        <Button
          variant="contained"
          color="error"
          disabled={isDisabled}
          onClick={deleteChart}
        >
          Delete
        </Button>
        <Button variant="contained" color="secondary" onClick={closeModal}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};

export default DeleteChartModal;
