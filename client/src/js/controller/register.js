import {baseData} from '../config/data';
import ngFileUpload from '../framework/angular-file-upload.js';
register.$inject = ['$scope', '$http', '$rootScope',"$state"];
export default function register($scope,$http,$rootScope,$state){
	$scope.name="wangyan";
	$scope.formView={
		cla:"form-horizontal",
		name:'formName',
		sonC:[
               
                 {
                    title: "邮箱",
                    type:"text",
                    name:'email',
                    value:''
                },{
                	title:'密码',
                	type:'password',
                	name:'password',
                	value:''
                },{
                	title:'确认密码',
                	type:'password',
                	name:'repassword',
                	value:''
                },{
                	title:'是否为管理员',
                	type:'radio',
                	name:'radio[]',
                	value:'',
                	content:[
                		{text:'是',checked:false,value:'true'},
                		{text:'否',checked:true,value:'false'}
                	]
                }
        ]
	}



	/*$scope.tableV={
		 "head":[
		    "Alfreds Futterkiste",
		     "Germany",
		    "Berlin"
		  ],
		"body":[
			[
			"1","1","1",
			],
			[
			"2","2","2",

			],[
			"3","3","3",
			],
		]}*/
	$scope.submitFun=function (){
		console.log($scope.formView)
		$.ajax({
			type:'post',
			async: true,
			cache: false,
			url:baseData.baseUrl+"/user/register",
			data:$scope.formView.sonC,
			dataType:'json',
			success:function(result){
				if(result.code==0){
					alert(result.message)
					window.location="/node_ng/client/index.html#/info";
				}else{
					alert(result.message)
				}

			},
			error:function(err){console.log("error")}
		})
	}
	$scope.downFileUrl=baseData.downFileUrl;
	$scope.fileData=""//文件数据
	/*$http({method: "POST",url: "/getAllFile"})
		.success(function(data) {
			$scope.fileData=data.data
		})*/
	$scope.uploadFile=function (){
		var formElement = document.getElementById("uploadFileForm");
		var fd=new FormData(formElement);
		var file=document.querySelector('input[type=file]').files[0];
		fd.append('file',file);
		$.ajax({
			data: fd,
			url: baseData.baseUrl+"/uploade",
			type:"post",
			dataType: 'JSON',
			contentType: false,
			processData: false,
			success: function(data){
				console.log(data.data);
				$scope.fileData=data.data
				$scope.$apply($scope.fileData=data.data);
				alert("上传成功！");
			},
			error: function(err){
				console.log('error: ' + err);
			}
		});


	}

	$scope.forFile=function (){
			$("#file").click()
	}
	$scope.fileChange=function(){
		$("#btnForFile").val($("#file").val())
	}
}