const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

// Load Models
require('./api/models/categoryModel');
require('./api/models/productModel');
require('./api/models/userModel');

const app = express();

/**
 * mongoose instance connection - url connection
 */
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === 'test') {
    mongoose.connect('mongodb://localhost/testStorageDB', { useNewUrlParser: true, useUnifiedTopology: true });
} else {
    mongoose.connect('mongodb://localhost/generalStorageDB', { useNewUrlParser: true, useUnifiedTopology: true });
}

app.use(helmet());
app.use('/uploadedFiles', express.static('uploadedFiles'));
/**
 * bodyParser parses incoming req bodies in a middleware before the handlers
 * available under the req.body property
 * req.body populated with empty json object if there is no body to parse or error while parsing
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * import and register routes in the server
 */
const categoryRoutes = require('./api/routes/categoryRoutes');
const productRoutes = require('./api/routes/productRoutes');
const userRoutes = require('./api/routes/userRoutes');
const authenticationRoutes = require('./api/routes/authenticationRoutes');

categoryRoutes(app);
productRoutes(app);
userRoutes(app);
authenticationRoutes(app);

/**
 * Handle wrong route calls
 * Always add after registering routes
 */
app.use((req, res) => {
    res.status(404).send({ url: `${req.originalUrl} not found` });
});

module.exports = app;
