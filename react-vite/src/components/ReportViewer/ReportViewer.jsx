import "./daily-chart-all.css";
import { ClientListComponent } from "../ClientListComponent";

const ReportViewer = () => {
  return (
    <div className="mainDisplayContain">
      <h1>Report Viewer</h1>

      <ClientListComponent />
    </div>
  );
};

export default ReportViewer;
