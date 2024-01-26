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
import { useDispatch } from "react-redux";
import returnColor from "../helpers/returnColor";
import { getAllIntervalsThunk } from "../../redux/charts";

const GraphComponent = ({
  clientCharts,
  chartType,
  chartDataPoint,
  selectedClient,
  dataPoint,
  dataPointTwo,
  dataLabels,
}) => {
  const [chartData, setChartData] = useState();
  const dispatch = useDispatch();

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
      // console.log(+selectedClient, "Selected Client");
      const getTheData = async () => {
        const behaviorData = await dispatch(
          getAllIntervalsThunk(+selectedClient)
        );
        if (behaviorData) {
          dataPtLabels = "chart_date";
          dataPt1 = "behaviors";
          setChartData(behaviorData);
          console.log(behaviorData);
        }
      };
      getTheData();
    }
  }, [
    chartDataPoint,
    selectedClient,
    clientCharts,
    dataPt1,
    dataPt2,
    dataPtLabels,
    chartType,
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
      dataPt1 = "avgForChart";
      dataPt2 = "interval_count";
      dataPtLabels = "chart_date";
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
