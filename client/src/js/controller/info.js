import {baseData} from '../config/data';
info.$inject = ['$scope', '$http', '$rootScope'];
export default function info($scope,$http,$rootScope){
	$http.post(baseData.baseUrl+"/info").success( function(response) {
		console.log(response)
		$scope.infoV=response.content;
	});
}