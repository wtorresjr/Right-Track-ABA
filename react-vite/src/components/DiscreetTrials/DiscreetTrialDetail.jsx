import "./dt-comp-styles.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "../ClientDetails/client-details.css";
import { getDiscreetTrialThunk } from "../../redux/dts";
import TrialComponent from "./TrialComponent";
import { returnPercentColor } from "../helpers/returnColor";
import { LegendComponent } from "../DailyCharts";
// import DeleteModal from "../DeleteModal/DeleteModal";
// import UpdateClientModal from "../UpdateClientModal/UpdateClientModal";

const DiscreetTrialDetail = () => {
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

  const client = useSelector((state) => state?.clients?.client_by_id);

  useEffect(() => {
    setLoaded(false);
    const getData = async () => {
      const data = await dispatch(getDiscreetTrialThunk(+dt_id));

      if (data) {
        setLoaded(true);
        setDtData(data.Discreet_Trial);
        setTrialsData(data.Trials);
      }
    };
    getData();
  }, [client.id, message, dt_id]);

  useEffect(() => {
    if (trialsData) {
      let trialsNum = trialsData.reduce(
        (acc, trial) => acc + trial.trial_count,
        0
      );

      let score = trialsData.reduce((acc, trial) => acc + trial.trial_score, 0);
      setTrialCount(trialsNum);
      setTrialScore(score);

      setMastered(((100 / trialCount) * trialScore).toFixed(1));
    }
  }, [trialsData, trialScore, trialCount]);

  useEffect(() => {
    setPassOrFail(returnPercentColor(percentMastered));
  }, [percentMastered]);

  return (
    <>
      {loaded ? (
        <div className="mainDisplayContain" id="clientDetails">
          <h1>
            {client?.last_name}, {client?.first_name}
            <NavLink to={`/client/${client?.id}`} className="navLinkStyle">
              <i className="fa-solid fa-arrow-left fa-xl"></i>
              {` Back To ${client.first_name}'s Detail Page`}
            </NavLink>
          </h1>

          <LegendComponent />
          <div
            className="trialDeets"
            style={{ border: `3px solid ${passOrFail}` }}
          >
            <div className="trialInfo">
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
              <div className="percent">{percentMastered}%</div>
            </div>
          </div>

          {trialsData ? (
            trialsData.map((trial) => {
              return <TrialComponent trial={trial} key={trial.id} />;
            })
          ) : (
            <>{"No Trials Yet."}</>
          )}

          <div className="clientDetailsContain"></div>
          <h1>
            {client?.last_name}, {client?.first_name}
            <NavLink to={`/client/${client?.id}`} className="navLinkStyle">
              <i className="fa-solid fa-arrow-left fa-xl"></i>
              {` Back To ${client?.first_name}'s Detail Page`}
            </NavLink>
          </h1>
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
