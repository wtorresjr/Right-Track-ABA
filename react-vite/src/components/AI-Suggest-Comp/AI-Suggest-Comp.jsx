import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getClientsThunk } from "../../redux/clients";
import "./index.css";
import {
  analyzeTrendsByAi,
  clearAiTrendData,
  getClientDataForAI,
} from "../../redux/aiSuggest";

import {
  Stack,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
// import { trend_prompt, analysis_data_prompt } from "../helpers/prompts";

const AI_Suggest_Comp = () => {
  const dispatch = useDispatch();
  const [selectedClient, setSelectedClient] = useState(null);
  const clientList = useSelector((state) => state?.clients?.clients?.Clients);
  const cleanDataStore = useSelector((state) => state?.ai?.cleanData);
  const showData = useSelector((state) => state?.ai?.cleanData);
  const aiTrend = useSelector((state) => state?.ai?.ai_trend);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    dispatch(getClientsThunk());
  }, []);

  useEffect(() => {
    dispatch(clearAiTrendData());
  }, [selectedClient]);

  const getRecords = async () => {
    await dispatch(getClientDataForAI(selectedClient, startDate, endDate));
  };

  const analyzeTrends = async () => {
    // console.log("CLEAN DATA", cleanDataStore.cleanData);
    setWaiting(true);
    const userPrompt = {
      prompt: `${cleanDataStore?.cleanData}`,
    };
    try {
      const gettingTrends = await dispatch(analyzeTrendsByAi(userPrompt));
      gettingTrends ? setWaiting(false) : null;
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
      <Stack direction="column" spacing={2}>
        <Typography variant="h4">AI Suggestions</Typography>
        <Typography variant="subtitle" textAlign="center">
          Optional: Choose dates to analyze session data for those dates only or
          all available session data will be analyzed which may affect response
          time.
        </Typography>
        <input
          id="dateInput"
          type="date"
          value={startDate || ""}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          id="dateInput"
          type="date"
          value={endDate || ""}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <Box>
          <FormControl fullWidth>
            <InputLabel>Select Client</InputLabel>
            <Select
              sx={{ backgroundColor: "white" }}
              label="Select Client"
              onChange={(e) => setSelectedClient(e.target.value)}
              value={selectedClient || ""}
            >
              {clientList &&
                clientList.map((client) => {
                  return (
                    <MenuItem key={client?.id} value={client?.id}>
                      {client?.first_name} {client?.last_name} -- DOB --{" "}
                      {client?.dob}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Box>
        {selectedClient && (
          <Button variant="contained" onClick={getRecords}>
            Get Records
          </Button>
        )}
      </Stack>
      <>
        {parseInt(selectedClient) === cleanDataStore?.client_id &&
        cleanDataStore?.cleanData ? (
          <Stack>
            <Typography variant="h4" sx={{ marginTop: "10px" }}>
              Interval Data
            </Typography>

            <Stack
              direction="column"
              spacing={1}
              width="100%"
              sx={{ margin: "10px 0 10px 0" }}
            >
              <Button variant="contained" onClick={() => analyzeTrends()}>
                Analyze Trends
              </Button>
              {/* <Button
                variant="contained"
                disabled={"true"}
                onClick={() => suggestIntervention()}
              >
                Suggest Intervention
              </Button>
              <Button
                variant="contained"
                disabled={"true"}
                onClick={() => alert("Feature Coming Soon...")}
              >
                Graph Data
              </Button> */}
            </Stack>
            <Stack
              sx={{
                backgroundColor: "black",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <Typography>
                Showing Data for dates: {startDate ? startDate : "Oldest"} to{" "}
                {endDate ? endDate : "Latest"}
              </Typography>
              <Typography>
                Total Intervals: {showData?.showData.length}
              </Typography>
              <Typography>
                Date (Interval Count):{" "}
                {Object.entries(showData?.found_dates).map((date) => {
                  return `- ${date[0]} (${date[1]}) -`;
                })}
              </Typography>
              <Typography>
                Behaviors Exhibited: (
                {Object.keys(showData?.behavior_totals).length}) :{" "}
                {Object.entries(showData?.behavior_totals).map((behavior) => {
                  return `- ${behavior[0]} : ${behavior[1]} -`;
                })}
              </Typography>
            </Stack>
          </Stack>
        ) : null}
        {parseInt(selectedClient) && cleanDataStore?.cleanData == "" ? (
          <p>No Matching Data Found.</p>
        ) : null}
      </>
      {/* <>
        {" "}
        {parseInt(selectedClient) === cleanDataStore.client_id &&
        aiTrend.length == 0 ? (
          <Stack
            sx={{
              backgroundColor: "black",
              padding: "10px",
              borderRadius: "10px",
              marginTop: "10px",
            }}
          >
            <Typography variant="h4">Trend Analysis</Typography>
            {aiTrend}
            Test
          </Stack>
        ) : (
          ""
        )}
      </> */}
      <>
        {parseInt(selectedClient) === cleanDataStore.client_id && waiting ? (
          <Stack
            sx={{
              backgroundColor: "black",
              padding: "10px",
              borderRadius: "10px",
              marginTop: "10px",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">Trend Analysis</Typography>
            <CircularProgress color="inherit" />
          </Stack>
        ) : (
          aiTrend.length > 0 && (
            <Stack
              sx={{
                backgroundColor: "black",
                padding: "10px",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            >
              <Typography variant="h4">Trend Analysis</Typography>
              {aiTrend}
            </Stack>
          )
        )}
      </>
    </div>
  );
};

export default AI_Suggest_Comp;
