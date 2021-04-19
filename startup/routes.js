require('express-async-errors');
const express = require('express');
const dogs = require('../routes/dogs');
const favourites = require('../routes/favourites');
const shelters = require('../routes/shelters');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/errorMiddleware');
const morgan = require('morgan');

function routes(app) {
  
    app.use(express.json()); // req.body
    app.use(express.urlencoded({extended: true})); // parses incoming req with urlenc payloads
    if (app.get('env') === "development") {
      app.use(morgan('tiny'));
    };

    app.use('/api/dogs', dogs);
    app.use('/api/favourites', favourites);
    app.use('/api/shelters', shelters);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    app.use(error);

}

module.exports = routes;

