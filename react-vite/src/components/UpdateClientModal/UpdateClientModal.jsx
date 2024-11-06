import "./update-client-page.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { getClientByIDThunk, updateClientThunk } from "../../redux/clients";
import { useNavigate } from "react-router-dom";
import { DeleteMessage } from "../DeleteModal";

import { Stack, Typography, Button, TextField, Box } from "@mui/material";

const UpdateClientModal = ({ client }) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  const stringDob = new Date(client?.dob);
  const formatDate = stringDob.toISOString().slice(0, 10);

  const [isDisabled, setIsDisabled] = useState(true);
  const [firstName, setFirstName] = useState(client?.first_name);
  const [lastName, setLastName] = useState(client?.last_name);
  const [guardianEmail, setGuardianEmail] = useState(client?.guardian_email);
  const [dob, setDob] = useState(formatDate);
  const [clientNotes, setClientNotes] = useState(client?.client_notes);
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
    if (!dob.length) {
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

    const updatedClientInput = {
      first_name: firstName,
      last_name: lastName,
      guardian_email: guardianEmail,
      dob: dob,
      client_notes: clientNotes,
    };

    const updatedClient = await dispatch(
      updateClientThunk(client?.id, updatedClientInput)
    );

    if (updatedClient) {
      navigate(`/client/${client?.id}`);
      dispatch(getClientByIDThunk(client?.id));
      closeModal();
      setModalContent(
        <DeleteMessage message={"Updated Client Successfully!"} />
      );
    } else {
      throw new Error("Error Updating client");
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
        <Typography variant="h6">Update Client Info</Typography>
        <TextField
          value={firstName}
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
          value={lastName}
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
          value={guardianEmail}
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

        <Stack direction="column" spacing={1}>
          <Typography>Date Of Birth:</Typography>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </Stack>
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

        <TextField
          value={clientNotes}
          label="Client Notes (Optional)"
          multiline
          maxRows={5}
        />
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            handleSubmit(e);
          }}
          disabled={isDisabled}
        >
          Update Client
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            closeModal();
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default UpdateClientModal;
