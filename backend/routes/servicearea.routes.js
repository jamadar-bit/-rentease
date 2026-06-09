const express = require('express');
const router = express.Router();
const { getServiceAreas, createServiceArea, updateServiceArea, deleteServiceArea, checkServiceArea } = require('../controllers/servicearea.controller');
const { protect, admin } = require('../middleware/auth');

router.get('/check/:pincode', checkServiceArea);

router.route('/')
  .get(protect, admin, getServiceAreas)
  .post(protect, admin, createServiceArea);

router.route('/:id')
  .put(protect, admin, updateServiceArea)
  .delete(protect, admin, deleteServiceArea);

module.exports = router;
