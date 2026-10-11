const stamp = () => new Date().toISOString().slice(11, 23);

const make =
  (tag: string) =>
  (...args: unknown[]) => {
    if (process.env.VITEST) return; // keep test output clean
    console.log(`[${stamp()}] ${tag}`, ...args);
  };

export const log = {
  http: make('HTTP'),
  ws: make('WS  '),
  sim: make('SIM '),
  info: make('INFO'),
};
