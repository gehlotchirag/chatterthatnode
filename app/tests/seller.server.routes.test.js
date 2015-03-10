'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Seller = mongoose.model('Seller'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, seller;

/**
 * Seller routes tests
 */
describe('Seller CRUD tests', function() {
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

		// Save a user to the test db and create new Seller
		user.save(function() {
			seller = {
				name: 'Seller Name'
			};

			done();
		});
	});

	it('should be able to save Seller instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Seller
				agent.post('/sellers')
					.send(seller)
					.expect(200)
					.end(function(sellerSaveErr, sellerSaveRes) {
						// Handle Seller save error
						if (sellerSaveErr) done(sellerSaveErr);

						// Get a list of Sellers
						agent.get('/sellers')
							.end(function(sellersGetErr, sellersGetRes) {
								// Handle Seller save error
								if (sellersGetErr) done(sellersGetErr);

								// Get Sellers list
								var sellers = sellersGetRes.body;

								// Set assertions
								(sellers[0].user._id).should.equal(userId);
								(sellers[0].name).should.match('Seller Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Seller instance if not logged in', function(done) {
		agent.post('/sellers')
			.send(seller)
			.expect(401)
			.end(function(sellerSaveErr, sellerSaveRes) {
				// Call the assertion callback
				done(sellerSaveErr);
			});
	});

	it('should not be able to save Seller instance if no name is provided', function(done) {
		// Invalidate name field
		seller.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Seller
				agent.post('/sellers')
					.send(seller)
					.expect(400)
					.end(function(sellerSaveErr, sellerSaveRes) {
						// Set message assertion
						(sellerSaveRes.body.message).should.match('Please fill Seller name');
						
						// Handle Seller save error
						done(sellerSaveErr);
					});
			});
	});

	it('should be able to update Seller instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Seller
				agent.post('/sellers')
					.send(seller)
					.expect(200)
					.end(function(sellerSaveErr, sellerSaveRes) {
						// Handle Seller save error
						if (sellerSaveErr) done(sellerSaveErr);

						// Update Seller name
						seller.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Seller
						agent.put('/sellers/' + sellerSaveRes.body._id)
							.send(seller)
							.expect(200)
							.end(function(sellerUpdateErr, sellerUpdateRes) {
								// Handle Seller update error
								if (sellerUpdateErr) done(sellerUpdateErr);

								// Set assertions
								(sellerUpdateRes.body._id).should.equal(sellerSaveRes.body._id);
								(sellerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sellers if not signed in', function(done) {
		// Create new Seller model instance
		var sellerObj = new Seller(seller);

		// Save the Seller
		sellerObj.save(function() {
			// Request Sellers
			request(app).get('/sellers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Seller if not signed in', function(done) {
		// Create new Seller model instance
		var sellerObj = new Seller(seller);

		// Save the Seller
		sellerObj.save(function() {
			request(app).get('/sellers/' + sellerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', seller.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Seller instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Seller
				agent.post('/sellers')
					.send(seller)
					.expect(200)
					.end(function(sellerSaveErr, sellerSaveRes) {
						// Handle Seller save error
						if (sellerSaveErr) done(sellerSaveErr);

						// Delete existing Seller
						agent.delete('/sellers/' + sellerSaveRes.body._id)
							.send(seller)
							.expect(200)
							.end(function(sellerDeleteErr, sellerDeleteRes) {
								// Handle Seller error error
								if (sellerDeleteErr) done(sellerDeleteErr);

								// Set assertions
								(sellerDeleteRes.body._id).should.equal(sellerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Seller instance if not signed in', function(done) {
		// Set Seller user 
		seller.user = user;

		// Create new Seller model instance
		var sellerObj = new Seller(seller);

		// Save the Seller
		sellerObj.save(function() {
			// Try deleting Seller
			request(app).delete('/sellers/' + sellerObj._id)
			.expect(401)
			.end(function(sellerDeleteErr, sellerDeleteRes) {
				// Set message assertion
				(sellerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Seller error error
				done(sellerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Seller.remove().exec();
		done();
	});
});