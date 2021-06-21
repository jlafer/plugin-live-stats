import * as R from 'ramda';
import React from 'react';

import {makeCustomColumnData} from '../../helpers';
import StatsTable from './StatsTable';

const formatTask = R.curry((tasks, task_sid) => {
  const task = tasks[task_sid];
  const {statusAge, status, channel_unique_name, queue_name, attributes: taskAttrs} = task;
  const {from} = taskAttrs;
  return `${channel_unique_name} from ${from} via ${queue_name} [${status} for ${statusAge} secs]`;
});

const formatRow = R.curry((schema, tasks, worker) => {
  console.log('-----------formatRow.worker: schema:', schema);
  console.log('-----------formatRow.worker: worker:', worker);
  const {worker_sid: sid, activity_name, activityAge, formattedAge, attributes, tasks: workerTaskSids} = worker;
  const taskCnt = workerTaskSids.length;
  const activityStr = (taskCnt === 0) ? activity_name : `${activity_name} - on task`;
  const {full_name: agentName, routing} = attributes;
  const tasksFrmtd = workerTaskSids.map(formatTask(tasks));
  const tasksStr = tasksFrmtd.join('; ');
  const skills = (routing && routing.skills) ? routing.skills : [];
  const skillsStr = skills.join(', ');
  const customData = makeCustomColumnData(schema, worker);
  const row = {
    sid, agentName, activityStr, activityAge, formattedAge, tasksStr, skillsStr,
    ...customData
  };
  console.log('-----------formatRow.worker: returning:', row);
  return row;
});

export default function WorkersTable(props) {
  const {workers, tasks, query, schema} = props;
  const rows = R.values(workers).map(formatRow(schema, tasks));
  return <StatsTable name="workers" data={rows} schema={schema} query={query} /> ;
}
