'use strict';

var _ = require('underscore'),
    mongo = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    mongoUri = "mongodb://127.0.0.1:27017/fathom",
    votes,
		bills,
		comments;

var ObjectId = require('mongodb').ObjectID;

mongo.connect(mongoUri, function(err, db) {
  return db.collection('votes', function(er, c) {
    return votes = c;
  });
});

/*
When creating a vote, we need 4 parameters:
Content type: either "bill" or "comment"
	this tells us which collection to use for the vote
Vote type: either "up" or "down"
	this tells us whether to vote UP or DOWN
User: id
	each POST to vote must include the ID of the voting user
Voted ID: id
	each POST to vote must include the ID of the element on which to apply the vote
*/
exports.create = function(req, res) {
	var content_type = req.body.content_type;
	var vote_type = req.body.vote_type;
	var user = req.body.user_id;
	var voted_id = req.body.voted_id;
	voted_id = ObjectId(voted_id);
	if(content_type === "bill") {
	  mongo.connect(mongoUri, function(err, db) {
			return db.collection('bills', function(er, c) {
				return c.find({_id: voted_id}).toArray(function(err, selected_bills) {
					var mapped_bills = _.map(selected_bills, function(item) {
							if(vote_type === "up"){
								return {
									_id: item._id,
									date: req.body.date,
									upvoters: _.uniq(item.upvoters.concat(user)),
									downvoters: _.reject(item.downvoters,function(elem) { return elem === user; }),
									title: req.body.title,
									url: req.body.url,
									creator: req.body.creator,
									createdAt: req.body.createdAt,
									updatedAt: new Date(),
									deletedAt: req.body.deletedAt
								}
							}
							else if(vote_type === "down"){
								return {
									_id: item._id,
									date: req.body.date,
									upvoters: _.reject(item.upvoters,function(elem) { return elem === user; } ),
									downvoters: _.uniq(item.downvoters.concat(user)),
									title: req.body.title,
									url: req.body.url,
									creator: req.body.creator,
									createdAt: req.body.createdAt,
									updatedAt: new Date(),
									deletedAt: req.body.deletedAt
								}
							}
					});
					_.each(mapped_bills, function(bill) {
						return c.save(bill, function(err) {
						});
					});
				});
			});
		});
	}
	else if(content_type === "comment"){
	  mongo.connect(mongoUri, function(err, db) {
			return db.collection('comments', function(er, c) {
				return c.find({_id: voted_id}).toArray(function(err, selected_comments) {
					var mapped_comments = _.map(selected_comments, function(item) {
							if(vote_type === "up"){
								return {
									_id: item._id,
									text: item.text,
									upvoters: _.uniq(item.upvoters.concat(user)),
									downvoters: _.reject(item.downvoters,function(elem) { return elem === user }),
									parent: item.parent,
									creator: item.creator,
									createdAt: item.createdAt,
									updatedAt: new Date
								}
							}
							else if(vote_type === "down"){
								return {
									_id: item._id,
									text: item.text,
									upvoters: _.reject(item.upvoters,function(elem) { return elem === user }),
									downvoters: _.uniq(item.downvoters.concat(user)),
									parent: item.parent,
									creator: item.creator,
									createdAt: item.createdAt,
									updatedAt: new Date
								}
							}
					});
					_.each(mapped_comments, function(comment) {
						return c.save(comment, function(err) {
						});
					});
				});
			});
		});
	}
	return res.send(200);
};
