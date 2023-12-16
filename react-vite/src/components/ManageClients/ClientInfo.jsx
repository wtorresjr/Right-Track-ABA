import "./manage-clients.css";
const ClientInfo = ({ client }) => {
  const handleClick = (client_id, action) => {
    console.log(client_id, action);
  };
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
        <button
          id="viewBtn"
          onClick={(e) => {
            handleClick(client.id, "view");
          }}
        >
          View Data
        </button>
        <button
          id="editBtn"
          onClick={(e) => {
            handleClick(client.id, "edit");
          }}
        >
          Edit
        </button>
        <button
          id="delBtn"
          onClick={(e) => {
            handleClick(client.id, "delete");
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ClientInfo;
