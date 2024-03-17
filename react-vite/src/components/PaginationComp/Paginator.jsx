import TablePagination from "@mui/material/TablePagination";
import { useState, useEffect } from "react";

const Paginator = ({ numOfCharts, perPage, currentPage, handlePageChange }) => {
  const [page, setPage] = useState(currentPage - 1);

  useEffect(() => {
    setPage(currentPage - 1);
  }, [currentPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    handlePageChange(newPage + 1, perPage); // Pass perPage from props
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPage(0);
    handlePageChange(1, newRowsPerPage);
  };

  return (
    <TablePagination
      sx={{
        backgroundColor: "grey",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
      component="div"
      count={numOfCharts || 0}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={perPage} // Use perPage from props
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[1, 3, 5, 10, 25, 50, 100]}
      style={{ color: "white" }}
      // showLastButton={true}
      // showFirstButton={true}
    />
  );
};

export default Paginator;
