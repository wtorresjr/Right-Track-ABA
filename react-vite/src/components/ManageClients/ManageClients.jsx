import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientsThunk } from "../../redux/clients";
import ClientInfo from "./ClientInfo";
import CreateClient from "../CreateClientPage/CreateClientPage";
import { useModal } from "../../context/Modal";
import "./manage-clients.css";
import Paginator from "../PaginationComp/Paginator";
import "../PaginationComp/bootstrap.css";

import { Button, Stack } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const ManageClients = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const { setModalContent } = useModal();
  const clients = useSelector((state) => state?.clients?.clients?.Clients);
  const totalClients = useSelector(
    (state) => state?.clients?.clients?.Total_Clients
  );
  const [filteredClients, setFilteredClients] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoaded(false);
    const getData = async () => {
      const dataLoaded = await dispatch(getClientsThunk(currentPage, perPage));
      if (dataLoaded) {
        setIsLoaded(true);
      }
    };
    getData();
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
  }, [clients]);

  useEffect(() => {
    let allClients;
    const getClients = async () => {
      const fetchClients = await dispatch(
        getClientsThunk(currentPage, undefined)
      );
      if (fetchClients) {
        allClients = fetchClients.data.Clients;
        const results = allClients?.filter((item) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchFilter.toLowerCase())
          )
        );
        setFilteredClients(results);
      }
    };
    getClients();
  }, [searchFilter]);

  const openCreateClientModal = () => {
    setModalContent(<CreateClient />);
  };

  const handlePageChange = (pageNumber, rowsPerPage) => {
    setCurrentPage(pageNumber);
    setPerPage(rowsPerPage); // Update perPage when it changes in Paginator
  };

  return (
    <div className="mainDisplayContain">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="10px"
      >
        <h1>Manage Clients</h1>

        <Button
          variant="contained"
          color="warning"
          onClick={openCreateClientModal}
          startIcon={<PersonAddIcon />}
          endIcon={<PersonAddIcon />}
        >
          Add New Client
        </Button>

        {/* <div
          className="chartTotalsContain"
          style={{
            border: `3px solid white`,
          }}
        >
          <div>
            Total Clients: {totalClients}
            {searchFilter && filteredClients
              ? ` - (${filteredClients.length} Filtered)`
              : ""}
          </div>
        </div> */}
      </Stack>
      <input
        type="text"
        placeholder="Search For A Client"
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
      />

      {filteredClients?.length > 0 && (
        <div>
          <Paginator
            numOfCharts={totalClients || 0}
            perPage={perPage}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>
      )}

      {isLoaded ? (
        filteredClients &&
        filteredClients?.map((client) => {
          return <ClientInfo key={client.id} client={client} />;
        })
      ) : (
        <h2
          style={{
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
            borderRadius: "15px",
            padding: "10px 0",
          }}
        >
          Loading Clients...
        </h2>
      )}
    </div>
  );
};

export default ManageClients;
