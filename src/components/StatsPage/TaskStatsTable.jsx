import * as R from 'ramda';
import React from 'react';

import StatsTable from './StatsTable';

const formatRow = (task) => {
  console.log('----------------formatRow: task', task);
  const {task_sid: sid, status, queue_name, channel_type, attributes: taskAttrs, worker_name, statusAge, formattedAge} = task;
  const {from} = taskAttrs;
  return {sid, from, status, queue_name, formattedAge, statusAge, channel_type, worker_name};
};

const metadata = {
  key: 'sid',
  cols: [
    { id: 'from', numeric: false, disablePadding: true, label: 'From' },
    { id: 'status', numeric: false, disablePadding: true, label: 'Status' },
    { id: 'queue_name', numeric: false, disablePadding: true, label: 'Queue' },
    { id: 'formattedAge', numeric: true, disablePadding: false, label: 'Task Time', sortFld: 'statusAge' },
    { id: 'channel_type', numeric: false, disablePadding: false, label: 'Channel' },
    { id: 'worker_name', numeric: false, disablePadding: false, label: 'Agent' },
  ],
  defaultSortCol: 'queue_name'
};

export default function TasksTable(props) {
  const {tasks, query, queryDefn} = props;
  const rows = R.values(tasks).map(formatRow);
  return <StatsTable name="tasks" data={rows} metadata={metadata} query={query} queryDefn={queryDefn} /> ;
}
