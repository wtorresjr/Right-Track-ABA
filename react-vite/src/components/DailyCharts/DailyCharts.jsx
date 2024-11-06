import React, { useEffect, useState } from "react";
import "./daily-chart.css";
import { useModal } from "../../context/Modal";
import { DeleteChartModal } from "../DeleteModal";
import { CreateDailyChart, UpdateDailyChart } from "../CreateDailyChart";
import { returnColor } from "../helpers/returnColor";
import { useSelector, useDispatch } from "react-redux";
import { getClientByIDThunk } from "../../redux/clients";
import Paginator from "../PaginationComp/Paginator";
import "../PaginationComp/bootstrap.css";
import InfoBar from "../InfoBarComponent";
import { useNavigate } from "react-router-dom";
import { useIsSmallScreen } from "../helpers";

import {
  Button,
  Stack,
  Typography,
  TextField,
  Divider,
  Rating,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

const DailyCharts = ({ clientCharts }) => {
  const isSmallScreen = useIsSmallScreen();
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredCharts, setFilteredCharts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [filteredAvg, setFilteredAvg] = useState();
  const [allCharts, setAllCharts] = useState();
  const [pagLoading, setPagLoading] = useState(false);
  const navigate = useNavigate();

  const numOfCharts = useSelector(
    (state) => state?.clients?.client_by_id?.Num_Of_Charts
  );

  const handleNav = (chartId) => {
    navigate(`/daily-chart/${chartId}`);
  };

  useEffect(() => {
    setPagLoading(false);
    const getAllCharts = async () => {
      const allData = await dispatch(
        getClientByIDThunk(clientCharts?.id, 1, 1000)
      );

      if (allData?.ok) {
        setAllCharts(allData?.payload);
      }
    };

    if (searchFilter.length) {
      getAllCharts();
    }

    const getData = async () => {
      try {
        const data = await dispatch(
          getClientByIDThunk(clientCharts?.id, currentPage, perPage)
        );

        if (data?.ok) {
          setFilteredCharts(data?.payload?.Daily_Charts || []);
          setPagLoading(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!searchFilter.length) {
      getData();
    }

    const dateResults = allCharts?.Daily_Charts?.filter((charts) =>
      Object.values(charts).some(
        (value) =>
          typeof value === "string" &&
          value?.toLowerCase().includes(searchFilter?.toLowerCase())
      )
    );

    if (dateResults) {
      let avgTotals = 0;

      for (let chart of dateResults) {
        avgTotals += chart.avgForChart;
      }

      let filtChartAvg = (avgTotals / dateResults.length).toFixed(2);

      isNaN(filtChartAvg)
        ? setFilteredAvg("No Charts")
        : setFilteredAvg(filtChartAvg);

      setFilteredCharts(dateResults);
      setPagLoading(true);
    }
  }, [searchFilter, currentPage, perPage, clientCharts?.id, numOfCharts]);

  useEffect(() => {
    let avgTotals = 0;

    if (filteredCharts) {
      for (let chart of filteredCharts) {
        avgTotals += chart.avgForChart;
      }
      let filtChartAvg = (avgTotals / filteredCharts.length).toFixed(2);
      isNaN(filtChartAvg)
        ? setFilteredAvg("No Charts")
        : setFilteredAvg(filtChartAvg);
    }
  }, [filteredCharts]);

  const openDeleteModal = (chart) => {
    setModalContent(<DeleteChartModal chartInfo={chart} />);
  };

  const openCreateChartModal = () => {
    setModalContent(<CreateDailyChart />);
  };

  const openUpdateChartModal = (dc) => {
    setModalContent(<UpdateDailyChart dc={dc} />);
  };

  let dayColorRating;

  const handlePageChange = (pageNumber, rowsPerPage) => {
    setCurrentPage(pageNumber);
    setPerPage(rowsPerPage);
  };

  return (
    <>
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          margin: "10px 0",
        }}
      >
        <Typography variant="h5">Daily Performance Charts</Typography>
        <Button
          sx={isSmallScreen ? { width: "100%", marginTop: "5px" } : {}}
          color="warning"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateChartModal}
        >
          New Chart
        </Button>
      </Stack>
      {numOfCharts > 0 ? (
        <Stack>
          <TextField
            fullWidth
            id="outlined-basic"
            variant="outlined"
            placeholder="Search Daily Charts"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            sx={{
              marginBottom: "10px",
              input: { color: "white" },
              "& .MuiInputLabel-root": { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
          />

          <InfoBar
            clientCharts={clientCharts}
            numOfCharts={numOfCharts}
            searchFilter={searchFilter}
            filteredAvg={filteredAvg}
            filteredCharts={filteredCharts}
            type={"dailyCharts"}
          />
          <Paginator
            numOfCharts={numOfCharts}
            perPage={perPage}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
          {pagLoading ? (
            <Stack direction="column" width="100%">
              {filteredCharts &&
                filteredCharts?.map((dc) => {
                  dayColorRating = returnColor(dc?.avgForChart, "float");

                  if (dc) {
                    dc?.chart_complete === false
                      ? (dayColorRating = "white")
                      : null;

                    return (
                      <Stack
                        key={dc?.id}
                        width="100%"
                        direction={isSmallScreen ? "column" : "row"}
                        sx={{
                          justifyContent: "space-between",
                          border: "2px solid",
                          borderColor: "gray",
                          borderRadius: 2,
                          bgcolor: "black",
                          color: "white",
                          marginBottom: "10px",
                          padding: "5px",
                          textAlign: "center",
                          alignItems: "center",

                          "& svg": {
                            m: 1,
                          },
                        }}
                      >
                        <Typography sx={{ padding: "5px" }}>
                          {dc?.chart_date}
                        </Typography>
                        <Divider
                          orientation={
                            isSmallScreen ? "horizontal" : "vertical"
                          }
                          variant="middle"
                          flexItem
                          sx={{ backgroundColor: "grey" }}
                        />
                        <Typography sx={{ padding: "5px" }}>
                          Total Intervals: {dc?.interval_count}
                        </Typography>
                        <Divider
                          orientation={
                            isSmallScreen ? "horizontal" : "vertical"
                          }
                          variant="middle"
                          flexItem
                          sx={{ backgroundColor: "grey" }}
                        />
                        <Stack
                          direction={isSmallScreen ? "row" : "column"}
                          justifyContent="center"
                        >
                          {(
                            <Rating
                              sx={{
                                color: `${returnColor(
                                  dc?.avgForChart.toFixed(1)
                                )}`,
                              }}
                              size="small"
                              readOnly
                              precision={0.1}
                              name="simple-controlled"
                              value={dc?.avgForChart.toFixed(1)}
                            />
                          ) || "0"}
                          <Typography
                            sx={{ padding: "5px", alignContent: "center" }}
                          >
                            {dc?.avgForChart.toFixed(1)}
                          </Typography>
                        </Stack>
                        <Divider
                          orientation={
                            isSmallScreen ? "horizontal" : "vertical"
                          }
                          variant="middle"
                          flexItem
                          sx={{ backgroundColor: "grey" }}
                        />
                        <Button
                          color="error"
                          onClick={() => {
                            openDeleteModal(dc);
                          }}
                        >
                          Delete
                        </Button>
                        <Divider
                          orientation={
                            isSmallScreen ? "horizontal" : "vertical"
                          }
                          variant="middle"
                          flexItem
                          sx={{ backgroundColor: "grey" }}
                        />
                        <Button
                          color="warning"
                          onClick={() => {
                            openUpdateChartModal(dc);
                          }}
                        >
                          Edit
                        </Button>
                        <Divider
                          orientation={
                            isSmallScreen ? "horizontal" : "vertical"
                          }
                          variant="middle"
                          flexItem
                          sx={{ backgroundColor: "grey" }}
                        />
                        <Button
                          onClick={() => {
                            handleNav(dc?.id);
                          }}
                        >
                          View Chart
                        </Button>
                      </Stack>
                    );
                  }
                  return null;
                })}
            </Stack>
          ) : (
            <div className="pagLoadingDiv">
              <Typography variant="h5">Loading Charts...</Typography>
            </div>
          )}
        </Stack>
      ) : (
        <Typography
          style={{
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
            borderRadius: "15px",
            padding: "10px 0",
            width: "100%",
            marginBottom: "10px",
          }}
        >
          No Daily Charts Yet.
        </Typography>
      )}
    </>
  );
};

export default DailyCharts;
