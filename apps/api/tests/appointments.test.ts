import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { ServerMessage } from '@nobat/shared';
import { createApp } from '../src/app';
import { Store } from '../src/store';

const validBody = (slotId: string) => ({
  doctorId: 'd1',
  slotId,
  patientName: 'علی محمدی',
  phone: '09121234567',
});

let store: Store;
let events: Array<{ doctorId: string; message: ServerMessage }>;
let app: ReturnType<typeof createApp>;

const freeSlot = (n = 0) => store.listSlots('d1').filter((s) => !s.isBooked)[n]!;

beforeEach(() => {
  store = new Store();
  events = [];
  app = createApp({
    store,
    hub: { broadcast: (doctorId, message) => events.push({ doctorId, message }) },
    bookingDelayMs: 0,
  });
});

describe('POST /api/appointments', () => {
  it('books a free slot, returns 201 and broadcasts slot:booked', async () => {
    const slot = freeSlot();
    const res = await request(app).post('/api/appointments').send(validBody(slot.id));

    expect(res.status).toBe(201);
    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.body).toMatchObject({ slotId: slot.id, doctorId: 'd1' });
    expect(store.getSlot(slot.id)?.isBooked).toBe(true);
    expect(events).toEqual([{ doctorId: 'd1', message: { type: 'slot:booked', doctorId: 'd1', slotId: slot.id } }]);
  });

  it('returns 409 on double booking (no second broadcast)', async () => {
    const slot = freeSlot();
    await request(app).post('/api/appointments').send(validBody(slot.id)).expect(201);
    const res = await request(app).post('/api/appointments').send(validBody(slot.id));

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('SLOT_ALREADY_BOOKED');
    expect(events).toHaveLength(1);
  });

  it('returns 409 for a slot that was pre-booked in the seed', async () => {
    const booked = store.listSlots('d1').find((s) => s.isBooked)!;
    await request(app).post('/api/appointments').send(validBody(booked.id)).expect(409);
  });

  it('only one of two concurrent requests wins', async () => {
    const slot = freeSlot();
    const [a, b] = await Promise.all([
      request(app).post('/api/appointments').send(validBody(slot.id)),
      request(app).post('/api/appointments').send(validBody(slot.id)),
    ]);
    expect([a.status, b.status].sort()).toEqual([201, 409]);
  });

  describe('Idempotency-Key', () => {
    it('replays the same response and never double-books', async () => {
      const slot = freeSlot();
      const send = () =>
        request(app).post('/api/appointments').set('Idempotency-Key', 'key-1').send(validBody(slot.id));

      const first = await send();
      const second = await send();

      expect(first.status).toBe(201);
      expect(second.status).toBe(201);
      expect(second.body).toEqual(first.body);
      expect(second.headers['idempotent-replayed']).toBe('true');
      expect(events).toHaveLength(1);
    });

    it('handles concurrent requests with the same key', async () => {
      const slot = freeSlot();
      const send = () =>
        request(app).post('/api/appointments').set('Idempotency-Key', 'key-2').send(validBody(slot.id));
      const [a, b] = await Promise.all([send(), send()]);

      expect(a.status).toBe(201);
      expect(b.status).toBe(201);
      expect(b.body.id).toBe(a.body.id);
    });

    it('rejects the same key reused with a different payload (422)', async () => {
      const [s1, s2] = [freeSlot(0), freeSlot(1)];
      await request(app).post('/api/appointments').set('Idempotency-Key', 'key-3').send(validBody(s1.id)).expect(201);
      await request(app).post('/api/appointments').set('Idempotency-Key', 'key-3').send(validBody(s2.id)).expect(422);
    });

    it('different keys on the same slot => second gets 409', async () => {
      const slot = freeSlot();
      await request(app).post('/api/appointments').set('Idempotency-Key', 'a').send(validBody(slot.id)).expect(201);
      await request(app).post('/api/appointments').set('Idempotency-Key', 'b').send(validBody(slot.id)).expect(409);
    });
  });

  describe('validation', () => {
    it('returns 400 with field errors', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({ doctorId: 'd1', slotId: '', patientName: 'ا', phone: '123' });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(Object.keys(res.body.fieldErrors).sort()).toEqual(['patientName', 'phone', 'slotId']);
    });

    it('rejects a non-Iranian phone number', async () => {
      const res = await request(app).post('/api/appointments').send({ ...validBody(freeSlot().id), phone: '+14155550123' });
      expect(res.status).toBe(400);
      expect(res.body.fieldErrors.phone).toBeDefined();
    });

    it('returns 400 on malformed JSON', async () => {
      const res = await request(app).post('/api/appointments').set('Content-Type', 'application/json').send('{oops');
      expect(res.status).toBe(400);
    });

    it('returns 404 for an unknown slot', async () => {
      await request(app).post('/api/appointments').send(validBody('nope')).expect(404);
    });
  });
});

describe('DELETE /api/appointments/:id', () => {
  it('frees the slot and broadcasts slot:released', async () => {
    const slot = freeSlot();
    const { body } = await request(app).post('/api/appointments').send(validBody(slot.id));
    events.length = 0;

    await request(app).delete(`/api/appointments/${body.id}`).expect(204);

    expect(store.getSlot(slot.id)?.isBooked).toBe(false);
    expect(events).toEqual([{ doctorId: 'd1', message: { type: 'slot:released', doctorId: 'd1', slotId: slot.id } }]);
    await request(app).delete(`/api/appointments/${body.id}`).expect(404);
  });
});
