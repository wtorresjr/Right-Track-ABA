import { useDispatch, useSelector } from "react-redux";
import { getClientByIDThunk, getClientsThunk } from "../../redux/clients";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { createNewChartThunk, getChartByIdThunk } from "../../redux/charts";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { dt_programs } from "../helpers/dropdown-data";
import "./create-daily-chart.css";
import {
  addNewDTThunk,
  editDTThunk,
  getDiscreetTrialThunk,
} from "../../redux/dts";
import { DeleteMessage } from "../DeleteModal";

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

const CreateDailyChart = ({ isDT, isDTupdate, dtInfo }) => {
  const { setModalContent } = useModal();
  const navigate = useNavigate();
  const { client_id } = useParams();
  const { closeModal } = useModal();
  const [selectedClient, setSelectedClient] = useState(client_id);
  const [isDisabled, setIsDisabled] = useState(true);
  const [todaysDate, setTodaysDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [errors, setErrors] = useState({});
  const [selectedProgram, setProgram] = useState(dt_programs[0]);
  const [programNotes, setProgramNotes] = useState(1);
  const [newChartCompleted, setNewChartCompleted] = useState(null);
  const [clientName, setClientName] = useState();
  const dispatch = useDispatch();
  const currentClient = useSelector((state) => state?.clients?.client_by_id);
  const clientList = useSelector((state) => state?.clients?.clients?.Clients);

  const errorCollector = {};

  useEffect(() => {
    if (isDTupdate && dtInfo) {
      setTodaysDate(dtInfo?.trial_date);
      setProgramNotes(dtInfo.program_notes.slice(-2).trimStart());
      setProgram(dtInfo.program_name);
      dispatch(getDiscreetTrialThunk(dtInfo.id));
    }
  }, [dtInfo]);

  useEffect(() => {
    const today = new Date();
    const selectedDate = new Date(todaysDate);
    selectedDate.setHours(24, 0, 0, 0);

    if (selectedDate.getTime() > today.getTime()) {
      errorCollector.date = "Chart date cannot be in the future";
    }

    setErrors(errorCollector);

    if (!Object.keys(errorCollector).length) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [dispatch, todaysDate]);

  useEffect(() => {
    dispatch(getClientByIDThunk(client_id));
    dispatch(getClientsThunk());
    if (!selectedClient) {
      setSelectedClient(clientList[0]?.id);
    }
  }, [dispatch, client_id]);

  const openUpdateMessage = () => {
    setModalContent(<DeleteMessage message={"Discreet Trial Updated!"} />);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDTupdate) {
      const updatedDTinfo = {
        trial_date: todaysDate,
        program_name: selectedProgram,
        program_notes: `${selectedProgram} in a field of ${programNotes}`,
      };

      const updateChart = await dispatch(editDTThunk(updatedDTinfo, dtInfo.id));
      setNewChartCompleted(updateChart);
    }

    if (!isDT && !isDTupdate) {
      const startNewChart = {
        chart_date: todaysDate,
        client_id: selectedClient,
      };
      const newChartResult = await dispatch(createNewChartThunk(startNewChart));
      setNewChartCompleted(newChartResult);
    }
    if (isDT) {
      const startNewDT = {
        trial_date: todaysDate,
        client_id: currentClient?.id,
        program_name: selectedProgram,
        program_notes: `${selectedProgram} in a field of ${programNotes}`,
      };

      const newDTResult = await dispatch(addNewDTThunk(startNewDT));
      setNewChartCompleted(newDTResult);
    }
  };

  useEffect(() => {
    if (newChartCompleted && isDTupdate) {
      closeModal();

      dispatch(getClientByIDThunk(client_id));
      openUpdateMessage();
    }

    if (newChartCompleted && !isDT && !isDTupdate) {
      closeModal();
      dispatch(getChartByIdThunk(newChartCompleted?.New_Chart?.id));
      navigate(`/daily-chart/${newChartCompleted?.New_Chart?.id}`);
    }
    if (newChartCompleted && isDT) {
      closeModal();
      dispatch(
        getDiscreetTrialThunk(newChartCompleted?.New_Discreet_Trial?.id)
      );
      navigate(`/discreet-trial/${newChartCompleted?.New_Discreet_Trial?.id}`);
    }
  }, [newChartCompleted, navigate]);

  return (
    <Stack padding={2} spacing={1}>
      <Typography variant="h5" textAlign="center">
        {isDTupdate ? "Update" : "Create"}{" "}
        {isDT ? "Discreet Trial" : "Daily Chart"}
      </Typography>

      {currentClient && !currentClient?.message ? (
        <div>
          <Stack direction="column" spacing={2}>
            <input
              id="dateInput"
              type="date"
              value={todaysDate}
              onChange={(e) => setTodaysDate(e.target.value)}
            />
            {errors && errors.date && (
              <Typography sx={{ color: "red" }}>{errors.date} </Typography>
            )}
            {isDT || isDTupdate ? (
              <>
                <Box sx={{ marginBottom: "10px" }} width="40ch">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Programs
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedProgram || "Select Program"}
                      label="Programs"
                      onChange={(e) => setProgram(e.target.value)}
                    >
                      {dt_programs &&
                        dt_programs?.map((program) => {
                          return (
                            <MenuItem key={program} value={program}>
                              {program}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </Box>
                <TextField
                  inputProps={{ min: 1 }}
                  sx={{ marginBottom: "10px" }}
                  label="In A Field Of"
                  fullWidth
                  type="number"
                  value={programNotes}
                  onChange={(e) => setProgramNotes(e.target.value)}
                ></TextField>
              </>
            ) : (
              <Box sx={{ marginBottom: "10px" }} width="40ch">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Client</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedClient || "Select Client"}
                    label="Client"
                    onChange={(e) => setSelectedClient(e.target.value)}
                  >
                    {clientList &&
                      clientList?.map((client) => {
                        return (
                          <MenuItem key={client?.id} value={client?.id}>
                            {client?.first_name} {client?.last_name} --- DOB:{" "}
                            {client?.dob}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Box>
            )}
            <Stack direction="row" justifyContent="space-between">
              <Button
                disabled={isDisabled}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {isDTupdate ? "Update DT" : isDT ? "Create DT" : "Create Chart"}
              </Button>
              <Button
                onClick={() => closeModal()}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </div>
      ) : (
        <h1>{currentClient?.message}</h1>
      )}
    </Stack>
  );
};

export default CreateDailyChart;
