const Rental = require('../models/rental.model');
const User = require('../models/user.model');
const Maintenance = require('../models/maintenance.model');

const getAdminStats = async (req, res, next) => {
  try {
    // 1. Total Revenue (sum of totalCost of non-cancelled rentals)
    const revenueStats = await Rental.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalCost' } } }
    ]);
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;

    // 2. Active Rentals count
    const activeRentals = await Rental.countDocuments({ status: 'Active' });

    // 3. Pending Support tickets count
    const pendingSupport = await Maintenance.countDocuments({ status: { $ne: 'Resolved' } });

    // 4. Total Users count
    const totalUsers = await User.countDocuments({ role: 'user' });

    // 5. Category distribution from rentals
    const categoryStats = await Rental.aggregate([
      { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'prod' } },
      { $unwind: '$prod' },
      { $group: { _id: '$prod.category', count: { $sum: 1 } } }
    ]);

    // 6. Recent rentals list
    const recentRentals = await Rental.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('product', 'name category monthlyRent imageUrl');

    res.status(200).json({
      totalRevenue,
      activeRentals,
      pendingSupport,
      totalUsers,
      categoryStats,
      recentRentals
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats
};
