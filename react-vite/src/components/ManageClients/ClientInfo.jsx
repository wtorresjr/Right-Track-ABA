import { useNavigate } from "react-router-dom";
import "./manage-clients.css";
import { useModal } from "../../context/Modal";
import DeleteModal from "../DeleteModal/DeleteModal";
import UpdateClientModal from "../UpdateClientModal/UpdateClientModal";
import { Button, ButtonGroup, Stack, Paper } from "@mui/material";

import { useIsSmallScreen } from "../helpers";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PreviewIcon from "@mui/icons-material/Preview";

import { Typography } from "@mui/material";

import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#000",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: "white",
}));

const ClientInfo = ({ client }) => {
  const isSmallScreen = useIsSmallScreen();
  const { setModalContent } = useModal();
  const navigate = useNavigate();

  const handleClick = (client_id) => {
    navigate(`/client/${client_id}`);
  };

  const openDeleteModal = () => {
    setModalContent(<DeleteModal client={client} />);
  };
  const openEditModal = () => {
    setModalContent(<UpdateClientModal client={client} />);
  };

  const buttons = [
    <Button
      key="delete"
      onClick={openDeleteModal}
      color="error"
      startIcon={<DeleteForeverIcon />}
      size="medium"
    >
      DELETE
    </Button>,
    <Button
      key="edit"
      onClick={openEditModal}
      color="warning"
      startIcon={<EditNoteIcon />}
      size="medium"
    >
      EDIT
    </Button>,
    <Button
      key="view"
      onClick={() => {
        handleClick(client?.id);
      }}
      color="secondary"
      startIcon={<PreviewIcon />}
      size="medium"
    >
      VIEW CLIENT DATA
    </Button>,
  ];

  return (
    <Stack
      key={client?.id}
      sx={{
        backgroundColor: "black",
        padding: "10px",
        borderRadius: "10px",
        marginBottom: "10px",
      }}
    >
      <Stack direction="column" justifyContent="center">
        <Typography variant="h5">
          {client?.first_name} {client?.last_name}
        </Typography>
        <Item sx={{ padding: "0px" }}>
          Guardian Email: {client?.guardian_email}
        </Item>
      </Stack>

      <Stack direction="row" justifyContent="center">
        <Item>Total Daily Charts: {client?.Daily_Chart_Count}</Item>
        <Item>Total Discreet Trials: {client?.Discreet_Trial_Count}</Item>
      </Stack>

      <Stack>
        <ButtonGroup
          fullWidth
          orientation={isSmallScreen ? "vertical" : "horizontal"}
        >
          {buttons}
        </ButtonGroup>
      </Stack>
    </Stack>
  );
};

export default ClientInfo;
