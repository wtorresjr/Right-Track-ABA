import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
// import { getClientByIDThunk } from "../../redux/clients";
import { useModal } from "../../context/Modal";
import "../ClientDetails/client-details.css";
import { getDiscreetTrialThunk } from "../../redux/dts";
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

  const client = useSelector((state) => state?.clients?.client_by_id);
  const discreetTrial = useSelector(
    (state) => state?.clients?.client_by_id?.Discreet_Trials
  );

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

    // const selectedDT = discreetTrial.filter((dt) => dt.id === +dt_id);

    // if (selectedDT.length) {
    //   console.log(selectedDT, "DT filtered");
    //   setDtData(selectedDT[0]);
    //   setLoaded(true);
    // }
  }, [client.id, message, dt_id]);

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
          <div>{dtData?.trial_date}</div>
          <div>{dtData?.program_name}</div>
          <div>{dtData?.program_notes}</div>

          {trialsData ? (
            trialsData.map((trial) => {
              return (
                <div key={trial.id}>
                  <div>Trial Target: {trial.trial_target}</div>
                  <div>{trial.trial_notes}</div>
                </div>
              );
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
