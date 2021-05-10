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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const formatTask = task => {
  const {age, queue_name, attributes: taskAttrs} = task;
  const {channelType, from} = taskAttrs;
  return `${channelType} from ${from} via ${queue_name} [${age} secs]`;
}
function WorkerStatsRow(props) {
  const {data} = props;
  const {activity_name, activityAge, attributes, tasks} = data;
  const {full_name, routing} = attributes;
  const tasksFrmtd = R.values(tasks).map(formatTask);
  const tasksStr = tasksFrmtd.join('; ');
  const skills = (routing && routing.skills) ? routing.skills : [];
  const skillsStr = skills.join(', ');
  return (
  <TableRow>
    <TableCell component="th" scope="row">
      {full_name}
    </TableCell>
    <TableCell align="right">{activity_name}</TableCell>
    <TableCell align="right">{activityAge}</TableCell>
    <TableCell align="right">{tasksStr}</TableCell>
    <TableCell align="right">{skillsStr}</TableCell>
  </TableRow>
  )
}

export default function BasicTable(props) {
  const {workers} = props;
  const rows = R.values(workers);

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Activity</TableCell>
            <TableCell align="right">Activity Time</TableCell>
            <TableCell align="right">Tasks</TableCell>
            <TableCell align="right">Skills</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => <WorkerStatsRow data={row} key={row.worker_sid} />) }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
