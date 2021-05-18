import { Manager } from "@twilio/flex-ui";
import {initLiveQuery, updateStatusAges} from './helpers';
import {
  initiateTaskStats, updateTaskStats, removeTaskStats,
  initiateWorkerStats, updateWorkerStats, removeWorkerStats, setIntervalId
} from "./states";

export const startLiveQueries = (manager) => {
  startQuery(
    manager,
    {
      index: 'tr-worker', query: 'data.activity_name == "Available"',
      initialCB: initialWorkersCB, updateCB: updateWorkerCB, removeCB: removeWorkerCB
    },
  );
  startQuery(
    manager,
    {
      index: 'tr-task', query: '',
      initialCB: initialTasksCB, updateCB: updateTaskCB, removeCB: removeTaskCB
    }
  );

  const intervalId = setInterval(updateStatusAges(manager), 5000);
  const {store} = manager;
  store.dispatch( setIntervalId(intervalId) )
};

export const startQuery = (manager, params) => {
  initLiveQuery(manager, params);
}

export const initialTasksCB = (args) => {
  const items = args.getItems();
  Manager.getInstance().store.dispatch( initiateTaskStats(items) );
};

export const updateTaskCB = (args) => {
  const {key, value} = args;
  Manager.getInstance().store.dispatch( updateTaskStats(key, value) );
}

export const removeTaskCB = (args) => {
  Manager.getInstance().store.dispatch( removeTaskStats(args.key) );
};

export const initialWorkersCB = (args) => {
  const items = args.getItems();
  Manager.getInstance().store.dispatch( initiateWorkerStats(items) );
};

export const updateWorkerCB = (args) => {
  const {key, value} = args;
  Manager.getInstance().store.dispatch( updateWorkerStats(key, value) );
}

export const removeWorkerCB = (args) => {
  Manager.getInstance().store.dispatch( removeWorkerStats(args.key) );
};
