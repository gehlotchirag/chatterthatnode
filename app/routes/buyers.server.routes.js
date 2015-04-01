'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var buyers = require('../../app/controllers/buyers.server.controller');

	// Buyers Routes
	app.route('/buyers')
		.get(buyers.list)
		.post(users.requiresLogin, buyers.create);

	app.route('/buyers/:buyerId')
		.get(buyers.read)
		.put(users.requiresLogin, buyers.hasAuthorization, buyers.update)
		.delete(users.requiresLogin, buyers.hasAuthorization, buyers.delete);

	// Finish by binding the Buyer middleware
	app.param('buyerId', buyers.buyerByID);
};
