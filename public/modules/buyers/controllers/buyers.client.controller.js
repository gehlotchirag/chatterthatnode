'use strict';

// Buyers controller
angular.module('buyers').controller('BuyersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Buyers',
	function($scope, $stateParams, $location, Authentication, Buyers) {
		$scope.authentication = Authentication;

		// Create new Buyer
		$scope.create = function() {
			// Create new Buyer object
			var buyer = new Buyers ({
				name: this.name
			});

			// Redirect after save
			buyer.$save(function(response) {
				$location.path('buyers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Buyer
		$scope.remove = function(buyer) {
			if ( buyer ) { 
				buyer.$remove();

				for (var i in $scope.buyers) {
					if ($scope.buyers [i] === buyer) {
						$scope.buyers.splice(i, 1);
					}
				}
			} else {
				$scope.buyer.$remove(function() {
					$location.path('buyers');
				});
			}
		};

		// Update existing Buyer
		$scope.update = function() {
			var buyer = $scope.buyer;

			buyer.$update(function() {
				$location.path('buyers/' + buyer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Buyers
		$scope.find = function() {
			$scope.buyers = Buyers.query();
		};

		// Find existing Buyer
		$scope.findOne = function() {
			$scope.buyer = Buyers.get({ 
				buyerId: $stateParams.buyerId
			});
		};
	}
]);