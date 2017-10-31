import {baseData} from '../config/data';
table.$inject = ['$scope', '$http', '$rootScope'];
export default function table($scope,$http,$rootScope){
	$scope.formView={
		cla:"form-inline",
		name:'formName',
		sonC:[
                 {
                    title: "管理员",
                    type:"select",
                    name:'isAdmin',
                    value:'',
                    content:[
                                {value:true,text:"管理员"},
                                {value:false,text:"非管理员"}
                        ]
                },{
                	title:'用户名',
                	type:'text',
                	name:'name',
                    value:''
                }

        ]};

	$scope.tableV={};
	  $scope.paginationConf = {/*分页配置*/
	        currentPage:'1',
	        totalItems:'',
	        itemsPerPage:'',
			page:'1'
	}
	$scope.search={/*查询数据*/
		currentPage:'',
		totalItems:'',
		itemsPerPage:'',
		isAdmin:'',
		name:''
	}
	var dataList=function (){/*分页监听*/
		$scope.search.currentPage=$scope.paginationConf.currentPage;
		$scope.commonAjax(baseData.baseUrl+"/allUserInfo",$scope.search,$scope.operationListResult);
	}
	  $scope.$watch('paginationConf.currentPage',dataList);

	$scope.submitFun=function (){/*查询*/
		$scope.commonAjax(baseData.baseUrl+"/searchUserInfo",$scope.formView.sonC,$scope.operationListResult);
	}

	$scope.commonAjax=function (url,data,fn){
		$.ajax({
			url:url,
			data:data,
			type:'post',
			dataType:'json',
			success:function(result){
				fn(result);
			},
			error:function (){
			}
		})
	}
	/*结果处理*/
	$scope.operationListResult=function (result){
		console.log(result)
		$scope.search.totalItems=result.paging.count;
		$scope.search.currentPage=result.paging.page;
		$scope.search.itemsPerPage=result.paging.limit;

		$scope.paginationConf.totalItems =result.paging.count;//总条数
		$scope.paginationConf.currentPage = result.paging.page;//当前页码
		$scope.paginationConf.itemsPerPage = result.paging.limit;//每页条数
		if(result.count=="0"){
			$scope.$apply($scope.tableV.body="");
		}else{
			$scope.$apply($scope.tableV.head=result.content.head);
			$scope.$apply($scope.tableV.body=result.content.body);
		}
	}
	$scope.commonAjax(baseData.baseUrl+"/allUserInfo",$scope.search,$scope.operationListResult);
}