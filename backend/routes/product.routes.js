const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/auth');
const Joi = require('joi');
const { validateRequest } = require('../validations/user.validation');

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  monthlyRent: Joi.number().min(0).required(),
  securityDeposit: Joi.number().min(0).required(),
  tenureOptions: Joi.array().items(Joi.number().integer().min(1)).required(),
  stock: Joi.number().integer().min(0).required(),
  imageUrl: Joi.string().allow('').optional(),
  category: Joi.string().valid('Furniture', 'Appliances').required()
});

const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  monthlyRent: Joi.number().min(0).optional(),
  securityDeposit: Joi.number().min(0).optional(),
  tenureOptions: Joi.array().items(Joi.number().integer().min(1)).optional(),
  stock: Joi.number().integer().min(0).optional(),
  imageUrl: Joi.string().allow('').optional(),
  category: Joi.string().valid('Furniture', 'Appliances').optional()
});

router.route('/')
  .get(getProducts)
  .post(protect, admin, validateRequest(productSchema), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, validateRequest(updateProductSchema), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
