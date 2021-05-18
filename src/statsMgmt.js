import { Manager } from "@twilio/flex-ui";
import {initLiveQuery, updateStatusAges} from './helpers';
import {
  initiateTaskStats, updateTaskStats, removeTaskStats,
  initiateWorkerStats, updateWorkerStats, removeWorkerStats, setIntervalId
} from "./states";

export const startLiveQueries = (manager) => {
  startWorkersQuery(
    manager,
    {field: 'activity_name', op: '==', value: 'Available'}
  );
  startTasksQuery(
    manager,
    {}
  );
  const intervalId = setInterval(updateStatusAges(manager), 5000);
  const {store} = manager;
  store.dispatch( setIntervalId(intervalId) )
};

export const startWorkersQuery = (manager, predicate) => {
  startQuery(
    manager,
    {
      index: 'tr-worker', predicate,
      initialCB: initialWorkersCB, updateCB: updateWorkerCB, removeCB: removeWorkerCB
    }
  );
};

export const startTasksQuery = (manager, predicate) => {
  startQuery(
    manager,
    {
      index: 'tr-task', predicate,
      initialCB: initialTasksCB, updateCB: updateTaskCB, removeCB: removeTaskCB
    }
  );
};

const startQuery = (manager, params) => {
  initLiveQuery(manager, params);
}

const initialTasksCB = (args) => {
  const items = args.getItems();
  Manager.getInstance().store.dispatch( initiateTaskStats(items) );
};

const updateTaskCB = (args) => {
  const {key, value} = args;
  Manager.getInstance().store.dispatch( updateTaskStats(key, value) );
}

const removeTaskCB = (args) => {
  Manager.getInstance().store.dispatch( removeTaskStats(args.key) );
};

const initialWorkersCB = (args) => {
  const items = args.getItems();
  Manager.getInstance().store.dispatch( initiateWorkerStats(items) );
};

const updateWorkerCB = (args) => {
  const {key, value} = args;
  Manager.getInstance().store.dispatch( updateWorkerStats(key, value) );
}

const removeWorkerCB = (args) => {
  Manager.getInstance().store.dispatch( removeWorkerStats(args.key) );
};
