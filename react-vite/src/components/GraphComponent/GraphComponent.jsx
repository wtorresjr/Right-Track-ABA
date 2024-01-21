import Chart, { Chart as ChartJS } from "chart.js/auto";
import { Line, Bar, Scatter, Pie } from "react-chartjs-2";
import "./graph-component.css";
import { useEffect, useState } from "react";

const GraphComponent = ({
  clientCharts,
  chartType,
  chartDataPoint,
  selectedClient,
}) => {
  const [chartData, setChartData] = useState();

  useEffect(() => {
    if (chartDataPoint === "AVG") {
      setChartData(clientCharts);
    }
    if (chartDataPoint === "PB") {
      console.log(clientCharts, "Selected BP Client Charts");
      // const intervalData = [];
      // clientCharts?.map((chart) => {
      //   chart["intervals"].map((intervalTags) => {
      //     console.log(intervalTags);
      //     // intervalTags.push(intervalTags);
      //   });

      //   intervalData;
      // });
    }
    if (chartDataPoint === "BD") {
    }
    return;
  }, [chartDataPoint, selectedClient]);

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
