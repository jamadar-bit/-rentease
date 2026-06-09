process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/rentease_test';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Product = require('../models/product.model');
const Rental = require('../models/rental.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require('../utils/jwt');

describe('Rentals API Endpoints', () => {
  let userToken;
  let adminToken;
  let customerUser;
  let sampleProductObj;

  beforeAll(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Rental.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    customerUser = await User.create({
      name: 'Regular Renter',
      email: 'renter@rentease.com',
      password: hashedPassword,
      role: 'user'
    });
    userToken = generateAccessToken(customerUser._id);

    const adminUser = await User.create({
      name: 'Admin Manager',
      email: 'manager@rentease.com',
      password: hashedPassword,
      role: 'admin'
    });
    adminToken = generateAccessToken(adminUser._id);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Rental.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Rental.deleteMany({});
    await Product.deleteMany({});

    // Reset standard product for each test
    sampleProductObj = await Product.create({
      name: 'Premium Dining Set',
      description: 'Solid teak wood dining table with 4 padded chairs.',
      category: 'Furniture',
      monthlyRent: 750,
      securityDeposit: 2500,
      tenureOptions: [3, 6, 12],
      stock: 3,
      imageUrl: ''
    });
  });

  describe('POST /api/rentals', () => {
    it('should create a single product rental contract successfully and reduce stock by 1', async () => {
      const rentalPayload = {
        product: sampleProductObj._id.toString(),
        tenureMonths: 6,
        deliveryAddress: 'House 12, Indiranagar, Bangalore',
        deliveryDate: '2026-06-01'
      };

      const res = await request(app)
        .post('/api/rentals')
        .set('Authorization', `Bearer ${userToken}`)
        .send(rentalPayload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.tenureMonths).toBe(6);
      expect(res.body.monthlyRent).toBe(750);
      expect(res.body.securityDeposit).toBe(2500);
      expect(res.body.totalCost).toBe((750 * 6) + 2500);

      // Verify product stock dropped by 1
      const updatedProduct = await Product.findById(sampleProductObj._id);
      expect(updatedProduct.stock).toBe(2);
    });

    it('should refuse rental if product is out of stock', async () => {
      // Drain stock
      sampleProductObj.stock = 0;
      await sampleProductObj.save();

      const rentalPayload = {
        product: sampleProductObj._id.toString(),
        tenureMonths: 6,
        deliveryAddress: 'House 12, Indiranagar, Bangalore',
        deliveryDate: '2026-06-01'
      };

      const res = await request(app)
        .post('/api/rentals')
        .set('Authorization', `Bearer ${userToken}`)
        .send(rentalPayload);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('out of stock');
    });
  });

  describe('POST /api/rentals/batch', () => {
    it('should checkout multiple cart items under batch transaction', async () => {
      const secondProduct = await Product.create({
        name: 'Smart Washing Machine',
        description: 'Automatic front load washing machine.',
        category: 'Appliances',
        monthlyRent: 500,
        securityDeposit: 1500,
        tenureOptions: [6, 12],
        stock: 5
      });

      const batchPayload = {
        items: [
          { product: sampleProductObj._id.toString(), tenureMonths: 6, quantity: 1 },
          { product: secondProduct._id.toString(), tenureMonths: 12, quantity: 1 }
        ],
        deliveryAddress: 'Flat A, Whitefield, Bangalore',
        deliveryDate: '2026-06-05'
      };

      const res = await request(app)
        .post('/api/rentals/batch')
        .set('Authorization', `Bearer ${userToken}`)
        .send(batchPayload);

      expect(res.status).toBe(201);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);

      // Verify stock decreases
      const updated1 = await Product.findById(sampleProductObj._id);
      const updated2 = await Product.findById(secondProduct._id);
      expect(updated1.stock).toBe(2);
      expect(updated2.stock).toBe(4);
    });
  });

  describe('GET /api/rentals/myrentals', () => {
    it('should return all rentals associated with the current user', async () => {
      // Create a rental directly
      await Rental.create({
        user: customerUser._id,
        product: sampleProductObj._id,
        startDate: new Date(),
        endDate: new Date(),
        tenureMonths: 3,
        monthlyRent: 750,
        securityDeposit: 2500,
        totalCost: 4750,
        deliveryAddress: 'Indiranagar',
        deliveryDate: new Date()
      });

      const res = await request(app)
        .get('/api/rentals/myrentals')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].monthlyRent).toBe(750);
    });
  });
});
