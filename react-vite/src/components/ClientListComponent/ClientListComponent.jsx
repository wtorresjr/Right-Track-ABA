import html2pdf from "html2pdf.js";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientsThunk, getClientByIDThunk } from "../../redux/clients";
import "../CreateDailyChart/create-daily-chart.css";
import GraphComponentV2 from "../GraphComponent/GraphComponentV2";
import { getAllIntervalsThunk } from "../../redux/charts";

const ClientListComponent = ({ onRemove }) => {
  const divToPrintRef = useRef(null);
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

  const printGraph = () => {
    const printContent = divToPrintRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Graph</title>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const exportGraph = () => {
    const printContent = divToPrintRef.current;
    html2pdf().from(printContent).save();
  };

  const clearDates = () => {
    setStartDay("");
    setEndDay("");
  };

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
          {chartDataPoint && selectedClient && (
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
                onClick={clearDates}
                id="createChartBtn"
                style={{ height: "50px" }}
              >
                Clear Date Filters
              </button>
            </div>
          )}
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
        </div>{" "}
      </div>
      <div className="chartView" ref={divToPrintRef}>
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
      <div style={{ display: "flex", flexFlow: "row nowrap", gap: "10px" }}>
        <button id="createNewChartBtn" onClick={onRemove}>
          Remove Graph
        </button>
        {chartDataPoint && selectedClient && (
          <>
            <button id="createNewChartBtn" onClick={exportGraph}>
              Export PDF
            </button>
            <button id="createNewChartBtn" onClick={printGraph}>
              Print
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ClientListComponent;
