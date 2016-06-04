'use strict';

var users = require('./controllers/users'),
    events = require('./controllers/events'),
    timelines = require('./controllers/timelines'),
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

  //Event Routes
  app.get('/api/events', events.index);
  app.post('/api/events', events.create);
  app.put('/api/events/:id', events.edit);

  //Timeline Routes
  app.get('/api/timelines', timelines.index);
  app.post('/api/timelines', timelines.create);
  app.put('/api/timelines/:id', timelines.edit);

  //Scorecard Routes
  app.get('/api/correlations', correlations.index);
  app.get('/api/correlations/timelines/:id', correlations.timelines);
  app.get('/api/correlations/events/:id', correlations.events);
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
