import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getClientsThunk } from "../../redux/clients";
import "./index.css";
import { analyzeTrendsByAi, getClientDataForAI } from "../../redux/aiSuggest";
// import { trend_prompt, analysis_data_prompt } from "../helpers/prompts";

const AI_Suggest_Comp = () => {
  const dispatch = useDispatch();
  const [selectedClient, setSelectedClient] = useState(null);
  const clientList = useSelector((state) => state?.clients?.clients?.Clients);
  const cleanDataStore = useSelector((state) => state?.ai?.cleanData);
  const showData = useSelector((state) => state?.ai?.cleanData);
  const aiTrend = useSelector((state) => state?.ai?.ai_trend);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(getClientsThunk());
  }, []);

  const getRecords = async () => {
    await dispatch(getClientDataForAI(selectedClient, startDate, endDate));
  };

  const analyzeTrends = async () => {
    const userPrompt = {
      prompt: `${cleanDataStore?.cleanData}`,
    };
    try {
      await dispatch(analyzeTrendsByAi(userPrompt));
    } catch (errors) {
      console.error("Error Occurred Finding Trends:", errors);
    }
  };

  const suggestIntervention = async () => {
    // const prompt = `${analysis_data_prompt}=${cleanDataStore}`;
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
        <div style={{display:"flex",flexFlow:"column nowrap",gap:"12px"}}>
          Optional: Choose dates to analyze session data for those dates only or all available session data will be analyzed which may affect response time.
          <select
            id="dcClientSelect"
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option>Get AI Suggestions For...</option>
            {clientList &&
              clientList.map((client) => {
                return (
                  <option key={client?.id} value={client?.id}>
                    {client?.first_name} {client?.last_name} -- DOB --{" "}
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
      </div>
      <>
        {parseInt(selectedClient) === cleanDataStore?.client_id &&
        cleanDataStore?.cleanData ? (
          <div className="cleanDataDiv">
            <div className="manageClientsHeader">
              <h1>Interval Data</h1>
            </div>
            <div className="aiBtnContainer">
              <button onClick={() => analyzeTrends()}>Analyze Trends</button>
              <button disabled={"true"} onClick={() => suggestIntervention()}>
                Suggest Intervention
              </button>
              <button
                disabled={"true"}
                onClick={() => alert("Feature Coming Soon...")}
              >
                Graph Data
              </button>
            </div>
            <div id="cleanDataText">
              <p>
                Showing Data for dates: {startDate ? startDate : "Oldest"} to{" "}
                {endDate ? endDate : "Latest"}
              </p>
              <p>Total Intervals: {showData?.showData.length}</p>
              <p>
                Date (Interval Count):{" "}
                {Object.entries(showData?.found_dates).map((date) => {
                  return `- ${date[0]} (${date[1]}) -`;
                })}
              </p>
              <p>
                Behaviors Exhibited: (
                {Object.keys(showData?.behavior_totals).length}) :{" "}
                {Object.entries(showData?.behavior_totals).map((behavior) => {
                  return `- ${behavior[0]} : ${behavior[1]} -`;
                })}
              </p>
            </div>
          </div>
        ) : null}
        {parseInt(selectedClient) && cleanDataStore?.cleanData == "" ? (
          <p>No Matching Data Found.</p>
        ) : null}
      </>
      <>
        {parseInt(selectedClient) === cleanDataStore.client_id &&
        aiTrend.length > 0 ? (
          <div className="cleanDataDiv">
            <div>
              <h1>Trend Analysis</h1>
            </div>
            {aiTrend}
          </div>
        ) : (
          ""
        )}
      </>
    </div>
  );
};

export default AI_Suggest_Comp;
