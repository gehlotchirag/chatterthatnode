'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Buyer = mongoose.model('Buyer'),
	_ = require('lodash');

/**
 * Create a Buyer
 */
exports.create = function(req, res) {
	var buyer = new Buyer(req.body);
	buyer.user = req.user;

	buyer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(buyer);
		}
	});
};

/**
 * Show the current Buyer
 */
exports.read = function(req, res) {
	res.jsonp(req.buyer);
};

/**
 * Update a Buyer
 */
exports.update = function(req, res) {
	var buyer = req.buyer ;

	buyer = _.extend(buyer , req.body);

	buyer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(buyer);
		}
	});
};

/**
 * Delete an Buyer
 */
exports.delete = function(req, res) {
	var buyer = req.buyer ;

	buyer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(buyer);
		}
	});
};

/**
 * List of Buyers
 */
exports.list = function(req, res) { 
	Buyer.find().sort('-created').populate('user', 'displayName').exec(function(err, buyers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(buyers);
		}
	});
};

/**
 * Buyer middleware
 */
exports.buyerByID = function(req, res, next, id) { 
	Buyer.findById(id).populate('user', 'displayName').exec(function(err, buyer) {
		if (err) return next(err);
		if (! buyer) return next(new Error('Failed to load Buyer ' + id));
		req.buyer = buyer ;
		next();
	});
};

/**
 * Buyer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.buyer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
