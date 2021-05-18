import {converge, fromPairs, head, last, map, pair, pipe, toPairs} from 'ramda';
import {namespace, refreshStatusAges, setQuery} from './states';

export const initLiveQuery = async (manager, params) => {
  const {index, predicate, initialCB, updateCB, removeCB} = params;
  const pageState = manager.store.getState()[namespace].pageState
  const query = pageState.queries && pageState.queries[index];
  if (!!query) {
    manager.store.dispatch( setQuery(index, null) );
    await query.instance.close();
  }
  const {field, op, value} = predicate;
  const queryStr = field ? `data.${field} ${op} "${value}"` : '';
  const instance = await manager.insightsClient.liveQuery(index, queryStr);
  console.log(`subscribed to LiveQuery for ${index} where -${queryStr}-  `);
  manager.store.dispatch( setQuery(index, instance, predicate) );
  initialCB(instance);
  instance.on('itemRemoved', removeCB);
  instance.on('itemUpdated', updateCB);
}

// mapValuesOfObject :: objMapperFn -> object -> object
export const mapValuesOfObject = objMapperFn => pipe(
  toPairs,
  map(converge(pair, [head, pipe(last, objMapperFn)])),
  fromPairs
);

export const formatSecsHHMMSS = (dt, secs) => {
  dt.setSeconds(secs);
  return dt.toISOString().substr(11, 8);
};

export const updateStatusAges = manager => () => {
  manager.store.dispatch( refreshStatusAges() );
}