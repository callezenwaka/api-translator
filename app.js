'use strict'

// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate').v2;
// Import util library
// const utils = require('./libs/utils');
// const { handleUpload, translateText }  = require('./libs/utils');

const fs = require('fs');
const path = require('path');
const cors = require('cors');
const hbs = require('handlebars');
const express = require('express');
const multer = require('multer');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const serviceAccount = require('./translator.json');
const upload = multer({ dest: 'uploads/' });

// Creates a client
const translate = new Translate();

/**
 * Set up view engine
 */
const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

/**
 * Automatically parse request body as json
 */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * [START GET Form Page]
 */
app.get('/', async (req, res, next) => {
    var heading = 'Welcome Home';
    res.render('home', {heading});
})
// [END GET Form Page]


/**
 * Catch 404 and forward to error handler
 */
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})

/**
 * Handle error on development
 */
app.use((req, res, next) => {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error', {err});
});

// Start listening to port
app.listen(process.env.PORT || 8080, () => {
    console.log(`Server started on port: ${process.env.PORT || 8080}`);
})

module.exports = app;