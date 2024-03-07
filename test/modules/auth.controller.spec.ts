import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { fakeMember } from '../factory';
import { AuthHelper } from '../helpers';

describe('AuthController', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;

  beforeAll(() => {
    app = global.testContext.app;
    authHelper = new AuthHelper();
  });

  afterEach(async () => {
    await authHelper.clearMembers();
  });

  describe('POST /auth/sign-up', () => {
    it('Should success', async () => {
      const fakeEmail = 'test@test.test';

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(fakeMember({ email: fakeEmail }));

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.email).toBe(fakeEmail);
    });

    it('Should fail', async () => {
      const fakeEmail = 'test@test.test';

      await authHelper.createMember({ email: fakeEmail });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(fakeMember({ email: fakeEmail }));

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe('This email is already taken');
    });
  });

  describe('POST /auth/sign-in', () => {
    it('Should success', async () => {
      const fakeInput = fakeMember();

      await authHelper.createMember(fakeInput);

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ email: fakeInput.email, password: fakeInput.password });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.email).toBe(fakeInput.email);
    });

    it('Should fail', async () => {
      const fakeInput = fakeMember();

      await authHelper.createMember(fakeInput);

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: fakeInput.email,
          password: fakeInput.password.concat('@@@'),
        });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('DELETE /auth/sign-out', () => {
    it('Should success', async () => {
      const authHeader = await authHelper.fakeAuthHeader();

      const response = await request(app.getHttpServer())
        .delete('/auth/sign-out')
        .set(authHeader)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
    });

    it('Should fail', async () => {
      const response = await request(app.getHttpServer())
        .delete('/auth/sign-out')
        .send();

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('Should fail', async () => {
      const response = await request(app.getHttpServer())
        .delete('/auth/sign-out')
        .set('Cookie', 'token=abcdef')
        .send();

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });
});
