import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientsThunk, getClientByIDThunk } from "../../redux/clients";
import "../CreateDailyChart/create-daily-chart.css";
import GraphComponentV2 from "../GraphComponent/GraphComponentV2";
import { getAllIntervalsThunk } from "../../redux/charts";

const ClientListComponent = () => {
  const dispatch = useDispatch();
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState("Line");
  const [chartDataPoint, setChartDataPoint] = useState();
  const [clientCharts, setClientCharts] = useState();
  const clientList = useSelector((state) => state?.clients?.clients?.Clients);
  const allIntervals = useSelector((state) => state?.chart?.allClientIntervals);

  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [filteredCharts, setFilteredCharts] = useState();
  const [dataPoint, setDataPoint] = useState();
  const [dataPointTwo, setDataPointTwo] = useState();
  const [dataLabels, setDataLabels] = useState();
  const [legendTitle, setLegendTitle] = useState();
  const [legendTitleTwo, setLegendTitleTwo] = useState();

  useEffect(() => {
    dispatch(getClientsThunk("graphs"));
  }, []);

  useEffect(() => {
    if (selectedClient && chartDataPoint && allIntervals) {
      const findClientCharts = async () => {
        if (chartDataPoint === "AVG") {
          const clientData = await dispatch(
            getClientByIDThunk(+selectedClient)
          );
          if (clientData) {
            setClientCharts(clientData?.payload.Daily_Charts);
            setDataLabels("chart_date");
            setDataPoint("avgForChart");
            setDataPointTwo("interval_count");
            setLegendTitle("Chart Average");
            setLegendTitleTwo("Interval Count");
          }
        }
        if (chartDataPoint === "PB") {
          // console.log("Selected PB");
          const getIntervals = await dispatch(
            getAllIntervalsThunk(+selectedClient)
          );
          if (getIntervals) {
            setClientCharts(getIntervals);
            setDataPoint("behaviors");
            setDataLabels("chart_date");
            setLegendTitle("Problem Behaviors");
          }
        }
      };

      findClientCharts(selectedClient);
    }
  }, [selectedClient, chartDataPoint]);

  useEffect(() => {
    setFilteredCharts();
    if (startDay && endDay && clientCharts) {
      const filterCharts = clientCharts?.filter((chart) => {
        return (
          new Date(chart.chart_date).getTime() >=
            new Date(startDay).getTime() &&
          new Date(chart.chart_date).getTime() <= new Date(endDay).getTime()
        );
      });

      if (filterCharts.length > 0) {
        setFilteredCharts(filterCharts);
      }
    }
  }, [startDay, endDay, clientCharts]);

  return (
    <>
      <div className="chartOptions">
        <div className="clientNDp">
          <label>
            Client:
            <select
              id="dcClientSelect"
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option>View Charts For...</option>
              {clientList &&
                clientList.map((client) => (
                  <option key={client?.id} value={client?.id}>
                    {client?.first_name} {client?.last_name} --- DOB:{" "}
                    {client?.dob}
                  </option>
                ))}
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
              {/* <option value="PB">Problem Behaviors</option> */}
            </select>
          </label>
        </div>
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
            <button
              onClick={(e) => {
                setStartDay(""), setEndDay("");
              }}
              id="createChartBtn"
              style={{ height: "50px" }}
            >
              Clear Date Filters
            </button>
          <label>
            Chart Type:
            <div className="chartTypeContain">
              <button onClick={() => setSelectedChartType("Bar")}>Bar</button>
              <button onClick={() => setSelectedChartType("Line")}>Line</button>
              {/* <button onClick={() => setSelectedChartType("Scatter")}>
            Scatter
            </button>
          <button onClick={() => setSelectedChartType("Pie")}>Pie</button> */}
            </div>
          </label>
          </div>
        </div>{" "}
      </div>
      <div className="chartView">
        {selectedClient &&
        chartDataPoint &&
        (filteredCharts || clientCharts) ? (
          <div className="chartDisplayArea">
            <GraphComponentV2
              selectedChartType={selectedChartType}
              clientCharts={filteredCharts || clientCharts}
              selectedClient={selectedClient}
              dataPoint={dataPoint}
              dataPointTwo={dataPointTwo || ""}
              dataLabels={dataLabels}
              legendTitle={legendTitle}
              legendTitleTwo={legendTitleTwo}
              chartDataPoint={chartDataPoint}
            />
          </div>
        ) : (
          <div className="chartDisplayArea">
            <p className="errorsPtag">Choose a client & Data Point</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientListComponent;
