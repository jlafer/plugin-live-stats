import { combineReducers } from 'redux';

import {
  SET_CURRENT_TASK, SET_SERVERLESS_URI, SET_SYNC_TOKEN,
  SET_STATS_PAGE_STATE, INITIATE_TASK_STATS, UPDATE_TASK_STATS, REMOVE_TASK_STATS
} from './actions';
import appStateReducer from "./AppState";
import pageStateReducer from "./PageState";

// Register your redux store under a unique namespace
export const namespace = 'plugin-live-stats';

export default combineReducers({
  pageState: pageStateReducer,
  appState: appStateReducer
});

export const setServerlessUri = (payload) => ({
  type: SET_SERVERLESS_URI, payload
});

export const setSyncToken = (payload) => ({
  type: SET_SYNC_TOKEN, payload
});

export const setCurrentTask = (payload) => ({
  type: SET_CURRENT_TASK, payload
});

export const initiateTaskStats = (items) => ({
  type: INITIATE_TASK_STATS, payload: items
});

export const updateTaskStats = (key, value) => ({
  type: UPDATE_TASK_STATS, payload: {key, value}
});

export const removeTaskStats = (key) => ({
  type: REMOVE_TASK_STATS, payload: {key}
});

export const setStatsPageState = (payload) => ({
  type: SET_STATS_PAGE_STATE, payload
});
