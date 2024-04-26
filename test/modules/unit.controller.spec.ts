import { HttpStatus, INestApplication } from '@nestjs/common';
import Decimal from 'decimal.js';
import { UpdatePropertyDto } from 'src/libssss/dto';
import request from 'supertest';
import { fakeUnit } from 'test/factory/unit';
import { v4 } from 'uuid';
import { AuthHeader, AuthHelper, PropertyHelper } from '../helpers';

const baseUrl = '/units';

describe('PropertyController', () => {
  let app: INestApplication;
  let staffId: string;
  let authHelper: AuthHelper;
  let authHeader: AuthHeader;
  let propertyHelper: PropertyHelper;
  let propertyId: string;

  beforeAll(() => {
    app = global.testContext.app;
    authHelper = new AuthHelper();
    propertyHelper = new PropertyHelper();
  });

  beforeEach(async () => {
    staffId = v4();
    propertyId = v4();
    authHeader = await authHelper.fakeAuthHeader({ id: staffId });
  });

  afterEach(async () => {
    await propertyHelper.clearProperties();
    await authHelper.clearMembers();
  });

  describe('GET /units', () => {
    it('should success', async () => {
      await propertyHelper.createProperty(staffId, { id: propertyId }, [
        fakeUnit(propertyId),
        fakeUnit(propertyId),
      ]);

      const response = await request(app.getHttpServer())
        .get(baseUrl)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.length).toBe(2);
    });

    it('should success', async () => {
      const response = await request(app.getHttpServer())
        .get(baseUrl)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /units/:id', () => {
    it('should success', async () => {
      const id = v4();
      await propertyHelper.createUnitFeatures(['AAA']);
      await propertyHelper.createProperty(staffId, { id: propertyId }, [
        fakeUnit(propertyId, { id, unitFeatures: ['AAA'] }),
      ]);

      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${id}`)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should fail', async () => {
      const id = v4();
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${id}`)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.message).toBe(`Unit with id = ${id} not found`);
    });
  });

  describe('PATCH /units/:id', () => {
    it('Should success', async () => {
      const id = v4();
      const newPrice = 2_000_000;
      await propertyHelper.createUnitFeatures(['AAA', 'BBB']);
      await propertyHelper.createProperty(staffId, { id: propertyId }, [
        fakeUnit(propertyId, { id, price: 1_000_000 }),
      ]);

      const updateDto = {
        price: new Decimal(newPrice),
        unitFeatures: ['AAA'],
      };

      const response = await request(app.getHttpServer())
        .patch(`${baseUrl}/${id}`)
        .send(updateDto)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.text).toBe(id);

      const updatedUnit = await propertyHelper.getUnit(id);
      expect(+updatedUnit.price).toEqual(+newPrice);
    });

    it('Should fail', async () => {
      const id = v4();
      const updateDto: UpdatePropertyDto = fakeUnit(propertyId);

      const response = await request(app.getHttpServer())
        .patch(`${baseUrl}/${id}`)
        .send(updateDto)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.message).toBe(`Unit with id = ${id} not found`);
    });
  });

  describe('DELETE /units/:id', () => {
    it('Should success', async () => {
      const id = v4();
      await propertyHelper.createProperty(staffId, { id: propertyId }, [
        fakeUnit(propertyId, { id }),
      ]);

      const response = await request(app.getHttpServer())
        .delete(`${baseUrl}/${id}`)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.text).toBe(id);
    });

    it('Should fail', async () => {
      const id = v4();

      const response = await request(app.getHttpServer())
        .delete(`${baseUrl}/${id}`)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.message).toBe(`Unit with id = ${id} not found`);
    });
  });
});
