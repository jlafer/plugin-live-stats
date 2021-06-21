import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import {getPluginConfiguration} from 'jlafer-flex-util';

import StatsPage from "./components/StatsPage/StatsPageContainer";
import SidebarStatsButton from './components/SidebarStatsButton/SidebarStatsButton';
import reducers, {namespace, initQueries} from './states';
import {startLiveQueries} from './statsMgmt';
import {
  addConfigurationToSchema, addWorkerActivityFilterDefn, verifyAndFillConfiguration
} from './pluginConfig';

const PLUGIN_NAME = 'LiveStatsPlugin';

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
    const schemaWithWorkerActivityFilter = addWorkerActivityFilterDefn(store);
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
