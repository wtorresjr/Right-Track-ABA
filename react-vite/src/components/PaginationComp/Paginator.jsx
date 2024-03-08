import "./paginator.css";
import Pagination from "react-bootstrap/Pagination";
import "./bootstrap.css";

const Paginator = ({ numOfCharts, perPage, currentPage, handlePageChange }) => {
  const totalPages = Math.ceil(numOfCharts / perPage);
  const pageItems = [];

  const renderPageItems = () => {
    const pagesToShow = 5;
    const halfPagesToShow = Math.floor(pagesToShow / 2);

    let startPage = Math.max(currentPage - halfPagesToShow, 1);
    let endPage = Math.min(startPage + pagesToShow - 1, totalPages);

    if (totalPages - endPage < halfPagesToShow) {
      startPage = Math.max(endPage - pagesToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <Pagination.Item
          key={i}
          active={currentPage === i}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return pageItems;
  };

  return (
    <Pagination>
      <Pagination.First onClick={() => handlePageChange(1)} />
      <Pagination.Prev
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
      />
      {renderPageItems()}
      <Pagination.Next
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
      />
      <Pagination.Last onClick={() => handlePageChange(totalPages)} />
    </Pagination>
  );
};

export default Paginator;
