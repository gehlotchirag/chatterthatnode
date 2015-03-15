'use strict';

// Configuring the Articles module
angular.module('sellers',['ui.calendar' , 'ui.bootstrap']).run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Sellers', 'sellers', 'dropdown', '/sellers(/create)?');
		//Menus.addSubMenuItem('topbar', 'sellers', 'List Sellers', 'sellers');
		//Menus.addSubMenuItem('topbar', 'sellers', 'New Seller', 'sellers/create');
	}
]);
