const GET_CLIENTS = "clients/getClients";

const get_clients = (usersClients) => {
  return {
    type: GET_CLIENTS,
    payload: usersClients,
  };
};

export const getClientsThunk = () => async (dispatch) => {
  try {
    const response = await fetch(`/api/my-clients/`);
    if (response.ok) {
      const data = await response.json();
      dispatch(get_clients(data));
    }
  } catch (errors) {
    return errors;
  }
};

const initialState = { clients: null };

export const clientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CLIENTS:
      return {
        ...state,
        clients: action.payload ? { ...action.payload } : null,
      };
    default:
      return state;
  }
};
