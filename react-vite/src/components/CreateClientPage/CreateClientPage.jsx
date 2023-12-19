import "./create-client-page.css";
import { useState } from "react";
import { useModal } from "../../context/Modal";
const CreateClient = () => {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [guardianEmail, setGuardianEmail] = useState();
  const [dob, setDob] = useState();
  const [clientNotes, setClientNotes] = useState();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClient = {
      first_name: firstName,
      last_name: lastName,
      guardian_email: guardianEmail,
      dob: dob,
      client_notes: clientNotes,
    };

    console.log(newClient, "<-----New Client");
  };

  return (
    <div className="createClient">
      <div className="mainDisplayContain">
        <form onSubmit={handleSubmit} className="newClientForm">
        <h1>Create A New Client</h1>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label>
            Guardian Email:
            <input
              type="text"
              value={guardianEmail}
              onChange={(e) => setGuardianEmail(e.target.value)}
            />
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
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
            <button type="submit" className="formButton" id="submitBtn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClient;
