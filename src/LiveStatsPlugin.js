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
    columns: [],
    filterDefns: []
  },
  tasks: {
    index: 'tr-task',
    columns: [],
    filterDefns: []
  }
};

const nameToNameAndLabelObj = (name, nameToLabelFn) => {
  const label = nameToLabelFn ? nameToLabelFn(name) : name;
  return ({name: name, label: label})
};

const addWorkerActivityFilterDefn = (store, schema) => {
  const {workers} = schema;
  const {columns, filterDefns} = workers;
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
  const tasksConfigured = addFilterDefnsToTbl(tasks, config.tasks);
  const workersConfigured = addFilterDefnsToTbl(workers, config.workers);
  return {tasks: tasksConfigured, workers: workersConfigured};
};

const addFilterDefnsToTbl = (curr, toAdd) => {
  return {...curr, filterDefns: R.concat(curr.filterDefns, toAdd.filterDefns)}
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
