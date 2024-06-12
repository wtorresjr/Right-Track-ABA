import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getClientsThunk } from "../../redux/clients";
import "./index.css";
import { getClientDataForAI } from "../../redux/aiSuggest";
import { trend_prompt } from "../helpers/prompts";

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

  const analyzeTrends = async () => {
    const prompt = `${trend_prompt}=${cleanDataStore.cleanData}`;
    console.log(prompt);
  };

  const suggestIntervention = async () => {
    console.log("Suggest Intervention");
  };

  const graphData = async () => {
    console.log("Graph Data");
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
      <>
        {cleanDataStore.cleanData ? (
          <div className="cleanDataDiv">
            <div className="manageClientsHeader">
              <h1>Clean Interval Data</h1>
            </div>
            <div className="aiBtnContainer">
              <button onClick={() => analyzeTrends()}>Analyze Trends</button>
              <button onClick={() => suggestIntervention()}>
                Suggest Intervention
              </button>
              <button onClick={() => alert("Feature Coming Soon...")}>
                Graph Data
              </button>
            </div>
            <div id="cleanDataText">{cleanDataStore["cleanData"]}</div>
          </div>
        ) : null}
      </>
    </div>
  );
};

export default AI_Suggest_Comp;
