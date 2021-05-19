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
        name: 'activity', label: 'Activity', field: 'activity_name',
        options: ['All', 'Available', 'Unavailable', 'Break', 'Offline']
      },
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
        options: ['Pending', 'Reserved', 'Assigned', 'Wrapping']
      }
    ]
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
