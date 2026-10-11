import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { Store } from '../src/store';

const app = createApp({ store: new Store(), hub: { broadcast: () => {} }, bookingDelayMs: 0 });

describe('doctors & slots', () => {
  it('lists doctors and filters by specialty', async () => {
    const all = await request(app).get('/api/doctors').expect(200);
    expect(all.body).toHaveLength(8);
    const heart = await request(app).get('/api/doctors').query({ specialty: 'قلب' }).expect(200);
    expect(heart.body.every((d: { specialty: string }) => d.specialty === 'قلب')).toBe(true);
    await request(app).get('/api/doctors').query({ specialty: 'نامعتبر' }).expect(400);
  });

  it('returns 404 for a missing doctor', async () => {
    await request(app).get('/api/doctors/nope').expect(404);
    await request(app).get('/api/doctors/nope/slots').expect(404);
  });

  it('returns 56 slots per doctor with Cache-Control: no-store', async () => {
    const res = await request(app).get('/api/doctors/d1/slots').expect(200);
    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.body).toHaveLength(7 * 8);
    expect(res.body.some((s: { isBooked: boolean }) => s.isBooked)).toBe(true);
  });
});
