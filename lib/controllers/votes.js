'use strict';

var _ = require('underscore'),
    mongo = require('mongodb').MongoClient,
    mongoUri = "mongodb://127.0.0.1:27017/fathom",
    votes;

mongo.connect(mongoUri, function(err, db) {
  return db.collection('votes', function(er, c) {
    return votes = c;
  });
});

exports.index = function(req, res) {
  mongo.connect(mongoUri, function(err, db) {
    return db.collection('votes', function(er, c) {
      return c.find({deletedAt: null}).toArray(function(err, votes) {
        votes = _.map(votes, function(item) {
            return {
              id: item._id,
              user: item.user,
              comment: item.comment,
              correlation: item.correlation,
              value: item.value,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            };
        });
        return res.send(votes);
      });
    });
  });
};

exports.create = function(req, res) {
  var vote;
  vote = {
    user: req.body.user,
    comment: req.body.comment,
    correlation: req.body.correlation,
    value: req.body.value,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  };
  return votes.insert(vote, function(err) {
    return res.send(200);
  });
};

exports.edit = function(req, res) {
  var vote, id;
  id = req.params.id;
  vote = {
    _id: ObjectId(id),
    user: req.body.user,
    comment: req.body.comment,
    correlation: req.body.correlation,
    value: req.body.value,
    updatedAt: new Date()
  };
  return votes.save(vote, function(err) {
    return res.send(200);
  });
};
