import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successfull signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password123' })
    .expect(201);
});

it('returns a 400 on an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'testcom', password: 'password123' })
    .expect(400);
});

it('returns a 400 on an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'p' })
    .expect(400);
});

it('returns a 400 with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({ password: 'password123' })
    .expect(400);
});

it('rejects duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(400);
});

it('sets a cookie on successfull signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password123' })
    .expect(201);

  expect(res.get('Set-Cookie')).toBeDefined();
});
