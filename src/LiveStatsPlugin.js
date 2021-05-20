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
        options: ['All', 'Red', 'Blue', 'Green', 'Yellow']
      }
    ]
  },
  tasks: {
    index: 'tr-task',
    filterDefns: [
      {
        name: 'status', label: 'Status', field: 'status',
        options: ['All', 'pending', 'reserved', 'assigned', 'wrapping']
      }
    ]
  }
};

const addWorkerActivityFilterDefn = (store, querySchema) => {
  const activities = Object.fromEntries(store.getState().flex.worker.activities);
  const activityNames = R.pipe(R.values, R.map(R.prop('name')), R.append('All'))(activities);
  querySchema.workers.filterDefns.push({
    name: 'activity', label: 'Activity', field: 'activity_name',
    options: activityNames
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
