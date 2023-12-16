import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientsThunk } from "../../redux/clients";
import ClientInfo from "./ClientInfo";

const ManageClients = () => {
  const clients = useSelector((state) => state?.clients?.clients?.Clients);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClientsThunk());
  }, [dispatch]);

  return (
    <div className="mainDisplayContain">
      <div className="manageClientsHeader">
        <h1>Manage Clients</h1>
        <input
          type="text"
          placeholder="Search For A Client"
          onClick={(e) => alert("Feature coming soon!")}
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
