'use strict';

(function() {
	// Sellers Controller Spec
	describe('Sellers Controller Tests', function() {
		// Initialize global variables
		var SellersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Sellers controller.
			SellersController = $controller('SellersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Seller object fetched from XHR', inject(function(Sellers) {
			// Create sample Seller using the Sellers service
			var sampleSeller = new Sellers({
				name: 'New Seller'
			});

			// Create a sample Sellers array that includes the new Seller
			var sampleSellers = [sampleSeller];

			// Set GET response
			$httpBackend.expectGET('sellers').respond(sampleSellers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sellers).toEqualData(sampleSellers);
		}));

		it('$scope.findOne() should create an array with one Seller object fetched from XHR using a sellerId URL parameter', inject(function(Sellers) {
			// Define a sample Seller object
			var sampleSeller = new Sellers({
				name: 'New Seller'
			});

			// Set the URL parameter
			$stateParams.sellerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sellers\/([0-9a-fA-F]{24})$/).respond(sampleSeller);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.seller).toEqualData(sampleSeller);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Sellers) {
			// Create a sample Seller object
			var sampleSellerPostData = new Sellers({
				name: 'New Seller'
			});

			// Create a sample Seller response
			var sampleSellerResponse = new Sellers({
				_id: '525cf20451979dea2c000001',
				name: 'New Seller'
			});

			// Fixture mock form input values
			scope.name = 'New Seller';

			// Set POST response
			$httpBackend.expectPOST('sellers', sampleSellerPostData).respond(sampleSellerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Seller was created
			expect($location.path()).toBe('/sellers/' + sampleSellerResponse._id);
		}));

		it('$scope.update() should update a valid Seller', inject(function(Sellers) {
			// Define a sample Seller put data
			var sampleSellerPutData = new Sellers({
				_id: '525cf20451979dea2c000001',
				name: 'New Seller'
			});

			// Mock Seller in scope
			scope.seller = sampleSellerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/sellers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sellers/' + sampleSellerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sellerId and remove the Seller from the scope', inject(function(Sellers) {
			// Create new Seller object
			var sampleSeller = new Sellers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sellers array and include the Seller
			scope.sellers = [sampleSeller];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sellers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSeller);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sellers.length).toBe(0);
		}));
	});
}());