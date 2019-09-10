var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Category = require('./api/models/categoryModel'), // loading the model
    Product = require('./api/models/productModel'), // loading the model
    User = require('./api/models/userModel'), // loading the model
    bodyParser = require('body-parser');

/**
 * mongoose instance connection - url connection
 */
mongoose.Promise = global.Promise;
(process.env.NODE_ENV === 'test')
? mongoose.connect('mongodb://localhost/testStorageDB', { useNewUrlParser: true })
: mongoose.connect('mongodb://localhost/generalStorageDB', { useNewUrlParser: true });

app.use('/uploadedFiles', express.static('uploadedFiles'))
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