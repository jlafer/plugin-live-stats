import { Manager } from "@twilio/flex-ui";
import {initLiveQuery, updateStatusAges} from './helpers';
import {
  initiateTaskStats, updateTaskStats, removeTaskStats,
  initiateWorkerStats, updateWorkerStats, removeWorkerStats, setIntervalId
} from "./states";

export const startLiveQueries = (manager) => {
  startWorkersQuery(
    manager,
    [
      {name: 'activity', op: '==', value: 'Available'},
      {name: 'team', op: '==', value: 'All'}
    ]
  );
  startTasksQuery(
    manager,
    [
      {name: 'status', op: '==', value: 'Pending'}
    ]
  );
  const intervalId = setInterval(updateStatusAges(manager), 5000);
  const {store} = manager;
  store.dispatch( setIntervalId(intervalId) )
};

export const startWorkersQuery = (manager, filters) => {
  startQuery(
    manager,
    {
      key: 'workers', filters,
      initialCB: initialWorkersCB, updateCB: updateWorkerCB, removeCB: removeWorkerCB
    }
  );
};

export const startTasksQuery = (manager, filters) => {
  startQuery(
    manager,
    {
      key: 'tasks', filters,
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
