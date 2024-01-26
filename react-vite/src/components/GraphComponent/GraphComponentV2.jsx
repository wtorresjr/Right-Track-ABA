import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  LineChart,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./graph-component.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import returnColor from "../helpers/returnColor";
import { getAllIntervalsThunk } from "../../redux/charts";

const GraphComponentV2 = ({
  chartDataPoint,
  selectedClient,
  selectedChartType,
  clientCharts,
}) => {
  return (
    <>
      <h1>{console.log(selectedChartType, "Chart Type From Graph Comp")}</h1>
      <h1>{console.log(clientCharts, "Client Charts from Graph Component")}</h1>
      <h1>{console.log(selectedClient, "Selected Client From Graph Comp")}</h1>
      <h1>
        {console.log(chartDataPoint, "Chart Data Point from Graph Component")}
      </h1>
      Test
    </>
  );
};

export default GraphComponentV2;
