const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!token || token === 'null' || token === 'undefined') {
        res.status(401);
        return next(new Error('Not authorized, token failed'));
      }
      const decoded = verifyAccessToken(token);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, token failed'));
      }
      return next();
    } catch (error) {
      console.error(error);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  } else if (req.cookies && req.cookies.accessToken) {
    try {
      token = req.cookies.accessToken;
      if (!token || token === 'null' || token === 'undefined') {
        res.status(401);
        return next(new Error('Not authorized, token failed'));
      }
      const decoded = verifyAccessToken(token);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, token failed'));
      }
      return next();
    } catch (error) {
      console.error(error);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'vendor')) {
    next();
  } else {
    res.status(403);
    next(new Error('Not authorized as an admin or vendor'));
  }
};

module.exports = { protect, admin };
