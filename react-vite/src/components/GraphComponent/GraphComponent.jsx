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

  switch (chartType) {
    case "Line":
      ChartComponent = LineChart;
      ChartElement = Line;
      fillType = "white";
      break;
    case "Bar":
      ChartComponent = BarChart;
      ChartElement = Bar;
      fillType = "blue";
      break;
    default:
      ChartComponent = LineChart;
      ChartElement = Line;
      fillType = "white";
  }

  return (
    <div className="chartContain">
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={chartData}>
          <ChartElement
            // type="monotone"
            fill={fillType}
            dataKey="avgForChart"
          />
          <CartesianGrid stroke="#ccc" strokeDasharray={(2, 2)} />
          <XAxis dataKey="chart_date" reversed={true} />
          <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
          <Tooltip />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphComponent;
