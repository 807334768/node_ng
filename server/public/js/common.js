/**
 * Created by Yan on 2017/7/22.
 */
(function (){
       this.ajaxFun=function (url,data){
          return  $.ajax({
                type:'post',
                async: true,
                cache: false,
                url:url,
                data:data,
                dataType:'json'
            })
        }

})(window)