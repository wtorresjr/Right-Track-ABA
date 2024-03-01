import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientsThunk } from "../../redux/clients";
import ClientInfo from "./ClientInfo";
import CreateClient from "../CreateClientPage/CreateClientPage";
import { useModal } from "../../context/Modal";
import "./manage-clients.css";
import LegendComponent from "../DailyCharts/LegendComponent";
import Paginator from "../PaginationComp/Paginator";
import "../PaginationComp/bootstrap.css";

const ManageClients = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const { setModalContent } = useModal();
  const clients = useSelector((state) => state?.clients?.clients?.Clients);
  const totalClients = useSelector(
    (state) => state?.clients?.clients?.Total_Clients
  );
  // const clientChartInfo = useSelector((state) => state?.clients?.client_by_id);
  const [filteredClients, setFilteredClients] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClientsThunk(currentPage, perPage));
    // }, [searchFilter, currentPage, perPage]);
  }, [currentPage, perPage]);

  useEffect(() => {
    const results = clients?.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchFilter.toLowerCase())
      )
    );
    setFilteredClients(results);
  }, [clients, searchFilter]);

  const openCreateClientModal = () => {
    setModalContent(<CreateClient />);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mainDisplayContain">
      <div className="manageClientsHeader">
        <h1>Manage Clients</h1>
        <button id="addNewClientBtn" onClick={openCreateClientModal}>
          <i className="fa-regular fa-address-card fa-xl"></i>
          Add New Client <i className="fa-regular fa-address-card fa-xl"></i>
        </button>
        <LegendComponent />
        <div
          className="chartTotalsContain"
          style={{
            border: `3px solid white`,
          }}
        >
          <div>Total Clients: {totalClients}</div>
        </div>
        <input
          type="text"
          placeholder="Search For A Client"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        />
      </div>

      <div className="paginationDiv">
        <label>Page:</label>
        <Paginator
          numOfCharts={totalClients}
          perPage={perPage}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
        <label>Clients Per Page:</label>
        <input
          className="perPageInput"
          type="number"
          value={perPage}
          onChange={(e) => setPerPage(e.target.value)}
        />
      </div>

      {filteredClients &&
        filteredClients?.map((client) => {
          return <ClientInfo key={client.id} client={client} />;
        })}
    </div>
  );
};

export default ManageClients;
