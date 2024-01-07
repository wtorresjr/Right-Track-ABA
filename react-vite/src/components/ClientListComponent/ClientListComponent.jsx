import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientsThunk, getClientByIDThunk } from "../../redux/clients";
import "../CreateDailyChart/create-daily-chart.css";
import ChartSlimComponent from "./ChartSlimComponent";
import ChartComponent from "../ChartComponent/ChartComponent";

const ClientListComponent = () => {
  const dispatch = useDispatch();
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientCharts, setClientCharts] = useState();
  const clientList = useSelector((state) => state?.clients?.clients?.Clients);

  useEffect(() => {
    dispatch(getClientsThunk());
  }, [dispatch]);

  useEffect(() => {
    const findClientCharts = async () => {
      const clientData = await dispatch(getClientByIDThunk(selectedClient));
      if (clientData.ok) {
        setClientCharts(clientData.payload);
        console.log(clientData.payload);
      }
    };
    findClientCharts(selectedClient);
  }, [dispatch, selectedClient]);

  return (
    <div>
      <div className="newChartMenu">
        <select
          id="dcClientSelect"
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <option>View Charts For...</option>
          {clientList &&
            clientList.map((client) => {
              return (
                <option key={client?.id} value={client?.id}>
                  {client?.first_name} {client?.last_name} --- DOB:{" "}
                  {client?.dob}
                </option>
              );
            })}
        </select>
      </div>
      {clientCharts ? (
        <ChartComponent clientCharts={clientCharts.Daily_Charts} />
      ) : (
        ""
      )}
      {clientCharts ? (
        clientCharts.Daily_Charts.map((chart) => {
          return (
            <div key={chart.id}>
              <ChartSlimComponent chart={chart} />
            </div>
          );
        })
      ) : (
        <p className="errorsPtag">{"No client selected"}</p>
      )}
    </div>
  );
};

export default ClientListComponent;
