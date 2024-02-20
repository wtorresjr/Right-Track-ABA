const GET_CHART = "charts/getChart";
const ADD_INTERVAL = "charts/addInterval";
const CREATE_CHART = "charts/createChart";
const COMPLETE_CHART = "charts/completeChart";
const DELETE_CHART = "charts/deleteChart";
const UPDATE_CHART = "charts/updateChart";
const GET_ALL_CHARTS = "charts/getAllCharts";
const GET_ALL_INTERVALS = "charts/getAllIntervals";
const GET_INTERVAL = "charts/getInterval";
const DELETE_INTERVAL = "charts/deleteInterval";
const EDIT_AN_INTERVAL = "charts/editAnInterval";

const deleteInterval = (intervalToDelete) => {
  return {
    type: DELETE_INTERVAL,
    payload: intervalToDelete,
  };
};

export const deleteIntervalThunk = (intervalId) => async (dispatch) => {
  const response = await fetch(`/api/interval/${intervalId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    const deletedInterval = await response.json();
    dispatch(deleteInterval(deletedInterval));
    return deletedInterval;
  } else {
    throw new Error("Error deleting Interval");
  }
};

const getAllIntervals = (clientIntervals) => {
  return {
    type: GET_ALL_INTERVALS,
    payload: clientIntervals,
  };
};

export const getAllIntervalsThunk = (client_id) => async (dispatch) => {
  const response = await fetch(`/api/interval/${client_id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    const allIntervals = await response.json();
    dispatch(getAllIntervals(allIntervals));
    return allIntervals;
  } else {
    throw new Error("Error fetching all intervals");
  }
};

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
    headers: { "Content-Type": "application/json" },
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

const getOneInterval = (intervalFound) => {
  return {
    type: GET_INTERVAL,
    payload: intervalFound,
  };
};

export const getOneIntervalThunk = (interval_id) => async (dispatch) => {
  const response = await fetch(`/api/my-daily-charts/interval/${interval_id}`, {
    method: "GET",
    header: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    const foundInterval = await response.json();
    dispatch(getOneInterval(foundInterval));
    return foundInterval;
  }
};

const editAnInterval = (editedInterval) => {
  return {
    type: EDIT_AN_INTERVAL,
    payload: editedInterval,
  };
};

export const editIntervalThunk =
  (data, intervalId, chart_id) => async (dispatch) => {
    const response = await fetch(`/api/interval/${intervalId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const editedInterval = await response.json();
      const done = await dispatch(editAnInterval(editedInterval));
      if (done) {
        dispatch(getChartByIdThunk(chart_id));
        return editedInterval;
      }
    } else {
      throw new Error("Error editing interval");
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
  allClientIntervals: [],
};

function chartsReducer(state = initialState, action) {
  switch (action.type) {
    case EDIT_AN_INTERVAL:
      return {
        ...state,
        client_by_id: {
          ...state.client_by_id,
          Daily_Charts: state.client_by_id.Daily_Charts.map((chart) =>
            chart.id === action.payload.chart_id
              ? {
                  ...chart,
                  intervals: chart.intervals.map((interval) =>
                    interval.id === action.payload.id
                      ? action.payload
                      : interval
                  ),
                }
              : chart
          ),
        },
        chart: {
          ...state.chart,
          Chart_Intervals: state.chart.Chart_Intervals.map((interval) =>
            interval.id === action.payload.id ? action.payload : interval
          ),
        },
      };
    case DELETE_INTERVAL:
      return {
        ...state,
        client_by_id: {
          ...state.client_by_id,
          Daily_Charts: state.client_by_id.Daily_Charts.map((chart) =>
            chart.id === action.payload.chart_id
              ? {
                  ...chart,
                  intervals: chart.intervals.filter(
                    (interval) => interval.id !== action.payload.id
                  ),
                }
              : chart
          ),
        },
        chart: {
          ...state.chart,
          Chart_Intervals: state.chart.Chart_Intervals.filter(
            (interval) => interval.id !== action.payload.id
          ),
        },
      };

    case GET_ALL_INTERVALS:
      return {
        ...state,
        allClientIntervals: action.payload,
      };
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
