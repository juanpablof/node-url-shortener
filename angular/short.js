/** Basic AngularJS module */
var shortener = angular.module('shortener', []);

/** Connects our Single Page App with our Backend [Node] */
shortener.service('ShortenerService', function($q, $http) {

	this.getShortUrl = function(longUrl){
		var delay = $q.defer();
		$http.get('/api/short?url='+longUrl)
			.success(function(response){delay.resolve(response);})
			.error(function(){delay.reject("Error getting customer accounts.");});
		return delay.promise;
	};
});

/** Binds variables and functions */
shortener.controller('ShortenerController', function($scope, ShortenerService) {
  	
  	$scope.submit = function(){
  		if(typeof $scope.longUrl !== 'undefined'){
  			ShortenerService.getShortUrl($scope.longUrl).then(function(response){
					$scope.shortUrl = response;
			});	
  		}else{
  			//error msg
  		}
  	};

  	$scope.reset = function(){
  		$scope.longUrl = '';
  		$scope.shortUrl = '';
  	};
  	
});
