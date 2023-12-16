const GET_CLIENTS = "clients/getClients";
const GET_BY_ID = "clients/byID";

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
    return { ok: false, payload: { message: 'Error fetching client data' } };
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
    default:
      return state;
  }
};
