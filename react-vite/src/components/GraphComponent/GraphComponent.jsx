import { Chart as ChartJS } from "chart.js/auto";
import { Line, Bar, Scatter, Pie } from "react-chartjs-2";
import "./graph-component.css";
import { useState } from "react";

const GraphComponent = ({ clientCharts, chartType }) => {
  console.log(clientCharts);
  const [selectedChartType, setChartType] = useState(Line);
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
  return (
    <div className="chartContain">
      <Bar
        data={{
          labels: clientCharts.map((chart) => chart.chart_date).reverse(),
          datasets: [
            {
              label: "Chart Avg",
              data: clientCharts
                .map((chartAvg) => chartAvg.avgForChart)
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
