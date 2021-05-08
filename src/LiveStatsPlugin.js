import * as R from 'ramda';
import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import StatsPage from "./components/StatsPage/StatsPageContainer";
import SidebarStatsButton from './components/SidebarStatsButton/SidebarStatsButton';
import reducers, {
  namespace, setCurrentTask, setServerlessUri
} from './states';
import {initLiveQuery} from './helpers';

const PLUGIN_NAME = 'LiveStatsPlugin';

export default class TemplatePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    console.log(`${PLUGIN_NAME}: initializing in Flex ${Flex.VERSION} instance`);
    const {store, serviceConfiguration} = manager;
    store.addReducer(namespace, reducers);
    const serverlessUri = process.env.REACT_APP_SERVERLESS_URI;
    console.log(`${PLUGIN_NAME}: serverless uri = ${serverlessUri}`);
    store.dispatch( setServerlessUri(serverlessUri) );

    initLiveQuery(manager);

    // add a side-navigation button for presenting a custom view
    flex.SideNav.Content.add(<SidebarStatsButton key="stats" />);

    // add a custom view
    flex.ViewCollection.Content.add(
      <Flex.View key="stats-page" name="stats-page">
        <StatsPage serverlessUri={serverlessUri} />
      </Flex.View>
    );
  }
}