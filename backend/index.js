const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error');

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
const { validateApiKey } = require('./middleware/apiKey');
app.use('/api', validateApiKey);

app.use('/api-docs', require('swagger-ui-express').serve, require('swagger-ui-express').setup(require('./config/swagger.json')));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/rentals', require('./routes/rental.routes'));
app.use('/api/maintenance', require('./routes/maintenance.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/serviceareas', require('./routes/servicearea.routes'));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // Nodemon restart trigger
