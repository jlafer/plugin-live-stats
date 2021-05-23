import {converge, curry, fromPairs, head, last, map, pair, pipe, toPairs} from 'ramda';
import {namespace, refreshStatusAges, setQuery} from './states';
import { formatDuration } from 'date-fns';

export const initLiveQuery = async (manager, params) => {
  const {key, filters, initialCB, updateCB, removeCB} = params;
  const pageState = manager.store.getState()[namespace].pageState;
  const {querySchema, queries} = pageState;
  const query = queries && queries[key];
  if (!!query) {
    manager.store.dispatch( setQuery(key, null, []) );
    await query.instance.close();
  }
  const queryDefn = querySchema[key];
  const {index, filterDefns} = queryDefn;
  const queryStr = filtersToQueryString(filterDefns, filters);
  const instance = await manager.insightsClient.liveQuery(index, queryStr);
  console.log(`subscribed to LiveQuery for ${index} where -${queryStr}-  `);
  manager.store.dispatch( setQuery(key, instance, filters) );
  initialCB(instance);
  instance.on('itemRemoved', removeCB);
  instance.on('itemUpdated', updateCB);
};

const buildPredString = curry( (filterDefns, filter) => {
  const {name, op, value} = filter;
  const filterDefn = filterDefns.find(fd => fd.name === name);
  return `data.${filterDefn.field} ${op} "${value}"`;
});

const filtersToQueryString = (filterDefns, filters) => {
  const filterStrings = filters.filter(filterActivated).map(buildPredString(filterDefns));
  return filterStrings.join(' AND ');
};

const filterActivated = f => f.value !== 'All';

// mapValuesOfObject :: objMapperFn -> object -> object
export const mapValuesOfObject = objMapperFn => pipe(
  toPairs,
  map(converge(pair, [head, pipe(last, objMapperFn)])),
  fromPairs
);

export const formatSecsHHMMSS = (secs) => {
  return formatDuration(
    {seconds: secs},
    {format: ['hours', 'minutes', 'seconds']}
  );
};

export const updateStatusAges = manager => () => {
  manager.store.dispatch( refreshStatusAges() );
}