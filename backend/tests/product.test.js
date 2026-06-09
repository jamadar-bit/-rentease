process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/rentease_test';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require('../utils/jwt');

describe('Products API Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // Wait for DB and delete old test items
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create a regular user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = await User.create({
      name: 'Regular Customer',
      email: 'customer@rentease.com',
      password: hashedPassword,
      role: 'user'
    });
    userToken = generateAccessToken(user._id);

    // Create an admin user
    const admin = await User.create({
      name: 'Site Administrator',
      email: 'admin@rentease.com',
      password: hashedPassword,
      role: 'admin'
    });
    adminToken = generateAccessToken(admin._id);
  });

  afterAll(async () => {
    await Product.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  const sampleProduct = {
    name: 'Smart UHD LED TV',
    description: '4K Resolution Smart LED Television with HDR support and preloaded streaming apps.',
    category: 'Appliances',
    monthlyRent: 499,
    securityDeposit: 1500,
    tenureOptions: [3, 6, 12],
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575'
  };

  describe('GET /api/products', () => {
    it('should return all products in the database', async () => {
      // Create a product directly
      await Product.create(sampleProduct);

      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe(sampleProduct.name);
    });
  });

  describe('POST /api/products', () => {
    it('should allow admin to create a new product successfully', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(sampleProduct.name);

      // Verify it is in database
      const dbProd = await Product.findById(res.body._id);
      expect(dbProd).toBeTruthy();
    });

    it('should deny regular users from creating a product (return 403)', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleProduct);

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a specific product when a valid ID is passed', async () => {
      const created = await Product.create(sampleProduct);

      const res = await request(app).get(`/api/products/${created._id}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe(sampleProduct.name);
    });

    it('should return 404 if product ID is valid format but not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/products/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });
});
