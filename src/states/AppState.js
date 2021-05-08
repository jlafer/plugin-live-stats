import {
  SET_SERVERLESS_URI, SET_CURRENT_TASK, SET_SYNC_TOKEN,
} from './actions';

const initialState = {
  currentTask: null,
  serverlessUri: null,
  syncToken: null
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case SET_SERVERLESS_URI:
      return {
        ...state,
        serverlessUri: action.payload
      };
    case SET_CURRENT_TASK:
      return {
        ...state,
        currentTask: action.payload
      };
    case SET_SYNC_TOKEN:
      return {
        ...state,
        syncToken: action.payload
      };
    default:
      return state;
  }
}
