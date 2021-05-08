export const initLiveQuery = async (manager) => {
  const workersRes = await manager.insightsClient
    .liveQuery('tr-worker', 'data.activity_name == "Available"')
  console.log('subscribed to live data updates for workers');
  const workers = workersRes.getItems();
  Object.entries(workers).forEach(([key, value]) => {
      console.log(`Worker: ${key}`);
      console.log('  data: ', value);
  });
  workersRes.on('itemRemoved', function (workerRes) {
    console.log('Worker ' + workerRes.key + ' is no longer "Available"');
  });
  workersRes.on('itemUpdated', function (workerRes) {
    const {key, value} = workerRes;
    console.log(`worker update: ${key}:`, value);
  });
  const tasksRes = await manager.insightsClient
    .liveQuery('tr-task', '')
  console.log('subscribed to live data updates for tasks');
  const tasks = tasksRes.getItems();
  Object.entries(tasks).forEach(([key, value]) => {
      console.log(`Task: ${key}`);
      console.log('  data: ', value);
  });
  tasksRes.on('itemRemoved', function (taskRes) {
    console.log('Task ' + taskRes.key + ' has gone away');
  });
  tasksRes.on('itemUpdated', function (taskRes) {
    const {key, value} = taskRes;
    console.log(`task update: ${key}:`, value);
  });
}
