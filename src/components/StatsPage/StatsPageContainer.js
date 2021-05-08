import { connect } from 'react-redux';

import {
  namespace, setStatsPageState
} from '../../states';
import StatsPage from './StatsPage';

const mapStateToProps = (state, ownProps) => {
  const pageState = state[namespace].pageState;

  return {
    pageState,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  {
    setStatsPageState
  }
)(StatsPage);