import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { getClientByIDThunk } from "../../redux/clients";
import { useModal } from "../../context/Modal";
import "./client-details.css";
import { DailyCharts } from "../DailyCharts";
import { DiscreetTrials } from "../DiscreetTrials";
import DeleteModal from "../DeleteModal/DeleteModal";
import UpdateClientModal from "../UpdateClientModal/UpdateClientModal";
import { useNavigate } from "react-router-dom";

import { useIsSmallScreen } from "../helpers";

import {
  Button,
  Divider,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import KeyboardBackspaceTwoToneIcon from "@mui/icons-material/KeyboardBackspaceTwoTone";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ClientDetails = () => {
  const isSmallScreen = useIsSmallScreen();
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const { client_id } = useParams();
  const client = useSelector((state) => state?.clients?.client_by_id);

  useEffect(() => {
    setLoaded(false);
    let data = "";
    const getData = async () => {
      if (client_id) {
        try {
          const data = await dispatch(getClientByIDThunk(client_id));
          if (data?.ok) {
            setLoaded(true);
          }
          if (data?.payload?.message) {
            setMessage(data?.payload?.message);
            setLoaded(false);
          }
        } catch (error) {
          setMessage(data?.payload?.message);
          setLoaded(false);
        }
      }
    };
    getData();
  }, [client_id, message]);

  const openDeleteModal = () => {
    setModalContent(<DeleteModal client={client} trigger={"ClientDetails"} />);
  };
  const openEditModal = () => {
    setModalContent(
      <UpdateClientModal client={client} trigger={"ClientDetails"} />
    );
  };

  const handleNavBack = () => {
    navigate("/manage-clients");
  };

  return (
    <>
      {loaded && client ? (
        <div className="mainDisplayContain" id="clientDetails">
          <Stack
            direction={isSmallScreen ? "column" : "row"}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">
              {client?.last_name}, {client?.first_name}
            </Typography>
            <Button
              sx={isSmallScreen ? { width: "100%", marginTop: "10px" } : {}}
              variant="contained"
              startIcon={<KeyboardBackspaceTwoToneIcon />}
              onClick={handleNavBack}
            >
              Manage Clients
            </Button>
          </Stack>

          <Accordion
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "10px",
              margin: "10px 0",
              width: "100%",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            >
              {`${client?.first_name}'s Details`}
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Client Notes: {client?.client_notes}</Typography>
              <Typography>Guardian Email: {client?.guardian_email}</Typography>
            </AccordionDetails>
          </Accordion>

          <Stack
            width="100%"
            spacing={2}
            direction={isSmallScreen ? "column" : "row"}
            // alignItems={isSmallScreen ? "center" : "left"}
          >
            <Button
              variant="contained"
              color="error"
              onClick={openDeleteModal}
              startIcon={<DeleteForeverIcon />}
            >
              DELETE CLIENT
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={openEditModal}
              startIcon={<EditNoteIcon />}
            >
              EDIT CLIENT INFO
            </Button>
          </Stack>
          <Divider
            sx={{
              width: "100%",
              paddingBottom: "10px",
              borderColor: "white",
              "&::before, &::after": {
                borderColor: "white",
              },
            }}
          ></Divider>

          <DailyCharts clientCharts={client} />

          <Divider
            sx={{
              width: "100%",
              borderColor: "white",
              "&::before, &::after": {
                borderColor: "white",
              },
            }}
          ></Divider>

          <DiscreetTrials clientDT={client} />
          <Stack
            direction={isSmallScreen ? "column" : "row"}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">
              {client?.last_name}, {client?.first_name}
            </Typography>
            <Button
              sx={isSmallScreen ? { width: "100%", marginTop: "10px" } : {}}
              variant="contained"
              startIcon={<KeyboardBackspaceTwoToneIcon />}
              onClick={handleNavBack}
            >
              Manage Clients
            </Button>
          </Stack>
        </div>
      ) : (
        <Typography
          style={{
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
            borderRadius: "15px",
            padding: "10px 0",
          }}
          variant="h5"
        >
          {message}
        </Typography>
      )}
    </>
  );
};

export default ClientDetails;
