import * as R from 'ramda';
import React from 'react';

import {formatSecsHHMMSS} from '../../helpers';
import StatsTable from './StatsTable';

const formatTask = R.curry((tasks, task_sid) => {
  const task = tasks[task_sid];
  const {statusAge, status, channel_unique_name, queue_name, attributes: taskAttrs} = task;
  const dt = new Date(null);
  const ageHHMMSS = formatSecsHHMMSS(dt, statusAge);
  const {from} = taskAttrs;
  return `${channel_unique_name} from ${from} via ${queue_name} [${status} for ${ageHHMMSS}]`;
});

const formatRow = R.curry((tasks, worker) => {
  const {worker_sid: sid, activity_name, activityAge, attributes, tasks: workerTaskSids} = worker;
  const taskCnt = workerTaskSids.length;
  const activityStr = (taskCnt === 0) ? activity_name : `${activity_name} - on task`;
  const dt = new Date(null);
  const activityHHMMSS = formatSecsHHMMSS(dt, activityAge);
  const {full_name: agentName, routing} = attributes;
  const tasksFrmtd = workerTaskSids.map(formatTask(tasks));
  const tasksStr = tasksFrmtd.join('; ');
  const skills = (routing && routing.skills) ? routing.skills : [];
  const skillsStr = skills.join(', ');
  return {sid, agentName, activityStr, activityHHMMSS, tasksStr, skillsStr};
});

const metadata = {
  key: 'sid',
  cols: [
    { id: 'agentName', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'activityStr', numeric: false, disablePadding: false, label: 'Activity' },
    { id: 'activityHHMMSS', numeric: true, disablePadding: false, label: 'Activity Time' },
    { id: 'tasksStr', numeric: false, disablePadding: false, label: 'Tasks' },
    { id: 'skillsStr', numeric: false, disablePadding: false, label: 'Skills' }
  ],
  defaultSortCol: 'agentName'
};

export default function WorkersTable(props) {
  const {workers, tasks, query} = props;
  const rows = R.values(workers).map(formatRow(tasks));
  return <StatsTable data={rows} metadata={metadata} query={query} /> ;
}
