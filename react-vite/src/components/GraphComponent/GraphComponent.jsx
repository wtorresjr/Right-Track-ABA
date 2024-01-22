import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  LineChart,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./graph-component.css";
import { useEffect, useState } from "react";
import returnColor from "../helpers/returnColor";

const GraphComponent = ({
  clientCharts,
  chartType,
  chartDataPoint,
  selectedClient,
}) => {
  const [chartData, setChartData] = useState({});
  // const [pbehaviorsLabels, setPbehaviorsLabels] = useState();
  // const [pbehaviorData, setPbehaviorData] = useState();

  let ChartComponent;
  let ChartElement;
  let fillType;
  let fillType2;
  let dataPt1;
  let dataPt2;
  let dataPtLabels;
  // const navigate = useNavigate();

  useEffect(() => {
    if (chartDataPoint === "AVG") {
      dataPt1 = "avgForChart";
      dataPt2 = "interval_count";
      dataPtLabels = "chart_date";
      setChartData(clientCharts);
    }

    if (chartDataPoint === "PB") {
      console.log("Client Charts", clientCharts);
      const pbChartData = clientCharts?.map((chart) => chart.chart_date);
      if (pbChartData) {
        dataPtLabels = pbChartData;
        dataPt1 = pbChartData;
        // console.log("CHart Dates", pbChartData);
        setPbehaviorData(clientCharts);
        setPbehaviorsLabels(dataPtLabels);
      }
    }

    // if (chartDataPoint === "BD") {
    // }
  }, [
    chartDataPoint,
    selectedClient,
    clientCharts,
    dataPt1,
    dataPt2,
    dataPtLabels,
  ]);

  // if (dataPtLabels) {
  //   console.log(dataPtLabels, "<-----Chart Data for PB");
  // }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          Date: {label}
          {payload.map((entry, index) => (
            <div key={index} style={{ color: `${returnColor(entry.value)}` }}>
              {entry.name}: {entry.value}
            </div>
          ))}
          <p>Click data point to view chart.</p>
        </div>
      );
    }

    return null;
  };

  switch (chartType) {
    case "Line":
      ChartComponent = LineChart;
      ChartElement = Line;
      fillType = "white";
      break;
    case "Bar":
      ChartComponent = BarChart;
      ChartElement = Bar;
      fillType = "lightblue";
      fillType2 = "red";
      break;
    default:
      ChartComponent = LineChart;
      ChartElement = Line;
      fillType = "white";
      fillType2 = "red";
      dataPt1 = "avgForChart";
      dataPt2 = "interval_count";
      dataPtLabels = "chart_date";
  }

  const handleClick = (data) => {
    if (data.activePayload) {
      const chartId = data.activePayload[0].payload.id;
      const newWindow = window.open(`/daily-chart/${chartId}`, "_blank");
      if (newWindow) {
        newWindow.focus();
      } else {
        console.error("Unable to open new window.");
      }
      return;
    }
  };

  return (
    <div className="chartContain">
      <ResponsiveContainer width="100%" height={400}>
        
        <ChartComponent
          data={chartData}
          margin={{ top: 25, right: 50, left: 25, bottom: 25 }}
          onClick={(data) => handleClick(data)}
        >
          <ChartElement
            fill={fillType}
            dataKey={dataPt1}
            strokeWidth={3}
            name="Chart Avg"
          />
          <ChartElement
            fill={fillType2}
            dataKey={dataPt2}
            strokeWidth={3}
            stroke="red"
            name="Interval Count"
          />
          <CartesianGrid stroke="#eee" strokeDasharray={(2, 2)} />
          <XAxis
            dataKey={dataPtLabels}
            reversed={true}
            interval={"preserveStartEnd"}
          />
          <YAxis
            domain={["0", "auto"]}
            interval="preserveStartEnd"
            ticks={[0, 5, 10, 15, 20]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphComponent;
