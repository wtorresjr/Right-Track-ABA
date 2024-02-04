import { useNavigate } from "react-router-dom";
import "./manage-clients.css";
import { useModal } from "../../context/Modal";
import DeleteModal from "../DeleteModal/DeleteModal";
import UpdateClientModal from "../UpdateClientModal/UpdateClientModal";

const ClientInfo = ({ client }) => {
  const { setModalContent } = useModal();
  const navigate = useNavigate();

  const handleClick = (client_id) => {
    navigate(`/client/${client_id}`);
  };

  const openDeleteModal = () => {
    setModalContent(<DeleteModal client={client} />);
  };
  const openEditModal = () => {
    setModalContent(<UpdateClientModal client={client} />);
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
        <button id="delBtn" onClick={openDeleteModal}>
          Delete
        </button>
        <button id="editBtn" onClick={openEditModal}>
          Edit
        </button>
        <button
          id="viewBtn"
          onClick={() => {
            handleClick(client.id);
          }}
        >
          Client Data & Daily Charts
        </button>
      </div>
    </div>
  );
};

export default ClientInfo;
