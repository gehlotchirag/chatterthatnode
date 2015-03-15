'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Seller Schema
 */
var SellerSchema = new Schema({
    title: {
        type: String,
        default: '',
        required: 'Please fill Seller title',
        trim: true
    },
    display: {
        type: String,
        default: ''
     },
    name: {
		type: String,
		default: '',
		required: 'Please fill Seller name',
		trim: true
	},
    description: {
        type: String,
        default: '',
        required: 'Please fill Seller description',
        trim: true
    },
    cost: {
        type: Number,
        default: '',
        required: 'Please fill Seller cost',
        trim: true
    },
    duration: {
        type: Number,
        default: '30',
        required: 'Please fill Seller cost',
        trim: true
    },
    events: [
        {
            title: String,
            start: Date,
            end: Date,
            with: String,
            accepted:Boolean
        }
    ],
    created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Seller', SellerSchema);
