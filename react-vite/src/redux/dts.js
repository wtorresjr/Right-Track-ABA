const GET_DT = "dt/getDT";

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

const initialState = {
  DiscreetTrial: {},
};

function dtReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DT:
      return { ...state, DiscreetTrial: action.payload };
    default:
      return state;
  }
}

export default dtReducer;
