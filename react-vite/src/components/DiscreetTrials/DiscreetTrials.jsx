import { useParams } from "react-router-dom";
import "../DailyCharts/daily-chart.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { getAllDTsThunk } from "../../redux/dts";
import { returnPercentColor } from "../helpers/returnColor";
import { useNavigate } from "react-router-dom";
import { DeleteChartModal } from "../DeleteModal";
import { useModal } from "../../context/Modal";
import CreateDailyChart from "../CreateDailyChart/CreateDailyChart";
import Paginator from "../PaginationComp/Paginator";
import "../PaginationComp/bootstrap.css";

import {
  Button,
  Stack,
  Typography,
  TextField,
  Box,
  Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

const DiscreetTrials = () => {
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const { client_id } = useParams();
  const dispatch = useDispatch();
  const clientDT = useSelector((state) => state?.dt?.Discreet_Trials);
  const dtCount = useSelector(
    (state) => state?.clients?.client_by_id?.Total_DTs
  );
  const [totalDTs, setTotalDTs] = useState();
  const [pagLoaded, setPagLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  useEffect(() => {
    setPagLoaded(false);
    const getDTdata = async () => {
      const thunkLoaded = await dispatch(
        getAllDTsThunk(+client_id, currentPage, perPage)
      );
      if (thunkLoaded) {
        setPagLoaded(true);
      }
    };

    getDTdata();
  }, [currentPage, perPage, client_id]);

  useEffect(() => {
    setTotalDTs(dtCount);
  }, [dtCount]);

  const openDeleteModal = (chart) => {
    setModalContent(<DeleteChartModal chartInfo={chart} typeToDelete={"DT"} />);
  };

  const openCreateDTModal = () => {
    setModalContent(<CreateDailyChart isDT={"True"} />);
  };

  const openUpdateChartModal = (dt) => {
    setModalContent(
      <CreateDailyChart isDTupdate={"True"} isDT={"True"} dtInfo={dt} />
    );
  };

  const handlePageChange = (pageNumber, rowsPerPage) => {
    setCurrentPage(pageNumber);
    setPerPage(rowsPerPage);
  };

  const handleNav = (dtId) => {
    navigate(`/discreet-trial/${dtId}`);
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
        <Typography variant="h5">Discreet Trials</Typography>
        <Button
          color="warning"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDTModal}
        >
          Create New Trial
        </Button>
      </Stack>
      {dtCount > 0 ? (
        <div className="chartsContain">
          <Paginator
            numOfCharts={totalDTs}
            perPage={perPage}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
          {pagLoaded ? (
            <Stack direction="column" width="100%">
              {clientDT &&
                clientDT.map((dt) => (
                  <Box
                    key={dt?.id}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      border: "2px solid",
                      borderColor: "gray",
                      borderRadius: 2,
                      bgcolor: "black",
                      color: "white",
                      marginBottom: "10px",
                      justifyContent:"space-between",
                      "& svg": {
                        m: 1,
                      },
                    }}
                  >
                    <Button
                      color="error"
                      onClick={() => {
                        openDeleteModal(dt);
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
                        openUpdateChartModal(dt);
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
                      {dt?.trial_date}
                    </Typography>
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ backgroundColor: "grey" }}
                    />
                    <Typography sx={{ padding: "5px" }}>
                      {dt?.program_name}
                    </Typography>
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ backgroundColor: "grey" }}
                    />
                    <Typography sx={{ padding: "5px" }}>
                      Mastery: {dt?.trials_avg.toFixed(1)}
                    </Typography>
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ backgroundColor: "grey" }}
                    />
                    <Button
                      onClick={() => {
                        handleNav(dt?.id);
                      }}
                    >
                      View Chart
                    </Button>
                  </Box>
                ))}
            </Stack>
          ) : (
            <div className="pagLoadingDiv">
              <h2>Loading Trials...</h2>
            </div>
          )}
        </div>
      ) : (
        <Typography
          style={{
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
            borderRadius: "15px",
            padding: "10px 0",
            width: "100%",
            marginBottom: "5px",
          }}
        >
          No Discreet Trials Yet.
        </Typography>
      )}
    </>
  );
};

export default DiscreetTrials;
