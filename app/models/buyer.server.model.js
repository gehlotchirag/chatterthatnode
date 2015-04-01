'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Buyer Schema
 */
var BuyerSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Buyer title',
    trim: true
  },
  display: {
    type: String,
    default: ''
  },
  BuyerName: {
    type: String,
    default: '',
    required: 'Please fill Buyer name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Buyer description',
    trim: true
  },
  cost: {
    type: Number,
    default: '',
    required: 'Please fill Buyer cost',
    trim: true
  },
  duration: {
    type: Number,
    default: '30',
    required: 'Please fill Buyer cost',
    trim: true
  },
  created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Buyer', BuyerSchema);
