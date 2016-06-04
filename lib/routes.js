'use strict';

var users = require('./controllers/users'),
    comments = require('./controllers/comments'),
    bills = require('./controllers/bills'),
    correlations = require('./controllers/correlations'),
    comments = require('./controllers/comments'),
    votes = require('./controllers/votes'),
    index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  // Register Routes
  app.post('/users', users.create);
  app.put('/api/users/:id', users.edit);

  // Authentication Route
  app.post('/authenticate', users.authenticate);

  //Comment Routes
  app.get('/api/comments', comments.index);
  app.get('/api/comments/:id', comments.filtIndex);
  app.post('/api/comments', comments.create);
  app.put('/api/comments/:id', comments.edit);

  //bill Routes
  app.get('/api/bills', bills.index);
  app.post('/api/bills', bills.create);
  app.put('/api/bills/:id', bills.edit);

  //Vote Routes
  app.post('/api/votes', votes.create);

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  // All other routes to use Angular routing in app/scripts/app.js
  // app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};
