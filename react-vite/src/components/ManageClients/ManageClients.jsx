import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getClientsThunk } from "../../redux/clients";
import ClientInfo from "./ClientInfo";
import "./manage-clients.css";

const ManageClients = () => {
  const navigate = useNavigate();
  const clients = useSelector((state) => state?.clients?.clients?.Clients);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClientsThunk());
  }, [dispatch]);

  return (
    <div className="mainDisplayContain">
      <div className="manageClientsHeader">
        <h1>Manage Clients</h1>
        <button id="addNewClientBtn" onClick={() => navigate("/create-client")}>
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
