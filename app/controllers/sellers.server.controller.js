'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Seller = mongoose.model('Seller'),
	_ = require('lodash');

/**
 * Create a Seller
 */
exports.create = function(req, res) {
	var seller = new Seller(req.body);
	seller.user = req.user;

	seller.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(seller);
		}
	});
};

/**
 * Show the current Seller
 */
exports.read = function(req, res) {
	res.jsonp(req.seller);
};

/**
 * Update a Seller
 */
exports.update = function(req, res) {
	var seller = req.seller ;

	seller = _.extend(seller , req.body);

	seller.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(seller);
		}
	});
};

/**
 * Delete an Seller
 */
exports.delete = function(req, res) {
	var seller = req.seller ;

	seller.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(seller);
		}
	});
};

/**
 * List of Sellers
 */
exports.list = function(req, res) { 
	Seller.find().sort('-created').populate('user', 'displayName').exec(function(err, sellers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sellers);
		}
	});
};

/**
 * Seller middleware
 */
exports.sellerByID = function(req, res, next, id) { 
	Seller.findById(id).populate('user', 'displayName').exec(function(err, seller) {
		if (err) return next(err);
		if (! seller) return next(new Error('Failed to load Seller ' + id));
		req.seller = seller ;
		next();
	});
};

/**
 * Seller authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.seller.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
