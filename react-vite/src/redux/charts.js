const GET_CHART = "charts/getChart";

const getChart = (foundChart) => {
  return {
    type: GET_CHART,
    payload: foundChart,
  };
};

export const getChartByIdThunk = (chart_id) => async (dispatch) => {
  const response = await fetch(`/api/my-daily-charts/${chart_id}`);
  if (response.ok) {
    const chart = await response.json();
    dispatch(getChart(chart));
    return chart;
  } else {
    throw new Error("Error finding chart");
  }
};

const initialState = { chart: null };

function chartsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CHART:
      return { ...state, chart: action.payload };
    default:
      return state;
  }
}

export default chartsReducer;
