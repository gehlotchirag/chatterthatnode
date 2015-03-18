'use strict';

//Setting up route
angular.module('sellers').config(['$stateProvider',
	function($stateProvider) {
		// Sellers state routing
		$stateProvider.
		state('listSellers', {
			url: '/sellers',
			templateUrl: 'modules/sellers/views/list-sellers.client.view.html'
		}).
		state('createSeller', {
			url: '/sellers/create',
			templateUrl: 'modules/sellers/views/create-seller.client.view.html'
		}).
		state('viewSeller', {
			url: '/sellers/:sellerId',
			templateUrl: 'modules/sellers/views/view-seller.client.view.html'
		}).
            state('videochatSeller', {
                url: '/sellers/:sellerId/videochat',
                templateUrl: 'modules/sellers/views/videochat.view.html'
            }).
		state('editSeller', {
			url: '/sellers/:sellerId/edit',
			templateUrl: 'modules/sellers/views/edit-seller.client.view.html'
		});
	}
]);
