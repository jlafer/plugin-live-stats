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

function WorkerStatsRow(props) {
  const {data} = props;
  const {worker_sid, activity_name, attributes} = data;
  const {full_name} = attributes;
  return (
  <TableRow>
    <TableCell component="th" scope="row">
      {worker_sid}
    </TableCell>
    <TableCell align="right">{full_name}</TableCell>
    <TableCell align="right">{activity_name}</TableCell>
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
            <TableCell>Worker SID</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Activity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => <WorkerStatsRow data={row} key={row.worker_sid} />) }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
