import { Manager } from "@twilio/flex-ui";
import {initLiveQuery, updateStatusAges} from './helpers';
import {
  initiateTaskStats, updateTaskStats, removeTaskStats,
  initiateWorkerStats, updateWorkerStats, removeWorkerStats, setIntervalId
} from "./states";

export const startLiveQueries = (manager, schema) => {
  const {tasks, workers} = schema;

  startQuery(
    manager,
    'workers',
    makeFiltersFromDefns(workers.filterDefns)
  );
  startQuery(
    manager,
    'tasks',
    makeFiltersFromDefns(tasks.filterDefns)
  );
  const intervalId = setInterval(updateStatusAges(manager), 5000);
  const {store} = manager;
  store.dispatch( setIntervalId(intervalId) )
};

const makeFiltersFromDefns = (filterDefns) => {
  return filterDefns.map(defn => {
    const {name, defaultOption} = defn;
    return {name,  op: '==', value: defaultOption}
  })
};

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

const callbacks = {
  workers: {
    initialCB: initialWorkersCB, updateCB: updateWorkerCB, removeCB: removeWorkerCB
  },
  tasks: {
    initialCB: initialTasksCB, updateCB: updateTaskCB, removeCB: removeTaskCB
  }
};

export const startQuery = (manager, key, filters) => {
  const qryCBs = callbacks[key];
  const {initialCB, updateCB, removeCB} = qryCBs;
  initLiveQuery(
    manager,
    {key, filters, initialCB, updateCB, removeCB}
  );
};
