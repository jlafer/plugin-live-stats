export function verifyAndFillConfiguration(cfg) {
  if (! cfg)
    throw new Error(`LiveStatsPlugin: attributes.plugin_live_stats NOT configured. See README for instructions.`);
  const workers = verifyAndFillTblConfig(cfg, 'workers');
  const tasks = verifyAndFillTblConfig(cfg, 'tasks');
  return {workers, tasks};
}

const verifyAndFillTblConfig = (cfg, key) => {
  if (!cfg[key])
    throw new Error(`LiveStatsPlugin: attributes.plugin_live_stats missing property ${key}. See README for instructions.`);
  const {columns, filterDefns} = cfg[key];
  const filledColumns = columns.map(col => ({...col, type: 'custom'}));
  return {...cfg[key], columns: filledColumns};
}