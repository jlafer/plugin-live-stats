import * as R from 'ramda';
import React from 'react';

import {makeCustomColumnData} from '../../helpers';
import StatsTable from './StatsTable';

const formatRow = R.curry((schema, task) => {
  //console.log('----------------formatRow: task', task);
  const {task_sid: sid, status, queue_name, channel_type, attributes: taskAttrs, worker_name, statusAge, formatted_age} = task;
  const {from} = taskAttrs;
  const customData = makeCustomColumnData(schema, task);
  const row = {
    sid, from, status, queue_name, formatted_age, statusAge, channel_type, worker_name,
    ...customData
  };
  //console.log('-----------formatRow.task: returning:', row);
  return row;
});

export default function TasksTable(props) {
  const {tasks, query, schema} = props;
  const rows = R.values(tasks).map(formatRow(schema));
  return <StatsTable name="tasks" data={rows} schema={schema} query={query} /> ;
}
