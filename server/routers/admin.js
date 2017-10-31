/**
 * Created by Yan on 2017/6/27.
 * 管理中心模块
 */

var express=require('express');
var router=express.Router();
var User=require("../models/User");
var Category=require("../models/Category");
var Content=require("../models/Content");
//定义统一返回格式
var responseData;
router.use(function (req,res,next){
    console.log("req.userInfo----->")
    console.log(req.userInfo)
    responseData={
        code:0,
        message:""
    }
    next();
})
//对当前用户身份验证
router.use(function (req,res,next){
  //  var loginTime=new Date(req.userInfo.loginTime).getTime()+1800000;
    var loginTime=new Date(req.userInfo.loginTime).getTime()+180000000;
    var newDate=new Date().getTime()
  /*  if( newDate< loginTime){
        console.log("Login expired");
        var msg="登录超时，请重新登录";
        res.render("admin/err",msg);
        return;
    }else {*/
        if(!req.userInfo.isAdmin){
            var msg="非管理员用户，没有操作权限";
            res.send("非管理员用户，没有操作权限");

        }
        next();
  /*  }*/


})
router.get('/',function (req,res,next){
  //  res.send('管理首页');
    res.render("admin/index",{
        userInfo:req.userInfo
    });
})
/*
*limit(number):限制获取的数据条数
* skip(number):忽略时间的条数
* 每页显示2条
* 1:1-2 skip：0-->（当前页-1）*limit
* 2:3-4 skip:2
* 3:5-6 skip:4
* */

router.get('/user',function (req,res,next){//用户列表页
    var paging={
        page:Number(req.query.page || 1),//第几页
        limit:2,//每页条数
        pages:0,//总页数
        skip:2
    }

    User.count().then(function (count){
       // console.log(count)User总条数
        //计算总页数
        paging.pages=Math.ceil(count/paging.limit);
        //取值不能超过pages（页码最大不能超过总页数）（返回这两个数中的最小值）
        paging.page=Math.min(paging.page,paging.pages);
        //取值不能小于1（页码最小是1）
        paging.page=Math.max(paging.page,1)
        paging.skip=(paging.page-1)*paging.limit;//当前页码


        User.find().limit(paging.limit).skip(paging.skip).then(function (users){
            res.render("admin/user_index",{
                userInfo:req.userInfo,
                users:users,
                paging:paging
            });
        })
    })
    //读取用户列表

})
//分类管理
router.get('/category',function(req,res,next){

    Category.find().then(function (result){
            res.render("admin/category_index",{
                userInfo:req.userInfo,
                category:result
            })

    })
})
//添加分类
router.get('/category/add',function (req,res){

    res.render("admin/category_add",{
        userInfo:req.userInfo
    })
})
//保存分类
router.post("/category/save",function (req,res,next){
    var name1=req.body.name||"";
    if(name1==''){
        responseData.code=3;
        responseData.message="请填写分类";
        res.json(responseData);
        return;
    }
    var label=req.body.label||"";
    if(label==''){
        responseData.code=4;
        responseData.message="请选择标签";
        res.json(responseData);
        return;
    }
    Category.findOne({
        name:name1
    }).then(function (newName){
        if(!newName){
            var category=new Category({
                name:name1,
                label:label
            })
            return category.save();
        }else{
            responseData.code=2;
            responseData.message="分类已存在";
            res.json(responseData);
            return;
            //return Promise.reject()
        }
    }).then(function (info){
        responseData.code=0;
        responseData.message="添加分类成功";
        res.json(responseData);
        return;
    })
})
//内容列表
router.get("/content",function (req,res){
    var paging={
        page:Number(req.query.page || 1),//第几页
        limit:2,//每页条数
        pages:0,//总页数
        skip:10,
        count:0
    }
    Content.count().then(function (count){
        paging.count=count;
        paging.pages=Math.ceil(count/paging.limit);
        var pageList=new Array();
        for(var i=0;i<6;i++){
                pageList[i]=i+1;
        }
        var pageList2=new Array();
        for(var i=0;i<paging.pages;i++){
            pageList2[i]=i+1;
        }
        paging.page=Math.min(paging.page,paging.pages);
        paging.page=Math.max(paging.page,1)
        paging.skip=(paging.page-1)*paging.limit;//当前页码
        Content.find().limit(paging.limit).sort({_id:-1}).skip(paging.skip).populate(['category','user']).then(function (contents){

            Category.find().sort({_id:-1}).then(function (result){
                console.log("11111111111111")
                console.log(result)
                res.render("admin/content_index",{
                    userInfo:req.userInfo,
                    content:contents,
                    paging:paging,
                    pageList:pageList,
                    pageList2:pageList2,
                    category:result,
                    url:'/admin/content'
                });
            })

        })
    })
})
//内容添加
router.get("/content/add",function (req,res){

    Category.find().sort({_id:-1}).then(function (category){
        res.render("admin/content_add",{
            userInfo:req.userInfo,
            category:category
        })
    })


})
//内容保存
router.post("/content/save",function (req,res){
    //验证
//保存数据到数据库
     new Content({
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content,
         user:req.userInfo._id.toString()
     }).save().then(function (){

             responseData.code=0;
             responseData.message="添加内容成功";
             res.json(responseData);
             return;
     });
})
//内容修改
router.post("/content/edit",function (req,res){

    //获取id值，并查询此记录
    Content.findOne({'_id':req.body._id}).then(function (data){

        res.json(data);
        return;
    })
})
//内容修改更新
router.post("/content/edit_update",function (req,res){
    var updatstr={
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content
    }


    Content.update({
            '_id':req.body._id
    },{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content
    }).then(function (){
        res.json("修改成功");
        return;
    })

})
//内容修改更新
router.post("/content/delete",function (req,res){
    var id=req.body._id;
    Content.remove({
        _id:id
    }).then(function (){
        res.json("删除成功");
        return;
    });
})

router.get("/userInfo",function (req,res){
    res.render("admin/userInfo",{
        userInfo:req.userInfo,
        url:'/admin/userInfo'
    });
})

module.exports=router;