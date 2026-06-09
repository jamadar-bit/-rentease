process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/rentease_test';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const ServiceArea = require('../models/servicearea.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require('../utils/jwt');

describe('ServiceArea API Endpoints', () => {
  let adminToken;

  beforeAll(async () => {
    await ServiceArea.deleteMany({});
    await User.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'System Admin',
      email: 'sysadmin@rentease.com',
      password: hashedPassword,
      role: 'admin'
    });
    adminToken = generateAccessToken(admin._id);
  });

  afterAll(async () => {
    await ServiceArea.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await ServiceArea.deleteMany({});
  });

  describe('GET /api/serviceareas/check/:pincode', () => {
    it('should return available: true and the city name for a serviceable pincode', async () => {
      // Create a serviceable area
      await ServiceArea.create({
        name: 'South Bangalore',
        pincode: '560001',
        active: true
      });

      const res = await request(app).get('/api/serviceareas/check/560001');
      expect(res.status).toBe(200);
      expect(res.body.available).toBe(true);
      expect(res.body.city).toBe('South Bangalore');
    });

    it('should return available: false for an inactive area', async () => {
      // Create an inactive service area
      await ServiceArea.create({
        name: 'Mumbai East',
        pincode: '400001',
        active: false
      });

      const res = await request(app).get('/api/serviceareas/check/400001');
      expect(res.status).toBe(200);
      expect(res.body.available).toBe(false);
    });

    it('should return available: false for an unknown pincode', async () => {
      const res = await request(app).get('/api/serviceareas/check/999999');
      expect(res.status).toBe(200);
      expect(res.body.available).toBe(false);
    });
  });

  describe('POST /api/serviceareas', () => {
    it('should allow admin to create a new serviceable zip code', async () => {
      const res = await request(app)
        .post('/api/serviceareas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Delhi Central',
          pincode: '110001',
          active: true
        });

      expect(res.status).toBe(201);
      expect(res.body.pincode).toBe('110001');
      expect(res.body.name).toBe('Delhi Central');
    });
  });
});
