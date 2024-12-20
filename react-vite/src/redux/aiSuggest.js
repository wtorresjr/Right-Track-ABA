const GET_CLIENT_DATA = "aiReducer/getClientData";
const ANALYZE_TRENDS = "aiReducer/analyzedTrend";

const analyzedTrend = (trends) => {
  return {
    type: ANALYZE_TRENDS,
    payload: trends,
  };
};

export const analyzeTrendsByAi = (ai_request) => async (dispatch) => {
  // console.log(ai_request, "<------ AI Request");
  const response = await fetch(`/api/ai-suggest-post/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ai_request),
  });

  // console.log(response, "Response data");
  if (response.ok) {
    const trendRequest = await response.json();
    dispatch(analyzedTrend(trendRequest));
    return trendRequest;
  } else {
    throw new Error("Error getting AI Trends");
  }
};

const getClientData = (cleanData) => {
  return {
    type: GET_CLIENT_DATA,
    payload: cleanData,
  };
};

export const getClientDataForAI =
  (client_id, startDate, endDate) => async (dispatch) => {
    const response = await fetch(
      `/api/ai-suggest-post/${parseInt(
        client_id
      )}?startDate=${startDate}&endDate=${endDate}`,
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
  ai_trend: [],
};

function aiReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CLIENT_DATA:
      return {
        ...state,
        cleanData: action.payload,
      };
    case ANALYZE_TRENDS:
      return {
        ...state,
        ai_trend: action.payload,
      };
    default:
      return state;
  }
}

export default aiReducer;
