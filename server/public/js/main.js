/**
 * Created by Yan on 2017/7/4.
 */
$(function(){
    //切换到注册
    $("#toSign").click(function (){
        $("#sign").show();
        $("#register").hide();
    });
    //切换到登录
    $("#toRegister").click(function (){
        $("#register").show();
        $("#sign").hide();
    })
    //注册
   var $registerBtn=$("#registerBtn");
    $registerBtn.click(function (){
        //通过ajax提交
        $.ajax({
            type:'post',
            async: true,
            cache: false,
            url:"/api/user/register",
           data:{
               username:$("#regName").val(),
               password:$("#regPassword").val(),
               repassword: $("#regRepassword").val()
           },
            dataType:'json',
            success:function(result){
                //显示返回注册结果，注册成功1秒后跳转登录面板
                if(result.code!=0){
                        $("#error_reg").text(result.message);
                    }else{
                       /* $("#error_reg").text('注册成功');
                        setTimeout(function (){
                            $("#sign").show();
                            $("#register").hide();
                    },2000)*/
                    window.location.reload();
                }

            },
            error:function(err){console.log("error")}
        })
    })

    //登录
    var $signBtn=$("#signBtn");
    $signBtn.click(function (){
        //通过ajax提交
        $.ajax({
            type:'post',
            async: true,
            cache: false,
            url:"/api/user/login",
            data:{
                username:$("#inputEmail").val(),
                password:$("#inputPassword").val(),
            },
            dataType:'json',
            success:function(result){
                console.log(result)
                //显示返回注册结果，注册成功1秒后跳转用户信息面板
                if(result.code!=0){
                    $("#error_sign").text(result.message);
                }else{
                   /* $("#error_sign").text('登录成功');
                    setTimeout(function (){
                        $("#sign").hide();
                        $("#userInfo").show();
                        $("#name").text(result.userInfo.username);
                    },2000)*/
                    window.location.reload();
                }

            },
            error:function(err){console.log("error")}
        })
    })

    //  退出
    $("#longout").click(function (){
        $.ajax({
            url:'/api/user/logout',
            success:function(result){
                if(!result.code){
                    window.location.reload();
                }
            }
        })
    })
    //添加分类保存
    $("#category_save").click(function (){
        var data={
            name:$("#name").val(),
            label:$("#label").val(),
        }

        ajaxFun("/admin/category/save",data).success(function (result){
            if(result.code==0){
                alert(result.message);
            }else{
                alert(result.message);
            }
        }).error(function (){
            alert("失败");
        });

    })
    //内容保存
    $("#content_save").click(function (){

        var data={
            category:$("#category").val(),
            title:$("#title").val(),
            description:$("#description").val(),
            content:$("#content").val()
        }
        ajaxFun("/admin/content/save",data).success(function (result){
            if(result.code==0){
                alert(result.message);
            }else{
                alert(result.message);
            }
        }).error(function (){
            alert("失败");
        });

    })
    //内容修改-获取数据
    $(".operation").click(function (){
        $(".cover").show();
        $(".dialog").show();
        var _this=this;
        var dataId=$(_this).attr("data-id");

        var data={"_id":dataId};
        ajaxFun("/admin/content/edit",data).success(function (result){
            console.log(result);
            var r=result;
            $("#_id").val(r._id);
            $("#title").val(r.title);
            $("#content").val(r.content);
            $("#description").val(r.description);
            $("#category").val(r.category);
        }).error(function (){
            alert("失败");
        });
    })
    //内容修改-更新
    $("#edit_update").click(function (){
        var data={
            _id:$("#_id").val(),
            category:$("#category").val(),
            title:$("#title").val(),
            description:$("#description").val(),
            content:$("#content").val()
        }
        ajaxFun("/admin/content/edit_update",data).success(function (result){
                alert(result);
            $(".cover").hide();
            $(".dialog").hide();
            location.reload();
        }).error(function (){
            alert("失败");
        });
    })
    //关闭弹出
    $(".cover").click(function (){
        $(".cover").hide();
        $(".dialog").hide();
    })
    //删除
    $(".operation_delete").click(function (){

        if(confirm("确定要删除吗？"))
        {
            var _this=this;
            var dataId=$(_this).attr("data-id");
            var data={
                _id:dataId
            }
            ajaxFun("/admin/content/delete",data).success(function (result){
                alert(result);
                $(".cover").hide();
                $(".dialog").hide();
            }).error(function (){
                alert("失败");
            });
        }
    })
    //评论提交
    $("#sub_content").click(function () {
        var data={
            contentId:$("#contentId").val(),
            content:$('#content').val()
        }
        ajaxFun("/api/common/post",data).success(function (result){
            //提交成功
            var data=result.data;
            $('#content').val('');
            renderComments(data.comments.reverse());

        }).error(function (){
            alert("失败2!!!");
        });
    })

    //图片上穿
    $("#subImg").click(function (){
        console.log($("#img").val())
        $.ajaxFileUpload({
                type: 'post',
                dataType: 'json',
                url: "/api/uploade",
                data:{
                    img:$("#img").val()
                },
                secureuri: false,
                fileElementId:"img",
                success:function (result){
                    console.log(result)
                },
                error: function (err){
                    console.log(err);
                }
            }
        );
    })

})

function renderComments(comments){

    $("#countList").html(comments.length);






    var html='';
        for(var i=0;i<comments.length;i++){

        html+='<div  class="media"><div class="media-left media-middle"><a href="#"><img class="media-object"  src="/public/images/123.jpg">'+
            '</a></div> <div class="media-body"><div>'+comments[i].content+' </div><h5 class="media-heading">'+ comments[i].username+'&nbsp;&nbsp;'+formatDate(comments[i].postTime)+'</h5></div></div>'
    }


    $("#comments").html(html)
}



//格式化日期
function formatDate(date){
    var d=new Date(date);
    return d.getFullYear()+"年"+ (d.getMonth()+1)+'月'+ d.getDay()+"日"+ d.getHours()+":"+ d.getMinutes()+":"+ d.getSeconds();
}
//分页
