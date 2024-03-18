import React, { useState } from "react";
import "./report-viewer.css";
import { ClientListComponent } from "../ClientListComponent";

const ReportViewer = () => {
  const [graphComponents, setGraphComponents] = useState([]);

  const addGraph = () => {
    setGraphComponents((prevGraphs) => [
      ...prevGraphs,
      <ClientListComponent key={prevGraphs.length} />,
    ]);
  };

  return (
    <div className="mainDisplayContain">
      <div className="addGraphButton">
        <h1>Report Viewer</h1>
        <button id="createNewChartBtn" onClick={addGraph}>
          Add New Graph
        </button>
      </div>

      {graphComponents.map((graph, index) => (
        <div key={index}>{graph}</div>
      ))}
    </div>
  );
};

export default ReportViewer;
