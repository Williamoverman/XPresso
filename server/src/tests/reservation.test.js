import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { userToken } from './setup.js';

let dummyReservation;
beforeEach(async () => {
  dummyReservation = {
    user_id: 2,
    ad_id: 1,
    start_date: "2025-10-15T10:00:00Z",
    end_date: "2025-10-15T11:00:00Z"
  };
});

describe('GET /reservations', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/reservations?id=2').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /reservations', () => {
  it('returns 400 (already 2 reservations for this user)', async () => {
    const res = await request(app).post('/reservations').set('Authorization', `Bearer ${userToken}`).send(dummyReservation);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Maximum reserverings limiet bereikt: 2 voor deze advertentie');
  });

  it('returns 401 (needs to be logged in)', async () => {
    const res = await request(app).post('/reservations').send(dummyReservation);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized: invalid or expired token');
  });

  it('returns 400 (missing required fields)', async () => {
    dummyReservation.start_date = "";
    const res = await request(app).post('/reservations').set('Authorization', `Bearer ${userToken}`).send(dummyReservation);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing required fields: start_date');
  });
});

describe('GET /reservations/:id', () => {
  it('returns 200 (existing reservation)', async () => {
    const res = await request(app).get(`/reservations/1`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 404 (non existing reservation)', async () => {
    const res = await request(app).get(`/reservations/231`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Reservation found by ID: 231');
  });
});

describe('PATCH /reservations/:id', () => {
  it('returns 200 (correct reservation)', async () => {
    dummyReservation.start_date = "2025-10-15T10:05:00Z";
    const res = await request(app).patch(`/reservations/1`).set('Authorization', `Bearer ${userToken}`).send(dummyReservation);
    expect(res.status).toBe(200);
    expect(res.body.start_date).toBe("2025-10-15T10:05:00.000Z");
  });

  it('returns 404 (non existing reservation)', async () => {
    const res = await request(app).patch(`/reservations/123`).set('Authorization', `Bearer ${userToken}`).send(dummyReservation);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Reservation found by ID: 123');
  });
});

describe('DELETE /reservations/:id', () => {
  it('returns 204 (correct reservation)', async () => {
    const res = await request(app).delete(`/reservations/2`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(204);
  });

  it('returns 404 (non existing reservation)', async () => {
    const res = await request(app).delete(`/reservations/123`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Reservation found by ID: 123');
  });
});