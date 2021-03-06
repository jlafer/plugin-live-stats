import React from "react";

import "./StatsPage.css";
import TaskStatsTable from './TaskStatsTable';
import WorkerStatsTable from './WorkerStatsTable';

export default function StatsPage (props) {
  const {pageState} = props;
  const {tasks, workers, queries, schema} = pageState;
  return (
    <div>
      <div className="statsTbl">
        <h2 className="statsTitle">Tasks</h2>
        <TaskStatsTable tasks={tasks} query={queries.tasks} schema={schema.tasks}/>
      </div>
      <div className="statsTbl">
        <h2 className="statsTitle">Agents</h2>
        <WorkerStatsTable workers={workers} tasks={tasks} query={queries.workers} schema={schema.workers}/>
      </div>
    </div>
  );
}
