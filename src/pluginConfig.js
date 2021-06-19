export function verifyAndFillConfiguration(cfg) {
  if (! cfg)
    throw new Error(`LiveStatsPlugin: attributes.plugin_live_stats NOT configured. See README for instructions.`);
  verifyProperty(cfg, 'workers');
  verifyProperty(cfg, 'tasks');
  const {workers, tasks} = cfg;
  return {workers, tasks};
}

const verifyProperty = (cfg, key) => {
  if (!cfg[key])
    throw new Error(`LiveStatsPlugin: attributes.plugin_live_stats missing property ${key}. See README for instructions.`);
}