import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import StatsPage from "./components/StatsPage/StatsPageContainer";
import SidebarStatsButton from './components/SidebarStatsButton/SidebarStatsButton';
import reducers, {namespace, setIntervalId} from './states';
import {initLiveQuery, updateStatusAges} from './helpers';
import {initialTasksCB, updateTaskCB, removeTaskCB, initialWorkersCB, updateWorkerCB, removeWorkerCB} from './statsMgmt';

const PLUGIN_NAME = 'LiveStatsPlugin';

export default class TemplatePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    console.log(`${PLUGIN_NAME}: initializing in Flex ${Flex.VERSION} instance`);
    const {store} = manager;
    store.addReducer(namespace, reducers);

    initLiveQuery(
      manager,
      {
        index: 'tr-worker', query: '',
        initialCB: initialWorkersCB, updateCB: updateWorkerCB, removeCB: removeWorkerCB
      }
    );
    initLiveQuery(
      manager,
      {
        index: 'tr-task', query: '',
        initialCB: initialTasksCB, updateCB: updateTaskCB, removeCB: removeTaskCB
      }
    );

    const intervalId = setInterval(updateStatusAges(manager), 5000);
    store.dispatch( setIntervalId(intervalId) )

    // add a side-navigation button for presenting a custom view
    flex.SideNav.Content.add(<SidebarStatsButton key="stats" />);

    // add a custom view
    flex.ViewCollection.Content.add(
      <Flex.View key="stats-page" name="stats-page">
        <StatsPage />
      </Flex.View>
    );
  }
}
