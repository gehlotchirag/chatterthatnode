'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Buyer = mongoose.model('Buyer'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, buyer;

/**
 * Buyer routes tests
 */
describe('Buyer CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Buyer
		user.save(function() {
			buyer = {
				name: 'Buyer Name'
			};

			done();
		});
	});

	it('should be able to save Buyer instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Buyer
				agent.post('/buyers')
					.send(buyer)
					.expect(200)
					.end(function(buyerSaveErr, buyerSaveRes) {
						// Handle Buyer save error
						if (buyerSaveErr) done(buyerSaveErr);

						// Get a list of Buyers
						agent.get('/buyers')
							.end(function(buyersGetErr, buyersGetRes) {
								// Handle Buyer save error
								if (buyersGetErr) done(buyersGetErr);

								// Get Buyers list
								var buyers = buyersGetRes.body;

								// Set assertions
								(buyers[0].user._id).should.equal(userId);
								(buyers[0].name).should.match('Buyer Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Buyer instance if not logged in', function(done) {
		agent.post('/buyers')
			.send(buyer)
			.expect(401)
			.end(function(buyerSaveErr, buyerSaveRes) {
				// Call the assertion callback
				done(buyerSaveErr);
			});
	});

	it('should not be able to save Buyer instance if no name is provided', function(done) {
		// Invalidate name field
		buyer.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Buyer
				agent.post('/buyers')
					.send(buyer)
					.expect(400)
					.end(function(buyerSaveErr, buyerSaveRes) {
						// Set message assertion
						(buyerSaveRes.body.message).should.match('Please fill Buyer name');
						
						// Handle Buyer save error
						done(buyerSaveErr);
					});
			});
	});

	it('should be able to update Buyer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Buyer
				agent.post('/buyers')
					.send(buyer)
					.expect(200)
					.end(function(buyerSaveErr, buyerSaveRes) {
						// Handle Buyer save error
						if (buyerSaveErr) done(buyerSaveErr);

						// Update Buyer name
						buyer.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Buyer
						agent.put('/buyers/' + buyerSaveRes.body._id)
							.send(buyer)
							.expect(200)
							.end(function(buyerUpdateErr, buyerUpdateRes) {
								// Handle Buyer update error
								if (buyerUpdateErr) done(buyerUpdateErr);

								// Set assertions
								(buyerUpdateRes.body._id).should.equal(buyerSaveRes.body._id);
								(buyerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Buyers if not signed in', function(done) {
		// Create new Buyer model instance
		var buyerObj = new Buyer(buyer);

		// Save the Buyer
		buyerObj.save(function() {
			// Request Buyers
			request(app).get('/buyers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Buyer if not signed in', function(done) {
		// Create new Buyer model instance
		var buyerObj = new Buyer(buyer);

		// Save the Buyer
		buyerObj.save(function() {
			request(app).get('/buyers/' + buyerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', buyer.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Buyer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Buyer
				agent.post('/buyers')
					.send(buyer)
					.expect(200)
					.end(function(buyerSaveErr, buyerSaveRes) {
						// Handle Buyer save error
						if (buyerSaveErr) done(buyerSaveErr);

						// Delete existing Buyer
						agent.delete('/buyers/' + buyerSaveRes.body._id)
							.send(buyer)
							.expect(200)
							.end(function(buyerDeleteErr, buyerDeleteRes) {
								// Handle Buyer error error
								if (buyerDeleteErr) done(buyerDeleteErr);

								// Set assertions
								(buyerDeleteRes.body._id).should.equal(buyerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Buyer instance if not signed in', function(done) {
		// Set Buyer user 
		buyer.user = user;

		// Create new Buyer model instance
		var buyerObj = new Buyer(buyer);

		// Save the Buyer
		buyerObj.save(function() {
			// Try deleting Buyer
			request(app).delete('/buyers/' + buyerObj._id)
			.expect(401)
			.end(function(buyerDeleteErr, buyerDeleteRes) {
				// Set message assertion
				(buyerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Buyer error error
				done(buyerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Buyer.remove().exec();
		done();
	});
});