import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { userToken } from './setup.js';

let dummyGame;
beforeEach(async () => {
  dummyGame = {
    name: "tester",
    abbreviation: 'test'
  };
});

describe('GET /games', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/games');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /games', () => {
  it('returns 201 (correct game)', async () => {
    const res = await request(app).post('/games').set('Authorization', `Bearer ${userToken}`).send(dummyGame);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 401 (needs to be logged in)', async () => {
    const res = await request(app).post('/games').send(dummyGame);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('invalid or expired token');
  });

  it('returns 400 (missing required fields)', async () => {
    dummyGame.name = "";
    const res = await request(app).post('/games').set('Authorization', `Bearer ${userToken}`).send(dummyGame);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing required fields: name');
  });
});

describe('GET /games/:id', () => {
  it('returns 200 (existing game)', async () => {
    const res = await request(app).get(`/games/1`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 404 (non existing game)', async () => {
    const res = await request(app).get(`/games/231`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Game found by ID: 231');
  });
});

describe('PUT /games/:id', () => {
  it('returns 200 (correct game)', async () => {
    dummyGame.name = "somethingNew";
    const res = await request(app).put(`/games/1`).set('Authorization', `Bearer ${userToken}`).send(dummyGame);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("somethingNew");
  });

  it('returns 400 (missing required fields)', async () => {
    dummyGame.abbreviation = "";
    const res = await request(app).put(`/games/1`).set('Authorization', `Bearer ${userToken}`).send(dummyGame);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing required fields: abbreviation');
  });

  it('returns 404 (non existing game)', async () => {
    const res = await request(app).put(`/games/${123}`).set('Authorization', `Bearer ${userToken}`).send(dummyGame);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Game found by ID: 123');
  });
});

describe('DELETE /games/:id', () => {
  it('returns 204 (correct game)', async () => {
    const res = await request(app).delete(`/games/3`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(204);
  });

  it('returns 400 (associated ads/proplayers)', async () => {
    const res = await request(app).delete(`/games/1`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Cannot delete game with associated ads/pro-players');
  });

  it('returns 404 (non existing game)', async () => {
    const res = await request(app).delete(`/games/123`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Game found by ID: 123');
  });
});