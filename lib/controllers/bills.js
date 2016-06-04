'use strict';

var _ = require('underscore'),
    mongo = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    mongoUri = "mongodb://127.0.0.1:27017/fathom",
    bills;

mongo.connect(mongoUri, function(err, db) {
  return db.collection('bills', function(er, c) {
    return bills = c;
  });
});

exports.index = function(req, res) {
  mongo.connect(mongoUri, function(err, db) {
    return db.collection('bills', function(er, c) {
      return c.find({deletedAt: null}).toArray(function(err, bills) {
        bills = _.map(bills, function(item) {
            return {
              id: item._id,
              date: item.date,
              title: item.title,
							text: item.text,
              url: item.url,
              creator: item.creator,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            };
        });
        return res.send(bills);
      });
    });
  });
};

exports.create = function(req, res) {
  var bill;
  bill = {
    date: req.body.date,
    title: req.body.title,
    url: req.body.url,
    creator: req.body.creator,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  };
  return bills.insert(bill, function(err) {
    return res.send(bill._id, 200);
  });
};

exports.edit = function(req, res) {
  var bill, id;
  id = req.params.id;
  bill = {

    _id: ObjectId(id),
    date: req.body.date,
    title: req.body.title,
    url: req.body.url,
    creator: req.body.creator,
    createdAt: req.body.createdAt,
    updatedAt: new Date(),
    deletedAt: req.body.deletedAt
  };
  return bills.save(bill, function(err) {
    return res.send(200);
  });
};
