import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { adminToken, proPlayerToken, userToken } from './setup.js';

describe('GET /pro-players', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/pro-players');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /pro-players', () => {
  it('returns 201 (correct user)', async () => {
    const res = await request(app).post(`/pro-players/2`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 401 (needs to be logged in)', async () => {
    const res = await request(app).post(`/pro-players/2`);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized: invalid or expired token');
  });

  it('returns 403 (already registered as proplayer)', async () => {
    const res = await request(app).post(`/pro-players/3`).set('Authorization', `Bearer ${proPlayerToken}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: requires one of [User]');
  });

  it('returns 404 (user not found)', async () => {
    const res = await request(app).post(`/pro-players/0`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No User found by ID: 0');
  });
});

describe('GET /pro-players/:id', () => {
  it('returns 200 (existing pro player)', async () => {
    const res = await request(app).get(`/pro-players/2`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 404 (non existing pro player)', async () => {
    const res = await request(app).get(`/pro-players/231`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No ProPlayer found by ID: 231');
  });
});

describe('PUT /pro-players/:id', () => {
  it('returns 200 (correct ad)', async () => {
    const res = await request(app).put(`/pro-players/3`).set('Authorization', `Bearer ${proPlayerToken}`).send({bio: "test", hourly_rate: 10});
    expect(res.status).toBe(200);
    expect(res.body.hourly_rate).toBe(10);
  });

  it('returns 400 (missing required fields)', async () => {
    const res = await request(app).put(`/pro-players/3`).set('Authorization', `Bearer ${proPlayerToken}`).send({bio: "", hourly_rate: 0});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing required fields: hourly_rate');
  });

  it('returns 404 (altering someone elses)', async () => {
    const res = await request(app).put(`/pro-players/1`).set('Authorization', `Bearer ${proPlayerToken}`).send({bio: "test", hourly_rate: 10});
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: not authorized to interact with this user');
  });
});

describe('DELETE /pro-players/:id', () => {
  it('returns 204 (correct pro player)', async () => {
    const userRes = await request(app) // re login for reacquiring roles
        .post('/auth/login')
        .send({
        email: 'user@gmail.com',
        password: 'useruser'
    });
    const newUserToken = userRes.body.token;

    const res = await request(app).delete(`/pro-players/2`).set('Authorization', `Bearer ${newUserToken}`);
    expect(res.status).toBe(204);
  });

  it('returns 400 (associated ads)', async () => {
    const res = await request(app).delete(`/pro-players/3`).set('Authorization', `Bearer ${proPlayerToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Cannot delete pro player with associated ads');
  });

  it('returns 404 (non existing pro player)', async () => {
    const res = await request(app).delete(`/pro-players/123`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No ProPlayer found by ID: 123');
  });
});

describe('GET /pro-players/:id/games', () => {
  it('returns 200 (existing pro player)', async () => {
    const res = await request(app).get(`/pro-players/3/games`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 404 (non existing pro player)', async () => {
    const res = await request(app).get(`/pro-players/231/games`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No ProPlayer found by ID: 231');
  });
});

describe('POST /pro-players/:id/games', () => {
  it('returns 201 (correct pro player)', async () => {
    const res = await request(app).post(`/pro-players/3/games`).set('Authorization', `Bearer ${proPlayerToken}`).send({ game_id: 2, current_rank: "none", years_experience: 4 });
    expect(res.status).toBe(201);
  });

  it('returns 401 (needs to be logged in)', async () => {
    const res = await request(app).post(`/pro-players/3/games`).send({ game_id: 1, current_rank: "none", years_experience: 4 });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized: invalid or expired token');
  });

  it('returns 404 (pro player not found)', async () => {
    const res = await request(app).post(`/pro-players/0/games`).set('Authorization', `Bearer ${proPlayerToken}`).send({ game_id: 1, current_rank: "none", years_experience: 4 });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No ProPlayer found by ID: 0');
  });
});

describe('PATCH /pro-players/:id/games', () => {
  it('returns 200 (correct pro player)', async () => {
    const res = await request(app).patch(`/pro-players/3/games/1`).set('Authorization', `Bearer ${proPlayerToken}`).send({ current_rank: "none", years_experience: 4 });
    expect(res.status).toBe(200);
  });

  it('returns 400 (negative number)', async () => {
    const res = await request(app).patch(`/pro-players/3/games/1`).set('Authorization', `Bearer ${proPlayerToken}`).send({ current_rank: "", years_experience: -1 });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('These fields cannot have a negative number: years_experience');
  });

  it('returns 404 (game not found)', async () => {
    const res = await request(app).patch(`/pro-players/3/games/4`).set('Authorization', `Bearer ${proPlayerToken}`).send({ current_rank: "none", years_experience: 4 });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Game found by ID: 4');
  });
});