import React from 'react';
import { Actions, Manager, SideLink } from "@twilio/flex-ui";
import {setStatsPageState} from '../../states';
import { StatsButtonIcon, StatsButtonIconActive } from "./StatsButtonIcon";

export default class SidebarStatsButton extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
    const manager = Manager.getInstance();
    manager.store.dispatch( setStatsPageState('PAGE_ACTIVE') );
		Actions.invokeAction("NavigateToView", { viewName: "stats-page" });
	}

	render() {
		return (
			<SideLink
				{...this.props}
				icon={<StatsButtonIcon />}
				iconActive={<StatsButtonIconActive />}
				isActive={this.props.activeView === "stats-page"}
				onClick={this.handleClick}
			>
				Custom Page Nav
			</SideLink>
		);
	}
}
