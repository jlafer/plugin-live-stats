export const initLiveQuery = async (manager, params) => {
  const {index, query, initialCB, updateCB, removeCB} = params;
  const res = await manager.insightsClient.liveQuery(index, query);
  console.log(`subscribed to LiveQuery for ${index} where -${query}-  `);
  initialCB(res);
  res.on('itemRemoved', removeCB);
  res.on('itemUpdated', updateCB);
}
