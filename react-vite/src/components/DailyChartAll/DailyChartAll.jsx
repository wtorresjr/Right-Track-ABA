import "./daily-chart-all.css";
import { ClientListComponent } from "../ClientListComponent";

const DailyChartAll = () => {
  return (
    <div className="mainDisplayContain">
      <h1>Daily Charts Viewer</h1>

      <ClientListComponent />
    </div>
  );
};

export default DailyChartAll;
