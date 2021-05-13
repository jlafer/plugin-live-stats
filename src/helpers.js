import {converge, fromPairs, head, last, map, pair, pipe, toPairs} from 'ramda';
import {refreshStatusAges} from './states';

export const initLiveQuery = async (manager, params) => {
  const {index, query, initialCB, updateCB, removeCB} = params;
  const res = await manager.insightsClient.liveQuery(index, query);
  console.log(`subscribed to LiveQuery for ${index} where -${query}-  `);
  initialCB(res);
  res.on('itemRemoved', removeCB);
  res.on('itemUpdated', updateCB);
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