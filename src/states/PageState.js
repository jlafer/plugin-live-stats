import {
  SET_STATS_PAGE_STATE
} from './actions';
  
const initialState = {
  statsPageState: 'INACTIVE'
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case SET_STATS_PAGE_STATE:
      return {...state, statsPageState: action.payload};
    default:
      return state;
  }
}
