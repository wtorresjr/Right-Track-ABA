const GET_CLIENT_DATA = "aiReducer/getClientData";
// const ANALYZE_TRENDS = "aiReducer/analyzedTrend";

// const analyzedTrend = (trends) => {
//   return {
//     type: ANALYZE_TRENDS,
//     payload: trends,
//   };
// };

// export const analyzeTrendsByAi =
//   (client_id, ai_request) => async (dispatch) => {
//     const response = await fetch(`/api/ai-suggest-post/`, {
//       method: "POST",
//       header: { "Content-Type": "application/json" },
//     });
//   };

const getClientData = (cleanData) => {
  return {
    type: GET_CLIENT_DATA,
    payload: cleanData,
  };
};

export const getClientDataForAI =
  (client_id, startDate, endDate) => async (dispatch) => {
    const response = await fetch(
      `/api/ai-suggest-post/${parseInt(client_id)}?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        header: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      const foundCleanData = await response.json();
      dispatch(getClientData(foundCleanData));
      return foundCleanData;
    }
  };

const initialState = {
  cleanData: {},
};

function aiReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CLIENT_DATA:
      return {
        ...state,
        cleanData: action.payload,
      };
    default:
      return state;
  }
}

export default aiReducer;
