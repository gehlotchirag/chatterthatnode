'use strict';

// Sellers controller
angular.module('sellers').controller('SellersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sellers',
	function($scope, $stateParams, $location, Authentication, Sellers) {
		$scope.authentication = Authentication;

		// Create new Seller
		$scope.create = function() {
			// Create new Seller object
			var seller = new Sellers ({
                name: this.name,
                title: this.title,
                description: this.description,
                cost: this.cost,
                duration: this.duration
			});

			// Redirect after save
			seller.$save(function(response) {
				$location.path('sellers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Seller
		$scope.remove = function(seller) {
			if ( seller ) { 
				seller.$remove();

				for (var i in $scope.sellers) {
					if ($scope.sellers [i] === seller) {
						$scope.sellers.splice(i, 1);
					}
				}
			} else {
				$scope.seller.$remove(function() {
					$location.path('sellers');
				});
			}
		};

		// Update existing Seller
		$scope.update = function() {
			var seller = $scope.seller;

			seller.$update(function() {
				$location.path('sellers/' + seller._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sellers
		$scope.find = function() {
			$scope.sellers = Sellers.query();
		};

		// Find existing Seller
		$scope.findOne = function() {
			$scope.seller = Sellers.get({ 
				sellerId: $stateParams.sellerId
			});
		};
	}
]);
