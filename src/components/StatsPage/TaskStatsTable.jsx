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

function TaskStatsRow(props) {
  const {data} = props;
  const {task_sid, queue_name, channel_type, worker_name} = data;
  return (
  <TableRow>
    <TableCell component="th" scope="row">
      {task_sid}
    </TableCell>
    <TableCell align="right">{queue_name}</TableCell>
    <TableCell align="right">{channel_type}</TableCell>
    <TableCell align="right">{worker_name}</TableCell>
  </TableRow>
  )
}

export default function BasicTable(props) {
  const {tasks} = props;
  const rows = R.values(tasks);

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Task SID</TableCell>
            <TableCell align="right">Queue</TableCell>
            <TableCell align="right">Channel</TableCell>
            <TableCell align="right">Agent</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => <TaskStatsRow data={row} key={row.task_sid} />) }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
