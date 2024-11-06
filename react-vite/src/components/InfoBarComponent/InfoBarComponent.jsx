import { returnColor } from "../helpers/returnColor";
import { useEffect, useState } from "react";

import { Stack, Chip, Typography } from "@mui/material";
import { useIsSmallScreen } from "../helpers";

const InfoBar = ({
  clientCharts,
  numOfCharts,
  searchFilter,
  filteredAvg,
  filteredCharts,
  type,
}) => {
  const isSmallScreen = useIsSmallScreen();
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
    <Stack
      direction={isSmallScreen ? "column" : "row"}
      justifyContent={isSmallScreen ? "center" : "space-between"}
      textAlign="center"
      style={{
        padding: "10px",
        backgroundColor: "black",
        borderRadius: "10px",
        border: `2px solid ${
          type === "dailyCharts"
            ? returnColor(clientCharts?.All_Charts_Avg)
            : "white"
        }`,
      }}
    >
      <Typography>
        {barType} {numOfCharts}
        {searchFilter ? ` (${filteredCharts?.length} - Filtered)` : ""}
      </Typography>
      {type === "dailyCharts" ? (
        <Typography
          style={{ color: returnColor(clientCharts?.All_Charts_Avg) }}
        >
          {allAvg} {clientCharts?.All_Charts_Avg}
        </Typography>
      ) : (
        ""
      )}
      {type === "dailyCharts" ? (
        <Typography
          style={{ color: returnColor(clientCharts?.Paginated_Charts_Avg) }}
        >
          {filteredAvgType} {filteredAvg || clientCharts?.Paginated_Charts_Avg}
        </Typography>
      ) : (
        ""
      )}
    </Stack>
  );
};

export default InfoBar;
