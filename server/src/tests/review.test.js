import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { userToken } from './setup.js';

let dummyReview;
beforeEach(async () => {
  dummyReview = {
    reservation_id: 1,
    user_id: 2,
    pro_player_id: 3,
    rating: 5,
    comment: "Great experience!"
  };
});

describe('GET /reviews', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/reviews?user_id=2').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /reviews', () => {
  it('returns 201 (correct review)', async () => {
    const res = await request(app).post('/reviews').set('Authorization', `Bearer ${userToken}`).send(dummyReview);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 401 (needs to be logged in)', async () => {
    const res = await request(app).post('/reviews').send(dummyReview);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized: invalid or expired token');
  });

  it('returns 400 (missing required fields)', async () => {
    dummyReview.rating = null;
    const res = await request(app).post('/reviews').set('Authorization', `Bearer ${userToken}`).send(dummyReview);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing required fields: rating');
  });
});

describe('GET /reviews/:id', () => {
  it('returns 200 (existing review)', async () => {
    const res = await request(app).get(`/reviews/1`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 404 (non existing review)', async () => {
    const res = await request(app).get(`/reviews/555`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Review found by ID: 555');
  });
});

describe('PATCH /reviews/:id', () => {
  it('returns 200 (correct review)', async () => {
    dummyReview.rating = 4;
    dummyReview.comment = "Updated review comment";
    const res = await request(app).patch(`/reviews/1`).set('Authorization', `Bearer ${userToken}`).send(dummyReview);
    expect(res.status).toBe(200);
    expect(res.body.rating).toBe(4);
  });

  it('returns 400 (missing required fields)', async () => {
    dummyReview.rating = null;
    const res = await request(app).patch(`/reviews/1`).set('Authorization', `Bearer ${userToken}`).send(dummyReview);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing required fields: rating');
  });

  it('returns 404 (non existing review)', async () => {
    const res = await request(app).patch(`/reviews/123`).set('Authorization', `Bearer ${userToken}`).send(dummyReview);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Review found by ID: 123');
  });
});

describe('DELETE /reviews/:id', () => {
  it('returns 204 (correct review)', async () => {
    const res = await request(app).delete(`/reviews/2`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(204);
  });

  it('returns 404 (non existing review)', async () => {
    const res = await request(app).delete(`/reviews/332`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Review found by ID: 332');
  });
});