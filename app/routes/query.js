// Dependencies
var mongoose        = require('mongoose');
var User            = require('../models/model.js');

// Opens App Routes
module.exports = function() {
	return {
		
		post: function(req, res){
			

			// Retrieves JSON records for all users who meet a certain set of query conditions
			

				// Grab all of the query parameters from the body.
				var lat             = req.body.latitude;
				var long            = req.body.longitude;
				var distance        = req.body.distance;
				var male            = req.body.male;
				var female          = req.body.female;
				var other           = req.body.other;
				var minAge          = req.body.minAge;
				var maxAge          = req.body.maxAge;
				var favLang         = req.body.favlang;
				var reqVerified     = req.body.reqVerified;

				// Opens a generic Mongoose Query. Depending on the post body we will...
				var query = User.find({});

				// ...include filter by Max Distance (converting miles to meters)
				if(distance){

					// Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
					query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

						// Converting meters to miles. Specifying spherical geometry (for globe)
						maxDistance: distance * 1609.34, spherical: true});
				}

				// ...include filter by Gender (all options)
				if(male || female || other){
					query.or([{ 'gender': male }, { 'gender': female }, {'gender': other}]);
				}

				// ...include filter by Min Age
				if(minAge){
					query = query.where('age').gte(minAge);
				}

				// ...include filter by Max Age
				if(maxAge){
					query = query.where('age').lte(maxAge);
				}

				// ...include filter by Favorite Language
				if(favLang){
					query = query.where('favlang').equals(favLang);
				}

				// ...include filter for HTML5 Verified Locations
				if(reqVerified){
					query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
				}

				// Execute Query and Return the Query Results
				query.exec(function(err, users){
					if(err)
						res.send(err);

					// If no errors, respond with a JSON of all users that meet the criteria
					res.json(users);
				});
			
		}
			
			
	}
};  