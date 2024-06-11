import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getClientsThunk } from "../../redux/clients";
import "./index.css";
import { getClientDataForAI } from "../../redux/aiSuggest";

const AI_Suggest_Comp = () => {
  const dispatch = useDispatch();
  const [selectedClient, setSelectedClient] = useState(null);
  const clientList = useSelector((state) => state?.clients?.clients?.Clients);

  const cleanDataStore = useSelector((state) => state?.ai?.cleanData);

  useEffect(() => {
    dispatch(getClientsThunk());
  }, []);

  const getRecords = async () => {
    await dispatch(getClientDataForAI(selectedClient));
  };

  return (
    <div className="mainDisplayContain">
      <div className="manageClientsHeader">
        <h1>AI Suggestions</h1>
      </div>

      {/*Drop Down Menu*/}

      <div className="suggestDropDown">
        <select
          id="dcClientSelect"
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <option>Get AI Suggestions For...</option>
          {clientList &&
            clientList.map((client) => {
              return (
                <option key={client?.id} value={client?.id}>
                  {client?.first_name} {client?.last_name} --- DOB:{" "}
                  {client?.dob}
                </option>
              );
            })}
        </select>
        {selectedClient && (
          <button className="recordBtn" onClick={getRecords}>
            Get Records
          </button>
        )}
      </div>

      {cleanDataStore.cleanData ? (
        <div className="cleanDataDiv">
          <div className="aiBtnContainer">
            <button>Analyze Trends</button>
            <button>Suggest Intervention</button>
            <button>Graph Data</button>
          </div>
          <div id="cleanDataText">{cleanDataStore["cleanData"]}</div>
        </div>
      ) : null}
    </div>
  );
};

export default AI_Suggest_Comp;
