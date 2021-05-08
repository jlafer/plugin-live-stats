export const initLiveQuery = (manager) => {
  manager.insightsClient
  .liveQuery('tr-worker', 'data.activity_name == "Available"')
  .then(function (args) {
    console.log(
      'Subscribed to live data updates for worker in "Available" activity'
    );
    args.on('itemRemoved', function (args) {
      console.log('Worker ' + args.key + ' is no longer "Available"');
    });
    args.on('itemUpdated', function (args) {
      console.log('Worker ' + args.key + ' is now "Available"');
    });
  })
  .catch(function (err) {
    console.log('Error when subscribing to live updates', err);
  });
}
