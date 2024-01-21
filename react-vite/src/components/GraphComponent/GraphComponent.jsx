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

const GraphComponent = ({
  clientCharts,
  chartType,
  chartDataPoint,
  selectedClient,
}) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (chartDataPoint === "AVG") {
      setChartData(clientCharts);
    }

    // if (chartDataPoint === "PB") {
    //   const pbChartData = {
    //     labels: clientCharts
    //       ?.map((chart) => chart.intervals.map((interval) => interval.activity))
    //       .reverse(),
    //     datasets: clientCharts
    //       ?.map((chart) =>
    //         chart.intervals.map((interval) => interval.interval_rating)
    //       )
    //       .reverse(),
    //   };

    //   setChartData(pbChartData);
    // }

    // if (chartDataPoint === "BD") {
    // }
  }, [chartDataPoint, selectedClient, clientCharts]);

  if (chartData) {
    console.log(chartData, "<-----Chart Data for PB");
  }

  let ChartComponent;
  let ChartElement;
  let fillType;
  let fillType2;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          Date: {label}
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </div>
          ))}
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
  }

  return (
    <div className="chartContain">
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent
          data={chartData}
          margin={{ top: 25, right: 50, left: 25, bottom: 25 }}
        >
          <ChartElement
            fill={fillType}
            dataKey="avgForChart"
            strokeWidth={3}
            name="Chart Avg"
          />
          <ChartElement
            fill={fillType2}
            dataKey="interval_count"
            strokeWidth={3}
            stroke="red"
            name="Interval Count"
          />
          <CartesianGrid stroke="#ccc" strokeDasharray={(2, 2)} />
          <XAxis
            dataKey="chart_date"
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
