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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(getClientsThunk());
  }, []);

  const getRecords = async () => {
    await dispatch(getClientDataForAI(selectedClient, startDate, endDate));
    console.log(startDate, endDate);
  };

  const analyzeTrends = async () => {
    const prompt = `${trend_prompt}=${cleanDataStore}`;
    // console.log(`Showing data from ${startDate} to ${endDate}.`);
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
        <div>
          <input
            id="dateInput"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            id="dateInput"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
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
              <p>
                Showing Data for dates:{" "}
                {startDate ? startDate : "Earliest Found"} to{" "}
                {endDate ? endDate : "Newest Found"}
              </p>
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
            <div id="cleanDataText">{cleanDataStore.cleanData}</div>
          </div>
        ) : null}
        {cleanDataStore == "" ? <p>No Matching Data Found.</p> : null}
      </>
    </div>
  );
};

export default AI_Suggest_Comp;
