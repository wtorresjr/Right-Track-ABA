import "./chart-slim.css";

const ChartSlimComponent = ({ chart }) => {
  return (
    <div className="slimDivContain">
      <div className="slimDiv">
        <label>Chart Date:</label>
        {chart.chart_date}
      </div>
      <div className="slimDiv">{chart.avgForChart}</div>
    </div>
  );
};

export default ChartSlimComponent;

