import "./daily-chart.css";

const LegendComponent = () => {
  return (
    <div id="legend">
      <h3>Behavior Legend</h3>
      <div id="colors">
        <div className="color" style={{ backgroundColor: "white", color:"black" }}>Incomplete
        </div>
        <div className="color" style={{ backgroundColor: "red" }}>
          Poor
        </div>
        <div className="color" style={{ backgroundColor: "Orange" }}></div>
        <div className="color" style={{ backgroundColor: "yellow" }}></div>
        <div className="color" style={{ backgroundColor: "yellowgreen" }}></div>
        <div className="color" style={{ backgroundColor: "green" }}>
          Great
        </div>
      </div>
    </div>
  );
};

export default LegendComponent;
