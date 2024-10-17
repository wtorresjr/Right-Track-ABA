import "./create-client-page.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { createNewClientThunk } from "../../redux/clients";
import { useNavigate } from "react-router-dom";

import { Stack, Typography, Button, TextField, Box } from "@mui/material";
import { DatePicker, DatePickerToolbar } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Import the Day.js adapter

const CreateClient = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [dob, setDob] = useState(null);
  const [clientNotes, setClientNotes] = useState("");
  const { closeModal } = useModal();
  const [errors, setErrors] = useState({});

  const errorCollector = {};
  useEffect(() => {
    const lN = lastName.trimStart();
    const fN = firstName.trimStart();
    const capLastName = lN.charAt(0).toUpperCase() + lN.slice(1);
    const capFirstName = fN.charAt(0).toUpperCase() + fN.slice(1);
    const emailTrim = guardianEmail.trim();
    const trimStartNotes = clientNotes.trimStart();

    setFirstName(capFirstName);
    setLastName(capLastName);
    setGuardianEmail(emailTrim);
    setClientNotes(trimStartNotes);

    if (!firstName.length || firstName.length < 2 || firstName.length > 30) {
      errorCollector.firstName =
        "First name must be between 2 and 30 characters";
    }
    if (!lastName.length || lastName.length < 2 || lastName.length > 35) {
      errorCollector.lastName = "Last name must be between 2 and 35 characters";
    }
    if (!guardianEmail.match(emailRegex) || guardianEmail.trim() === "") {
      errorCollector.guardianEmail = "Invalid email address";
    }

    if (!dob) {
      errorCollector.dob = "Date of birth is required";
    }

    const today = new Date();
    today.setHours(-12, 0, 0, 0);
    const selectedDate = new Date(dob);
    selectedDate.setHours(12, 0, 0, 0);

    if (selectedDate.getTime() >= today.getTime()) {
      errorCollector.dobTooGreat = "DOB cannot be todays date or a future date";
    }

    setErrors(errorCollector);
    if (Object.keys(errorCollector).length > 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [dispatch, firstName, lastName, guardianEmail, dob, clientNotes]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let extracted_dob = `${dob.$y}-${dob.$M + 1}-${dob.$D}`;

    const newClient = {
      first_name: firstName,
      last_name: lastName,
      guardian_email: guardianEmail,
      dob: extracted_dob,
      client_notes: clientNotes,
    };

    const newClientCreate = await dispatch(createNewClientThunk(newClient));
    if (newClientCreate) {
      navigate(`/client/${newClientCreate.id}`);
      closeModal();
    } else {
      throw new Error("Error creating client");
    }
  };

  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "40ch", padding: "10px" } }}
      noValidate
      autoComplete="off"
    >
      <Stack direction="column" spacing={2}>
        <Typography variant="h6">Create New Client</Typography>
        <TextField
          label="First Name"
          multiline
          maxRows={1}
          onChange={(e) => setFirstName(e.target.value)}
        />
        {errors.firstName && (
          <Typography sx={{ color: "red", textAlign: "center" }}>
            {errors.firstName}
          </Typography>
        )}
        <TextField
          label="Last Name"
          multiline
          maxRows={1}
          onChange={(e) => setLastName(e.target.value)}
        />
        {errors.lastName && (
          <Typography sx={{ color: "red", textAlign: "center" }}>
            {errors.lastName}
          </Typography>
        )}
        <TextField
          label="Guardian's Email"
          multiline
          maxRows={1}
          onChange={(e) => setGuardianEmail(e.target.value)}
        />
        {errors.guardianEmail && (
          <Typography sx={{ color: "red", textAlign: "center" }}>
            {errors.guardianEmail}
          </Typography>
        )}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date Of Birth"
            value={dob}
            onChange={(newValue) => {
              setDob(newValue);
            }}
          />
        </LocalizationProvider>

        {errors.dob && (
          <Typography sx={{ color: "red", textAlign: "center" }}>
            {errors.dob}
          </Typography>
        )}
        {errors.dobTooGreat && (
          <Typography sx={{ color: "red", textAlign: "center" }}>
            {errors.dobTooGreat}
          </Typography>
        )}

        <TextField label="Client Notes" multiline maxRows={5} />
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            closeModal();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            handleSubmit(e);
          }}
          disabled={isDisabled}
        >
          Add Client
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateClient;
