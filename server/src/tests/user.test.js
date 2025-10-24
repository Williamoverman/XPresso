import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { adminToken, userToken, proPlayerToken } from './setup.js';

let dummyUser;
let newUserToken;

beforeEach(async () => {
  dummyUser = {
    email: "test@example.com",
    password: "Voetbal123!",
    username: "TestUser"
  };

  const newUserRes = await request(app) //login as new user
    .post('/auth/login')
    .send({
      email: 'test@example.com',
      password: 'Voetbal123!'
    });
    newUserToken = newUserRes.body.token;
});

describe('GET /users', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/users').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /users', () => {
  it('returns 201 (correct user)', async () => {
    const res = await request(app).post('/users').set('Authorization', `Bearer ${userToken}`).send(dummyUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 400 (missing required fields)', async () => {
    dummyUser.email = "";
    const res = await request(app).post('/users').set('Authorization', `Bearer ${userToken}`).send(dummyUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing required fields: email');
  });

  it('returns 400 (invalid email format)', async () => {
    dummyUser.email = "invalid-email";
    const res = await request(app).post('/users').set('Authorization', `Bearer ${userToken}`).send(dummyUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid email format');
  });

  it('returns 400 (password not strong enough)', async () => {
    dummyUser.email = "new@gmail.com"
    dummyUser.password = "weak";
    const res = await request(app).post('/users').set('Authorization', `Bearer ${userToken}`).send(dummyUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Password is not strong enough');
  });

  it('returns 400 (email already exists)', async () => {
    dummyUser.email = "admin@gmail.com";
    const res = await request(app).post('/users').set('Authorization', `Bearer ${userToken}`).send(dummyUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email already exists');
  });
});

describe('GET /users/:id', () => {
  it('returns 200 (existing user)', async () => {
    const res = await request(app).get(`/users/2`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 404 (non existing user)', async () => {
    const res = await request(app).get(`/users/777`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No User found by ID: 777');
  });
});

describe('PATCH /users/:id', () => {
  it('returns 200 (correct user)', async () => {
    dummyUser.email = "user@gmail.com"
    dummyUser.username = "UpdatedUser";
    const res = await request(app).patch(`/users/2`).set('Authorization', `Bearer ${userToken}`).send(dummyUser);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("UpdatedUser");
  });

  it('returns 400 (invalid email format)', async () => {
    dummyUser.email = "invalid-email";
    const res = await request(app).patch(`/users/2`).set('Authorization', `Bearer ${userToken}`).send(dummyUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid email format');
  });

  it('returns 400 (password not strong enough)', async () => {
    dummyUser.email = "new@gmail.com";
    dummyUser.password = "weak";
    const res = await request(app).patch(`/users/2`).set('Authorization', `Bearer ${userToken}`).send(dummyUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Password is not strong enough');
  });

  it('returns 400 (email already exists)', async () => {
    dummyUser.email = "admin@gmail.com";
    const res = await request(app).patch(`/users/2`).set('Authorization', `Bearer ${userToken}`).send(dummyUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email already exists');
  });

  it('returns 403 (non-owner access)', async () => {
    const res = await request(app).patch(`/users/3`).set('Authorization', `Bearer ${userToken}`).send(dummyUser);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('not authorized to interact with this user');
  });

  it('returns 404 (non existing user)', async () => {
    const res = await request(app).patch(`/users/555`).set('Authorization', `Bearer ${userToken}`).send(dummyUser);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No User found by ID: 555');
  });
});

describe('DELETE /users/:id', () => {
  it('returns 204 (correct user)', async () => {
    const res = await request(app).delete(`/users/4`).set('Authorization', `Bearer ${newUserToken}`);
    expect(res.status).toBe(204);
  });

  it('returns 404 (non existing user)', async () => {
    const res = await request(app).delete(`/users/555`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No User found by ID: 555');
  });

  it('returns 400 (user with associated relations)', async () => {
    const res = await request(app).delete(`/users/2`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Cannot delete user with associated relations');
  });

  it('returns 403 (non-owner access)', async () => {
    const res = await request(app).delete(`/users/3`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('not authorized to interact with this user');
  });
});

describe('GET /users/:id/roles', () => {
  it('returns 200 (existing user)', async () => {
    const res = await request(app).get(`/users/2/roles`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 404 (non existing user)', async () => {
    const res = await request(app).get(`/users/555/roles`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No User found by ID: 555');
  });

  it('returns 403 (non-admin access)', async () => {
    const res = await request(app).get(`/users/2/roles`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('requires one of Admin');
  });
});

describe('POST /users/:id/roles', () => {
  it('returns 201 (correct role assignment)', async () => {
    const roleData = { role_id: 2 };
    const res = await request(app).post(`/users/3/roles`).set('Authorization', `Bearer ${adminToken}`).send(roleData);
    expect(res.status).toBe(201);
  });

  it('returns 400 (role already assigned)', async () => {
    const roleData = { role_id: 2 };
    const res = await request(app).post(`/users/1/roles`).set('Authorization', `Bearer ${adminToken}`).send(roleData);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already has role assigned');
  });

  it('returns 403 (non-admin access)', async () => {
    const roleData = { role_id: 2 };
    const res = await request(app).post(`/users/3/roles`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('requires one of Admin');
  });
});

describe('PATCH /users/:id/activate', () => {
  it('returns 200 (successful activation)', async () => {
    await request(app).patch(`/users/3/deactivate`).set('Authorization', `Bearer ${adminToken}`) //first deactive (by default user is activated)
    const res = await request(app).patch(`/users/3/activate`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.is_active).toBe(true);
  });

  it('returns 404 (non existing user)', async () => {
    const res = await request(app).patch(`/users/123123/activate`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No User found by ID: 123123');
  });

  it('returns 400 (user already active)', async () => {
    const res = await request(app).patch(`/users/1/activate`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User is already activated');
  });

  it('returns 403 (non-admin access)', async () => {
    const res = await request(app).patch(`/users/2/activate`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('requires one of Admin');
  });
});

describe('PATCH /users/:id/deactivate', () => {
  it('returns 200 (successful deactivation)', async () => {
    const res = await request(app).patch(`/users/2/deactivate`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.is_active).toBe(false);
  });

  it('returns 400 (user already deactivated)', async () => {
    const res = await request(app).patch(`/users/2/deactivate`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User is already deactivated');
  });

  it('returns 403 (non-admin access)', async () => {
    const res = await request(app).patch(`/users/2/deactivate`).set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('requires one of Admin');
  });
});