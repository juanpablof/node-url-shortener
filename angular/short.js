var shortener = angular.module('shortener', []);

shortener.service('ShortenerService', function($scope) {


  	
});

shortener.controller('ShortenerController', function($scope, ShortenerService) {
  	var init = function(){
		console.log('here');
  	};

  	init();
  	
});
