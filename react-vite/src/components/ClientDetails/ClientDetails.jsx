import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const ClientDetails = () => {
  const dispatch = useDispatch();
  const client_id = useParams("client_id");

  useEffect(() => {
    if (client_id) {
      console.log(client_id, "<-------------------- Client ID Found");
    }
  }, [dispatch]);

  return (
    <div className="mainDisplayContain">
      <h1>{/* {client?.last_name} {client?.first_name} */}</h1>
    </div>
  );
};

export default ClientDetails;
