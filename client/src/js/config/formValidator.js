formValidator.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];
export default function formValidator($stateProvider, $locationProvider, $urlRouterProvider) {
	return {
    restrict: 'A', link: function (scope, element, attrs) {
      element.bind('load', function () { 
        scope.$apply(attrs.imageonload);
      });
    }
  };
}