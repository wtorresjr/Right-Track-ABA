import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientsThunk } from "../../redux/clients";
import ClientInfo from "./ClientInfo";
import CreateClient from "../CreateClientPage/CreateClientPage";
import { useModal } from "../../context/Modal";
import "./manage-clients.css";

const ManageClients = () => {
  const { setModalContent } = useModal();
  const clients = useSelector((state) => state?.clients?.clients?.Clients);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClientsThunk());
  }, [dispatch]);

  const openCreateClientModal = () => {
    setModalContent(<CreateClient />);
  };

  return (
    <div className="mainDisplayContain">
      <div className="manageClientsHeader">
        <h1>Manage Clients</h1>
        <button id="addNewClientBtn" onClick={openCreateClientModal}>
          Add New Client
        </button>
        <input
          type="text"
          placeholder="Search For A Client"
          onClick={() => alert("Feature coming soon!")}
        />
      </div>
      {clients &&
        clients?.map((client) => {
          return <ClientInfo key={client.id} client={client} />;
        })}
    </div>
  );
};

export default ManageClients;
