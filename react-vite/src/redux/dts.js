const GET_DT = "dt/getDT";
const GET_ALL_DTS = "dt/getAllDts";

const getDiscreetTrial = (foundTrial) => {
  return {
    type: GET_DT,
    payload: foundTrial,
  };
};

export const getDiscreetTrialThunk = (dt_id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/my-discreet-trials/dt-id/${dt_id}`, {
      method: "GET",
      headers: { "Content-Type": "appliation/json" },
    });
    if (response.ok) {
      const foundTrial = await response.json();
      dispatch(getDiscreetTrial(foundTrial));
      return foundTrial;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getAllDiscreetTrial = (allDTs) => {
  return {
    type: GET_ALL_DTS,
    payload: allDTs,
  };
};

export const getAllDTsThunk = (client_id) => async (dispatch) => {
  try {
    const response = await fetch(
      `/api/my-discreet-trials/client/${client_id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      const foundDTs = await response.json();
      dispatch(getAllDiscreetTrial(foundDTs));
      return foundDTs;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const initialState = {
  DiscreetTrial: {},
  Discreet_Trials: {},
};

function dtReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DT:
      return { ...state, DiscreetTrial: action.payload };
    case GET_ALL_DTS:
      return { ...state, Discreet_Trials: action.payload };
    default:
      return state;
  }
}

export default dtReducer;
