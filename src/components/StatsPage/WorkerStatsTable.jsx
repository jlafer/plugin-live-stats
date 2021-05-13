import * as R from 'ramda';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {formatSecsHHMMSS} from '../../helpers';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const formatTask = R.curry((tasks, task_sid) => {
  const task = tasks[task_sid];
  const {statusAge, status, channel_unique_name, queue_name, attributes: taskAttrs} = task;
  const dt = new Date(null);
  const ageHHMMSS = formatSecsHHMMSS(dt, statusAge);
  const {from} = taskAttrs;
  return `${channel_unique_name} from ${from} via ${queue_name} [${status} for ${ageHHMMSS}]`;
});

function WorkerStatsRow(props) {
  const {data, tasks} = props;
  const {activity_name, activityAge, attributes, tasks: workerTaskSids} = data;
  const taskCnt = workerTaskSids.length;
  const activityStr = (taskCnt === 0) ? activity_name : `${activity_name} - on task`;
  const dt = new Date(null);
  const ageHHMMSS = formatSecsHHMMSS(dt, activityAge);
  const {full_name, routing} = attributes;
  const tasksFrmtd = workerTaskSids.map(formatTask(tasks));
  const tasksStr = tasksFrmtd.join('; ');
  const skills = (routing && routing.skills) ? routing.skills : [];
  const skillsStr = skills.join(', ');
  return (
  <TableRow>
    <TableCell component="th" scope="row">
      {full_name}
    </TableCell>
    <TableCell>{activityStr}</TableCell>
    <TableCell>{ageHHMMSS}</TableCell>
    <TableCell>{tasksStr}</TableCell>
    <TableCell>{skillsStr}</TableCell>
  </TableRow>
  )
}

export default function BasicTable(props) {
  const {workers, tasks} = props;
  const rows = R.values(workers);

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Activity</TableCell>
            <TableCell>Activity Time</TableCell>
            <TableCell>Tasks</TableCell>
            <TableCell>Skills</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => <WorkerStatsRow data={row} tasks={tasks} key={row.worker_sid} />) }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
