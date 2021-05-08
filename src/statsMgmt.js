import { Manager } from "@twilio/flex-ui";
import { initiateTaskStats, updateTaskStats, removeTaskStats } from "./states";

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
