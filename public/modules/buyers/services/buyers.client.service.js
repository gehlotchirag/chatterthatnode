'use strict';

//Buyers service used to communicate Buyers REST endpoints
angular.module('buyers').factory('Buyers', ['$resource',
	function($resource) {
		return $resource('buyers/:buyerId', { buyerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);