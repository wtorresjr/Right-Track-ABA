import { getClientByIDThunk } from "./clients";

const GET_DT = "dt/getDT";
const GET_ALL_DTS = "dt/getAllDts";
const DELETE_DT = "dt/deleteDT";
const DELETE_TRIAL = "dt/deleteTrial";
const ADD_NEW_DT = "dt/addNewDT";
const ADD_TRIAL = "dt/addTrial";

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
      const getAllDTsResponse = await fetch(
        `/api/my-discreet-trials/client/${client_id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (getAllDTsResponse.ok) {
        const updatedDTs = await getAllDTsResponse.json();
        dispatch(getAllDiscreetTrial(updatedDTs));
        return updatedDTs;
      }
    } else {
      dispatch(getClientByIDThunk(client_id));
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

const addDT = (dtInfo) => {
  return {
    type: ADD_NEW_DT,
    payload: dtInfo,
  };
};

export const addNewDTThunk = (dtData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/my-discreet-trials/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtData),
    });
    console.log(response, "Response from Thunk");
    if (response.ok) {
      const newDT = await response.json();
      await dispatch(addDT(newDT));
      return newDT;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const addTrial = (trialInfo) => {
  return {
    type: ADD_TRIAL,
    payload: trialInfo,
  };
};

export const addTrialThunk = (trialData, dt_id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/my-discreet-trials/add-trial/dt-id/${dt_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trialData),
    });
    if (response.ok) {
      const newTrial = await response.json();
      await dispatch(addTrial(newTrial));
      return newTrial;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const initialState = {
  DiscreetTrial: {},
  Discreet_Trials: [],
};

function dtReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TRIAL:
      return {
        ...state,
        DiscreetTrial: { ...state.DiscreetTrial, Trials: action.payload },
      };
    case ADD_NEW_DT:
      return { ...state, DiscreetTrial: action.payload };
    case GET_DT:
      return { ...state, DiscreetTrial: action.payload };
    case GET_ALL_DTS:
      return { ...state, Discreet_Trials: action.payload };
    case DELETE_DT:
      const updatedDiscreetTrials = state.Discreet_Trials.filter(
        (DT) => DT.id !== action.payload.id
      );

      return {
        ...state,
        Discreet_Trials: updatedDiscreetTrials,
        DiscreetTrial:
          updatedDiscreetTrials.length === 0 ? {} : state.DiscreetTrial,
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
