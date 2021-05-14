import React from "react";

import "./StatsPage.css";
import TaskStatsTable from './TaskStatsTable';
import WorkerStatsTable from './WorkerStatsTable';

export default function StatsPage (props) {
  const {pageState} = props;
  const {tasks, workers} = pageState;
  return (
    <div>
      <h1>My Stats Page</h1>
      <h2>Tasks</h2>
      <TaskStatsTable tasks={tasks}/>
      <h2>Agents</h2>
      <WorkerStatsTable workers={workers} tasks={tasks}/>
    </div>
  );
}
