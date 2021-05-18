import moment from 'moment-timezone';
import * as R from 'ramda';

import {
  SET_INTERVAL_ID,
  SET_QUERY,
  SET_STATS_PAGE_STATE,
  UPDATE_STATUS_AGES,
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

const initialState = {
  statsPageState: 'INACTIVE',
  intervalId: 0,
  latestRefreshDate: moment(),
  queries: {},
  tasks: {},
  workers: {}
};

export default function reduce(state = initialState, action) {
  const currDt = moment();
  
  switch (action.type) {
    case SET_QUERY:
      return {...state, queries: setQuery(state.queries, action.payload)};
    case UPDATE_STATUS_AGES:
      return refreshStatusAges(state, currDt);
    case SET_INTERVAL_ID:
      return {...state, intervalId: action.payload};
    case INITIATE_TASK_STATS:
      return initiateTaskStats(state, action.payload, currDt);
    case UPDATE_TASK_STATS:
      return updateOrAddTaskStats(state, action.payload, currDt);
    case REMOVE_TASK_STATS:
      return removeTaskStats(state, action.payload);
    case INITIATE_WORKER_STATS:
      return {...state, workers: initiateWorkerStats(state, action.payload, currDt) };
    case UPDATE_WORKER_STATS:
      return {...state, workers: updateOrAddWorkerStats(state, action.payload, currDt) };
    case REMOVE_WORKER_STATS:
      return {...state, workers: removeWorkerStats(state, action.payload) };
    case SET_STATS_PAGE_STATE:
      return {...state, statsPageState: action.payload};
    default:
      return state;
  }
}

const setQuery = (queries, payload) => {
  const {index, instance, query} = payload;
  return R.assoc(index, {instance, query}, queries);
};

const initiateTaskStats = (state, items, currDt) => {
  const addStateToEachTask = mapValuesOfObject(addStateToTask(currDt));
  const tasksWithState = addStateToEachTask(items);
  const workersWithTasks = addTasksToWorkers(state.workers, tasksWithState);
  return {...state, tasks: tasksWithState, workers: workersWithTasks };
};

const updateOrAddTaskStats = (state, payload, currDt) => {
  const {key, value} = payload;
  const taskInState = state.tasks[key];
  const newTask = (taskInState)
    ? updateTask(taskInState, value, currDt)
    : addStateToTask(currDt, value);
  let tasks = R.assoc(key, newTask, state.tasks);

  let newRefreshDate = state.latestRefreshDate;
  const secsSinceLastRefresh = currDt.diff(state.latestRefreshDate, 'seconds');
  if (secsSinceLastRefresh > 3) {
    tasks = updateStatusAgeOfTasks(tasks, currDt);
    newRefreshDate = currDt;
  }

  const workersWithTasks = updateWorkerWithTask(state.workers, newTask);

  return {...state,
    latestRefreshDate: newRefreshDate, tasks, workers: workersWithTasks
  };
};

const addStateToTask = R.curry((currDt, task) => {
  const statusChangeDate = makeDt(task.date_updated);
  const statusAge = currDt.diff(statusChangeDate, 'seconds');
  return {...task, statusChangeDate, statusAge}
});

const updateTask = (prevTask, currTask, currDt) => {
  const statusChangeDate = (currTask.status == prevTask.status)
    ? prevTask.statusChangeDate
    : makeDt(currTask.date_updated);
  const statusAge = currDt.diff(statusChangeDate, 'seconds');
  return {...currTask, statusChangeDate, statusAge};
};

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

const addTaskToWorker = (worker, task_sid, _task) => {
  return R.assoc('tasks', addTaskSidToList(task_sid, worker.tasks), worker);
};

const addTaskSidToList = (task_sid, tasks) => {
  return ( R.includes(task_sid, tasks) ) ? tasks : R.append(task_sid, tasks)
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
  return R.assoc('tasks', R.without([task_sid], worker.tasks), worker);
};

const initiateWorkerStats = (state, items, currDt) => {
  const addStateToEachWorker = mapValuesOfObject(addStateToWorker(currDt, state.tasks));
  const workersWithState = addStateToEachWorker(items);
  return workersWithState;
};

const updateOrAddWorkerStats = (state, payload, currDt) => {
  const {key, value} = payload;
  const workerInState = state.workers[key];
  const newWorker = (workerInState)
    ? updateWorker(workerInState, value, currDt)
    : addStateToWorker(currDt, state.tasks, value);
  const workers = R.assoc(key, newWorker, state.workers);
  return workers;
};

const addStateToWorker = R.curry((currDt, tasks, worker) => {
  const activityStartDt = makeDt(worker.date_updated);
  const activityAge = currDt.diff(activityStartDt, 'seconds');
  const workerTasks = getTasksForWorker(tasks, worker);
  return {...worker, activityStartDt, activityAge, tasks: workerTasks};
});

const predWorkerSidEqual = R.curry(
  (worker_sid, task) => task.worker_sid = worker_sid
);

const getTasksForWorker = (tasks, worker) =>
  R.values(tasks).filter(predWorkerSidEqual(worker.worker_sid)).map( R.prop('task_sid') );

const updateWorker = (prevWorker, currWorker, currDt) => {
  const activityStartDt = (currWorker.activity_name == prevWorker.activity_name)
    ? prevWorker.activityStartDt
    : makeDt(currWorker.date_updated);
  const activityAge = currDt.diff(activityStartDt, 'seconds');
  return {...currWorker, activityStartDt, activityAge, tasks: prevWorker.tasks};
}

const removeWorkerStats = (state, payload) => {
  const {key} = payload;
  return R.dissoc(key, state.workers);
};

const updateStatusAgeOfTasks = (tasks, currDt) => {
  const updateStatusAgeOfEachTask = mapValuesOfObject(updateStatusAgeOfTask(currDt));
  return updateStatusAgeOfEachTask(tasks);
};

const updateStatusAgeOfTask = R.curry((currDt, task) => {
  const statusAge = currDt.diff(task.statusChangeDate, 'seconds');
  return {...task, statusAge};
});

const updateActivityAgeOfWorkers = (workers, currDt) => {
  const updateActivityAgeOfEachWorker = mapValuesOfObject(updateActivityAgeOfWorker(currDt));
  return updateActivityAgeOfEachWorker(workers);
};

const updateActivityAgeOfWorker = R.curry((currDt, worker) => {
  const activityAge = currDt.diff(worker.activityStartDt, 'seconds');
  return {...worker, activityAge};
});

const refreshStatusAges = (state, currDt) => {
  const tasks = updateStatusAgeOfTasks(state.tasks, currDt);
  const workers = updateActivityAgeOfWorkers(state.workers, currDt);
  return {...state, latestRefreshDate: currDt, tasks, workers}
};
