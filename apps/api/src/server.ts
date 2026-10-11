import { createServer } from 'node:http';
import { createApp } from './app';
import { createHub } from './hub';
import { startSimulator } from './simulator';
import { Store } from './store';
import { log } from './logger';

const PORT = Number(process.env.PORT ?? 4000);
const SIMULATE = (process.env.SIMULATE ?? (process.env.NODE_ENV === 'production' ? 'false' : 'true')) === 'true';
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000';

const store = new Store();
const server = createServer();
const hub = createHub(server);
server.on('request', createApp({ store, hub, corsOrigin: CORS_ORIGIN }));

const stopSimulator = SIMULATE ? startSimulator(store, hub) : undefined;

server.listen(PORT, () => {
  log.info(`API  http://localhost:${PORT}   WS  ws://localhost:${PORT}/ws   simulate=${SIMULATE}`);
});

const shutdown = () => {
  log.info('shutting down...');
  stopSimulator?.();
  hub.close();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 3000).unref();
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
