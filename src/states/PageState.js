import moment from 'moment-timezone';
import * as R from 'ramda';

import {
  SET_STATS_PAGE_STATE,
  INITIATE_TASK_STATS,
  UPDATE_TASK_STATS,
  REMOVE_TASK_STATS,
  INITIATE_WORKER_STATS,
  UPDATE_WORKER_STATS,
  REMOVE_WORKER_STATS
} from './actions';
import {mapValuesOfObject} from '../helpers';

const makeDtForTz = tz => utcDtStr => moment.utc(utcDtStr).tz(tz);
const makeDt = makeDtForTz('America/Los_Angeles');
const addActivityDateToObj = obj => {
  const dt = makeDt(obj.date_updated);
  return {...obj, activityStartDt: dt};
};
const addActivityDateToEachProp = mapValuesOfObject(addActivityDateToObj);

const mkAddActivityAgeToObj = currDt => obj => {
  const activityAge = currDt.diff(obj.activityStartDt, 'seconds');
  return {...obj, activityAge}
} ;

const addTaskMapToObj = R.assoc('tasks', {});
const addTaskMapToEachProp = mapValuesOfObject(addTaskMapToObj);

const initialState = {
  statsPageState: 'INACTIVE',
  tasks: {},
  workers: {}
};

export default function reduce(state = initialState, action) {
  const currDt = moment();
  
  switch (action.type) {
    case INITIATE_TASK_STATS:
      return {...state, tasks: initiateTaskStats(state, action.payload) };
    case UPDATE_TASK_STATS:
      return updateTaskStats(state, action.payload);
    case REMOVE_TASK_STATS:
      return removeTaskStats(state, action.payload);
    case INITIATE_WORKER_STATS:
      return {...state, workers: initiateWorkerStats(state, action.payload, currDt) };
    case UPDATE_WORKER_STATS:
      return {...state, workers: updateWorkerStats(state, action.payload, currDt) };
    case REMOVE_WORKER_STATS:
      return {...state, workers: removeWorkerStats(state, action.payload) };
    case SET_STATS_PAGE_STATE:
      return {...state, statsPageState: action.payload};
    default:
      return state;
  }
}

const initiateTaskStats = (_state, payload) => {
  return payload;
};

const updateTaskStats = (state, payload) => {
  const {key, value} = payload;
  const tasks = R.assoc(key, value, state.tasks);
  const workers = updateWorkerWithTask(state.workers, key, value);
  return {...state, tasks, workers };
};

const updateWorkerWithTask = (workers, task_sid, task) => {
  const {worker_sid} = task;
  if (!worker_sid || worker_sid === '')
    return workers;
  const worker = workers[worker_sid];
  if ( !worker )
    return workers;
  return R.assoc(worker_sid, addTaskToWorker(worker, task_sid, task), workers);
};

const addTaskToWorker = (worker, task_sid, task) => {
  return R.assoc('tasks', R.assoc(task_sid, task, worker.tasks), worker);
};

const removeTaskStats = (state, payload) => {
  const {key} = payload;
  const task = state.tasks[key];
  const workers = updateWorkerThatHadTask(state.workers, key, task);
  const tasks = R.dissoc(key, state.tasks);
  return {...state, tasks, workers };
};

const updateWorkerThatHadTask = (workers, task_sid, task) => {
  const {worker_sid} = task;
  if (!worker_sid || worker_sid === '')
    return workers;
  const worker = workers[worker_sid];
  if ( !worker )
    return workers;
  return R.assoc(worker_sid, removeTaskFromWorker(worker, task_sid), workers);
};

const removeTaskFromWorker = (worker, task_sid) => {
  return R.assoc('tasks', R.dissoc(task_sid, worker.tasks), worker);
};

const initiateWorkerStats = (_state, items, currDt) => {
  const addActivityAgeToObj = mkAddActivityAgeToObj(currDt);
  const addActivityAgeToEachProp = mapValuesOfObject(addActivityAgeToObj);

  const workersWithActivityDt = addActivityDateToEachProp(items);
  const workersWithActivityAge = addActivityAgeToEachProp(workersWithActivityDt);
  const workersWithTaskMap = addTaskMapToEachProp(workersWithActivityAge);
  return workersWithTaskMap;
};

const updateWorkerStats = (state, payload, currDt) => {
  const addActivityAgeToObj = mkAddActivityAgeToObj(currDt);
  const addActivityAgeToEachProp = mapValuesOfObject(addActivityAgeToObj);
  const {key, value} = payload;
  const workerWithActivityDt = addActivityDateToObj(value);
  const workers = R.assoc(key, workerWithActivityDt, state.workers);
  const workersWithActivityAge = addActivityAgeToEachProp(workers);
  return workersWithActivityAge;
};

const removeWorkerStats = (state, payload) => {
  const {key} = payload;
  return R.dissoc(key, state.workers);
};
