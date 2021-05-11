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
};
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
      return initiateTaskStats(state, action.payload, currDt);
    case UPDATE_TASK_STATS:
      return updateTaskStats(state, action.payload, currDt);
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

const addStateToTask = R.curry((currDt, task) => {
  const statusChangeDate = makeDt(task.date_updated);
  const statusAge = currDt.diff(statusChangeDate, 'seconds');
  return {...task, statusChangeDate, statusAge}
});

const addTasksToWorkers = (workers, tasks) => {
  return R.reduce(updateWorkerWithTask, workers, R.values(tasks))
};

const updateWorkerWithTask = (workers, task) => {
  const {task_sid, worker_sid} = task;
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

const initiateTaskStats = (state, items, currDt) => {
  const addStateToEachTask = mapValuesOfObject(addStateToTask(currDt));
  const tasksWithState = addStateToEachTask(items);
  const workersWithTasks = addTasksToWorkers(state.workers, tasksWithState);
  return {...state, tasks: tasksWithState, workers: workersWithTasks };
};

const updateTaskStats = (state, payload, currDt) => {
  const {key, value} = payload;
  const taskInState = state.tasks[key];
  const newTask = (taskInState)
    ? updateTask(taskInState, value, currDt)
    : addStateToTask(currDt, value);
  const tasks = R.assoc(key, newTask, state.tasks);
  const workersWithTasks = updateWorkerWithTask(state.workers, newTask);
  return {...state, tasks, workers: workersWithTasks };
};

const updateTask = (prevTask, currTask, currDt) => {
  const statusChangeDate = (currTask.status == prevTask.status)
    ? prevTask.statusChangeDate
    : makeDt(currTask.date_updated);
  const statusAge = currDt.diff(statusChangeDate, 'seconds');
  return {...currTask, statusChangeDate, statusAge};
};

const removeTaskStats = (state, payload) => {
  const {key} = payload;
  const task = state.tasks[key];
  const workers = (!!task) ? updateWorkerThatHadTask(state.workers, key, task) : state.workers;
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
