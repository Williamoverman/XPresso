import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { sequelize } from '../db/database-helper.js';
import { seed } from '../db/seed.js';

beforeAll(async () => {
  await sequelize.sync({ force: true })
  await seed.seed()
})

afterAll(async () => {
  await sequelize.close()
})

const dummyAd = {
  game_id: 1,
  pro_player_id: 1,
  name: "name",
  description: "test",
  max_reservations_per_user: 2,
  service_type: "Boosting",
  total_spots_available: 2,
  max_duration_minutes: 2
}

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
  it('returns 201', async () => {
    const res = await request(app).post('/ads').send(dummyAd);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id')
  });
});
