import "./manage-clients.css";
const ClientInfo = ({ client }) => {
  return (
    <div className="clientInfoContain">
      <div className="clientData" key={client?.id}>
        <div>First Name: {client?.first_name}</div>
        <div>Last Name: {client?.last_name}</div>
        <div>Guardian Email: {client?.guardian_email}</div>
      </div>
      <div className="btnsContain">
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
};

export default ClientInfo;
