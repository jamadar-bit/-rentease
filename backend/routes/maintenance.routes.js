const express = require('express');
const router = express.Router();
const { createMaintenanceRequest, getMyRequests, getAllRequests, updateMaintenanceStatus } = require('../controllers/maintenance.controller');
const { protect, admin } = require('../middleware/auth');
const Joi = require('joi');
const { validateRequest } = require('../validations/user.validation');

const maintenanceSchema = Joi.object({
  rentalId: Joi.string().required(),
  issueDescription: Joi.string().required()
});

router.route('/')
  .post(protect, validateRequest(maintenanceSchema), createMaintenanceRequest)
  .get(protect, admin, getAllRequests); // Admin only in prod

router.route('/myrequests').get(protect, getMyRequests);
router.route('/:id/status').put(protect, admin, updateMaintenanceStatus); // Admin only in prod

module.exports = router;
