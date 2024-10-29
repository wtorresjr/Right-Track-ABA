import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "../AddIntervalComponent/add-interval.css";
import "../CreateDailyChart/create-daily-chart.css";
import { useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { DeleteMessage } from "../DeleteModal";

import {
  trial_target_shapes,
  trial_target_colors,
  trial_target_sizes,
  trial_target_letters,
  trial_target_sorting_sizes,
} from "../helpers/dropdown-data";
import { addTrialThunk, editTrialThunk } from "../../redux/dts";
import { getClientByIDThunk } from "../../redux/clients";

import {
  Stack,
  TextField,
  Button,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from "@mui/material";

const AddTrialComponent = ({ dtInfo, trialInfo, isEdit }) => {
  const { dt_id } = useParams();
  const [isDisabled, setDisabled] = useState(true);
  const [programDD, setProgramDD] = useState([]);
  const [targetItem, setTargetItem] = useState("");
  const [trialCount, setTrialCount] = useState(1);
  const [trialScore, setTrialScore] = useState(0);
  const [trialNotes, setTrialNotes] = useState();

  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const { setModalContent } = useModal();
  const [errors, setErrors] = useState();
  const errorCollector = {};

  useEffect(() => {
    if (dtInfo?.program_name === "Identify Shapes")
      setProgramDD(trial_target_shapes);
    else if (dtInfo?.program_name === "Identify Colors")
      setProgramDD(trial_target_colors);
    else if (dtInfo?.program_name === "Identify Sizes")
      setProgramDD(trial_target_sizes);
    else if (dtInfo?.program_name === "Sorting Sizes")
      setProgramDD(trial_target_sorting_sizes);
    else if (dtInfo?.program_name === "Identify Letters")
      setProgramDD(trial_target_letters);
  }, [dtInfo]);

  useEffect(() => {
    if (programDD.length > 0 && trialInfo) {
      const isTargetInProgramDD = programDD.includes(trialInfo.trial_target);
      setTargetItem(isTargetInProgramDD ? trialInfo.trial_target : "");
      setTrialCount(trialInfo.trial_count);
      setTrialScore(trialInfo.trial_score);
      setTrialNotes(trialInfo.trial_notes);
    }
  }, [programDD, trialInfo]);

  useEffect(() => {
    setErrors();

    if (!targetItem) {
      errorCollector.targetItemMissing = "Please select a target";
    }
    if (!trialScore) {
      errorCollector.trialScoreMissing = "Trial score required";
    }
    if (!trialCount) {
      errorCollector.trialCountMissing = "Trial count required";
    }
    if (+trialScore > +trialCount) {
      errorCollector.trialCountError =
        "Trial score cannot be larger than trial count";
    }

    if (Object.keys(errorCollector).length) {
      setDisabled(true);
      setErrors(errorCollector);
    } else {
      setDisabled(false);
    }
  }, [trialCount, trialScore, targetItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTrial = {
      trial_target: targetItem,
      trial_count: trialCount,
      trial_score: trialScore,
      trial_notes: trialNotes,
      client_id: dtInfo.client_id,
    };

    let trialAdded;

    if (trialInfo) {
      trialAdded = await dispatch(editTrialThunk(newTrial, trialInfo.id));
    } else {
      trialAdded = await dispatch(addTrialThunk(newTrial, dt_id));
    }

    if (trialAdded) {
      closeModal();
      setModalContent(
        <DeleteMessage
          message={
            trialInfo
              ? "Trial Updated Successfully!"
              : "Trial Added Successfully!"
          }
        />
      );
      await dispatch(getClientByIDThunk(dtInfo.client_id));
    }
  };

  return (
    <Stack width="40ch" padding={2} spacing={2}>
      <Typography variant="h5" paddingBottom={2} textAlign="center">
        {isEdit ? "Edit" : "Add New"} Trial for {dtInfo.program_name}
      </Typography>
      <Stack direction="row" spacing={2}>
        <FormControl sx={{ flex: 1 }}>
          <InputLabel id="demo-simple-select-label">Target</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Target"
            onChange={(e) => setTargetItem(e.target.value)}
            value={targetItem}
          >
            {programDD
              ? programDD.map((progOption) => (
                  <MenuItem key={progOption} value={progOption}>
                    {progOption}
                  </MenuItem>
                ))
              : [...Array(11).keys()].map((number) => (
                  <MenuItem key={number} value={number}>
                    {number}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
        <TextField
          type="number"
          value={trialCount}
          label="Trial Count"
          onChange={(e) => setTrialCount(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          value={trialScore}
          onChange={(e) => setTrialScore(e.target.value)}
          label="Score"
          type="number"
        ></TextField>
        <Typography textAlign="center">Out Of</Typography>
        <TextField
          value={trialCount}
          onChange={(e) => setTrialScore(e.target.value)}
          label="Attempt(s)"
          type="number"
        ></TextField>
      </Stack>
      <TextField
        multiline
        maxRows={5}
        label="Trial Notes (Optional)"
        value={trialNotes}
        onChange={(e) => setTrialNotes(e.target.value)}
      ></TextField>

      <Stack direction="row" justifyContent="space-between">
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          {trialInfo ? "Update Trial" : "Add Trial"}
        </Button>
        <Button variant="contained" color="secondary" onClick={closeModal}>
          {"Cancel"}
        </Button>
      </Stack>

      {errors &&
        Object.values(errors).map((error) => {
          return (
            <Typography textAlign="center" color="red" key={error}>
              {error}
            </Typography>
          );
        })}
    </Stack>
  );
};

export default AddTrialComponent;
