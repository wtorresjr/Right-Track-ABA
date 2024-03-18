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
      style={{
        color: "white",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        borderBottom: "1px solid grey",
        boxShadow:"0px 5px 10px black"
      }}
      component="div"
      count={numOfCharts || 0}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={perPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[1, 3, 5, 10, 25, 50, 100]}
      labelRowsPerPage="Items Per Page:"
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
    />
  );
};

export default Paginator;
