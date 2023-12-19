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
    if (!firstName.length || firstName.length < 2) {
      errorCollector.firstName = "First name is required";
    }
    if (!lastName.length || lastName.length < 2) {
      errorCollector.lastName = "Last name is required";
    }
    if (!guardianEmail.match(emailRegex)) {
      errorCollector.guardianEmail = "Invalid email address";
    }
    if (!dob.length) {
      errorCollector.dob = "Date of birth is required";
    }
    const today = new Date();
    const selectedDate = new Date(dob);
    // console.log(dob, "<---DOB", today, "<---TODAY");
    if (selectedDate >= today) {
      errorCollector.dobTooGreat = "Dob cannot be todays date or future date";
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

    try {
      const newClientCreate = await dispatch(createNewClientThunk(newClient));
      if (newClientCreate) {
        navigate(`/client/${newClientCreate.id}`);
        closeModal();
      }
    } catch (error) {
      throw error;
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
              <p className="formErrors">{errors.firstName}</p>
            )}
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && <p className="formErrors">{errors.lastName}</p>}
          </label>
          <label>
            Guardian Email:
            <input
              type="text"
              value={guardianEmail}
              onChange={(e) => setGuardianEmail(e.target.value)}
            />
            {errors.guardianEmail && (
              <p className="formErrors">{errors.guardianEmail}</p>
            )}
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            {errors.dob && <p className="formErrors">{errors.dob}</p>}
            {errors.dobTooGreat && (
              <p className="formErrors">{errors.dobTooGreat}</p>
            )}
          </label>
          <label>
            Notes:
            <textarea
              rows="6"
              id="clientNotes"
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
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
