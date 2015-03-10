'use strict';

//Sellers service used to communicate Sellers REST endpoints
angular.module('sellers').factory('Sellers', ['$resource',
	function($resource) {
		return $resource('sellers/:sellerId', { sellerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);