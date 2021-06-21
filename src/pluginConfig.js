import * as R from 'ramda';

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
  return {...cfg[key], columns: columns};
}

const baseSchema = {
  workers: {
    index: 'tr-worker',
    key: 'sid',
    columns: [
      { id: 'agentName', numeric: false, disablePadding: true, label: 'Name' },
      { id: 'activityStr', numeric: false, disablePadding: false, label: 'Activity' },
      { id: 'formattedAge', numeric: true, disablePadding: false, label: 'Activity Time', sortFld: 'activityAge' },
      { id: 'tasksStr', numeric: false, disablePadding: false, label: 'Tasks' },
      { id: 'skillsStr', numeric: false, disablePadding: false, label: 'Skills' }
    ],
    defaultSortCol: 'agentName',
    filterDefns: []
  },
  tasks: {
    index: 'tr-task',
    key: 'sid',
    columns: [
      { id: 'from', numeric: false, disablePadding: true, label: 'From' },
      { id: 'status', numeric: false, disablePadding: true, label: 'Status' },
      { id: 'queue_name', numeric: false, disablePadding: true, label: 'Queue' },
      { id: 'formattedAge', numeric: true, disablePadding: false, label: 'Task Time', sortFld: 'statusAge' },
      { id: 'channel_type', numeric: false, disablePadding: false, label: 'Channel' },
      { id: 'worker_name', numeric: false, disablePadding: false, label: 'Agent' },
    ],
    defaultSortCol: 'queue_name',
    filterDefns: [
      {
        name: 'status', label: 'Status', field: 'status',
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
    name: 'activity', label: 'Activity', field: 'activity_name',
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

