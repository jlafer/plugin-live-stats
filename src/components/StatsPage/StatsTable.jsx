import * as R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
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
import { Manager } from "@twilio/flex-ui";
import {startQuery} from "../../statsMgmt";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy])
    return -1;
  if (b[orderBy] > a[orderBy])
    return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { columns, classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const StatsRow = (props) => {
  const {data, schema, index} = props;
  const {columns, defaultSortCol} = schema;
  const labelId = `enhanced-table-checkbox-${index}`;

  return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      key={data[defaultSortCol]}
    >
      <TableCell component="th" id={labelId} scope="row" padding="none">
        {data[columns[0].id]}
      </TableCell>
      {columns.slice(1).map((col, idx) => <TableCell align={col.numeric ? 'right' : 'left'} key={idx} >{data[col.id]}</TableCell>)}
    </TableRow>
  );
};

const handleFilterValueChange = R.curry((qryName, filters, event) => {
  const name = event.target.name;
  const filter = {name: name, op: '==', value: event.target.value};
  const newFilters = replaceFilter(filters, filter);
  startQuery(Manager.getInstance(), qryName, newFilters);
});

const replaceFilter = (filters, filter) =>
  filters.map(f => (f.name === filter.name) ? filter : f);

const FilterSelect = (props) => {
  const {qryName, filterDefn, filters, classes} = props;
  const {name, label, options} = filterDefn;
  const filter = filters.find(f => f.name === name);
  const valueStr = filter ? filter.value : '';
  const selectId = `select-${name}`;
  const labelId = `select-${name}-label`;
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={selectId}
        value={valueStr}
        name={name}
        onChange={handleFilterValueChange(qryName, filters)}
      >
        {options.map((option, index) => <MenuItem value={option.name} key={index} >{option.label}</MenuItem>)}
      </Select>
    </FormControl>
  )
};

export default function StatsTable(props) {
  console.log('----------------StatsTable: props', props);
  const {name, data, schema, query} = props;
  if (!query)
    return null;
  const {filters} = query;
  const {columns, key, defaultSortCol, filterDefns} = schema;
  const rows = data;

  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(defaultSortCol);
  const [page, setPage] = React.useState(0);
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

  const sortFldForCol = (columns, orderBy) => {
    const colDefn = columns.find(cd => cd.id === orderBy);
    return (colDefn.sortFld) ? colDefn.sortFld : orderBy;
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              columns={columns}
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, sortFldForCol(columns, orderBy)))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => <StatsRow data={row} schema={schema} index={index} key={row[key]} />)}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
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
      {filterDefns.map(fd => <FilterSelect qryName={name} filterDefn={fd} filters={filters} classes={classes} key={fd.name} />)}
    </div>
  );
}
