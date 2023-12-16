import { useNavigate } from "react-router-dom";
import "./manage-clients.css";
import { useDispatch } from "react-redux";
import ClientDetails from "../ClientDetails";

const ClientInfo = ({ client }) => {
  const dispatch = useDispatch();
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
          onClick={() => {
            handleClick(client.id, "view");
          }}
        >
          View Data
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
          id="delBtn"
          onClick={() => {
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
