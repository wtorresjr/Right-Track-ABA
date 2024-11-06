import "../DeleteModal/delete-modal.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import DeleteMessage from "../DeleteModal/DeletingMessage";
import { useNavigate } from "react-router-dom";
import { getChartByIdThunk, updateTheChartThunk } from "../../redux/charts";

import { Stack, Button, Typography } from "@mui/material";

const ConfirmModal = ({ infoToUpdate, dc, clientList }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent, closeModal } = useModal();
  const [clientName, setClientName] = useState("");
  const [newChartCompleted, setNewChartCompleted] = useState(null);

  const openMessageDiag = () => {
    setModalContent(<DeleteMessage message={"Updated Chart Data...."} />);
  };

  useEffect(() => {
    if (newChartCompleted) {
      closeModal();
      openMessageDiag();
      dispatch(getChartByIdThunk(dc?.id));
      navigate(`/daily-chart/${dc?.id}`);
    }
  }, [newChartCompleted, navigate]);

  useEffect(() => {
    const thisClient = clientList.filter(
      (client) => client.id === +infoToUpdate.client_id
    );
    setClientName(thisClient[0].first_name + " " + thisClient[0].last_name);
  }, []);

  const handleConfirm = async () => {
    const newChartResult = await dispatch(
      updateTheChartThunk(infoToUpdate, dc?.id)
    );
    setNewChartCompleted(newChartResult);
  };

  return (
    <Stack padding={2} textAlign="center" width="40ch" spacing={1}>
      <Typography variant="h5">Confirm Chart Changes...</Typography>

      <Typography>Please confirm the changes below are correct:</Typography>
      <Stack spacing={-1} sx={{ paddingBottom: "10px" }}>
        <Typography variant="h6" color="red">
          Updated Date: {infoToUpdate.chart_date}
        </Typography>
        <Typography variant="h6" color="red">
          For Client: {clientName}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
        <Button variant="contained" color="secondary" onClick={closeModal}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};

export default ConfirmModal;
