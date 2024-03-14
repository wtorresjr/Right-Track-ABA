import { getClientByIDThunk } from "./clients";
import { showError } from "./charts";

const GET_DT = "dt/getDT";
const GET_ALL_DTS = "dt/getAllDts";
const DELETE_DT = "dt/deleteDT";
const DELETE_TRIAL = "dt/deleteTrial";
const ADD_NEW_DT = "dt/addNewDT";
const ADD_TRIAL = "dt/addTrial";
const EDIT_TRIAL = "dt/editTrial";
const EDIT_DT = "dt/editDT";
const RESET_DT_STATE = "dt/resetDTState";

export const resetDTState = () => ({
  type: RESET_DT_STATE,
});

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
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.message;
      dispatch(showError(errorMessage));
    }
  } catch (error) {
    dispatch(showError("An error occurred"));
  }
};

const getAllDiscreetTrial = (allDTs) => {
  return {
    type: GET_ALL_DTS,
    payload: allDTs,
  };
};

export const getAllDTsThunk =
  (client_id, page, per_page) => async (dispatch) => {
    try {
      const response = await fetch(
        `/api/my-discreet-trials/client/${client_id}?page=${page}&per_page=${per_page}`,
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
    console.log(response.status, "response body");
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
    const response = await fetch(
      `/api/my-discreet-trials/add-trial/dt-id/${dt_id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trialData),
      }
    );
    if (response.ok) {
      const newTrial = await response.json();
      await dispatch(addTrial(newTrial));
      return newTrial;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const editTrial = (editedTrial) => {
  return {
    type: EDIT_TRIAL,
    payload: editedTrial,
  };
};

export const editTrialThunk = (trialData, trial_id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/my-trials/${trial_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trialData),
    });
    if (response.ok) {
      const editedTrial = await response.json();
      await dispatch(editTrial(editedTrial));
      return editedTrial;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const editDT = (editedDT) => {
  return {
    type: EDIT_DT,
    payload: editedDT,
  };
};

export const editDTThunk = (dtEditData, dt_id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/my-discreet-trials/dt-id/${dt_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtEditData),
    });
    if (response.ok) {
      const editedDT = await response.json();
      await dispatch(editDT(editedDT));
      return editedDT;
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
    // Inside dtReducer
    case RESET_DT_STATE:
      return { ...state, DiscreetTrial: null, Discreet_Trials: null };
    case EDIT_DT:
      const updateDiscreetTrials = state.Discreet_Trials.map((dt) =>
        dt.id === action.payload.id ? { ...dt, ...action.payload } : dt
      );

      const updatedTrialsAvg = updateDiscreetTrials.find(
        (dt) => dt.id === action.payload.id
      )?.trials_avg;

      return {
        ...state,
        Discreet_Trials: updateDiscreetTrials,
        DiscreetTrial: {
          ...state.DiscreetTrial,
          Discreet_Trial: action.payload.Discreet_Trial,
          Trials: {
            ...state.DiscreetTrial.Trials,
            trials_avg: updatedTrialsAvg,
          },
        },
      };

    case EDIT_TRIAL:
      const editedTrialIndex = state.DiscreetTrial.Trials.findIndex(
        (trial) => trial.id === action.payload.id
      );

      if (editedTrialIndex !== -1) {
        const updatedTrials = [...state.DiscreetTrial.Trials];
        updatedTrials[editedTrialIndex] = action.payload;

        return {
          ...state,
          DiscreetTrial: {
            ...state.DiscreetTrial,
            Trials: updatedTrials,
          },
        };
      } else {
        return state;
      }

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
