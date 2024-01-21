import Chart, { Chart as ChartJS } from "chart.js/auto";
import { Line, Bar, Scatter, Pie } from "react-chartjs-2";
import "./graph-component.css";
import { useEffect, useState } from "react";

const GraphComponent = ({ clientCharts, chartType, chartDataPoint }) => {
  const [chartData, setChartData] = useState();

  useEffect(() => {
    if (chartDataPoint === "AVG") {
      setChartData(clientCharts);
    }
    if (chartDataPoint === "PB") {

    }
    if (chartDataPoint === "BD") {
    }
  }, [chartDataPoint]);

  const options = {
    scales: {
      y: {
        min: 0,
        max: 5,
        grid: {
          color: "grey",
        },
      },
      x: {
        grid: {
          color: "grey",
        },
      },
    },
  };

  let ChartComponent;

  switch (chartType) {
    case "Line":
      ChartComponent = Line;
      break;
    case "Bar":
      ChartComponent = Bar;
      break;
    case "Scatter":
      ChartComponent = Scatter;
      break;
    case "Pie":
      ChartComponent = Pie;
      break;
    default:
      ChartComponent = Line;
  }

  return (
    <div className="chartContain">
      <ChartComponent
        data={{
          labels: chartData?.map((chart) => chart.chart_date).reverse(),
          datasets: [
            {
              label: "Chart Avg",
              data: chartData
                ?.map((chartAvg) => chartAvg.avgForChart)
                .reverse(),
            },
          ],
        }}
        options={options}
      />
    </div>
  );
};

export default GraphComponent;
