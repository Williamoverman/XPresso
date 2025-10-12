import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { adminToken } from './setup.js';

let dummyRole;
beforeEach(async () => {
  dummyRole = {
    name: "TestRole"
  };
});

describe('GET /roles', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/roles').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /roles', () => {
  it('returns 201 (correct role)', async () => {
    const res = await request(app).post('/roles').set('Authorization', `Bearer ${adminToken}`).send(dummyRole);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 401 (needs to be logged in)', async () => {
    const res = await request(app).post('/roles').send(dummyRole);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized: invalid or expired token');
  });

  it('returns 400 (missing required fields)', async () => {
    dummyRole.name = "";
    const res = await request(app).post('/roles').set('Authorization', `Bearer ${adminToken}`).send(dummyRole);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing required fields: name');
  });
});

describe('GET /roles/:id', () => {
  it('returns 200 (existing role)', async () => {
    const res = await request(app).get(`/roles/1`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 404 (non existing role)', async () => {
    const res = await request(app).get(`/roles/999`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Role found by ID: 999');
  });
});

describe('PUT /roles/:id', () => {
  it('returns 200 (correct role)', async () => {
    dummyRole.name = "UpdatedRole";
    const res = await request(app).put(`/roles/1`).set('Authorization', `Bearer ${adminToken}`).send(dummyRole);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("UpdatedRole");
  });

  it('returns 400 (missing required fields)', async () => {
    dummyRole.name = "";
    const res = await request(app).put(`/roles/1`).set('Authorization', `Bearer ${adminToken}`).send(dummyRole);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing required fields: name');
  });

  it('returns 404 (non existing role)', async () => {
    const res = await request(app).put(`/roles/999`).set('Authorization', `Bearer ${adminToken}`).send(dummyRole);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Role found by ID: 999');
  });
});

describe('DELETE /roles/:id', () => {
  it('returns 204 (correct role)', async () => {
    const res = await request(app).delete(`/roles/4`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
  });

  it('returns 404 (non existing role)', async () => {
    const res = await request(app).delete(`/roles/999`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Role found by ID: 999');
  });

  it('returns 400 (role with associated users)', async () => {
    const res = await request(app).delete(`/roles/1`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Cannot delete role with associated users');
  });
});

describe('GET /roles/:id/users', () => {
  it('returns 200 (existing role)', async () => {
    const res = await request(app).get(`/roles/1/users`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 404 (non existing role)', async () => {
    const res = await request(app).get(`/roles/999/users`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No Role found by ID: 999');
  });
});