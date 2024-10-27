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

import { Button, Stack, Typography } from "@mui/material";
import KeyboardBackspaceTwoToneIcon from "@mui/icons-material/KeyboardBackspaceTwoTone";

import AddIcon from "@mui/icons-material/Add";

// import DeleteModal from "../DeleteModal/DeleteModal";
// import UpdateClientModal from "../UpdateClientModal/UpdateClientModal";

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
          <Stack
            direction="row"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">
              {client?.last_name}, {client?.first_name}
            </Typography>
            <Button
              variant="contained"
              startIcon={<KeyboardBackspaceTwoToneIcon />}
              size="small"
              onClick={handleNavBack}
            >
              {`Back To ${client?.first_name}'s Detail Page`}
            </Button>
          </Stack>

          <div className="trialDeets" style={{ border: `3px solid white` }}>
            <div className="trialInfo">
              <h1>Discreet Trial</h1>
              <div>{dtData?.program_name}</div>
              <div>{dtData?.program_notes}</div>
              <div>{dtData?.trial_date}</div>
            </div>
            <div
              className="trialScoreDiv"
              style={{ border: `5px solid ${passOrFail}` }}
            >
              <div className="trialAttempts">
                Mastery:
                <br></br>
                {trialScore} / {trialCount}
              </div>
              <div className="percent">
                {isNaN(percentMastered) ? 0 : percentMastered}%
              </div>
            </div>
          </div>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              marginTop: "20px",
              alignItems: "center",
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
            <>{"No Trials Yet."}</>
          )}

          <div className="clientDetailsContain"></div>
          <Stack
            direction="row"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">
              {client?.last_name}, {client?.first_name}
            </Typography>
            <Button
              variant="contained"
              startIcon={<KeyboardBackspaceTwoToneIcon />}
              size="small"
              onClick={handleNavBack}
            >
              {`Back To ${client?.first_name}'s Detail Page`}
            </Button>
          </Stack>
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
