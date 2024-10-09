import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChartByIdThunk } from "../../redux/charts";
import { useParams, NavLink, Navigate } from "react-router-dom";
import { getClientByIDThunk } from "../../redux/clients";
import "./daily-chart-detail.css";
import AddIntervalComp from "../AddIntervalComponent/AddIntervalComp";
import { useNavigate } from "react-router-dom";
import { returnColor } from "../helpers/returnColor";
import { useModal } from "../../context/Modal";
import DeleteIntervalModal from "../DeleteModal/DeleteIntervalModal";
import UpdateIntervalComp from "../AddIntervalComponent/UpdateIntervalComp";
import { Button, Stack, Box, Divider, Typography, Card } from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import AddIcon from "@mui/icons-material/Add";
import KeyboardBackspaceTwoToneIcon from "@mui/icons-material/KeyboardBackspaceTwoTone";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";

const DailyChartDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { chart_id } = useParams();
  const clientInfo = useSelector((state) => state?.clients?.client_by_id);
  const currentChart = useSelector((state) => state?.chart?.chart?.Chart);
  const currentIntervals = useSelector(
    (state) => state?.chart?.chart?.Chart_Intervals
  );
  const errorObject = useSelector((state) => state?.chart?.error);

  const [ratingColor, setRatingColor] = useState("white");
  const [refresh, setRefresh] = useState(true);
  const [message, setMessage] = useState("Loading...");
  const [loaded, setLoaded] = useState(false);
  const { setModalContent } = useModal();

  useEffect(() => {
    setLoaded(false);
    const getData = async () => {
      try {
        const clientData = await dispatch(getChartByIdThunk(chart_id));
        const data = await dispatch(
          getClientByIDThunk(currentChart?.client_id)
        );

        if (errorObject) {
          setLoaded(false);
          setMessage(errorObject);
        }
        if (data && clientData) {
          setLoaded(true);
        }
      } catch (error) {
        setMessage(errorObject);
        setLoaded(false);
      }

      if (currentChart) {
        const chartColor = returnColor(currentChart?.Chart_Avg_Rating, "float");
        setRatingColor(chartColor);
      }
    };
    getData();
  }, [
    dispatch,
    chart_id,
    currentChart?.id,
    currentChart?.client_id,
    currentIntervals?.length,
    ratingColor,
    currentChart?.Chart_Avg_Rating,
    refresh,
    errorObject,
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNavBack = () => {
    navigate(`/client/${clientInfo?.id}`);
  };

  const openDeleteModal = (interval) => {
    setModalContent(<DeleteIntervalModal interval={interval} />);
  };

  const openEditIntervalModal = (interval) => {
    setModalContent(
      <UpdateIntervalComp client={clientInfo} intervalToEdit={interval} />
    );
  };

  const handleCrudClick = async (interval, actionType) => {
    if (actionType === "edit") {
      openEditIntervalModal(interval);
    }
    if (actionType === "delete") {
      openDeleteModal(interval);
    }
  };

  const openAddIntModal = () => {
    setModalContent(
      <AddIntervalComp
        client={clientInfo}
        currentIntervals={currentIntervals}
      />
    );
  };

  return (
    <>
      {loaded ? (
        <div className="mainDisplayContain">
          <Card
            variant="outlined"
            sx={{ backgroundColor: "black", color: "white" }}
          >
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="h6" component="div">
                  Daily Chart Detail - {currentChart?.chart_date}
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<KeyboardBackspaceTwoToneIcon />}
                  size="small"
                  onClick={handleNavBack}
                >
                  {clientInfo?.first_name}'s Detail Page
                </Button>
              </Stack>
              <Typography variant="h6" component="div">
                Client: {clientInfo?.first_name} {clientInfo?.last_name}
              </Typography>

              <Divider sx={{ backgroundColor: "white" }} />
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="h6" component="div">
                  Number of Intervals:{" "}
                  {currentChart?.Num_Intervals
                    ? currentChart?.Num_Intervals
                    : 0}
                </Typography>
                <Typography variant="h6">
                  Avg Interval Rating:{" "}
                  {currentChart?.Chart_Avg_Rating || "No Intervals Yet"}
                </Typography>
              </Stack>
            </Box>
          </Card>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "10px 0 0 0",
            }}
          >
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PrintIcon />}
              >
                Print Chart Data
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<AttachEmailIcon />}
              >
                Email Chart Data
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={openAddIntModal}
                startIcon={<AddIcon />}
              >
                Add New Interval
              </Button>
            </Stack>
          </div>
          {currentIntervals &&
            currentIntervals?.map((interval) => {
              return (
                <div
                  key={interval?.id - interval?.chart_id}
                  className="intervalInfoContain"
                >
                  <div
                    className="intervalHeader"
                    style={{
                      borderColor: returnColor(
                        interval?.interval_rating,
                        "whole"
                      ),
                    }}
                  >
                    <label>
                      Interval Time: {interval?.start_interval} -{" "}
                      {interval?.end_interval}
                    </label>{" "}
                    |<label> Activity: {interval?.activity} </label>|
                    <label> Interval Rating: {interval?.interval_rating}</label>
                  </div>
                  <p>
                    <label>Interval Notes:</label> {interval?.interval_notes}
                  </p>
                  <label>Problem Behaviors: </label>

                  {Object.keys(interval?.interval_tags ?? {}).length ? (
                    <div className="behaviorsTag">
                      {Object.entries(interval?.interval_tags || {}).map(
                        ([behavior, count]) => (
                          <div key={behavior}>
                            <div>
                              {<strong>{behavior}</strong>}: {count}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    "None."
                  )}
                  <Stack spacing={2} direction="row" sx={{ marginTop: "10px" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleCrudClick(interval, "delete")}
                      startIcon={<DeleteForeverIcon size="large" />}
                    >
                      Delete Interval
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => handleCrudClick(interval, "edit")}
                      startIcon={<EditNoteIcon size="large" />}
                    >
                      Edit Interval
                    </Button>
                  </Stack>
                </div>
              );
            })}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "10px 0 0 0",
            }}
          >
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PrintIcon />}
              >
                Print Chart Data
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<AttachEmailIcon />}
              >
                Email Chart Data
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={openAddIntModal}
                startIcon={<AddIcon />}
              >
                Add New Interval
              </Button>
            </Stack>
          </div>
          <Card
            variant="outlined"
            sx={{ backgroundColor: "black", color: "white", marginTop: "10px" }}
          >
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="h6" component="div">
                  Daily Chart Detail - {currentChart?.chart_date}
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<KeyboardBackspaceTwoToneIcon />}
                  size="small"
                  onClick={handleNavBack}
                >
                  {clientInfo?.first_name}'s Detail Page
                </Button>
              </Stack>
              <Typography variant="h6" component="div">
                Client: {clientInfo?.first_name} {clientInfo?.last_name}
              </Typography>

              <Divider sx={{ backgroundColor: "white" }} />
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="h6" component="div">
                  Number of Intervals:{" "}
                  {currentChart?.Num_Intervals
                    ? currentChart?.Num_Intervals
                    : 0}
                </Typography>
                <Typography variant="h6">
                  Avg Interval Rating:{" "}
                  {currentChart?.Chart_Avg_Rating || "No Intervals Yet"}
                </Typography>
              </Stack>
            </Box>
          </Card>
        </div>
      ) : (
        <h2
          style={{
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
            borderRadius: "15px",
            padding: "10px 0",
          }}
        >
          {message}
        </h2>
      )}
    </>
  );
};

export default DailyChartDetail;
