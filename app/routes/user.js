// Dependencies
var mongoose        = require('mongoose');
var User            = require('../models/model.js');

// Opens App Routes
module.exports = function() {
	return {
		// GET Routes
		// --------------------------------------------------------
		// Retrieve records for all users in the db
		get : function(req, res){

			// Uses Mongoose schema to run the search (empty conditions)
			var query = User.find({});
			query.exec(function(err, users){
				if(err)
					res.send(err);

				// If no errors are found, it responds with a JSON of all users
				res.json(users);
			});
		},

		// POST Routes
		// --------------------------------------------------------
		// Provides method for saving new users in the db
		post: function(req, res){

			// Creates a new User based on the Mongoose schema and the post bo.dy
			var newUser = new User(req.body);

			// New User is saved in the db.
			newUser.save(function(err){
				if(err)
					res.send(err);

				// If no errors are found, it responds with a JSON of the new user
				res.json(req.body);
			});
		}
	}
};  