import { returnColor } from "../helpers/returnColor";
import { useEffect, useState } from "react";

const InfoBar = ({
  clientCharts,
  numOfCharts,
  searchFilter,
  filteredAvg,
  filteredCharts,
  type,
}) => {
  const [barType, setBarType] = useState();
  const [allAvg, setAllAvg] = useState();
  const [filteredAvgType, setFilteredAvgType] = useState();

  useEffect(() => {
    if (type === "dailyCharts") {
      setBarType("Total Charts:");
      setAllAvg("Avg For All Charts:");
      setFilteredAvgType("Avg For Displayed Charts:");
    }
    if (type === "discreetTrials") {
      setBarType("Total Trials:");
      setAllAvg("Avg For All Trials:");
      setFilteredAvgType("Avg For Displayed DTs:");
    }
  }, []);

  return (
    <div
      className="chartTotalsContain"
      style={{
        border: `3px solid ${returnColor(clientCharts?.All_Charts_Avg)}`,
      }}
    >
      <div>
        {barType} {numOfCharts}
        {searchFilter ? ` (${filteredCharts?.length} - Filtered)` : ""}
      </div>

      <div style={{ color: returnColor(clientCharts?.All_Charts_Avg) }}>
        {allAvg} {clientCharts?.All_Charts_Avg}
      </div>
      <div style={{ color: returnColor(clientCharts?.Paginated_Charts_Avg) }}>
        {filteredAvgType} {filteredAvg || clientCharts?.Paginated_Charts_Avg}
      </div>
    </div>
  );
};

export default InfoBar;
