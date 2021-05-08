import * as R from 'ramda';

import {
  SET_STATS_PAGE_STATE,
  INITIATE_TASK_STATS,
  UPDATE_TASK_STATS,
  REMOVE_TASK_STATS
} from './actions';
  
const initialState = {
  statsPageState: 'INACTIVE',
  tasks: {},
  workers: {}
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case INITIATE_TASK_STATS:
      return {...state, tasks: initiateTaskStats(state, action.payload) };
    case UPDATE_TASK_STATS:
      return {...state, tasks: updateTaskStats(state, action.payload) };
    case REMOVE_TASK_STATS:
      return {...state, tasks: removeTaskStats(state, action.payload) };
    case SET_STATS_PAGE_STATE:
      return {...state, statsPageState: action.payload};
    default:
      return state;
  }
}

const initiateTaskStats = (state, payload) => {
  return payload;
};

const updateTaskStats = (state, payload) => {
  const {key, value} = payload;
  if ( R.has(key, state.tasks) ) {
    return R.assoc(key, value, state.tasks);
  }
  else {
    return R.assoc(key, value, state.tasks);
  }
};

const removeTaskStats = (state, payload) => {
  const {key} = payload;
  return R.dissoc(key, state.tasks);
};
