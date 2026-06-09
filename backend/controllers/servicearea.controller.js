const ServiceArea = require('../models/servicearea.model');

const getServiceAreas = async (req, res, next) => {
  try {
    const areas = await ServiceArea.find({});
    res.status(200).json(areas);
  } catch (error) {
    next(error);
  }
};

const createServiceArea = async (req, res, next) => {
  try {
    const { name, pincode, active } = req.body;

    const exists = await ServiceArea.findOne({ pincode });
    if (exists) {
      res.status(400);
      throw new Error('Service area with this pincode already exists');
    }

    const area = new ServiceArea({ name, pincode, active });
    const createdArea = await area.save();
    res.status(201).json(createdArea);
  } catch (error) {
    next(error);
  }
};

const updateServiceArea = async (req, res, next) => {
  try {
    const { name, pincode, active } = req.body;
    const area = await ServiceArea.findById(req.params.id);

    if (!area) {
      res.status(404);
      throw new Error('Service area not found');
    }

    if (name !== undefined) area.name = name;
    if (pincode !== undefined) area.pincode = pincode;
    if (active !== undefined) area.active = active;

    const updatedArea = await area.save();
    res.status(200).json(updatedArea);
  } catch (error) {
    next(error);
  }
};

const deleteServiceArea = async (req, res, next) => {
  try {
    const area = await ServiceArea.findById(req.params.id);
    if (!area) {
      res.status(404);
      throw new Error('Service area not found');
    }

    await ServiceArea.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Service area deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const checkServiceArea = async (req, res, next) => {
  try {
    const { pincode } = req.params;
    const area = await ServiceArea.findOne({ pincode, active: true });
    
    if (area) {
      res.status(200).json({ available: true, city: area.name });
    } else {
      res.status(200).json({ available: false });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServiceAreas,
  createServiceArea,
  updateServiceArea,
  deleteServiceArea,
  checkServiceArea
};
