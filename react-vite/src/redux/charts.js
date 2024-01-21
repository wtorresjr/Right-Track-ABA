const GET_CHART = "charts/getChart";
const ADD_INTERVAL = "charts/addInterval";
const CREATE_CHART = "charts/createChart";
const COMPLETE_CHART = "charts/completeChart";
const DELETE_CHART = "charts/deleteChart";
const UPDATE_CHART = "charts/updateChart";
const GET_ALL_CHARTS = "charts/getAllCharts";
// const GET_INTERVALS = "charts/getAllIntervals";

// const getIntervals = (clientIntervals) => {
//   return {
//     type: GET_INTERVALS,
//     payload: clientIntervals,
//   };
// };

// export const getIntervals = (client_id) => {
  
// }

const updateChart = (chartToUpdate) => {
  return {
    type: UPDATE_CHART,
    payload: chartToUpdate,
  };
};


export const updateTheChartThunk = (data, chart_id) => async (dispatch) => {
  const response = await fetch(`/api/my-daily-charts/${chart_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    const editTheChart = await response.json();
    dispatch(updateChart(editTheChart));
    return editTheChart;
  } else {
    throw new Error("Error editing chart");
  }
};

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
  const response = await fetch(`/api/my-daily-charts/${chart_id}`, {
    method: "GET",
    header: { "Content-Type": "application/json" },
  });
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

const deleteChart = (chartToDelete) => {
  return {
    type: DELETE_CHART,
    payload: chartToDelete,
  };
};

export const delDailyChartThunk = (chart_id) => async (dispatch) => {
  const response = await fetch(`/api/my-daily-charts/${chart_id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    const deletingChart = await response.json();
    dispatch(deleteChart(deletingChart));
    return deletingChart;
  } else {
    throw new Error("Error deleting chart");
  }
};

const getAllCharts = (allCharts) => {
  return {
    type: GET_ALL_CHARTS,
    payload: allCharts,
  };
};

export const getAllChartsThunk = () => async (dispatch) => {
  const response = await fetch(`/api/my-daily-charts/`, {
    method: "GET",
    header: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    const allFoundCharts = await response.json();
    dispatch(getAllCharts(allFoundCharts));
    return allFoundCharts;
  }
};

const initialState = {
  clients: null,
  client_by_id: {
    Daily_Charts: [],
  },
  chart: {
    Chart: null,
    Chart_Intervals: [],
  },
  allCharts: [],
};

function chartsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_CHARTS:
      return {
        ...state,
        allCharts: action.payload,
      };
    case UPDATE_CHART:
      return {
        ...state,
        chart: action.payload,
      };
    case GET_CHART:
      return { ...state, chart: action.payload };
    case ADD_INTERVAL:
      return {
        ...state,
        client_by_id: {
          ...state.client_by_id,
          Daily_Charts: state.client_by_id.Daily_Charts.map((chart) =>
            chart.id === action.payload.chart_id
              ? {
                  ...chart,
                  intervals: [...chart.intervals, action.payload],
                }
              : chart
          ),
        },
        chart: {
          ...state.chart,
          Chart_Intervals: [...state.chart.Chart_Intervals, action.payload],
        },
      };

    case CREATE_CHART:
      return { ...state, chart: action.payload };

    case DELETE_CHART:
      return {
        ...state,
        client_by_id: {
          ...state.client_by_id,
          Daily_Charts: state.client_by_id.Daily_Charts.filter(
            (chart) => chart.id !== action.payload.id
          ),
        },
        chart: null,
      };
    case COMPLETE_CHART:
      return {
        ...state,
        chart: action.payload,
      };

    default:
      return state;
  }
}

export default chartsReducer;
