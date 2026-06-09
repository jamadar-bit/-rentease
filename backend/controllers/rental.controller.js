const Rental = require('../models/rental.model');
const Product = require('../models/product.model');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });

const createRental = async (req, res, next) => {
  try {
    const { product, tenureMonths, deliveryAddress, deliveryDate } = req.body;

    const prod = await Product.findById(product);
    if (!prod) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (prod.stock <= 0) {
      res.status(400);
      throw new Error('Product out of stock');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + tenureMonths);

    const totalCost = (prod.monthlyRent * tenureMonths) + prod.securityDeposit;

    const rental = new Rental({
      user: req.user._id,
      product,
      startDate,
      endDate,
      tenureMonths,
      monthlyRent: prod.monthlyRent,
      securityDeposit: prod.securityDeposit,
      totalCost,
      deliveryAddress,
      deliveryDate,
      quantity: 1
    });

    const createdRental = await rental.save();

    // Decrease stock
    prod.stock -= 1;
    await prod.save();

    cache.del(`rentals_${req.user._id}`);

    res.status(201).json(createdRental);
  } catch (error) {
    next(error);
  }
};

const getMyRentals = async (req, res, next) => {
  try {
    const cacheKey = `rentals_${req.user._id}`;
    const cachedRentals = cache.get(cacheKey);

    if (cachedRentals) {
      return res.status(200).json(cachedRentals);
    }

    const rentals = await Rental.find({ user: req.user._id }).populate('product');
    cache.set(cacheKey, rentals);

    res.status(200).json(rentals);
  } catch (error) {
    next(error);
  }
};

const getAllRentals = async (req, res, next) => {
  try {
    // Admin only
    const rentals = await Rental.find({}).populate('user', 'name email').populate('product');
    res.status(200).json(rentals);
  } catch (error) {
    next(error);
  }
};

const createBatchRentals = async (req, res, next) => {
  try {
    const { items, deliveryAddress, deliveryDate } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error('No items provided for checkout');
    }

    const createdRentals = [];

    for (const item of items) {
      const prod = await Product.findById(item.product);
      if (!prod) {
        res.status(404);
        throw new Error(`Product ${item.product} not found`);
      }

      if (prod.stock < item.quantity) {
        res.status(400);
        throw new Error(`Product ${prod.name} has insufficient stock`);
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + item.tenureMonths);

      const totalCost = (prod.monthlyRent * item.tenureMonths * item.quantity) + (prod.securityDeposit * item.quantity);

      const rental = new Rental({
        user: req.user._id,
        product: item.product,
        startDate,
        endDate,
        tenureMonths: item.tenureMonths,
        monthlyRent: prod.monthlyRent,
        securityDeposit: prod.securityDeposit,
        totalCost,
        deliveryAddress,
        deliveryDate,
        quantity: item.quantity
      });

      const createdRental = await rental.save();

      // Decrease stock
      prod.stock -= item.quantity;
      await prod.save();

      createdRentals.push(createdRental);
    }

    cache.del(`rentals_${req.user._id}`);
    cache.del('all_products');

    res.status(201).json(createdRentals);
  } catch (error) {
    next(error);
  }
};

const updateRentalStatus = async (req, res, next) => {
  try {
    const { status, deliveryStatus, pickupDate, disputeStatus, disputeDescription, damageClaim, damageDescription } = req.body;
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      res.status(404);
      throw new Error('Rental not found');
    }

    if (status !== undefined) rental.status = status;
    if (deliveryStatus !== undefined) rental.deliveryStatus = deliveryStatus;
    if (pickupDate !== undefined) rental.pickupDate = pickupDate;
    if (disputeStatus !== undefined) rental.disputeStatus = disputeStatus;
    if (disputeDescription !== undefined) rental.disputeDescription = disputeDescription;
    if (damageClaim !== undefined) rental.damageClaim = damageClaim;
    if (damageDescription !== undefined) rental.damageDescription = damageDescription;

    const updatedRental = await rental.save();

    if (status === 'Completed' || status === 'Cancelled') {
      const prod = await Product.findById(rental.product);
      if (prod) {
        prod.stock += rental.quantity || 1;
        await prod.save();
        cache.del('all_products');
      }
    }

    cache.del(`rentals_${rental.user}`);

    res.status(200).json(updatedRental);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRental,
  getMyRentals,
  getAllRentals,
  createBatchRentals,
  updateRentalStatus
};
