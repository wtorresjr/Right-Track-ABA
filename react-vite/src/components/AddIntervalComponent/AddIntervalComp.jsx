import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import "./add-interval.css";
import "../CreateDailyChart/create-daily-chart.css";
// import { LegendComponent } from "../DailyCharts";
import { useParams } from "react-router-dom";
import { addIntervalToChart } from "../../redux/charts";
import { returnColor } from "../helpers/returnColor";
import { useModal } from "../../context/Modal";
import { DeleteMessage } from "../DeleteModal";
import { activities } from "../helpers/dropdown-data";
import { behaviors } from "../helpers/dropdown-data";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

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
  Chip,
  Rating,
} from "@mui/material";

const AddIntervalComp = ({ client, currentIntervals }) => {
  const { chart_id } = useParams();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [currBehavior, setCurrBehavior] = useState(behaviors[0]);
  const [currIntervalBehaviors, setCurrIntervalBehavior] = useState({});
  const [isDisabled, setDisabled] = useState(true);
  const [currActivity, setCurrActivity] = useState();
  const [intervalRating, setIntervalRating] = useState("");
  const [currentRatingColor, setCurrentRatingColor] = useState("white");
  const [currIntNotes, setCurrIntNotes] = useState("");
  const dispatch = useDispatch();
  const [errors, setErrors] = useState();
  const { closeModal } = useModal();
  const { setModalContent } = useModal();

  const [intTimes, setIntTimes] = useState();

  useEffect(() => {
    const intervalTimes = currentIntervals.map((interval) => {
      return { start: interval.start_interval, end: interval.end_interval };
    });
    setIntTimes(intervalTimes);
  }, []);

  const resetAfterSubmit = () => {
    setStartTime();
    setEndTime();
    setCurrBehavior();
    setCurrIntervalBehavior({});
    setCurrActivity();
    setCurrIntNotes("");
    setIntervalRating("");
    setCurrentRatingColor("white");
  };

  const errorCollector = {};
  useEffect(() => {
    if (intTimes && startTime && endTime) {
      intTimes.forEach((startEnd) => {
        if (!(startTime >= startEnd.end || endTime <= startEnd.start)) {
          errorCollector["timeOverlap"] =
            "Start time or End Time overlaps existing interval time.";
        }
      });
    }

    if (startTime > endTime) {
      errorCollector["invalidDate"] = "End Time cannot be before Start Time.";
    }
    if (!startTime) {
      errorCollector["startTime"] = "Start Required";
    }
    if (!endTime) {
      errorCollector["endTime"] = "End Required";
    }
    if (!currActivity) {
      errorCollector["activity"] = "Activity is required";
    }
    if (intervalRating === "") {
      errorCollector["intervalRating"] = "Interval rating is required";
    }
    if (!currIntNotes || currIntNotes.trim().length < 5) {
      errorCollector["intervalNotes"] = "Interval Notes required";
    }
    if (Object.keys(errorCollector).length) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }

    setErrors(errorCollector);
  }, [startTime, endTime, intervalRating, currIntNotes, currActivity]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newIntervalData = {
      start_interval: startTime,
      end_interval: endTime,
      interval_tags: currIntervalBehaviors,
      interval_notes: currIntNotes,
      interval_rating: intervalRating,
      chart_id: chart_id,
      client_id: client?.id,
      activity: currActivity,
    };

    const addIntv = dispatch(addIntervalToChart(newIntervalData));
    if (addIntv) {
      resetAfterSubmit();
      closeModal();
      setModalContent(
        <DeleteMessage message={"Interval Added Succesfully!"} />
      );
    }
  };

  const newBehavior = (behavior, addOrRemove) => {
    setCurrIntervalBehavior((prevBehaviors) => {
      const updatedBehaviors = { ...prevBehaviors };

      if (updatedBehaviors[behavior]) {
        updatedBehaviors[behavior] += addOrRemove === "add" ? 1 : -1;

        if (updatedBehaviors[behavior] === 0 || addOrRemove === "delete") {
          delete updatedBehaviors[behavior];
        }
      } else {
        updatedBehaviors[behavior] = 1;
      }

      return updatedBehaviors;
    });
  };

  return (
    <Stack padding={2} width="40ch">
      <Typography variant="h5" marginBottom="20px">
        New Interval
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Stack>
          <Typography>Start Time:</Typography>
          <input type="time" onChange={(e) => setStartTime(e.target.value)} />
          {errors?.startTime && (
            <Typography color="red">{errors?.startTime}</Typography>
          )}
        </Stack>
        <Stack>
          <Typography>End Time:</Typography>
          <input type="time" onChange={(e) => setEndTime(e.target.value)} />
          {errors?.endTime && (
            <Typography color="red">{errors?.endTime}</Typography>
          )}
        </Stack>
      </Stack>
      <Stack textAlign="center">
        {errors?.invalidDate && (
          <Typography color="red">{errors?.invalidDate}</Typography>
        )}
        {errors?.timeOverlap && (
          <Typography color="red">{errors?.timeOverlap}</Typography>
        )}
      </Stack>

      <Box margin="20px 0 10px 0">
        <FormControl fullWidth>
          <InputLabel>Activity</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currActivity}
            label="Activity"
            onChange={(e) => setCurrActivity(e.target.value)}
          >
            {activities &&
              activities?.map((activity) => {
                return (
                  <MenuItem key={activity} value={activity}>
                    {activity}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Box>
      {errors?.activity && (
        <Typography color="red" textAlign="center">
          {errors?.activity}
        </Typography>
      )}

      <Typography
        variant="h6"
        marginTop="10px"
        borderTop="1px solid lightgray"
        paddingTop="10px"
      >
        Problem Behaviors
      </Typography>
      <Stack direction="row" justifyContent="space-between">
        <Box width="65%">
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currBehavior}
              onChange={(e) => setCurrBehavior(e.target.value)}
            >
              {behaviors &&
                behaviors?.map((behavior) => {
                  return (
                    <MenuItem key={behavior} value={behavior}>
                      {behavior}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            newBehavior(currBehavior, "add");
          }}
        >
          Add Behavior
        </Button>
      </Stack>

      {Object.keys(currIntervalBehaviors).length ? (
        <Stack marginTop={2} spacing={2}>
          {Object.entries(currIntervalBehaviors || {}).map(
            ([behavior, count]) => (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    newBehavior(behavior, "delete");
                  }}
                >
                  Delete
                </Button>
                <Typography textAlign="left">{behavior}</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <RemoveCircleIcon
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      newBehavior(behavior, "remove");
                    }}
                  >
                    -
                  </RemoveCircleIcon>
                  <Chip label={count}>{count}</Chip>
                  <AddCircleIcon
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      newBehavior(behavior, "add");
                    }}
                  ></AddCircleIcon>
                </Stack>
              </Stack>
            )
          )}
        </Stack>
      ) : (
        ""
      )}
      <Stack marginTop="10px">
        <Typography variant="h6">Interval Notes</Typography>
        <TextField
          multiline
          value={currIntNotes}
          onChange={(e) => setCurrIntNotes(e.target.value)}
          maxRows={4}
        ></TextField>
         {errors?.intervalNotes && (
                  <Typography color="red">{errors?.intervalNotes}</Typography>
                )}
      </Stack>
      <Stack marginTop="10px">
        <Typography variant="h6">Interval Rating</Typography>
        <Rating
          fullWidth
          sx={{
            color: `${returnColor(intervalRating)}`,
          }}
          size="large"
          name="simple-controlled"
          value={intervalRating}
          onChange={(event, newValue) => {
            setIntervalRating(newValue);
          }}
        />
      </Stack>
      <Stack direction="row" justifyContent="space-between" marginTop="20px">
        <Button
          variant="contained"
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          Add Interval
        </Button>
        <Button variant="contained" color="secondary" onClick={closeModal}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddIntervalComp;
