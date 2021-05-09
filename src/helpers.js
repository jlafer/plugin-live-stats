import {converge, fromPairs, head, last, map, pair, pipe, toPairs} from 'ramda';

export const initLiveQuery = async (manager, params) => {
  const {index, query, initialCB, updateCB, removeCB} = params;
  const res = await manager.insightsClient.liveQuery(index, query);
  console.log(`subscribed to LiveQuery for ${index} where -${query}-  `);
  initialCB(res);
  res.on('itemRemoved', removeCB);
  res.on('itemUpdated', updateCB);
}

// makeMapSecondOfPairFn :: mapFn -> pair -> pair
const makeMapSecondOfPairFn = mapFn =>
  converge(
    pair,
    [head, pipe(last, mapFn)]
  );

// mapValuesOfObject :: objMapperFn -> object -> object
export const mapValuesOfObject = objMapperFn => pipe(
  toPairs,
  map(converge(pair, [head, pipe(last, objMapperFn)])),
  fromPairs
);
