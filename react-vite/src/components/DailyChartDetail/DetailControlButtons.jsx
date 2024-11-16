import { Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";

const handlePrintChart = () => {
  alert("Print Chart");
};

const handleEmailChart = () => {
  alert("Email Chart");
};

const DetailControlButtons = () => {
  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<PrintIcon />}
        onClick={() => handlePrintChart()}
      >
        Print Chart Data
      </Button>
      <Button
        variant="contained"
        color="success"
        startIcon={<AttachEmailIcon />}
        onClick={() => handleEmailChart()}
      >
        Email Chart Data
      </Button>
    </>
  );
};

export default DetailControlButtons;
