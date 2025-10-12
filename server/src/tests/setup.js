import { beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { sequelize } from '../db/database-helper.js';
import { seed } from '../db/seed.js';

let adminToken;
let userToken;
let proPlayerToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await seed();

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
});

afterAll(async () => {
  await sequelize.close()
});

export {
    adminToken,
    userToken,
    proPlayerToken
}