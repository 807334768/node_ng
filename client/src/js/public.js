function datetimepicker(){
		$('.common_datetimepicker').datetimepicker({
		 		format: 'yyyy-mm-dd hh:ii:ss',
	    		language: 'zh-CN',
	    		weekStart: 1,
	    		todayBtn: 1,
	    		todayHighlight: 1,
                startView: 2,
                autoclose:1,
	    		minView: 0
	    		
           });
	}
module.exports=datetimepicker();