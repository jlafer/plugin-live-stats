import * as R from 'ramda';
import React from 'react';

import {decodeContactUri, makeCustomColumnData} from '../../helpers';
import StatsTable from './StatsTable';

const formatTask = R.curry((tasks, task_sid) => {
  const task = tasks[task_sid];
  const {statusAge, status, channel_unique_name, queue_name, attributes: taskAttrs} = task;
  const {from} = taskAttrs;
  return `${channel_unique_name} from ${from} via ${queue_name} [${status} for ${statusAge} secs]`;
});

const formatRow = R.curry((schema, tasks, worker) => {
  const {worker_sid: sid, activity_name, activityAge, formatted_age, attributes, tasks: workerTaskSids} = worker;
  const taskCnt = workerTaskSids.length;
  const activity_str = (taskCnt === 0) ? activity_name : `${activity_name} - on task`;
  const {contact_uri: uriRaw, full_name: agent_name, routing} = attributes;
  const tasksFrmtd = workerTaskSids.map(formatTask(tasks));
  const tasks_str = tasksFrmtd.join('; ');
  const skills = (routing && routing.skills) ? routing.skills : [];
  const skills_str = skills.join(', ');
  const contact_uri = decodeContactUri(uriRaw);
  const customData = makeCustomColumnData(schema, worker);
  const row = {
    sid, agent_name, activity_name, activity_str, activityAge, contact_uri, formatted_age, tasks_str, skills_str,
    ...customData
  };
  //console.log('-----------formatRow.worker: returning:', row);
  return row;
});

export default function WorkersTable(props) {
  const {workers, tasks, query, schema} = props;
  const rows = R.values(workers).map(formatRow(schema, tasks));
  return <StatsTable name="workers" data={rows} schema={schema} query={query} /> ;
}
