const GET_CLIENTS = "clients/getClients";
const GET_BY_ID = "clients/byID";
const CREATE_CLIENT = "clients/createClient";
const DELETE_CLIENT = "clients/deleteClient";
const UPDATE_CLIENT = "clients/updateClient";
const RESET_STATE = "session/resetState";

export const resetState = () => ({
  type: RESET_STATE,
});

const update_a_client = (updatedClientData) => {
  return {
    type: UPDATE_CLIENT,
    payload: updatedClientData,
  };
};

export const updateClientThunk =
  (client_id, clientInfo) => async (dispatch) => {
    const response = await fetch(`/api/my-clients/${client_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientInfo),
    });

    if (response.ok) {
      const updatedClient = await response.json();
      dispatch(update_a_client(updatedClient));
      dispatch(getClientsThunk());
      return updatedClient;
    } else {
      throw new Error("Error editing client");
    }
  };

const delete_a_client = (deletedClient) => {
  return {
    type: DELETE_CLIENT,
    payload: deletedClient,
  };
};

export const deleteAClientThunk = (client_id) => async (dispatch) => {
  const response = await fetch(`/api/my-clients/${client_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    const removedClient = await response.json();

    dispatch(delete_a_client(removedClient));
    const finishedDisp = await dispatch(delete_a_client(removedClient));
    if (finishedDisp) {
      dispatch(getClientsThunk());
    }
    return removedClient;
  } else {
    throw new Error("Failed to delete client");
  }
};

const create_new_client = (newClient) => {
  return {
    type: CREATE_CLIENT,
    payload: newClient,
  };
};

export const createNewClientThunk = (clientInfo) => async (dispatch) => {
  const response = await fetch(`/api/my-clients/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clientInfo),
  });

  if (response.ok) {
    const clientCreated = await response.json();
    dispatch(create_new_client(clientCreated));
    return clientCreated;
  } else {
    throw new Error("Failed to create client");
  }
};

const get_clients = (usersClients) => {
  return {
    type: GET_CLIENTS,
    payload: usersClients,
  };
};

const get_by_id = (clientFound) => {
  return {
    type: GET_BY_ID,
    payload: clientFound,
  };
};

export const getClientByIDThunk = (client_id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/my-clients/${client_id}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(get_by_id(data));
      return { ok: true, payload: data };
    } else {
      const errorData = await response.json();
      return { ok: false, payload: errorData };
    }
  } catch (errors) {
    return { ok: false, payload: { message: "Error fetching client data" } };
  }
};

export const getClientsThunk = () => async (dispatch) => {
  try {
    const response = await fetch(`/api/my-clients/`);
    if (response.ok) {
      const data = await response.json();
      dispatch(get_clients(data));
      return { ok: true, data };
    }
  } catch (errors) {
    return { ok: false };
  }
};

const initialState = {
  clients: null,
  client_by_id: null,
};

export const clientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_STATE:
      return { ...state, clients: null, chart: null, client_by_id: null };
    case GET_CLIENTS:
      return {
        ...state,
        clients: action.payload ? { ...action.payload } : null,
      };
    case GET_BY_ID:
      return {
        ...state,
        client_by_id: action.payload,
      };
    case CREATE_CLIENT:
      return { ...state, [action.payload.id]: action.payload };

    case UPDATE_CLIENT:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };

    case DELETE_CLIENT:
      const { [action.payload]: deletedClient, ...remainingClients } =
        state.clients;
      return {
        ...state,
        clients: remainingClients,
      };
    default:
      return state;
  }
};
