'use strict';

var _ = require('underscore'),
    mongo = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    mongoUri = "mongodb://127.0.0.1:27017/fathom",
    events = require('./events'),
    correlations;

mongo.connect(mongoUri, function(err, db) {
  return db.collection('correlations', function(er, c) {
    return correlations = c;
  });
});

exports.index = function(req, res) {
  mongo.connect(mongoUri, function(err, db) {
    return db.collection('correlations', function(er, c) {
      return c.find({deletedAt: null}).toArray(function(err, correlations) {
        correlations = _.map(correlations, function(item) {
            return {
              id: item._id,
              timeline: item.timeline,
              event: item.event,
              votes: item.votes,
              creator: item.creator,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            };
        });
        return res.send(correlations);
      });
    });
  });
};

exports.timelines = function(req, res) {
  var id = req.params.id;
  mongo.connect(mongoUri, function(err, db) {
    db.collection('correlations', function(er, c) {
      c.find({deletedAt: null, timeline: id}).toArray(function(err, correlations) {
        correlations = _.map(correlations, function(item) {
            return {
              event: item.event
            };
        });

        var getEvents = function(func) {
          var evtIds = [];
          correlations.forEach(function(cor) {
            evtIds.push(ObjectId(cor.event));
          });
          func(evtIds);
        };

        getEvents(function(evtIds) {
          events.correlated(evtIds, function(evts) {
            return res.send(evts, 200);
          });
        });

      });
    });
  });
};

exports.events = function(req, res) {
  var id = req.params.id;
  mongo.connect(mongoUri, function(err, db) {
    return db.collection('correlations', function(er, c) {
      return c.find({deletedAt: null, event: id}).toArray(function(err, correlations) {
        correlations = _.map(correlations, function(item) {
            return {
              id: item._id,
              timeline: item.timeline,
              event: item.event,
              votes: item.votes,
              creator: item.creator,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            };
        });
        return res.send(correlations);
      });
    });
  });
};

exports.create = function(req, res) {
  var correlation;
  correlation = {
    timeline: req.body.timeline,
    event: req.body.event,
    votes: req.body.votes,
    creator: req.body.creator,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  };
  return correlations.insert(correlation, function(err) {
    console.log(correlation);
    return res.send(correlation, 200);
  });
};

exports.edit = function(req, res) {
  var correlation, id;
  id = req.params.id;
  correlation = {
    _id: ObjectId(id),
    timeline: req.body.timeline,
    event: req.body.event,
    votes: req.body.votes,
    creator: req.body.creator,
    createdAt: req.body.createdAt,
    updatedAt: new Date(),
    deletedAt: req.body.deletedAt
  };
  return correlations.save(correlation, function(err) {
    return res.send(200);
  });
};
