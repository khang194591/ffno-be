import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { v4 } from 'uuid';
import { AuthHeader, AuthHelper } from '../helpers';

const baseUrl = '/members';

describe('PropertyController', () => {
  let app: INestApplication;
  let staffId: string;
  let authHelper: AuthHelper;
  let authHeader: AuthHeader;

  beforeAll(() => {
    app = global.testContext.app;
    authHelper = new AuthHelper();
  });

  beforeEach(async () => {
    staffId = v4();
    authHeader = await authHelper.fakeAuthHeader({ id: staffId });
  });

  afterEach(async () => {
    await authHelper.clearMembers();
  });

  describe('GET /members/:id', () => {
    it('Should success', async () => {
      const id = v4();
      await authHelper.createMember({ id });
      await authHelper.createMember();

      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${id}`)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.OK);
    });

    it('Should fail', async () => {
      const id = v4();

      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${id}`)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.message).toBe(
        `Member with identity = ${id} not found`,
      );
    });
  });
});
