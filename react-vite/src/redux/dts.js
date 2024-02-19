const GET_DT = "dt/getDT";
const GET_ALL_DTS = "dt/getAllDts";
const DELETE_DT = "dt/deleteDT";
const DELETE_TRIAL = "dt/deleteTrial";

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
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const foundTrial = await response.json();
      await dispatch(getDiscreetTrial(foundTrial));
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
      await dispatch(getAllDiscreetTrial(foundDTs));
      return foundDTs;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const deleteTheDT = (dtToDelete) => {
  return {
    type: DELETE_DT,
    payload: dtToDelete,
  };
};

export const deleteDTThunk = (dt_id, client_id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/my-discreet-trials/dt-id/${dt_id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const deleteITDT = await response.json();
      await dispatch(deleteTheDT(deleteITDT));
      await dispatch(getAllDTsThunk(client_id));
      return deleteITDT;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const deleteDTTrial = (dtTrialToDelete) => {
  return {
    type: DELETE_TRIAL,
    payload: dtTrialToDelete,
  };
};

export const deleteTrialThunk = (trial_id, dt_id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/my-trials/${trial_id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const deleteTrial = await response.json();
      await dispatch(deleteDTTrial(deleteTrial));
      // await dispatch(getDiscreetTrial(+dt_id));
      return deleteTrial;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const initialState = {
  DiscreetTrial: {
    Discreet_Trial: {},
    Trials: [],
  },
  Discreet_Trials: [],
};

function dtReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DT:
      return { ...state, DiscreetTrial: action.payload };
    case GET_ALL_DTS:
      return { ...state, Discreet_Trials: action.payload };
    case DELETE_DT:
      return {
        ...state,
        Discreet_Trials: state.Discreet_Trials.filter(
          (DT) => DT.id !== action.payload.id
        ),
      };
    case DELETE_TRIAL:
      return {
        ...state,
        DiscreetTrial: {
          ...state.DiscreetTrial,
          Trials: state.DiscreetTrial.Trials.filter(
            (trial) => trial.id !== action.payload.id
          ),
        },
      };

    default:
      return state;
  }
}

export default dtReducer;
