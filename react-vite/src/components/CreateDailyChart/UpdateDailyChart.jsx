import { useDispatch, useSelector } from "react-redux";
import { getClientsThunk } from "../../redux/clients";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./create-daily-chart.css";
import { useModal } from "../../context/Modal";
import ConfirmModal from "./ConfirmModal";

import {
  Typography,
  Stack,
  Button,
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  TextField,
} from "@mui/material";

const UpdateDailyChart = ({ dc }) => {
  // const navigate = useNavigate();
  const { setModalContent } = useModal();
  const { client_id } = useParams();
  const { closeModal } = useModal();
  const [selectedClient, setSelectedClient] = useState(client_id);
  const [isDisabled, setIsDisabled] = useState(true);
  const [todaysDate, setTodaysDate] = useState(dc?.chart_date);

  const [errors, setErrors] = useState({});
  // const [clientName, setClientName] = useState();
  const currentClient = useSelector((state) => state?.clients?.client_by_id);
  const clientList = useSelector((state) => state?.clients?.clients?.Clients);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClientsThunk());
  }, [client_id]);

  const errorCollector = {};
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(todaysDate);
    selectedDate.setHours(24, 0, 0, 0);

    if (selectedDate.getTime() > today.getTime()) {
      errorCollector.date = "Chart date cannot be in the future";
    }

    setErrors(errorCollector);

    if (!Object.keys(errorCollector).length) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [dispatch, todaysDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startNewChart = {
      chart_date: todaysDate,
      client_id: selectedClient,
    };

    setModalContent(
      <ConfirmModal
        infoToUpdate={startNewChart}
        dc={dc}
        clientList={clientList}
      />
    );
  };

  return (
    <Stack padding={2} spacing={1}>
      <Typography variant="h5" textAlign="center">
        Update Daily Chart
      </Typography>

      {currentClient && !currentClient?.message ? (
        <div>
          <Stack direction="column" spacing={2}>
            <input
              id="dateInput"
              type="date"
              value={todaysDate}
              onChange={(e) => setTodaysDate(e.target.value)}
            />
            {errors && errors.date && (
              <Typography sx={{ color: "red" }}>{errors.date} </Typography>
            )}

            <Box sx={{ marginBottom: "10px" }} width="40ch">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Client</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedClient || "Select Client"}
                  label="Client"
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  {clientList &&
                    clientList?.map((client) => {
                      return (
                        <MenuItem key={client?.id} value={client?.id}>
                          {client?.first_name} {client?.last_name} --- DOB:{" "}
                          {client?.dob}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Box>

            <Stack direction="row" justifyContent="space-between">
              <Button
                disabled={isDisabled}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Update Chart
              </Button>
              <Button
                onClick={() => closeModal()}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </div>
      ) : (
        <h1>{currentClient?.message}</h1>
      )}
    </Stack>
    // <div className="newChartModal">
    //   <h1>Update Daily Chart</h1>
    //   {currentClient?.Incomplete_Charts &&
    //     currentClient?.Incomplete_Charts?.map((incChart) => {
    //       return (
    //         <div key={incChart?.id}>
    //           <label>Incomplete Charts for {currentClient?.first_name}: </label>
    //           <NavLink
    //             to={`/daily-chart/${incChart?.id}`}
    //             className="navLinkStyle"
    //           >
    //             {incChart?.chart_date}
    //           </NavLink>
    //         </div>
    //       );
    //     })}

    //   {currentClient && !currentClient?.message ? (
    //     <div>
    //       <div className="newChartMenu">
    //         <form onSubmit={handleSubmit}>
    //           <input
    //             id="dateInput"
    //             type="date"
    //             value={todaysDate}
    //             onChange={(e) => setTodaysDate(e.target.value)}
    //           />
    //           <select
    //             id="clientSelector"
    //             value={selectedClient || "Select Client"}
    //             onChange={(e) => setSelectedClient(e.target.value)}
    //           >
    //             {clientList &&
    //               clientList.map((client) => {
    //                 return (
    //                   <option key={client?.id} value={client?.id}>
    //                     {client?.first_name} {client?.last_name} --- DOB:{" "}
    //                     {client?.dob}
    //                   </option>
    //                 );
    //               })}
    //           </select>
    //           <div className="createBtnsDiv">
    //             <button id="createChartBtn" disabled={isDisabled}>
    //               Update Chart
    //             </button>
    //             <button id="cancelBtn" onClick={() => closeModal()}>
    //               Cancel
    //             </button>
    //           </div>
    //         </form>
    //       </div>
    //       {errors && errors.date && <p className="errorsPtag">{errors.date}</p>}
    //     </div>
    //   ) : (
    //     <h1>{currentClient?.message}</h1>
    //   )}
    // </div>
  );
};

export default UpdateDailyChart;
