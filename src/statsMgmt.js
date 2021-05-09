import { Manager } from "@twilio/flex-ui";
import { initiateTaskStats, updateTaskStats, removeTaskStats, initiateWorkerStats, updateWorkerStats, removeWorkerStats } from "./states";

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
