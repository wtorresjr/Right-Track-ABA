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
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (chartDataPoint === "AVG") {
      const chartAvgs = clientCharts
        ?.map((chart) => chart.avgForChart)
        .reverse();
      const chartDates = clientCharts
        ?.map((chart) => chart.chart_date)
        .reverse();
      setChartData({ avgs: chartAvgs, dates: chartDates });
    }

    if (chartDataPoint === "PB") {
      const pbChartData = {
        labels: clientCharts
          ?.flatMap((chart) =>
            chart.intervals.map((interval) => interval.activity)
          )
          .reverse(),
        datasets: Object.keys(
          clientCharts
            ?.flatMap((chart) =>
              chart.intervals.map((interval) => interval.interval_tags)
            )
            .reduce((acc, tags) => {
              Object.keys(tags).forEach((tag) => {
                acc[tag] = true;
              });
              return acc;
            }, {})
        ).map((tag) => ({
          label: tag,
          data: clientCharts
            ?.flatMap((chart) =>
              chart.intervals.map((interval) =>
                interval.interval_tags[tag] !== undefined
                  ? interval.interval_tags[tag]
                  : 0
              )
            )
            .reduce((acc, values) => acc.concat(values), []) // Flatten nested arrays
            .map((value) => ({ y: value })) // Wrap each value in an object to meet Chart.js expectations
            .reverse(),
        })),
      };

      setChartData(pbChartData);
    }

    if (chartDataPoint === "BD") {
    }
  }, [chartDataPoint, selectedClient, clientCharts]);

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
      {chartDataPoint === "AVG" ? (
        <ChartComponent
          data={{
            labels: chartData["dates"],
            datasets: [
              {
                label: "Chart Avg",
                data: chartData["avgs"],
              },
            ],
          }}
          options={options}
        />
      ) : (
        ""
      )}{" "}
      {chartDataPoint === "PB" ? (
        <ChartComponent
          data={{
            labels: chartData["activity"],
            // ?.map((chart) => chart.activity).reverse(),
            datasets: [
              {
                label: "Interval Avg",
                data: chartData["interval_tags"],
                // ?.map((interval) => interval.interval_tags)
                // .reverse(),
              },
            ],
          }}
          options={options}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default GraphComponent;
