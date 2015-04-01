'use strict';

module.exports = {
	app: {
		title: 'chatterthat',
		description: 'Chatterthat.com- A marketplace for video chat',
		keywords: 'Chatterthat, Video chat'
	},
	port: process.env.PORT || 8080,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/fullcalendar/fullcalendar.css'
			],
			js: [
        'public/lib/jquery/dist/jquery.js',
        'public/lib/jquery-ui/ui/jquery-ui.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/ng-file-upload/angular-file-upload-shim.min.js',
        'public/lib/angular/angular.js',
        'public/lib/ng-file-upload/angular-file-upload.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
 				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-ui-calendar/src/calendar.js',
        'public/lib/socialshare/angular-socialshare.min.js',
        'public/lib/fullcalendar/fullcalendar.js',
        'public/lib/SimpleWebRTC/socket.io.js'
      ]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
