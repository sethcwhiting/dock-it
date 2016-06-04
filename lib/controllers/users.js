'use strict';

var _ = require('underscore'),
    jwt = require('jsonwebtoken'),
    secret = 'this is the secret secret secret 12356',
    crypto = require('crypto'),
    users;

var mongoUri = 'mongodb://127.0.0.1:27017/fathom';
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(mongoUri, function(err, db) {
  return db.collection('users', function(er, c) {
    return users = c;
  });
});

exports.create = function(req, res) {
  var user;
  user = {
    userName: req.body.userName,
    password: crypto.createHash('sha256').update(req.body.password).digest("hex"),
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  };
  return users.insert(user, function(err) {
    return res.send(200);
  });
};

exports.edit = function(req, res) {
  var user, id;
  id = req.params.id;
  user = {
    _id: ObjectId(id),
    userName: req.body.userName,
    password: req.body.password,
    updatedAt: new Date(),
    deletedAt: req.body.deletedAt
  };
  return users.save(user, function(err) {
    return res.send(200);
  });
};

exports.authenticate = function (req, res) {
  MongoClient.connect(mongoUri, function(err, db) {
    return db.collection('users', function(er, c) {
      return c.find({
        $and: [
          {userName: req.body.userName},
          {password: crypto.createHash('sha256').update(req.body.password).digest("hex")},
          {deletedAt: null}
        ]
      }).toArray(function(err, users) {
        users = _.map(users, function(item) {
            return {
              id: item._id,
              userName: item.userName
            };
        });
        if (users[0]===undefined) {
          res.send(401, 'Wrong user or password');
          return;
        }
        // Send the user inside the token
        var expDate = new Date();
        expDate = expDate.setDate(expDate.getDate() + 2);
        var token = jwt.sign(users[0], secret, { expiresIn: '2 days' });
        res.json({
          token: token,
          user: users[0],
          expDate: expDate
        });
      });
    });
  });
};
