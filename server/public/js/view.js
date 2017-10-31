/**
 * Created by Yan on 2017/8/22.
 */
//获取所有评论
function getComments (){
    var data={
        contentid:$('#contentId').val()
    }
    ajaxFun("/api/common",data).success(function (result){
        //提交成功
        var data=result.data;

        $('#content').val('');

        renderComments(data.comments.reverse());

    }).error(function (){
        alert("失败2!!!");
    });}
getComments ();