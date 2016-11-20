angular.module('zizaniApp', ['ngRoute'])
       .config(config);

////////////
// ROUTES //
////////////

config.$inject = ['$routeProvider', '$locationProvider'];
function config (  $routeProvider,   $locationProvider  )  {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/index.html',
      controller: 'ZizaniController',
      controllerAs: 'zizaniCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider
    .html5Mode({
      enabled: false,
      requireBase: false
    });
}