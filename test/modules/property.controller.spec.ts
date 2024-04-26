import { HttpStatus, INestApplication } from '@nestjs/common';
import { UpdatePropertyDto } from 'src/libssss/dto';
import request from 'supertest';
import { fakeProperty } from 'test/factory';
import { v4 } from 'uuid';
import { AuthHeader, AuthHelper, PropertyHelper } from '../helpers';
import { fakeUnit } from 'test/factory/unit';

const baseUrl = '/properties';

describe('PropertyController', () => {
  let app: INestApplication;
  let staffId: string;
  let authHelper: AuthHelper;
  let authHeader: AuthHeader;
  let propertyHelper: PropertyHelper;

  beforeAll(() => {
    app = global.testContext.app;
    authHelper = new AuthHelper();
    propertyHelper = new PropertyHelper();
  });

  beforeEach(async () => {
    staffId = v4();
    authHeader = await authHelper.fakeAuthHeader({ id: staffId });
  });

  afterEach(async () => {
    await propertyHelper.clearProperties();
    await authHelper.clearMembers();
  });

  describe('GET /properties', () => {
    it('should success', async () => {
      await propertyHelper.createProperty(staffId);
      await propertyHelper.createProperty(staffId);

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

  describe('GET /properties/:id', () => {
    it('should success', async () => {
      await propertyHelper.createAmenities();
      const id = await propertyHelper.createProperty(staffId, {
        amenities: ['Pool'],
      });

      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${id}`)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should success', async () => {
      const id = v4();
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${id}`)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.message).toBe(`Property with id = ${id} not found`);
    });
  });

  describe('POST /properties', () => {
    it('Should success', async () => {
      await propertyHelper.createAmenities(['AAA', 'BBB']);

      const response = await request(app.getHttpServer())
        .post(baseUrl)
        .send(fakeProperty(staffId, { amenities: ['AAA'] }))
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('Should fail', async () => {
      const response = await request(app.getHttpServer())
        .post(baseUrl)
        .send(fakeProperty(staffId, { amenities: ['AAA'] }))
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe('Invalid amenities');
    });
  });

  describe('PATCH /properties/:id', () => {
    it('Should success', async () => {
      await propertyHelper.createAmenities();
      const id = await propertyHelper.createProperty(staffId);
      const property = await propertyHelper.getProperty(id);
      const newAddress = 'New address';

      const updateDto: UpdatePropertyDto = {
        ...property,
        address: newAddress,
        amenities: ['Pool'],
      };

      const response = await request(app.getHttpServer())
        .patch(`${baseUrl}/${id}`)
        .send(updateDto)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.text).toBe(id);

      const updatedProperty = await propertyHelper.getProperty(id);
      expect(updatedProperty.address).toBe(newAddress);
    });

    it('Should fail', async () => {
      const id = v4();
      const updateDto: UpdatePropertyDto = fakeProperty(staffId);

      const response = await request(app.getHttpServer())
        .patch(`${baseUrl}/${id}`)
        .send(updateDto)
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.message).toBe(`Property with id = ${id} not found`);
    });
  });

  describe('DELETE /properties/:id', () => {
    it('Should success', async () => {
      const id = await propertyHelper.createProperty(staffId);

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
      expect(response.body.message).toBe(`Property with id = ${id} not found`);
    });
  });

  describe('POST /properties/:id/units', () => {
    it('should success', async () => {
      await propertyHelper.createUnitFeatures();
      const propertyId = await propertyHelper.createProperty(staffId);

      const response = await request(app.getHttpServer())
        .post(`${baseUrl}/${propertyId}/units`)
        .send(fakeUnit(propertyId, { unitFeatures: ['Balcony'] }))
        .set({ ...authHeader });

      const property = await propertyHelper.getProperty(propertyId);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(property.units.length).toBe(1);
      expect(property.units[0].id).toBe(response.text);
    });

    it('should fail with invalid features', async () => {
      const propertyId = await propertyHelper.createProperty(staffId);

      const response = await request(app.getHttpServer())
        .post(`${baseUrl}/${propertyId}/units`)
        .send(
          fakeUnit(propertyId, {
            unitFeatures: ['AAA'],
          }),
        )
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe('Invalid unit features');
    });

    it('should fail with invalid features', async () => {
      const fakeName = 'AAA';
      const propertyId = v4();
      await propertyHelper.createProperty(staffId, { id: propertyId }, [
        fakeUnit(propertyId, { name: fakeName }),
      ]);

      const response = await request(app.getHttpServer())
        .post(`${baseUrl}/${propertyId}/units`)
        .send(fakeUnit(propertyId, { name: fakeName }))
        .set({ ...authHeader });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe(
        `Unit with name = ${fakeName} and propertyId = ${propertyId}`,
      );
    });
  });
});
