import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { getClientByIDThunk } from "../../redux/clients";
import { useModal } from "../../context/Modal";
import "./client-details.css";
import { DailyCharts } from "../DailyCharts";
import DiscreetTrials from "../DiscreetTrials";
import DeleteModal from "../DeleteModal/DeleteModal";
import UpdateClientModal from "../UpdateClientModal/UpdateClientModal";

const ClientDetails = () => {
  const { setModalContent } = useModal();
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const { client_id } = useParams();
  const client = useSelector((state) => state?.clients?.client_by_id);

  useEffect(() => {
    setLoaded(false);
    let data = "";
    const getData = async () => {
      if (client_id) {
        try {
          const data = await dispatch(getClientByIDThunk(client_id));
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
  }, [client_id, dispatch, message]);

  const openDeleteModal = () => {
    setModalContent(<DeleteModal client={client} trigger={"ClientDetails"} />);
  };
  const openEditModal = () => {
    setModalContent(
      <UpdateClientModal client={client} trigger={"ClientDetails"} />
    );
  };

  return (
    <>
      {loaded ? (
        <div className="mainDisplayContain" id="clientDetails">
          <h1>
            {client?.last_name}, {client?.first_name}
            <NavLink to="/manage-clients" className="navLinkStyle">
              Back To Manage Clients
            </NavLink>
          </h1>

          <div className="clientDetailsContain">
            <div>
              <label className="detailsLabels">Guardian Email:</label>
              {client?.guardian_email}
            </div>
            <div>
              <label className="detailsLabels">DOB:</label>
              {client?.dob}
            </div>
            <div>
              <label className="detailsLabels">Notes:</label>
              {client?.client_notes}
            </div>
          </div>
          <div className="btnsContain">
            <button id="editBtn" onClick={openEditModal}>
              Edit Client Data
            </button>
            <button id="delBtn" onClick={openDeleteModal}>
              Delete Client
            </button>
          </div>
          <DailyCharts clientCharts={client} />
          <DiscreetTrials clientDT={client} />
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

export default ClientDetails;
