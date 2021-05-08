import React from "react";

import "./StatsPage.css";
import TaskStatsTable from './TaskStatsTable';

export default function StatsPage (props) {
  const {pageState} = props;
  const {statsPageState, tasks, workers} = pageState;
  return (
    <div>
      <h1>My Stats Page</h1>
      <h2>Tasks</h2>
      <TaskStatsTable tasks={tasks}/>
      <h2>Agents</h2>
    </div>
  );
}
