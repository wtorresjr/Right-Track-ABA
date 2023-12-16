import "./manage-clients.css";
const ClientInfo = ({ client }) => {
  return (
    <div className="clientInfoContain" key={client?.id}>
      <div className="clientData">
        <div>
          <label>First Name:</label>
          {client?.first_name}
        </div>
        <div>
          <label>Last Name:</label>
          {client?.last_name}
        </div>
        <div>
          <label>Guardian Email:</label>
          {client?.guardian_email}
        </div>
        <div>
          <label>DOB:</label>
          {client?.dob}
        </div>
      </div>
      <div className="btnsContain">
        <button id="editBtn">Edit</button>
        <button id="delBtn">Delete</button>
      </div>
    </div>
  );
};

export default ClientInfo;
