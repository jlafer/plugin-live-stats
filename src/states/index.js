import { combineReducers } from 'redux';

import {
  SET_CURRENT_TASK, SET_SERVERLESS_URI, SET_SYNC_TOKEN,
  INIT_SCHEMA, SET_QUERY, SET_STATS_PAGE_STATE, SET_INTERVAL_ID, UPDATE_STATUS_AGES,
  INITIATE_TASK_STATS, UPDATE_TASK_STATS, REMOVE_TASK_STATS,
  INITIATE_WORKER_STATS, UPDATE_WORKER_STATS, REMOVE_WORKER_STATS
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

export const initiateWorkerStats = (items) => ({
  type: INITIATE_WORKER_STATS, payload: items
});

export const updateWorkerStats = (key, value) => ({
  type: UPDATE_WORKER_STATS, payload: {key, value}
});

export const removeWorkerStats = (key) => ({
  type: REMOVE_WORKER_STATS, payload: {key}
});

export const setStatsPageState = (payload) => ({
  type: SET_STATS_PAGE_STATE, payload
});

export const setIntervalId = (payload) => ({
  type: SET_INTERVAL_ID, payload
});

export const initSchema = (schema) => ({
  type: INIT_SCHEMA, payload: schema
});

export const setQuery = (key, instance, filters) => ({
  type: SET_QUERY, payload: {key, instance, filters}
});

export const refreshStatusAges = () => ({
  type: UPDATE_STATUS_AGES
});
