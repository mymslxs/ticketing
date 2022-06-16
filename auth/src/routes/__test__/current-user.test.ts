import request from 'supertest';
import { app } from '../../app';
import { getAuthCookie } from '../../test/auth-helper-test';

it('responds with currently signed-in user', async () => {
  const cookie = await getAuthCookie();

  const res = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null currentUser if not authenticated', async () => {
  const res = await request(app).get('/api/users/current-user').send();

  expect(res.body.currentUser).toEqual(null);
});
