import * as R from 'ramda';
import React from 'react';

import StatsTable from './StatsTable';

const formatRow = (task) => {
  console.log('----------------formatRow: task', task);
  const {task_sid: sid, status, queue_name, channel_type, attributes: taskAttrs, worker_name, statusAge, formattedAge} = task;
  const {from} = taskAttrs;
  return {sid, from, status, queue_name, formattedAge, statusAge, channel_type, worker_name};
};

export default function TasksTable(props) {
  const {tasks, query, schema} = props;
  const rows = R.values(tasks).map(formatRow);
  return <StatsTable name="tasks" data={rows} schema={schema} query={query} /> ;
}
