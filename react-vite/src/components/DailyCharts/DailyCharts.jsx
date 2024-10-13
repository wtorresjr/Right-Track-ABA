import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./daily-chart.css";
import LegendComponent from "./LegendComponent";
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

import {
  Button,
  Stack,
  Typography,
  TextField,
  Box,
  Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

const DailyCharts = ({ clientCharts }) => {
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
        direction="row"
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
          color="warning"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateChartModal}
        >
          Create New Chart
        </Button>
      </Stack>
      {numOfCharts > 0 ? (
        <div className="chartsContain">
          <TextField
            fullWidth
            id="outlined-basic"
            variant="outlined"
            placeholder="Search Daily Charts"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            sx={{
              marginBottom: "10px",
              input: { color: "white" }, // Change input text color to white
              "& .MuiInputLabel-root": { color: "white" }, // Change label color
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white", // Change border color
                },
                "&:hover fieldset": {
                  borderColor: "white", // Border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white", // Border color when focused
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
            <Stack direction="column">
              {filteredCharts &&
                filteredCharts?.map((dc) => {
                  dayColorRating = returnColor(dc?.avgForChart, "float");

                  if (dc) {
                    dc?.chart_complete === false
                      ? (dayColorRating = "white")
                      : null;

                    return (
                      <Box
                        key={dc?.id}
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          border: "2px solid",
                          borderColor: "gray",
                          borderRadius: 2,
                          bgcolor: "black",
                          color: "white",
                          marginBottom: "10px",
                          "& svg": {
                            m: 1,
                          },
                        }}
                      >
                        <Button
                          color="error"
                          onClick={() => {
                            openDeleteModal(dc);
                          }}
                        >
                          Delete
                        </Button>
                        <Divider
                          orientation="vertical"
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
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          sx={{ backgroundColor: "grey" }}
                        />
                        <Typography sx={{ padding: "5px" }}>
                          Date: {dc?.chart_date}
                        </Typography>
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          sx={{ backgroundColor: "grey" }}
                        />
                        <Typography sx={{ padding: "5px" }}>
                          Total Intervals: {dc?.interval_count}
                        </Typography>
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          sx={{ backgroundColor: "grey" }}
                        />
                        <Typography sx={{ padding: "5px" }}>
                          Rating: {dc?.avgForChart.toFixed(1)}
                        </Typography>
                        <Divider
                          orientation="vertical"
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
                      </Box>
                    );
                  }
                  return null;
                })}
            </Stack>
          ) : (
            <div className="pagLoadingDiv">
              <h2>Loading Charts...</h2>
            </div>
          )}
        </div>
      ) : (
        <h2
          style={{
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
            borderRadius: "15px",
            padding: "10px 0",
            width: "100%",
          }}
        >
          No Daily Charts Yet.
        </h2>
      )}
    </>
  );
};

export default DailyCharts;
