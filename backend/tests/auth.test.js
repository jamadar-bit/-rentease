process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/rentease_test';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/user.model');
const { generateAccessToken } = require('../utils/jwt');

describe('Authentication API Endpoints', () => {
  beforeAll(async () => {
    // Clean database before starting
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Drop test database and close Mongoose connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  const sampleUser = {
    name: 'Test Customer',
    email: 'testcustomer@rentease.com',
    password: 'password123'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return an access token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(sampleUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('_id');
      expect(res.body.email).toBe(sampleUser.email);
      expect(res.body.role).toBe('user');

      // Verify user exists in the database and password was hashed
      const dbUser = await User.findOne({ email: sampleUser.email });
      expect(dbUser).toBeTruthy();
      expect(dbUser.password).not.toBe(sampleUser.password);
    });

    it('should fail registration if email is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid User',
          email: 'not-an-email',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should prevent duplicate registration with the same email', async () => {
      // Register first time
      await request(app).post('/api/auth/register').send(sampleUser);

      // Register second time
      const res = await request(app).post('/api/auth/register').send(sampleUser);
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and issue a JWT token', async () => {
      // Register user first
      await request(app).post('/api/auth/register').send(sampleUser);

      // Login user
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: sampleUser.email,
          password: sampleUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.email).toBe(sampleUser.email);
      expect(res.headers['set-cookie']).toBeDefined(); // Refresh token cookie
    });

    it('should fail authentication for non-existent users', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@rentease.com',
          password: 'somepassword'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return profile details for authenticated user', async () => {
      // Register user
      const regRes = await request(app).post('/api/auth/register').send(sampleUser);
      const token = regRes.body.accessToken;

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(sampleUser.email);
      expect(res.body.name).toBe(sampleUser.name);
    });

    it('should return 401 Unauthorized if no token is passed', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.status).toBe(401);
    });

    it('should return 401 Unauthorized if token is valid but user does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const token = generateAccessToken(fakeId);

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Not authorized, token failed');
    });
  });
});
