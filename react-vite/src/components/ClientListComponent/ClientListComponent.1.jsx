import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientsThunk, getClientByIDThunk } from "../../redux/clients";
import GraphComponent from "../GraphComponent/GraphComponent";

export const ClientListComponent = () => {
  const dispatch = useDispatch();
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState();
  const [chartDataPoint, setChartDataPoint] = useState();
  const [clientCharts, setClientCharts] = useState();
  const clientList = useSelector((state) => state?.clients?.clients?.Clients);
  const [startDay, setStartDay] = useState();
  const [endDay, setEndDay] = useState();
  // const [filteredCharts, setFilteredCharts] = useState();
  useEffect(() => {
    dispatch(getClientsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (startDay && endDay && clientCharts) {
      console.log("Conditions met to filter charts");
    }
  }, [dispatch, startDay, endDay]);

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
            <option value="PB">Problem Behaviors</option>
            <option value="BD">Behavior Duration</option>
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
                onChange={(e) => setStartDay(e.target.value)}
              ></input>
            </label>
            <label>
              End:
              <input
                type="date"
                onChange={(e) => setEndDay(e.target.value)}
              ></input>
            </label>
          </div>
        </div>

        <div className="chartTypeContain">
          <label>Chart Type:</label>
          <button onClick={() => setSelectedChartType("Bar")}>Bar</button>
          <button>Line</button>
          <button>Scatter</button>
          <button>Pie</button>
        </div>
        {/*
            <div className="chartTypeContain">
              <label>Chart Type:</label>
              <button>Bar</button>
              <button>Line</button>
              <button>Scatter</button>
              <button>Pie</button>
            </div> */}
      </div>{" "}
      {selectedClient && chartDataPoint === "AVG" ? (
        <div className="chartDisplayArea">
          <GraphComponent
            chartType={selectedChartType}
            clientCharts={clientCharts.Daily_Charts}
          />
        </div>
      ) : (
        <div className="chartDisplayArea">
          <p className="errorsPtag">Choose a client</p>
        </div>
      )}
    </div>
  );
};
