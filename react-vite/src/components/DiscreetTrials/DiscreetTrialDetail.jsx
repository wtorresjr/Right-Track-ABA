import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { getClientByIDThunk } from "../../redux/clients";
import { useModal } from "../../context/Modal";
import "../ClientDetails/client-details.css";
// import DeleteModal from "../DeleteModal/DeleteModal";
// import UpdateClientModal from "../UpdateClientModal/UpdateClientModal";

const DiscreetTrialDetail = () => {
  const { setModalContent } = useModal();
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("Loading...");
  // const { client_id } = useParams();
  const client = useSelector((state) => state?.clients?.client_by_id);

  useEffect(() => {
    setLoaded(false);
    let data = "";
    const getData = async () => {
      if (client.id) {
        try {
          const data = await dispatch(getClientByIDThunk(client.id));
          if (data?.ok) {
            setLoaded(true);
          }
          if (data?.payload?.message) {
            setMessage(data?.payload?.message);
            setLoaded(false);
          }
        } catch (error) {
          setMessage(data?.payload?.message);
          setLoaded(false);
        }
      }
    };
    getData();
  }, [client.id, message]);

  return (
    <>
      {loaded ? (
        <div className="mainDisplayContain" id="clientDetails">
          <h1>
            {client?.last_name}, {client?.first_name}
            <NavLink to={`/client/${client.id}`} className="navLinkStyle">
              <i className="fa-solid fa-arrow-left fa-xl"></i>
              {` Back To ${client.first_name}'s Detail Page`}
            </NavLink>
          </h1>
          Test

          <div className="clientDetailsContain"></div>
          <h1>
            {client?.last_name}, {client?.first_name}
            <NavLink to={`/client/${client.id}`} className="navLinkStyle">
              <i className="fa-solid fa-arrow-left fa-xl"></i>
              {` Back To ${client.first_name}'s Detail Page`}
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
