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
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
} from "recharts";
import "./graph-component.css";
// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { returnColor } from "../helpers/returnColor";

const GraphComponentV2 = ({
  clientCharts,
  selectedChartType,
  // selectedClient,
  dataPoint,
  dataPointTwo,
  dataLabels,
  legendTitle,
  legendTitleTwo,
  chartDataPoint,
}) => {
  // const dispatch = useDispatch();

  let ChartComponent;
  let ChartElement;

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

  switch (selectedChartType) {
    case "Line":
      ChartComponent = LineChart;
      ChartElement = Line;
      break;
    case "Bar":
      ChartComponent = BarChart;
      ChartElement = Bar;
      break;
    case "Scatter":
      ChartComponent = ScatterChart;
      ChartElement = Scatter;
      break;
    case "Pie":
      ChartComponent = PieChart;
      ChartElement = Pie;
      break;
    default:
      ChartComponent = LineChart;
      ChartElement = Line;
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
          data={clientCharts}
          margin={{ top: 25, right: 50, left: 25, bottom: 25 }}
          onClick={(data) => handleClick(data)}
        >
          {chartDataPoint === "PB" && ChartComponent !== "PieChart" && (
            <>
              {Object.keys(clientCharts[0].behaviors).map((behavior) => (
                <ChartElement
                  key={behavior}
                  dataKey={`${dataPoint}.${behavior}`}
                  strokeWidth={3}
                  name={behavior}
                />
              ))}
            </>
          )}

          <ChartElement
            dataKey={dataPoint}
            strokeWidth={3}
            name={legendTitle}
            stroke="lightblue"
            fill="lightblue"
          />
          <ChartElement
            dataKey={dataPointTwo || null}
            strokeWidth={3}
            stroke="red"
            fill="red"
            name={legendTitleTwo}
          />
          <CartesianGrid stroke="#eee" strokeDasharray={(2, 2)} />
          <XAxis
            dataKey={dataLabels}
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

export default GraphComponentV2;
