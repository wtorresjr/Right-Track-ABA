import "./dt-comp-styles.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "../ClientDetails/client-details.css";
import { getDiscreetTrialThunk } from "../../redux/dts";
import TrialComponent from "./TrialComponent";
import { returnPercentColor } from "../helpers/returnColor";
import { getClientByIDThunk } from "../../redux/clients";
import AddTrialComponent from "./AddTrialComponent";

import { useNavigate } from "react-router-dom";

import {
  Button,
  Stack,
  Typography,
  Card,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import KeyboardBackspaceTwoToneIcon from "@mui/icons-material/KeyboardBackspaceTwoTone";

import AddIcon from "@mui/icons-material/Add";


const DiscreetTrialDetail = () => {
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const dispatch = useDispatch();
  const { dt_id } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const [dtData, setDtData] = useState();
  const [trialsData, setTrialsData] = useState();
  const [percentMastered, setMastered] = useState(0);
  const [trialCount, setTrialCount] = useState(0);
  const [trialScore, setTrialScore] = useState(0);
  const [passOrFail, setPassOrFail] = useState("red");
  const errorObject = useSelector((state) => state?.chart?.error);

  let client = useSelector((state) => state?.clients?.client_by_id);
  let data;

  const handleNavBack = () => {
    navigate(`/client/${client?.id}`);
  };

  useEffect(() => {
    setLoaded(false);
    const getData = async () => {
      data = await dispatch(getDiscreetTrialThunk(+dt_id));
      if (errorObject) {
        setLoaded(false);
        setMessage(errorObject);
      }
      if (data) {
        setLoaded(true);
        setDtData(data?.Discreet_Trial);
        setTrialsData(data?.Trials);
      }
    };
    getData();
  }, [client?.id, message, dt_id, client, errorObject]);

  useEffect(() => {
    if (trialsData) {
      let trialsNum = trialsData?.reduce(
        (acc, trial) => acc + trial?.trial_count,
        0
      );

      let score = trialsData?.reduce(
        (acc, trial) => acc + trial?.trial_score,
        0
      );
      setTrialCount(trialsNum);
      setTrialScore(score);

      setMastered(((100 / trialCount) * trialScore).toFixed(1));
    }
  }, [trialsData, trialScore, trialCount]);

  useEffect(() => {
    setPassOrFail(returnPercentColor(percentMastered));
  }, [percentMastered]);

  useEffect(() => {
    const checkForClient = async () => {
      client = await dispatch(getClientByIDThunk(dtData?.client_id));
    };
    if (!client?.id && dtData) {
      checkForClient();
    }
  }, [dtData]);

  const openAddTrialModal = async () => {
    setModalContent(<AddTrialComponent dtInfo={dtData} />);
  };

  return (
    <>
      {loaded ? (
        <div className="mainDisplayContain" id="clientDetails">
          <Card
            variant="outlined"
            sx={{ backgroundColor: "black", color: "white", width: "100%" }}
          >
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="h6" component="div">
                  Trial Detail - {dtData?.trial_date}
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<KeyboardBackspaceTwoToneIcon />}
                  size="small"
                  onClick={handleNavBack}
                >
                  {client?.first_name}'s Detail Page
                </Button>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" component="div">
                  Client: {client?.first_name} {client?.last_name}
                </Typography>
                <Typography variant="h6">
                  Program Name: {dtData?.program_name}
                </Typography>
              </Stack>
              <Divider sx={{ backgroundColor: "white" }} />
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6">Total Mastery: </Typography>
                  <Chip
                    label={`${trialScore} out of ${trialCount} = ${
                      isNaN(percentMastered) ? 0 : percentMastered
                    }%`}
                    variant="contained"
                    sx={{
                      backgroundColor: passOrFail,
                      color: "black",
                      fontWeight: "bolder",
                      fontSize: "20px",
                    }}
                  />
                </Stack>
              </Stack>
            </Box>
          </Card>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              marginTop: "10px",
              alignItems: "center",
              padding: "0 15px",
            }}
            width="100%"
          >
            <Typography variant="h5">Trials</Typography>
            <Button
              color="warning"
              variant="contained"
              startIcon={<AddIcon />}
              endIcon={<AddIcon />}
              onClick={openAddTrialModal}
            >
              Add New Trial
            </Button>
          </Stack>

          {trialsData && trialsData.length ? (
            trialsData?.map((trial) => {
              return (
                <TrialComponent trial={trial} dtInfo={dtData} key={trial.id} />
              );
            })
          ) : (
            <Stack
              sx={{
                backgroundColor: "black",
                color: "white",
                width: "100%",
                textAlign: "center",
                padding: "10px",
                marginTop: "10px",
                borderRadius: "10px",
              }}
            >
              {"No Trials Yet."}
            </Stack>
          )}

          <div className="clientDetailsContain"></div>
          <Card
            variant="outlined"
            sx={{ backgroundColor: "black", color: "white", width: "100%" }}
          >
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="h6" component="div">
                  Trial Detail - {dtData?.trial_date}
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<KeyboardBackspaceTwoToneIcon />}
                  size="small"
                  onClick={handleNavBack}
                >
                  {client?.first_name}'s Detail Page
                </Button>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" component="div">
                  Client: {client?.first_name} {client?.last_name}
                </Typography>
                <Typography variant="h6">
                  Program Name: {dtData?.program_name}
                </Typography>
              </Stack>
              <Divider sx={{ backgroundColor: "white" }} />
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6">Total Mastery: </Typography>
                  <Chip
                    label={`${trialScore} out of ${trialCount} = ${
                      isNaN(percentMastered) ? 0 : percentMastered
                    }%`}
                    variant="contained"
                    sx={{
                      backgroundColor: passOrFail,
                      color: "black",
                      fontWeight: "bolder",
                      fontSize: "20px",
                    }}
                  />
                </Stack>
              </Stack>
            </Box>
          </Card>
        </div>
      ) : (
        <h2
          style={{
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
            borderRadius: "15px",
            padding: "10px 0",
          }}
        >
          {message}
        </h2>
      )}
    </>
  );
};

export default DiscreetTrialDetail;
