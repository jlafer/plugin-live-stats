import {
  converge, curry, fromPairs, has, head, last, map, pair, path, pipe,
  split, toPairs
} from 'ramda';
import {kvListToObj} from 'jlafer-fnal-util'
import {namespace, refreshStatusAges, setQuery} from './states';

const idValueListToObj = kvListToObj('id', 'value');
const makePathList = split('.');

export const makeCustomColumnData = (schema, rowData) => {
  const idValueList = schema.columns.filter(has('field'))
    .map(col => {
      console.log('------------makeCustomColumnData: col:', col);
      return {id: col.id, value: path( makePathList(col.field), rowData )}
    });
  return idValueListToObj(idValueList);
};

export const initLiveQuery = async (manager, params) => {
  const {key, filters, initialCB, updateCB, removeCB} = params;
  const pageState = manager.store.getState()[namespace].pageState;
  const {schema, queries} = pageState;
  const query = queries && queries[key];
  if (!!query) {
    manager.store.dispatch( setQuery(key, null, []) );
    await query.instance.close();
  }
  const queryDefn = schema[key];
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

const zeroPad2 = (num) => (num > 9) ? `${num}` : `0${num}`;

export const formatDuration = (duration) => {
  const {months, days, hours, minutes, seconds} = duration;
  const allDays = months * 30 + days;
  const dayStr = (allDays > 0) ? `${allDays}d ` : '';
  const hrStr = (hours > 0) ? `${hours}h ` : '';
  const minStr = (minutes > 0) ? `${zeroPad2(minutes)}:` : '';
  const secStr = (seconds > 0) ? `${zeroPad2(seconds)}` : '00';
  return `${dayStr}${hrStr}${minStr}${secStr}`;
}

export const updateStatusAges = manager => () => {
  manager.store.dispatch( refreshStatusAges() );
}