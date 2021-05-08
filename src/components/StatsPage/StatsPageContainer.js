import { connect } from 'react-redux';

import {
  namespace, setStatsPageState
} from '../../states';
import StatsPage from './StatsPage';

const mapStateToProps = (state, ownProps) => {
  const {currentTask} = state[namespace].appState;
  const {
    StatsPageState
  } = state[namespace].pageState;

  return {
    currentTask,
    StatsPageState,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  {
    setStatsPageState
  }
)(StatsPage);