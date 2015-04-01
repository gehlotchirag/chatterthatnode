'use strict';

//Setting up route
angular.module('buyers').config(['$stateProvider',
	function($stateProvider) {
		// Buyers state routing
		$stateProvider.
		state('listBuyers', {
			url: '/buyers',
			templateUrl: 'modules/buyers/views/list-buyers.client.view.html'
		}).
		state('createBuyer', {
			url: '/buyers/create',
			templateUrl: 'modules/buyers/views/create-buyer.client.view.html'
		}).
		state('viewBuyer', {
			url: '/buyers/:buyerId',
			templateUrl: 'modules/buyers/views/view-buyer.client.view.html'
		}).
		state('editBuyer', {
			url: '/buyers/:buyerId/edit',
			templateUrl: 'modules/buyers/views/edit-buyer.client.view.html'
		});
	}
]);