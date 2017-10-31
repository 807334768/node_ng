runing.$inject = ['$rootScope', '$state', '$stateParams'];
export  default function runing($rootScope, $state, $stateParams){
	
	
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        //如果路径不为index 则 检查登录状态
       //console.log("路由开始改变");
        $rootScope.isActive=function(){
            var str = "/index";
            var href=toState.url;
            var index = href.indexOf("/");
            if(index != -1){
                str = href.substring(1,href.length);
            }
  
            return str;
         
        }();
         var str = "/index";
            var href=toState.url;
            var index = href.indexOf("/");
            if(index != -1){
                str = href.substring(1,href.length);
                var urlIndex=str.indexOf(".");
                var uStr=str.substring(0,urlIndex);
            }
           
		$rootScope.u=uStr;

		
	
    });
	

	
	 $rootScope.nav=[
                {
                    key: "表单",
                    parent:"f",
                    child:[
                        {menuName: "registe",url: "register"}/*,
                        {menuName: "search", url: "search"},*/
                    ]
                },
                 {
                    key: "表格",
                    parent:'t',
                    child:[
                        {menuName: "table",url: "table"}
                     
                    ]
                },
                 {
                    key: "图表",
                    url:'chart'
                    
                },
                 {
                    key: "信息展示",
                    url:'info'
                    
                },
                 {
                     key: "上传",
                     url:'upload'

                 }

        ];
        $rootScope.datetimepicker=function (){
    		$('.common_datetimepicker').datetimepicker({
		 		format: 'yyyy-mm-dd',

	    		language: 'zh-CN',
	    		weekStart:1,
	    		todayBtn: 1,
	    		todayHighlight: 1,
                startView: 2,
                autoclose:1,
	    		minView: 3,
	    		maxView:4
	    		
            });
    	}
     
        $rootScope.formValidator=function (){
        	console.log("check");
        
        $('#defaultForm').bootstrapValidator({
         message: 'This value is not valid',
         feedbackIcons: {/*input状态样式图片*/
             valid: 'glyphicon glyphicon-ok',
             invalid: 'glyphicon glyphicon-remove',
             validating: 'glyphicon glyphicon-refresh'
         },
        // submitButtons: 'button[id="sub"]',
         fields: {/*验证：规则*/
           "radio[]":  {
                    validators: {
                        notEmpty: {
                            message: '请选择'
                        }
                    }
                },
              "checkbox[]"  : {
                    validators: {
                        notEmpty: {
                            message: 'Please specify at least one browser you use daily for development'
                        }
                    }
               },
             password: {
                 message:'密码无效',
                 validators: {
                     notEmpty: {
                         message: '密码不能为空'
                     },
                     stringLength: {
                         min: 6,
                         max: 30,
                         message: '用户名长度必须在6到30之间'
                     },
                     identical: {//相同
                         field: 'password', //需要进行比较的input name值
                         message: '两次密码不一致'
                     },
                    
                     regexp: {
                         regexp: /^[a-zA-Z0-9_\.]+$/,
                         message: 'The username can only consist of alphabetical, number, dot and underscore'
                     }
                 }
             },
             repassword: {
                 message: '密码无效',
                 validators: {
                     notEmpty: {
                         message: '用户名不能为空'
                     },
                     stringLength: {
                         min: 6,
                         max: 30,
                         message: '用户名长度必须在6到30之间'
                     },
                     identical: {//相同
                         field: 'password',
                         message: '两次密码不一致'
                     },
                    
                     regexp: {//匹配规则
                         regexp: /^[a-zA-Z0-9_\.]+$/,
                         message: '只能由字母、数字、点和下划线组成'
                     }
                 }
             },
             email: {
                 validators: {
                     notEmpty: {
                         message: '邮件不能为空'
                     },
                     emailAddress: {
                         message: '请输入正确的邮件地址如：123@qq.com'
                     }
                 }
             },
             phone: {
                 message: 'The phone is not valid',
                 validators: {
                     notEmpty: {
                         message: '手机号码不能为空'
                     },
                     stringLength: {
                         min: 11,
                         max: 11,
                         message: '请输入11位手机号码'
                     },
                     regexp: {
                         regexp: /^1[3|5|8]{1}[0-9]{9}$/,
                         message: '请输入正确的手机号码'
                     }
                 }
             },
             invite: {
                 message: '邀请码',
                 validators: {
                     notEmpty: {
                         message: '邀请码不能为空'
                     },
                     stringLength: {
                         min: 8,
                         max: 8,
                         message: '请输入正确长度的邀请码'
                     },
                     regexp: {
                         regexp: /^[\w]{8}$/,
                         message: '请输入正确的邀请码(包含数字字母)'
                     }
                 }
             },
         }
        
     })
        
       }
        
}/*end*/
