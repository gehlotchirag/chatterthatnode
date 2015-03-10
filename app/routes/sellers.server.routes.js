'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var sellers = require('../../app/controllers/sellers.server.controller');

	// Sellers Routes
	app.route('/sellers')
		.get(sellers.list)
		.post(users.requiresLogin, sellers.create);

	app.route('/sellers/:sellerId')
		.get(sellers.read)
		.put(users.requiresLogin, sellers.hasAuthorization, sellers.update)
		.delete(users.requiresLogin, sellers.hasAuthorization, sellers.delete);

	// Finish by binding the Seller middleware
	app.param('sellerId', sellers.sellerByID);
};
