import "./delete-modal.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import DeleteMessage from "./DeletingMessage";
import { deleteIntervalThunk, getChartByIdThunk } from "../../redux/charts";
import { useNavigate } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";

const DeleteIntervalModal = ({ interval }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [isDisabled, setIsDisabled] = useState(true);
  const [confirmDelText, setConfirmDelText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [chart, setChart] = useState();
  const { setModalContent } = useModal();
  // const navigate = useNavigate();

  useEffect(() => {
    setConfirmDelText(`YES DELETE`);
    setChart(interval?.chart_id);
  }, [dispatch, interval?.id]);

  useEffect(() => {
    if (userInput.length && userInput === confirmDelText) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [userInput, confirmDelText]);

  const openDeleteMessage = () => {
    setModalContent(<DeleteMessage message={"Interval was deleted."} />);
  };

  const deleteInterval = async () => {
    const successDelete = await dispatch(deleteIntervalThunk(interval?.id));
    if (successDelete) {
      closeModal();
      openDeleteMessage();
      dispatch(getChartByIdThunk(chart));
    } else {
      throw new Error("Error deleting Interval...");
    }
  };

  return (
    <Stack width="40ch" padding={2} textAlign="center" spacing={2}>
      <Typography variant="h5">Delete This Interval ?</Typography>
      <Typography>
        To delete this interval and all of it's related data, please enter the
        text below in the input:
      </Typography>
      <Typography color="red">{confirmDelText}</Typography>
      <input
        id="confirmInput"
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <Stack
        direction="row"
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          disabled={isDisabled}
          onClick={deleteInterval}
          variant="contained"
          color="error"
          size="large"
        >
          Delete
        </Button>
        <Button
          onClick={closeModal}
          variant="contained"
          color="secondary"
          size="large"
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};

export default DeleteIntervalModal;
