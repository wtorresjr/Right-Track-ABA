import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientsThunk } from "../../redux/clients";
import ClientInfo from "./ClientInfo";

const ManageClients = () => {
  const clients = useSelector((state) => state.clients?.clients?.Clients);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClientsThunk());
  }, [dispatch]);

  return (
    <div className="mainDisplayContain">
      <h1>Manage Clients</h1>
      {clients &&
        clients?.map((client) => {
          return <ClientInfo client={client} />;
          // return <p key={client?.id}>{client?.first_name}</p>;
        })}
    </div>
  );
};
export default ManageClients;
