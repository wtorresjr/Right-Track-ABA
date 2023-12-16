import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getClientByIDThunk } from "../../redux/clients";
import "./client-details.css";

const ClientDetails = () => {
  const dispatch = useDispatch();
  const { client_id } = useParams("client_id");
  const client = useSelector((state) => state?.clients?.client_by_id);

  useEffect(() => {
    if (client_id) {
      dispatch(getClientByIDThunk(client_id));
    }
  }, [dispatch]);

  return (
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
  );
};

export default ClientDetails;
