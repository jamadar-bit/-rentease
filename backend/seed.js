require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product.model');
const ServiceArea = require('./models/servicearea.model');
const User = require('./models/user.model');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fullstackproject')
.then(() => console.log('MongoDB Connected for Seeding'))
.catch(err => console.error(err));

const products = [
  {
    name: 'Premium Sofa Set',
    category: 'Furniture',
    monthlyRent: 1500,
    securityDeposit: 3000,
    tenureOptions: [3, 6, 12],
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80',
    description: 'A luxurious and highly comfortable piece perfectly designed for modern homes.'
  },
  {
    name: 'King Size Bed with Mattress',
    category: 'Furniture',
    monthlyRent: 1800,
    securityDeposit: 4000,
    tenureOptions: [3, 6, 12],
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80',
    description: 'Sleep like royalty on this sturdy king-size bed paired with a premium orthopedic mattress.'
  },
  {
    name: 'Wooden Dining Table Set',
    category: 'Furniture',
    monthlyRent: 1300,
    securityDeposit: 2500,
    tenureOptions: [3, 6, 12],
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=600&q=80',
    description: 'Elegant 4-seater wooden dining table set, perfect for family meals.'
  },
  {
    name: 'Smart LED TV 55"',
    category: 'Appliances',
    monthlyRent: 1200,
    securityDeposit: 2500,
    tenureOptions: [3, 6, 12],
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80',
    description: 'Experience cinematic viewing with this 4K Smart LED TV featuring built-in streaming apps.'
  },
  {
    name: 'Front Load Washing Machine',
    category: 'Appliances',
    monthlyRent: 1100,
    securityDeposit: 2200,
    tenureOptions: [3, 6, 12],
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1626806787426-5910811b6325?w=600&q=80',
    description: 'Efficient and quiet front-load washing machine with multiple wash programs.'
  },
  {
    name: 'Double Door Refrigerator',
    category: 'Appliances',
    monthlyRent: 1400,
    securityDeposit: 3000,
    tenureOptions: [3, 6, 12],
    stock: 7,
    imageUrl: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80',
    description: 'Keep your food fresh longer with this spacious double door frost-free refrigerator.'
  }
];

const serviceAreas = [
  { name: 'Mumbai', pincode: '400001', active: true },
  { name: 'Bangalore', pincode: '560001', active: true },
  { name: 'Delhi', pincode: '110001', active: true }
];

const seedData = async () => {
  try {
    // 1. Seed Products
    await Product.deleteMany();
    console.log('Existing products cleared.');
    await Product.insertMany(products);
    console.log('Bulk insertion of products successful!');

    // 2. Seed Service Areas
    await ServiceArea.deleteMany();
    console.log('Existing service areas cleared.');
    await ServiceArea.insertMany(serviceAreas);
    console.log('Bulk insertion of service areas successful!');

    // 3. Seed Users with hashed passwords
    await User.deleteMany();
    console.log('Existing users cleared.');

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('password123', salt);
    const userPassword = await bcrypt.hash('password123', salt);

    await User.create([
      {
        name: 'Admin User',
        email: 'admin@rentease.com',
        password: adminPassword,
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'user@rentease.com',
        password: userPassword,
        role: 'user'
      }
    ]);
    console.log('Bulk seeding of hashed users successful!');

    console.log('All seeding tasks finished successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
