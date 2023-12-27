import { useDispatch, useSelector } from "react-redux";
import { getClientByIDThunk, getClientsThunk } from "../../redux/clients";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./create-daily-chart.css";
import { createNewChartThunk } from "../../redux/charts";

const CreateDailyChart = () => {
  const { client_id } = useParams();
  const [selectedClient, setSelectedClient] = useState(client_id);
  const [todaysDate, setTodaysDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const currentClient = useSelector((state) => state?.clients?.client_by_id);
  const clientList = useSelector((state) => state?.clients?.clients?.Clients);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClientByIDThunk(client_id));
    dispatch(getClientsThunk());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Create new chart for client", selectedClient, todaysDate);

    

    dispatch(createNewChartThunk());
  };

  return (
    <div className="mainDisplayContain">
      <h1>
        Create Daily Chart For {currentClient?.first_name}{" "}
        {currentClient?.last_name}
      </h1>
      {currentClient?.Incomplete_Charts &&
        currentClient?.Incomplete_Charts?.map((incChart) => {
          return (
            <div>
              <label>Incomplete Charts for {currentClient?.first_name}: </label>
              <NavLink
                to={`/daily-chart/${incChart?.id}`}
                className="navLinkStyle"
              >
                {incChart?.chart_date}
              </NavLink>
            </div>
          );
        })}

      {currentClient && !currentClient?.message ? (
        <div className="newChartMenu">
          <form onSubmit={handleSubmit}>
            <input
              type="date"
              value={todaysDate}
              onChange={(e) => setTodaysDate(e.target.value)}
            />
            <select
              value={selectedClient || "Select Client"}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              {clientList &&
                clientList.map((client) => {
                  return (
                    <option key={client?.id} value={client?.id}>
                      {client?.first_name} {client?.last_name} --- DOB:{" "}
                      {client?.dob}
                    </option>
                  );
                })}
            </select>
            <button>Create Chart</button>
          </form>
        </div>
      ) : (
        <h1>{currentClient?.message}</h1>
      )}
    </div>
  );
};

export default CreateDailyChart;
