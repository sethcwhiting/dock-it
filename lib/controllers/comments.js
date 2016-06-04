'use strict';

var _ = require('underscore'),
    mongo = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    mongoUri = "mongodb://127.0.0.1:27017/fathom",
    comments;

mongo.connect(mongoUri, function(err, db) {
  return db.collection('comments', function(er, c) {
    return comments = c;
  });
});

exports.index = function(req, res) {
  mongo.connect(mongoUri, function(err, db) {
    return db.collection('comments', function(er, c) {
      return c.find({deletedAt: null}).toArray(function(err, comments) {
        comments = _.map(comments, function(item) {
            return {
              id: item._id,
              text: item.text,
							upvoters: item.upvoters,
							downvoters: item.downvoters,
              parent: item.parent,
							bill_id: item.bill_id,
              creator: item.creator,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            };
        });
        return res.send(comments);
      });
    });
  });
};

exports.create = function(req, res) {
  var comment;
  comment = {
    text: req.body.text,
		upvoters: [],
		downvoters: [],
    parent: req.body.parent,
		bill_id: req.body.bill_id,
    creator: req.body.creator,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  };
  return comments.insert(comment, function(err) {
    return res.send(200);
  });
};

exports.edit = function(req, res) {
  var comment, id;
  id = req.params.id;
  comment = {
    _id: ObjectId(id),
    text: req.body.text,
		upvoters: req.body.upvoters,
		downvoters: req.body.downvoters,
    parent: req.body.parent,
		bill_id: req.body.bill_id,
    creator: req.body.creator,
    updatedAt: new Date(),
    deletedAt: req.body.deletedAt
  };
  return comments.save(comment, function(err) {
    return res.send(200);
  });
};
