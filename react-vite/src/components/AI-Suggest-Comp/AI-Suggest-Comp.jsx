import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getClientsThunk } from "../../redux/clients";

const AI_Suggest_Comp = () => {
  const dispatch = useDispatch();
  const [selectedClient, setSelectedClient] = useState(null);
  const clientList = useSelector((state) => state?.clients?.clients?.Clients);

  useEffect(() => {
    dispatch(getClientsThunk());
  }, []);

  useEffect(() => {
    console.log("User selected", selectedClient);
  }, [selectedClient]);

  return (
    <div className="mainDisplayContain">
      <div className="manageClientsHeader">
        <h1>AI Suggestions</h1>
      </div>
      <select
        id="dcClientSelect"
        onChange={(e) => setSelectedClient(e.target.value)}
      >
        <option>Get AI Suggestions For...</option>
        {clientList &&
          clientList.map((client) => {
            return (
              <option key={client?.id} value={client?.id}>
                {client?.first_name} {client?.last_name} --- DOB: {client?.dob}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default AI_Suggest_Comp;
