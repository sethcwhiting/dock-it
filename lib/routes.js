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
  app.post('/api/comments', comments.create);
  app.put('/api/comments/:id', comments.edit);

  //bill Routes
  app.get('/api/bills', bills.index);
  app.post('/api/bills', bills.create);
  app.put('/api/bills/:id', bills.edit);

  //Scorecard Routes
  app.get('/api/correlations', correlations.index);
  app.get('/api/correlations/bills/:id', correlations.bills);
  app.get('/api/correlations/comments/:id', correlations.comments);
  app.post('/api/correlations', correlations.create);
  app.put('/api/correlations/:id', correlations.edit);

  //Comment Routes
  app.get('/api/comments', comments.index);
  app.post('/api/comments', comments.create);
  app.put('/api/comments/:id', comments.edit);

  //Vote Routes
  app.get('/api/votes', comments.index);
  app.post('/api/votes', comments.create);
  app.put('/api/votes/:id', comments.edit);

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  // All other routes to use Angular routing in app/scripts/app.js
  // app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};
