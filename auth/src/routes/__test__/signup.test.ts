import request from 'supertest';
import { app } from '../../app';

it('returns 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
});

it('returns 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test', password: 'password' })
    .expect(400);
});

it('returns 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@yahoo.com', password: 'p' })
    .expect(400);
});

it('returns 400 with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400);
  return request(app)
    .post('/api/users/signup')
    .send({ password: '123838384848' })
    .expect(400);
});

it('disallows duplicates emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});
