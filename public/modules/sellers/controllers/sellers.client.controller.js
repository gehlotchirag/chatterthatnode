'use strict';

// Sellers controller
angular.module('sellers').controller('SellersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sellers','$modal', '$log','$upload' ,
	function($scope, $stateParams, $location, Authentication, Sellers, $modal, $log, $upload) {

        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });

        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    $upload.upload({
                        url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                        fields: {'user': $scope.user},
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    });
                }
            }
        };

        $scope.events = [
            {
                title: 'All Day Event',
                start: '2015-03-01'
            },
            {
                title: 'Long Event',
                start: '2015-03-07',
                end: '2015-03-10'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: '2015-03-09T16:00:00'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: '2015-03-16T16:00:00'
            },
            {
                title: 'Conference',
                start: '2015-03-11',
                end: '2015-03-13'
            },
            {
                title: 'Meeting',
                start: '2015-03-12T10:30:00',
                end: '2015-03-12T12:30:00'
            },
            {
                title: 'Lunch',
                start: '2015-03-12T12:00:00'
            },
            {
                title: 'Meeting',
                start: '2015-03-12T14:30:00'
            },
            {
                title: 'Happy Hour',
                start: '2015-03-12T17:30:00'
            },
            {
                title: 'Dinner',
                start: '2015-03-12T20:00:00'
            },
            {
                title: 'Birthday Party',
                start: '2015-03-13T07:00:00'
            },
            {
                title: 'Click for Google',
                start: '2015-03-28'
            }
        ];
        $scope.uiConfig = {
            calendar:{
                 editable: true,
                header:{
                    left: 'month,agendaWeek,agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                selectable: true,
                selectHelper: true,
                 select: function(start, end) {
                     console.log (start);
                      window.meetingtime =start;
                    //var title = prompt('Event Title:');
                   // if (title) {
                        $scope.$apply(function(start, end){
                             $scope.ModalAddEvent();
                            //$scope.events.push({
                            //    title: title,
                            //    start: start,
                            //    end: end,
                            //    allDay: allDay
                            //});
                        });

                    //}
                    // should call 'unselect' method here
                }
            }
        };
        $scope.eventSources = [$scope.events];


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
        $scope.updateEvent = function() {
            $scope.ok();
            var seller = $scope.seller;
            seller.$update(function() {
                $location.path('sellers/' + seller._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
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

        //Modal Opener
        $scope.ModalAddEvent = function (size) {

            window.modalInstance = $modal.open({
                templateUrl: 'modules/sellers/views/create-event-seller.client.view.html',
                controller: 'SellersController',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }

            });

            window.modalInstance.result.then(function () {
                //$scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };

        $scope.ok = function () {
            window.modalInstance.close();
            console.log("closing");
         };

        $scope.cancel = function () {
            window.modalInstance.dismiss('cancel');
        };


        //time related ui
        $scope.mytime = window.meetingtime;

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };

        //$scope.updatetime = function() {
        //    var d = new Date();
        //    d.setHours( 14 );
        //    d.setMinutes( 0 );
        //    $scope.meetingtime = d;
        //};

        $scope.changed = function () {
             $log.log('Time changed to: ' + $scope.mytime);
        };

        $scope.clear = function() {
            $scope.mytime = null;
            window.meetingtime = null;
        };

        //rating
        $scope.rate = 4;
        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            ];



    }
]);
