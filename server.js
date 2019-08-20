var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Task = require('./api/models/todoListModel'), // loading the model
    Product = require('./api/models/productModel'), // loading the model
    bodyParser = require('body-parser');

/**
 * mongoose instance connection - url connection
 */
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/TodoDB');

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
var todoListRoutes = require('./api/routes/todoListRoutes');
var productRoutes = require('./api/routes/productRoutes');
todoListRoutes(app);
productRoutes(app);

/**
 * Handle wrong route calls
 * Always add after registering routes
 */
app.use((req, res) => {
    res.status(404).send({ url: `${req.originalUrl} not found` });
})

app.listen(port);

console.log(`todo lost RESTful API server started on: ${port}`);