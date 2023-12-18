import { useNavigate } from "react-router-dom";
import "./manage-clients.css";

const ClientInfo = ({ client }) => {
  const navigate = useNavigate();
  const handleClick = (client_id, action) => {
    if (action === "view") {
      navigate(`/client/${client_id}`);
    }
    if (action === "edit") {
      console.log(client_id, action);
    }
    if (action === "delete") {
      console.log(client_id, action);
    }
  };
  return (
    <div className="clientInfoContain" key={client?.id}>
      <div className="clientData">
        <div>
          <label className="detailsLabels">First Name:</label>
          {client?.first_name}
        </div>
        <div>
          <label className="detailsLabels">Last Name:</label>
          {client?.last_name}
        </div>
        <div>
          <label className="detailsLabels">Guardian Email:</label>
          {client?.guardian_email}
        </div>
        <div>
          <label className="detailsLabels">DOB:</label>
          {client?.dob}
        </div>
      </div>
      <div className="btnsContain">
        <button
          id="delBtn"
          onClick={() => {
            handleClick(client.id, "delete");
          }}
        >
          Delete
        </button>
        <button
          id="editBtn"
          onClick={() => {
            handleClick(client.id, "edit");
          }}
        >
          Edit
        </button>
        <button
          id="viewBtn"
          onClick={() => {
            handleClick(client.id, "view");
          }}
        >
          View Data
        </button>
      </div>
    </div>
  );
};

export default ClientInfo;
