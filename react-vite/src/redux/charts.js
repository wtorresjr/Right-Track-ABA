const GET_CHART = "charts/getChart";
const ADD_INTERVAL = "charts/addInterval";
const CREATE_CHART = "charts/createChart";
const COMPLETE_CHART = "charts/completeChart";

const closeChart = (chartToClose) => {
  return {
    type: COMPLETE_CHART,
    payload: chartToClose,
  };
};

export const completeTheChartThunk = (data, chart_id) => async (dispatch) => {
  const response = await fetch(`/api/my-daily-charts/${chart_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    const editedChart = await response.json();
    dispatch(closeChart(editedChart));
    return editedChart;
  } else {
    throw new Error("Error editing chart");
  }
};

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

const createChart = (newChart) => {
  return {
    type: CREATE_CHART,
    payload: newChart,
  };
};

export const createNewChartThunk = (chartData) => async (dispatch) => {
  const response = await fetch(`/api/my-daily-charts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chartData),
  });
  if (response.ok) {
    const newCreatedChart = await response.json();
    dispatch(createChart(newCreatedChart));
    return newCreatedChart;
  } else {
    throw new Error("Error creating chart.");
  }
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

// const initialState = { chart: { intervals: [] } };
const initialState = { chart: null };

// function chartsReducer(state = initialState, action) {
//   switch (action.type) {
//     case GET_CHART:
//       return { ...state, chart: action.payload };
//     case ADD_INTERVAL:
//       return {
//         ...state,
//         chart: {
//           ...state.chart,
//           intervals: state.chart
//             ? [...(state.chart.intervals || []), action.payload]
//             : [action.payload],
//         },
//       };
//     case CREATE_CHART:
//       return { ...state, chart: action.payload };
//     default:
//       return state;
//   }
// }

function chartsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CHART:
      return { ...state, chart: action.payload };
    case ADD_INTERVAL:
      return { ...state, chart: action.payload };
    case CREATE_CHART:
      return { ...state, chart: action.payload };
    default:
      return state;
  }
}

export default chartsReducer;
