import "./chart-slim.css";

const ChartSlimComponent = ({ chart }) => {
  return (
    <div className="slimDivContain">
      <div className="slimDiv">{chart.avgForChart}</div>
    </div>
  );
};
export default ChartSlimComponent;
