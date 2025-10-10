import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { sequelize } from '../db/database-helper.js';
import { seed } from '../db/seed.js';

let seedData;
let adminToken;
let userToken;
let proPlayerToken;

beforeAll(async () => {
  await sequelize.sync({ force: true })
  seedData = await seed()
  
  const adminRes = await request(app)
    .post('/auth/login')
    .send({
      email: 'admin@gmail.com',
      password: 'admin'
    });
  adminToken = adminRes.body.token;
  
  const userRes = await request(app)
    .post('/auth/login')
    .send({
      email: 'user@gmail.com',
      password: 'user'
    });
  userToken = userRes.body.token;
  
  const proPlayerRes = await request(app)
    .post('/auth/login')
    .send({
      email: 'proplayer@gmail.com',
      password: 'proplayer'
    });
  proPlayerToken = proPlayerRes.body.token;
})

afterAll(async () => {
  await sequelize.close()
})

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
    const dummyAd = {
      game_id: 1,
      pro_player_id: 3, 
      name: "name",
      description: "test",
      max_reservations_per_user: 2,
      service_type: "Boosting",
      total_spots_available: 2,
      max_duration_minutes: 2
    }

    const res = await request(app).post('/ads').set('Authorization', `Bearer ${proPlayerToken}`).send(dummyAd);
    console.log(res.body)
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id')
  });
});
