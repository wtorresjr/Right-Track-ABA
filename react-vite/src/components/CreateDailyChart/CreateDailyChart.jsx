import { useDispatch, useSelector } from "react-redux";
import { getClientByIDThunk, getClientsThunk } from "../../redux/clients";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./create-daily-chart.css";
import { createNewChartThunk, getChartByIdThunk } from "../../redux/charts";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";

const CreateDailyChart = () => {
  const navigate = useNavigate();
  const { client_id } = useParams();
  const { closeModal } = useModal();
  const [selectedClient, setSelectedClient] = useState(client_id);
  const [isDisabled, setIsDisabled] = useState(true);
  const [todaysDate, setTodaysDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [errors, setErrors] = useState({});

  const [newChartCompleted, setNewChartCompleted] = useState(null);

  const currentClient = useSelector((state) => state?.clients?.client_by_id);
  const clientList = useSelector((state) => state?.clients?.clients?.Clients);
  const dispatch = useDispatch();

  const errorCollector = {};
  useEffect(() => {
    const today = new Date();
    const selectedDate = new Date(todaysDate);
    selectedDate.setHours(24, 0, 0, 0);

    if (selectedDate.getTime() > today.getTime()) {
      errorCollector.date = "Chart date cannot be in the future";
    }

    setErrors(errorCollector);

    if (!Object.keys(errorCollector).length) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [dispatch, todaysDate]);

  useEffect(() => {
    dispatch(getClientByIDThunk(client_id));
    dispatch(getClientsThunk());
  }, [dispatch, client_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startNewChart = {
      chart_date: todaysDate,
      client_id: selectedClient,
    };

    const newChartResult = await dispatch(createNewChartThunk(startNewChart));
    setNewChartCompleted(newChartResult);
  };

  useEffect(() => {
    if (newChartCompleted) {
      closeModal();
      dispatch(getChartByIdThunk(newChartCompleted?.New_Chart?.id));
      navigate(`/daily-chart/${newChartCompleted?.New_Chart?.id}`);
    }
  }, [newChartCompleted, navigate]);

  return (
    <div className="newChartModal">
      <h1>
        Create Daily Chart For {currentClient?.first_name}{" "}
        {currentClient?.last_name}
      </h1>
      {currentClient?.Incomplete_Charts &&
        currentClient?.Incomplete_Charts?.map((incChart) => {
          return (
            <div key={incChart?.id}>
              <label>Incomplete Charts for {currentClient?.first_name}: </label>
              <NavLink
                to={`/daily-chart/${incChart?.id}`}
                className="navLinkStyle"
                onClick={() => closeModal()}
              >
                {incChart?.chart_date}
              </NavLink>
            </div>
          );
        })}

      {currentClient && !currentClient?.message ? (
        <div>
          <div className="newChartMenu">
            <form onSubmit={handleSubmit}>
              <input
                id="dateInput"
                type="date"
                value={todaysDate}
                onChange={(e) => setTodaysDate(e.target.value)}
              />
              <select
                id="clientSelector"
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
              <button id="cancelBtn" onClick={() => closeModal()}>
                Cancel
              </button>
              <button id="createChartBtn" disabled={isDisabled}>
                Create Chart
              </button>
            </form>
          </div>
          {errors && errors.date && <p className="errorsPtag">{errors.date}</p>}
        </div>
      ) : (
        <h1>{currentClient?.message}</h1>
      )}
    </div>
  );
};

export default CreateDailyChart;
