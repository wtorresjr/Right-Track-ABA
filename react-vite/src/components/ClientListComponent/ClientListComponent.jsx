import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientsThunk, getClientByIDThunk } from "../../redux/clients";
import "../CreateDailyChart/create-daily-chart.css";
import GraphComponent from "../GraphComponent/GraphComponent";

const ClientListComponent = () => {
  const dispatch = useDispatch();
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState();
  const [chartDataPoint, setChartDataPoint] = useState();
  const [clientCharts, setClientCharts] = useState();
  const clientList = useSelector((state) => state?.clients?.clients?.Clients);
  const [startDay, setStartDay] = useState();
  const [endDay, setEndDay] = useState();
  const [filteredCharts, setFilteredCharts] = useState();

  useEffect(() => {
    dispatch(getClientsThunk());
  }, [dispatch]);

  useEffect(() => {
    setFilteredCharts();
    if (startDay && endDay && clientCharts) {
      const filterCharts = clientCharts?.Daily_Charts?.filter((chart) => {
        return (
          new Date(chart.chart_date).getTime() >=
            new Date(startDay).getTime() &&
          new Date(chart.chart_date).getTime() <= new Date(endDay).getTime()
        );
      });

      if (Object.entries(filterCharts).length) {
        setFilteredCharts(filterCharts);
      }
    }
  }, [dispatch, startDay, endDay, selectedClient]);

  useEffect(() => {
    const findClientCharts = async () => {
      const clientData = await dispatch(getClientByIDThunk(selectedClient));
      if (clientData.ok) {
        setClientCharts(clientData.payload);
      }
    };
    findClientCharts(selectedClient);
  }, [selectedClient]);

  return (
    <div className="chartView">
      <div className="chartOptions">
        <label>
          Clients:
          <select
            id="dcClientSelect"
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option>View Charts For...</option>
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
        </label>
        <label>
          Data Points:
          <select
            id="dcClientSelect"
            onChange={(e) => setChartDataPoint(e.target.value)}
          >
            <option>Choose Data Points</option>
            <option value="AVG">Average Chart Rating</option>
            {/* <option value="PB">Problem Behaviors</option> */}
            {/* <option value="BD">Behavior Duration</option> */}
            {selectedClient ? "Loaded selected client" : "Not Loaded"}
          </select>
        </label>

        {/* <h4>Filter By Dates: </h4> */}
        <div className="newChartMenu">
          <div className="dateDivider">
            <label>
              Start:
              <input
                type="date"
                value={startDay}
                onChange={(e) => setStartDay(e.target.value)}
              ></input>
            </label>
            <label>
              End:
              <input
                type="date"
                value={endDay}
                onChange={(e) => setEndDay(e.target.value)}
              ></input>
            </label>
          </div>
        </div>
        <p style={{ justifyContent: "right", display: "flex" }}>
          <button
            onClick={(e) => {
              setStartDay(""), setEndDay("");
            }}
          >
            Clear Date Filters
          </button>
        </p>
        <div className="chartTypeContain">
          <label>Chart Type:</label>
          <button onClick={() => setSelectedChartType("Bar")}>Bar</button>
          <button onClick={() => setSelectedChartType("Line")}>Line</button>
          <button onClick={() => setSelectedChartType("Scatter")}>
            Scatter
          </button>
          <button onClick={() => setSelectedChartType("Pie")}>Pie</button>
        </div>
      </div>{" "}
      {selectedClient && chartDataPoint === "AVG" ? (
        <div className="chartDisplayArea">
          <GraphComponent
            chartType={selectedChartType}
            clientCharts={
              filteredCharts ? filteredCharts : clientCharts.Daily_Charts
            }
          />
        </div>
      ) : (
        <div className="chartDisplayArea">
          <p className="errorsPtag">Choose a client & Data Point</p>
        </div>
      )}
    </div>
  );
};

export default ClientListComponent;
