import request from 'supertest';
import { app } from '../../app';

it('fails when a non-existing email is provided', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password123' })
    .expect(400);
});

it('fails when an incorrect password is provided', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password123' })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(400);
});

it('responds with a cookie with valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password123' })
    .expect(201);

  const res = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password123' })
    .expect(200);

  expect(res.get('Set-Cookie')).toBeDefined();
});
