import * as R from 'ramda';

const baseSchema = {
  workers: {
    index: 'tr-worker',
    key: 'sid',
    columns: [
      { id: 'agent_name', numeric: false, disablePadding: true, label: 'Name' },
      { id: 'activity_str', numeric: false, disablePadding: false, label: 'Activity' },
      { id: 'formatted_age', numeric: true, disablePadding: false, label: 'Activity Time', sortFld: 'activityAge' },
      { id: 'tasks_str', numeric: false, disablePadding: false, label: 'Tasks' },
      { id: 'skills_str', numeric: false, disablePadding: false, label: 'Skills' },
      { id: 'contact_uri', numeric: false, disablePadding: false, label: 'URI' }
    ],
    defaultSortCol: 'agent_name',
    filterDefns: []
  },
  tasks: {
    index: 'tr-task',
    key: 'sid',
    columns: [
      { id: 'from', numeric: false, disablePadding: true, label: 'From' },
      { id: 'status', numeric: false, disablePadding: true, label: 'Status' },
      { id: 'queue_name', numeric: false, disablePadding: true, label: 'Queue' },
      { id: 'formatted_age', numeric: true, disablePadding: false, label: 'Task Time', sortFld: 'statusAge' },
      { id: 'channel_type', numeric: false, disablePadding: false, label: 'Channel' },
      { id: 'worker_name', numeric: false, disablePadding: false, label: 'Agent' },
    ],
    defaultSortCol: 'queue_name',
    filterDefns: [
      {
        name: 'status', label: 'Status', field: 'status', defaultOption: 'pending',
        options: [
          {label: 'All', name: 'All'},
          {label: 'Queued', name: 'pending'},
          {label: 'Alerting', name: 'reserved'},
          {label: 'Assigned', name: 'assigned'},
          {label: 'Wrapping', name: 'wrapping'}
        ]
      }
    ],
  }
};

export function verifyAndFillConfiguration(cfg) {
  if (! cfg)
    throw new Error(`LiveStatsPlugin: attributes.plugin_live_stats NOT configured. See README for instructions.`);
  const workers = verifyAndFillTblConfig(cfg, 'workers');
  const tasks = verifyAndFillTblConfig(cfg, 'tasks');
  return {workers, tasks};
}

const verifyAndFillTblConfig = (cfg, key) => {
  if (!cfg[key])
    throw new Error(`LiveStatsPlugin: attributes.plugin_live_stats missing property ${key}. See README for instructions.`);
  const {columns, filterDefns} = cfg[key];
  const filledColumns = R.map(verifyAndFillColumn, columns);
  const filledFilterDefns = R.map(verifyAndFillFilterDefn, filterDefns);
  return {...cfg[key], columns: filledColumns, filterDefns: filledFilterDefns};
}

const verifyAndFillColumn = (col) => {
  requiredProp('column', col, 'id');
  const numeric = optionalProp('column', col, 'numeric', {validValues: [true, false], defaultValue: false});
  const disablePadding = optionalProp('column', col, 'disablePadding', {validValues: [true, false], defaultValue: true});
  return {...col, numeric, disablePadding};
};

const verifyAndFillFilterDefn = (defn) => {
  console.log('-----------------verifyAndFillFilterDefn: defn', defn);
  requiredProp('filterDefn', defn, 'name');
  requiredProp('filterDefn', defn, 'label');
  requiredProp('filterDefn', defn, 'field');
  requiredProp('filterDefn', defn, 'options');
  const optionValues = R.map(R.prop('name'), defn.options);
  const defaultValue = R.includes('All', optionValues) ? 'All' : R.head(optionValues);
  const defaultOption = optionalProp('filterDefn', defn, 'defaultOption', {defaultValue, validValues: optionValues});
  return {...defn, defaultOption};
};

const requiredProp = (label, obj, key, options) => {
  if (! obj[key])
    throw new Error(`${key} is a required property in ${label}`);
  const value = obj[key];
  if ( ! validValue(value, options) )
    throw new Error(`${value} is an invalid value for ${key} in ${label}`);
};

const optionalProp = (label, obj, key, options) => {
  const value = obj[key] ? obj[key] : getAltValue(options);
  if ( ! validValue(value, options) )
    throw new Error(`${value} is an invalid value for ${key} in ${label}`);
  return value;
};

const getAltValue = (options) => {
  if (!options)
    return undefined;
  return options.defaultValue;
};

const validValue = (value, options) => {
  if (!options)
    return true;
  return ( !options.validValues || R.includes(value, options.validValues) )
};

const nameToNameAndLabelObj = (name, nameToLabelFn) => {
  const label = nameToLabelFn ? nameToLabelFn(name) : name;
  return ({name: name, label: label})
};

export const addWorkerActivityFilterDefn = (store) => {
  const {workers} = baseSchema;
  const {filterDefns} = workers;
  const activities = Object.fromEntries(store.getState().flex.worker.activities);
  const activityOptions = R.pipe(R.values, R.map(R.prop('name')), R.map(nameToNameAndLabelObj), R.append({name: 'All', label: 'All'}))(activities);
  const activityFilter = {
    name: 'activity', label: 'Activity', field: 'activity_name', defaultOption: 'All',
    options: activityOptions
  };
  const filterDefnsWithActivity = R.append(activityFilter, filterDefns);
  const workersSchemaWithActivity = {...workers, filterDefns: filterDefnsWithActivity};
  return {...baseSchema, workers: workersSchemaWithActivity};
};

export const addConfigurationToSchema = (base, config) => {
  const {tasks, workers} = base;
  const tasksConfigured = addConfigurationToTbl(tasks, config.tasks);
  const workersConfigured = addConfigurationToTbl(workers, config.workers);
  return {tasks: tasksConfigured, workers: workersConfigured};
};

const addConfigurationToTbl = (base, toAdd) => {
  return {...base,
    filterDefns: R.concat(base.filterDefns, toAdd.filterDefns),
    columns: mergeColumns(base.columns, toAdd.columns)
  };
};

const mergeColumns = (baseCols, cfgCols) => {
  return R.map( mergeColumn(baseCols), cfgCols );
};

const mergeColumn = R.curry((baseCols, cfgCol) => {
  const baseCol = R.find(col => col.id === cfgCol.id, baseCols);
  return R.mergeDeepRight(baseCol, cfgCol);
});

