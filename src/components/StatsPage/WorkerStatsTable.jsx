import * as R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import {formatSecsHHMMSS} from '../../helpers';

const formatTask = R.curry((tasks, task_sid) => {
  const task = tasks[task_sid];
  const {statusAge, status, channel_unique_name, queue_name, attributes: taskAttrs} = task;
  const dt = new Date(null);
  const ageHHMMSS = formatSecsHHMMSS(dt, statusAge);
  const {from} = taskAttrs;
  return `${channel_unique_name} from ${from} via ${queue_name} [${status} for ${ageHHMMSS}]`;
});

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  console.log(`--------------sorting by ${orderBy}`);
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  console.log(`--------------sorting table...`);
  console.log('unsorted:', array);
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  console.log('sorted:', stabilizedThis);
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'agentName', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'activityStr', numeric: false, disablePadding: false, label: 'Activity' },
  { id: 'activityHHMMSS', numeric: true, disablePadding: false, label: 'Activity Time' },
  { id: 'tasksStr', numeric: false, disablePadding: false, label: 'Tasks' },
  { id: 'skillsStr', numeric: false, disablePadding: false, label: 'Skills' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const formatRow = R.curry((tasks, worker) => {
  const {worker_sid, activity_name, activityAge, attributes, tasks: workerTaskSids} = worker;
  const taskCnt = workerTaskSids.length;
  const activityStr = (taskCnt === 0) ? activity_name : `${activity_name} - on task`;
  const dt = new Date(null);
  const activityHHMMSS = formatSecsHHMMSS(dt, activityAge);
  const {full_name: agentName, routing} = attributes;
  const tasksFrmtd = workerTaskSids.map(formatTask(tasks));
  const tasksStr = tasksFrmtd.join('; ');
  const skills = (routing && routing.skills) ? routing.skills : [];
  const skillsStr = skills.join(', ');
  return {worker_sid, agentName, activityStr, activityHHMMSS, tasksStr, skillsStr};
});

const WorkerStatsRow = (props) => {
  const {data, index} = props;
  const {agentName, activityStr, activityHHMMSS, tasksStr, skillsStr} = data;
  const labelId = `enhanced-table-checkbox-${index}`;

  return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      key={agentName}
    >
      <TableCell component="th" id={labelId} scope="row" padding="none">
        {agentName}
      </TableCell>
      <TableCell align="right">{activityStr}</TableCell>
      <TableCell align="right">{activityHHMMSS}</TableCell>
      <TableCell align="right">{tasksStr}</TableCell>
      <TableCell align="right">{skillsStr}</TableCell>
    </TableRow>
  );
};

export default function EnhancedTable(props) {
  const {workers, tasks} = props;
  const rows = R.values(workers).map(formatRow(tasks));

  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('agentName');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => <WorkerStatsRow data={row} index={index} key={row.worker_sid} />)}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}
