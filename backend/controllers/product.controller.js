const Product = require('../models/product.model');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

const getProducts = async (req, res, next) => {
  try {
    const cacheKey = 'all_products';
    const cachedProducts = cache.get(cacheKey);

    if (cachedProducts) {
      return res.status(200).json(cachedProducts);
    }

    const products = await Product.find({});
    cache.set(cacheKey, products);
    
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, monthlyRent, securityDeposit, tenureOptions, stock, imageUrl, category } = req.body;

    const product = new Product({
      name,
      description,
      monthlyRent,
      securityDeposit,
      tenureOptions,
      stock,
      imageUrl,
      category
    });

    const createdProduct = await product.save();
    cache.del('all_products'); // Clear cache when new product is added

    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, description, monthlyRent, securityDeposit, tenureOptions, stock, imageUrl, category } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (monthlyRent !== undefined) product.monthlyRent = monthlyRent;
    if (securityDeposit !== undefined) product.securityDeposit = securityDeposit;
    if (tenureOptions !== undefined) product.tenureOptions = tenureOptions;
    if (stock !== undefined) product.stock = stock;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (category !== undefined) product.category = category;

    const updatedProduct = await product.save();
    cache.del('all_products');

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await Product.findByIdAndDelete(req.params.id);
    cache.del('all_products');

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
