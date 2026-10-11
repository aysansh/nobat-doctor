import type { Server } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';
import { ClientMessageSchema, type ServerMessage } from '@nobat/shared';
import { log } from './logger';

/** What the REST layer needs from the realtime layer (easy to fake in tests). */
export interface Broadcaster {
  broadcast(doctorId: string, message: ServerMessage): void;
}

type Client = WebSocket & { isAlive: boolean; subscriptions: Set<string>; id: number };

const HEARTBEAT_MS = 30_000;

export function createHub(server: Server, opts: { heartbeatMs?: number } = {}) {
  const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 4 * 1024 });
  const rooms = new Map<string, Set<Client>>();
  let nextId = 1;

  const send = (client: WebSocket, message: ServerMessage) => {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(message));
  };

  wss.on('connection', (socket, req) => {
    const client = socket as Client;
    client.isAlive = true;
    client.subscriptions = new Set();
    client.id = nextId++;
    log.ws(`#${client.id} connected from ${req.socket.remoteAddress} (total: ${wss.clients.size})`);

    client.on('pong', () => {
      client.isAlive = true;
    });

    client.on('message', (raw) => {
      let json: unknown;
      try {
        json = JSON.parse(raw.toString());
      } catch {
        return send(client, { type: 'error', message: 'Invalid JSON' });
      }
      const parsed = ClientMessageSchema.safeParse(json);
      if (!parsed.success) {
        log.ws(`#${client.id} invalid message`, raw.toString());
        return send(client, { type: 'error', message: 'Invalid message' });
      }
      const { type, doctorId } = parsed.data;
      if (type === 'subscribe') {
        if (!rooms.has(doctorId)) rooms.set(doctorId, new Set());
        rooms.get(doctorId)!.add(client);
        client.subscriptions.add(doctorId);
      } else {
        rooms.get(doctorId)?.delete(client);
        client.subscriptions.delete(doctorId);
      }
      log.ws(`#${client.id} ${type} doctor=${doctorId} (subs: [${[...client.subscriptions]}])`);
    });

    client.on('close', (code) => {
      client.subscriptions.forEach((id) => rooms.get(id)?.delete(client));
      log.ws(`#${client.id} closed (code ${code}) (total: ${wss.clients.size})`);
    });
    client.on('error', (err) => log.ws(`#${client.id} error:`, err.message));
  });

  const heartbeat = setInterval(() => {
    wss.clients.forEach((socket) => {
      const client = socket as Client;
      if (!client.isAlive) {
        log.ws(`#${client.id} heartbeat timeout -> terminate`);
        return client.terminate();
      }
      client.isAlive = false;
      client.ping();
    });
  }, opts.heartbeatMs ?? HEARTBEAT_MS);

  const hub: Broadcaster & { close(): void; wss: WebSocketServer } = {
    wss,
    broadcast(doctorId, message) {
      const room = rooms.get(doctorId);
      const count = room?.size ?? 0;
      room?.forEach((c) => send(c, message));
      log.ws(`broadcast ${message.type} doctor=${doctorId} -> ${count} subscriber(s)`);
    },
    close() {
      clearInterval(heartbeat);
      wss.clients.forEach((c) => c.terminate());
      wss.close();
    },
  };
  return hub;
}
