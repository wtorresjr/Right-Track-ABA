import { useDispatch, useSelector } from "react-redux";
import { getClientByIDThunk, getClientsThunk } from "../../redux/clients";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./create-daily-chart.css";
import { getChartByIdThunk, updateTheChartThunk } from "../../redux/charts";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { DeleteMessage } from "../DeleteModal";

const UpdateDailyChart = ({ dc }) => {
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const { client_id } = useParams();
  const { closeModal } = useModal();
  const [selectedClient, setSelectedClient] = useState(client_id);
  const [isDisabled, setIsDisabled] = useState(true);
  const [todaysDate, setTodaysDate] = useState(dc?.chart_date);
  const [newChartCompleted, setNewChartCompleted] = useState(null);
  const [errors, setErrors] = useState({});
  const [clientName, setClientName] = useState();
  const currentClient = useSelector((state) => state?.clients?.client_by_id);
  const clientList = useSelector((state) => state?.clients?.clients?.Clients);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClientByIDThunk(client_id));
    dispatch(getClientsThunk());
  }, [dispatch, client_id]);

  const errorCollector = {};
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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
    const nameChanger = clientList?.filter((client) => {
      return client.id === +selectedClient;
    });
    const firstLastName =
      nameChanger[0]?.first_name + " " + nameChanger[0]?.last_name;

    setClientName(firstLastName);
  }, [dispatch, selectedClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startNewChart = {
      chart_date: todaysDate,
      client_id: selectedClient,
    };

    const newChartResult = await dispatch(
      updateTheChartThunk(startNewChart, dc?.id)
    );
    setNewChartCompleted(newChartResult);
  };

  const openMessageDiag = () => {
    setModalContent(<DeleteMessage message={"Updated Chart Data"} />);
  };

  useEffect(() => {
    if (newChartCompleted) {
      closeModal();
      openMessageDiag();
      dispatch(getChartByIdThunk(dc?.id));
      navigate(`/daily-chart/${dc?.id}`);
    }
  }, [newChartCompleted, navigate]);

  return (
    <div className="newChartModal">
      <h1>Update Daily Chart For {clientName}</h1>
      {currentClient?.Incomplete_Charts &&
        currentClient?.Incomplete_Charts?.map((incChart) => {
          return (
            <div key={incChart?.id}>
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
                Update Chart
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

export default UpdateDailyChart;
