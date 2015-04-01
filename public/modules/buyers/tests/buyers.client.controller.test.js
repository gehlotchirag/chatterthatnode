'use strict';

(function() {
	// Buyers Controller Spec
	describe('Buyers Controller Tests', function() {
		// Initialize global variables
		var BuyersController,
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

			// Initialize the Buyers controller.
			BuyersController = $controller('BuyersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Buyer object fetched from XHR', inject(function(Buyers) {
			// Create sample Buyer using the Buyers service
			var sampleBuyer = new Buyers({
				name: 'New Buyer'
			});

			// Create a sample Buyers array that includes the new Buyer
			var sampleBuyers = [sampleBuyer];

			// Set GET response
			$httpBackend.expectGET('buyers').respond(sampleBuyers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.buyers).toEqualData(sampleBuyers);
		}));

		it('$scope.findOne() should create an array with one Buyer object fetched from XHR using a buyerId URL parameter', inject(function(Buyers) {
			// Define a sample Buyer object
			var sampleBuyer = new Buyers({
				name: 'New Buyer'
			});

			// Set the URL parameter
			$stateParams.buyerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/buyers\/([0-9a-fA-F]{24})$/).respond(sampleBuyer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.buyer).toEqualData(sampleBuyer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Buyers) {
			// Create a sample Buyer object
			var sampleBuyerPostData = new Buyers({
				name: 'New Buyer'
			});

			// Create a sample Buyer response
			var sampleBuyerResponse = new Buyers({
				_id: '525cf20451979dea2c000001',
				name: 'New Buyer'
			});

			// Fixture mock form input values
			scope.name = 'New Buyer';

			// Set POST response
			$httpBackend.expectPOST('buyers', sampleBuyerPostData).respond(sampleBuyerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Buyer was created
			expect($location.path()).toBe('/buyers/' + sampleBuyerResponse._id);
		}));

		it('$scope.update() should update a valid Buyer', inject(function(Buyers) {
			// Define a sample Buyer put data
			var sampleBuyerPutData = new Buyers({
				_id: '525cf20451979dea2c000001',
				name: 'New Buyer'
			});

			// Mock Buyer in scope
			scope.buyer = sampleBuyerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/buyers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/buyers/' + sampleBuyerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid buyerId and remove the Buyer from the scope', inject(function(Buyers) {
			// Create new Buyer object
			var sampleBuyer = new Buyers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Buyers array and include the Buyer
			scope.buyers = [sampleBuyer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/buyers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBuyer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.buyers.length).toBe(0);
		}));
	});
}());