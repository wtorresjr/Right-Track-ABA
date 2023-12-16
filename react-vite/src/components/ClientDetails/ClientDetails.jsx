import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getClientByIDThunk } from "../../redux/clients";
import "./client-details.css";

const ClientDetails = () => {
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

  const handleClick = () => {
    console.log("HandleClicked");
  };

  return (
    <>
      {loaded ? (
        <div className="mainDisplayContain" id="clientDetails">
          <h1>
            {client?.last_name}, {client?.first_name}
          </h1>
          <div className="clientDetailsContain">
            <div>
              <label>Guardian Email:</label>
              {client?.guardian_email}
            </div>
            <div>
              <label>DOB:</label>
              {client?.dob}
            </div>
            <div>
              <label>Notes:</label>
              {client?.client_notes}
            </div>
          </div>
          <div className="btnsContain">
            <button
              id="editBtn"
              onClick={() => {
                handleClick(client.id, "edit");
              }}
            >
              Edit
            </button>
            <button
              id="delBtn"
              onClick={() => {
                handleClick(client.id, "delete");
              }}
            >
              Delete
            </button>
          </div>
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
