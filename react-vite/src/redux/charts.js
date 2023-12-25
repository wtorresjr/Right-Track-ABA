const GET_CHART = "charts/getChart";
const ADD_INTERVAL = "charts/addInterval";

const addInterval = (intervalToAdd) => {
  return {
    type: ADD_INTERVAL,
    payload: intervalToAdd,
  };
};

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

export const addIntervalToChart = (userIntervalInput) => async (dispatch) => {
  const response = await fetch(`/api/interval/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userIntervalInput),
  });
  if (response.ok) {
    const newInterval = await response.json();
    dispatch(addInterval(newInterval));
    return newInterval;
  } else {
    throw new Error("Error creating new interval");
  }
};

const initialState = { chart: null };

function chartsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CHART:
      return { ...state, chart: action.payload };
    case ADD_INTERVAL:
      return { ...state, chart: action.payload };
    default:
      return state;
  }
}

export default chartsReducer;
