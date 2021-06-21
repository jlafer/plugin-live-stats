import * as R from 'ramda';
import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import {getPluginConfiguration} from 'jlafer-flex-util';

import StatsPage from "./components/StatsPage/StatsPageContainer";
import SidebarStatsButton from './components/SidebarStatsButton/SidebarStatsButton';
import reducers, {namespace, initQueries} from './states';
import {startLiveQueries} from './statsMgmt';
import {verifyAndFillConfiguration} from './pluginConfig';

const PLUGIN_NAME = 'LiveStatsPlugin';

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

const addWorkerActivityFilterDefn = (store, schema) => {
  const {workers} = schema;
  const {filterDefns} = workers;
  const activities = Object.fromEntries(store.getState().flex.worker.activities);
  const activityOptions = R.pipe(R.values, R.map(R.prop('name')), R.map(nameToNameAndLabelObj), R.append({name: 'All', label: 'All'}))(activities);
  const activityFilter = {
    name: 'activity', label: 'Activity', field: 'activity_name',
    options: activityOptions
  };
  const filterDefnsWithActivity = R.append(activityFilter, filterDefns);
  const workersSchemaWithActivity = {...workers, filterDefns: filterDefnsWithActivity};
  return {...schema, workers: workersSchemaWithActivity}
};

const addConfigurationToSchema = (schema, config) => {
  const {tasks, workers} = schema;
  const tasksConfigured = addConfigurationToTbl(tasks, config.tasks);
  const workersConfigured = addConfigurationToTbl(workers, config.workers);
  return {tasks: tasksConfigured, workers: workersConfigured};
};

const addConfigurationToTbl = (curr, toAdd) => {
  return {...curr,
    filterDefns: R.concat(curr.filterDefns, toAdd.filterDefns),
    columns: R.concat(curr.columns, toAdd.columns)
  }
};

export default class LiveStatsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    console.log(`${PLUGIN_NAME}: initializing in Flex ${Flex.VERSION} instance`);
    
    const {store} = manager;
    store.addReducer(namespace, reducers);
    const rawConfig = getPluginConfiguration(manager, 'plugin_live_stats');
    const config = verifyAndFillConfiguration(rawConfig);
    console.log(`${PLUGIN_NAME}: config:`, config);
    const schemaWithWorkerActivityFilter = addWorkerActivityFilterDefn(store, baseSchema);
    const schema = addConfigurationToSchema(schemaWithWorkerActivityFilter, config);
    console.log(`${PLUGIN_NAME}: schema:`, schema);
    manager.store.dispatch( initQueries(schema) );
    startLiveQueries(manager);

    // add a side-navigation button for presenting the StatsPage
    flex.SideNav.Content.add(<SidebarStatsButton key="stats" />);

    // add the StatsPage as a custom view
    flex.ViewCollection.Content.add(
      <Flex.View key="stats-page" name="stats-page">
        <StatsPage />
      </Flex.View>
    );
  }
}
