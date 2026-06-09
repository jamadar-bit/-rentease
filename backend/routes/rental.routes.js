const express = require('express');
const router = express.Router();
const { createRental, getMyRentals, getAllRentals, createBatchRentals, updateRentalStatus } = require('../controllers/rental.controller');
const { protect, admin } = require('../middleware/auth');
const Joi = require('joi');
const { validateRequest } = require('../validations/user.validation');

const rentalSchema = Joi.object({
  product: Joi.string().required(),
  tenureMonths: Joi.number().integer().min(1).required(),
  deliveryAddress: Joi.string().required(),
  deliveryDate: Joi.date().required()
});

const batchRentalSchema = Joi.object({
  items: Joi.array().items(Joi.object({
    product: Joi.string().required(),
    tenureMonths: Joi.number().integer().min(1).required(),
    quantity: Joi.number().integer().min(1).required()
  })).required(),
  deliveryAddress: Joi.string().required(),
  deliveryDate: Joi.date().required()
});

router.route('/')
  .post(protect, validateRequest(rentalSchema), createRental)
  .get(protect, admin, getAllRentals);

router.route('/batch')
  .post(protect, validateRequest(batchRentalSchema), createBatchRentals);

router.route('/myrentals').get(protect, getMyRentals);
router.route('/:id/status').put(protect, admin, updateRentalStatus);

module.exports = router;
