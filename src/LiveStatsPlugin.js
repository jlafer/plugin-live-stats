import * as R from 'ramda';
import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import StatsPage from "./components/StatsPage/StatsPageContainer";
import SidebarStatsButton from './components/SidebarStatsButton/SidebarStatsButton';
import reducers, {namespace, initQueries} from './states';
import {startLiveQueries} from './statsMgmt';

const PLUGIN_NAME = 'LiveStatsPlugin';

const querySchema = {
  workers: {
    index: 'tr-worker',
    filterDefns: [
      {
        name: 'team', label: 'Team', field: 'attributes.team',
        options: [
          {label: 'All', name: 'All'},
          {label: 'Red', name: 'Red'},
          {label: 'Blue', name: 'Blue'},
          {label: 'Green', name: 'Green'},
          {label: 'Yellow', name: 'Yellow'}
        ]
      }
    ]
  },
  tasks: {
    index: 'tr-task',
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
    ]
  }
};

const nameToNameAndLabelObj = (name, nameToLabelFn) => {
  const label = nameToLabelFn ? nameToLabelFn(name) : name;
  return ({name: name, label: label})
};

const addWorkerActivityFilterDefn = (store, querySchema) => {
  const activities = Object.fromEntries(store.getState().flex.worker.activities);
  const activityOptions = R.pipe(R.values, R.map(R.prop('name')), R.map(nameToNameAndLabelObj), R.append({name: 'All', label: 'All'}))(activities);
  querySchema.workers.filterDefns.push({
    name: 'activity', label: 'Activity', field: 'activity_name',
    options: activityOptions
  });
};

export default class LiveStatsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    console.log(`${PLUGIN_NAME}: initializing in Flex ${Flex.VERSION} instance`);
    const {store} = manager;
    store.addReducer(namespace, reducers);
    // NOTE: mutates querySchema
    addWorkerActivityFilterDefn(store, querySchema);
    manager.store.dispatch( initQueries(querySchema) );
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
