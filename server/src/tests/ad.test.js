import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { proPlayerToken, userToken } from './setup.js';

let dummyAd;
beforeEach(async () => {
  dummyAd = {
    game_id: 1,
    pro_player_id: 3,
    name: 'name',
    description: 'test',
    max_reservations_per_user: 2,
    service_type: 'Boosting',
    total_spots_available: 2,
    max_duration_minutes: 2
  };
});

describe('GET /ads', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/ads').query({ service_type: 'Boosting', game_id: 1, pro_player_id: 2 });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 200', async () => {
    const res = await request(app).get('/ads');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /ads', () => {
  it('returns 201 (correct ad)', async () => {
    const res = await request(app).post('/ads').set('Authorization', `Bearer ${proPlayerToken}`).send(dummyAd);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 404 (regular user is not a pro player)', async () => {
    dummyAd.pro_player_id = 2;
    const res = await request(app).post('/ads').set('Authorization', `Bearer ${userToken}`).send(dummyAd);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No ProPlayer found by ID: 2');
  });

  it('returns 403 (regular user cannot create ad for other pro player)', async () => {
    dummyAd.pro_player_id = 3;
    const res = await request(app).post('/ads').set('Authorization', `Bearer ${userToken}`).send(dummyAd);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: not authorized to interact with this user');
  });

  it('returns 400 (missing required fields)', async () => {
    dummyAd.name = "";
    dummyAd.max_reservations_per_user = 0;
    const res = await request(app).post('/ads').set('Authorization', `Bearer ${proPlayerToken}`).send(dummyAd);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing required fields: name, max_reservations_per_user');
  });

  it('returns 404 (non existing game)', async () => {
    dummyAd.game_id = 23;
    const res = await request(app).post('/ads').set('Authorization', `Bearer ${proPlayerToken}`).send(dummyAd);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Game found by ID: 23');
  });
});

describe('GET /ads/:id', () => {
  it('returns 200 (existing ad)', async () => {
    const res = await request(app).get(`/ads/1`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 404 (non existing ad)', async () => {
    const res = await request(app).get(`/ads/231`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Ad found by ID: 231');
  });
});

describe('PATCH /ads/:id', () => {
  it('returns 200 (correct ad)', async () => {
    dummyAd.name = "somethingNew";
    const res = await request(app).patch(`/ads/1`).set('Authorization', `Bearer ${proPlayerToken}`).send(dummyAd);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("somethingNew");
  });

  it('returns 403 (regular user cannot update ad for another pro player)', async () => {
    dummyAd.pro_player_id = 3;
    const res = await request(app).patch(`/ads/1`).set('Authorization', `Bearer ${userToken}`).send(dummyAd);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: not authorized to modify this Ad');
  });

  it('returns 400 (missing required fields)', async () => {
    dummyAd.name = "";
    dummyAd.max_reservations_per_user = 0;
    const res = await request(app).patch(`/ads/1`).set('Authorization', `Bearer ${proPlayerToken}`).send(dummyAd);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing required fields: name, max_reservations_per_user');
  });

  it('returns 404 (non existing ad)', async () => {
    const res = await request(app).patch(`/ads/1233`).set('Authorization', `Bearer ${proPlayerToken}`).send(dummyAd);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Ad found by ID: 1233');
  });
  
  it('returns 404 (non existing game)', async () => {
    dummyAd.game_id = 23;
    const res = await request(app).patch(`/ads/1`).set('Authorization', `Bearer ${proPlayerToken}`).send(dummyAd);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Game found by ID: 23');
  });
});

describe('DELETE /ads/:id', () => {
  it('returns 204 (correct ad)', async () => {
    const res = await request(app).delete(`/ads/2`).set('Authorization', `Bearer ${proPlayerToken}`);
    expect(res.status).toBe(204);
  });

  it('returns 400 (associated reservations)', async () => {
    const res = await request(app).delete(`/ads/1`).set('Authorization', `Bearer ${proPlayerToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Kan reservering niet verwijderen met open reserveringen');
  });
  
  it('returns 403 (cannot delete someone elses ad)', async () => {
    const res = await request(app).delete(`/ads/1`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: not authorized to modify this Ad');
  });

  it('returns 404 (non existing ad)', async () => {
    const res = await request(app).delete(`/ads/123`).set('Authorization', `Bearer ${proPlayerToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Ad found by ID: 123');
  });
});