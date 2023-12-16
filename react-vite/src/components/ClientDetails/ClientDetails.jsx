import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getClientByIDThunk } from "../../redux/clients";

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
    <div className="mainDisplayContain">
      <h1>
        {client?.last_name}, {client?.first_name}
      </h1>
    </div>
  );
};

export default ClientDetails;
