const Maintenance = require('../models/maintenance.model');
const Rental = require('../models/rental.model');

const createMaintenanceRequest = async (req, res, next) => {
  try {
    const { rentalId, issueDescription } = req.body;

    const rental = await Rental.findById(rentalId);
    if (!rental || rental.user.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Rental not found or unauthorized');
    }

    const maintenance = new Maintenance({
      rental: rentalId,
      user: req.user._id,
      issueDescription
    });

    const createdMaintenance = await maintenance.save();
    res.status(201).json(createdMaintenance);
  } catch (error) {
    next(error);
  }
};

const getMyRequests = async (req, res, next) => {
  try {
    const requests = await Maintenance.find({ user: req.user._id }).populate('rental');
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

const getAllRequests = async (req, res, next) => {
  try {
    const requests = await Maintenance.find({}).populate('user', 'name email').populate('rental');
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

const updateMaintenanceStatus = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      res.status(404);
      throw new Error('Maintenance request not found');
    }

    maintenance.status = status;
    if (resolutionNotes) {
      maintenance.resolutionNotes = resolutionNotes;
    }

    const updatedMaintenance = await maintenance.save();
    res.status(200).json(updatedMaintenance);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMaintenanceRequest,
  getMyRequests,
  getAllRequests,
  updateMaintenanceStatus
};
