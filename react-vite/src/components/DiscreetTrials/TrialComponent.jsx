import { useEffect, useState } from "react";
import "./dt-comp-styles.css";
import { returnPercentColor } from "../helpers/returnColor";
import { useModal } from "../../context/Modal";
import { DeleteChartModal } from "../DeleteModal";
import AddTrialComponent from "./AddTrialComponent";

import { Button, Typography, Stack, Chip } from "@mui/material";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";

const TrialComponent = ({ trial, dtInfo }) => {
  const { setModalContent } = useModal();
  const [trialPercent, setTrialPercent] = useState(0);
  const [passOrFail, setPassOrFail] = useState();

  useEffect(() => {
    const result = (100 / trial?.trial_count) * trial?.trial_score;
    setTrialPercent(result.toFixed(2));
    setPassOrFail(returnPercentColor(trialPercent));
  }, [trial, trialPercent]);

  const openDeleteModal = (chart) => {
    setModalContent(
      <DeleteChartModal chartInfo={chart} typeToDelete={"TRIAL"} />
    );
  };

  const openUpdateTrialModal = () => {
    setModalContent(
      <AddTrialComponent dtInfo={dtInfo} trialInfo={trial} isEdit={"True"} />
    );
  };

  return (
    <>
      <Stack
        sx={{
          backgroundColor: "black",
          borderRadius: "10px",
          padding: "15px",
          marginTop: "10px",
          borderTop: `2px solid ${passOrFail}`,
        }}
        // direction="row"
        justifyContent="space-between"
        width="100%"
      >
        <Stack direction="row" justifyContent="space-between" marginBottom={1}>
          <Chip
            label={`Target: ${trial.trial_target}`}
            variant="outlined"
            color="primary"
            sx={{ justifyContent: "space-between" }}
          />
          <Chip
            label={`Trial Count: ${trial.trial_score} / ${trial.trial_count}`}
            variant="outlined"
            color="primary"
            sx={{ justifyContent: "space-between" }}
          />
        </Stack>
        <Stack direction="column" spacing={1}>
          <Stack
            sx={{
              backgroundColor: "black",
              alignItems: "center",
            }}
            direction="row"
            spacing={1}
          >
            {trial.trial_notes && (
              <>
                <Chip
                  label={`Trial Notes:`}
                  variant="outlined"
                  color="primary"
                />
                <Typography>{trial?.trial_notes}</Typography>
              </>
            )}
          </Stack>

          <Stack
            spacing={2}
            direction="row"
            justifyContent="space-between"
            sx={{
              backgroundColor: "black",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <Stack direction="row" spacing={2}>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => {
                  openDeleteModal(trial);
                }}
                startIcon={<DeleteForeverIcon size="large" />}
              >
                Delete Trial
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="warning"
                onClick={() => {
                  openUpdateTrialModal(trial);
                }}
                startIcon={<EditNoteIcon size="large" />}
              >
                Edit Trial
              </Button>
            </Stack>

            <Stack>
              <Chip
                label={`Mastery: ${trialPercent}%`}
                variant="contained"
                sx={{
                  backgroundColor: passOrFail,
                  color: "black",
                  fontWeight: "bolder",
                }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default TrialComponent;
