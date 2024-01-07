import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import "./chart-component.css";

const ChartComponent = ({ clientCharts }) => {
  const options = {
    scales: {
      y: {
        min: 0,
        max: 5,
        grid: {
          color: "grey",
        },
      },
    },
  };
  return (
    <div className="chartContain">
      <Line
        data={{
          labels: clientCharts.map((chart) => chart.chart_date),
          datasets: [
            {
              label: "Chart Avg",
              data: clientCharts.map((chartAvg) => chartAvg.avgForChart),
            },
          ],
        }}
        options={options}
      />
    </div>
  );
};

export default ChartComponent;
