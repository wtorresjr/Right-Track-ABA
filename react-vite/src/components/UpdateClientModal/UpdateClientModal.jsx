import "./create-client-page.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { updateClientThunk } from "../../redux/clients";
import { useNavigate } from "react-router-dom";

const UpdateClientModal = ({ client }) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    if (!firstName.length || firstName.length < 2 || firstName.length > 30) {
      errorCollector.firstName =
        "First name must be between 2 and 30 characters";
    }
    if (!lastName.length || lastName.length < 2 || lastName.length > 35) {
      errorCollector.lastName = "Last name must be between 2 and 35 characters";
    }
    if (!guardianEmail.match(emailRegex)) {
      errorCollector.guardianEmail = "Invalid email address";
    }
    if (!dob.length) {
      errorCollector.dob = "Date of birth is required";
    }

    const today = new Date();
    const selectedDate = new Date(dob);

    if (selectedDate >= today) {
      errorCollector.dobTooGreat = "DOB cannot be todays date or future date";
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
      dob: new Date(dob),
      client_notes: clientNotes,
    };

    updatedClientInput.dob = updatedClientInput.dob.toISOString().slice(0, 10);
    console.log(updatedClientInput, "----------Updated info Before Dispatch");

    const updatedClient = await dispatch(
      updateClientThunk(client?.id, updatedClientInput)
    );

    console.log(updatedClient, "Update Client After Dispatch");

    if (updatedClient) {
      navigate(`/client/${client?.id}`);
      closeModal();
    } else {
      throw new Error("Error Updating client");
    }
  };

  // useEffect(() => {

  //   setFirstName(client?.first_name);
  //   setLastName(client?.last_name);
  //   setDob(formatDate);
  //   setClientNotes(client?.client_notes);
  //   setGuardianEmail(client?.guardian_email);
  // }, [dispatch]);

  return (
    <div className="createClient">
      <div className="mainDisplayContain">
        <form onSubmit={handleSubmit} className="newClientForm">
          <i
            className="fa-solid fa-circle-xmark fa-2xl"
            id="closeBtn"
            onClick={closeModal}
          ></i>
          <h1>Update Client Info</h1>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && (
              <div className="formErrors">{errors.firstName}</div>
            )}
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && (
              <div className="formErrors">{errors.lastName}</div>
            )}
          </label>
          <label>
            Guardian Email:
            <input
              type="text"
              value={guardianEmail}
              onChange={(e) => setGuardianEmail(e.target.value)}
            />
            {errors.guardianEmail && (
              <div className="formErrors">{errors.guardianEmail}</div>
            )}
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            {errors.dob && <div className="formErrors">{errors.dob}</div>}
            {errors.dobTooGreat && (
              <div className="formErrors">{errors.dobTooGreat}</div>
            )}
          </label>
          <label>
            Notes:
            <textarea
              rows="6"
              id="clientNotes"
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              placeholder="Optional"
            ></textarea>
          </label>
          <div className="formBtnsContain">
            <button onClick={closeModal} className="formButton" id="cancelBtn">
              Cancel
            </button>
            <button
              type="submit"
              className={isDisabled ? "formButtonDisabled" : "formButton"}
              id={isDisabled ? "submitBtnDisabled" : "submitBtn"}
              disabled={isDisabled}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateClientModal;
