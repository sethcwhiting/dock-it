'use strict';

var express = require('express'),
    cors = require('cors'),
    expressJwt = require('express-jwt'),
    path = require('path'),
    ejs = require('ejs'),
    config = require('./config'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    connect = require('connect'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    secret = 'this is the secret secret secret 12356';


/**
 * Express configuration
 */
module.exports = function(app) {
  if (app.get('env') == 'development') {
    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(cors());
    app.options('*', cors());
    app.use(express.static(path.join(config.root, '/app')));
    app.use('/styles', express.static(path.join(config.root, '/.tmp/styles')));
    app.use('/bower_components', express.static(path.join(config.root, '/bower_components')));
    app.set('views', config.root + '/app/views');

  }

  if (app.get('env') == 'production') {
    app.use(cors());
    app.options('*', cors());
    app.use(express.static(path.join(config.root, '/dist')));
    app.use('/bower_components', express.static(path.join(config.root, '/bower_components')));
    app.set('views', config.root + '/dist/views');
  }

  app.engine('html', ejs.renderFile);
  app.set('view engine', 'html');
  app.use(morgan('combined'));

  // AUTH CODE
  app.use('/api', expressJwt({secret: secret}));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride('X-HTTP-Method-Override'));

  // Error handler
  app.use(errorHandler());
};
