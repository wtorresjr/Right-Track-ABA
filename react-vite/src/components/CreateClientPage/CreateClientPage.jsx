import "./create-client-page.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { createNewClientThunk } from "../../redux/clients";
import { useNavigate } from "react-router-dom";

const CreateClient = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [dob, setDob] = useState("");
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
   if (!dob.length) {
     errorCollector.dob = "Date of birth is required";
   }

   const today = new Date();
   today.setHours(-12, 0, 0, 0);
   const selectedDate = new Date(dob);
   selectedDate.setHours(12, 0, 0, 0);

   console.log(today.getTime(), "Todays Date");
   console.log(selectedDate.getTime(), "Selected DOB");

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
    console.log("Clicked Submit");
    const newClient = {
      first_name: firstName,
      last_name: lastName,
      guardian_email: guardianEmail,
      dob: dob,
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
    <div className="createClient">
      <div className="mainDisplayContain">
        <form onSubmit={handleSubmit} className="newClientForm">
          <i
            className="fa-solid fa-circle-xmark fa-2xl"
            id="closeBtn"
            onClick={closeModal}
          ></i>
          <h1>Create A New Client</h1>
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClient;
