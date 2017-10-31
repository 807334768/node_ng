/**
 * Created by Yan on 2017/6/27.
 */

var express=require('express');
var router=express.Router();
var Category=require('../models/Category');
var Content=require('../models/Content');

//处理通用数据
var data;
router.use(function (req,res,next){

    data={
        userInfo:req.userInfo,
        categories:[],
    }
    //分类信息
    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    })
})


router.get('/',function (req,res,next){

            data.categoryId=req.query.category||'';
            data.count=0;
            data.page=Number(req.query.page||1);
            data.limit=2;
            data.pages=0;
            data.url='';

            var where={};
            if(data.categoryId){
                where.category=data.categoryId
            }
    Content.count().where(where).then(function (count){
                data.count=count;
                data.pages=Math.ceil(count/data.limit);
                data.page=Math.min(data.page,data.pages);
                data.page=Math.max(data.page,1);
                var skip=(data.page-1)*data.limit;


            return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({addTime:-1});
        }).then(function (contents){
            data.contents=contents;
            /*req.cookies.set('userInfo',JSON.stringify({//存成一个字符串
                username:data.userInfo.username,
                _id:data.userInfo._id,
                loginTime:new Date(),
            }));*/
        console.log(data);
            res.render('main/index',data);
        })


})
router.get("/views",function (req,res){

    var contentId=req.query.contentid||"";
    Content.findOne({
        _id:contentId
    }).populate(['category','user']).then(function (contents){

        data.content=contents;
        if(contents.category){//如果有分类，设置分类，没有分类返回分类为空
            data.categoryId=contents.category._id;
        }else{
            data.categoryId="";
        }

        contents.views++;//阅读量+1
        contents.save();
        /*req.cookies.set('userInfo',JSON.stringify({//存成一个字符串
            username:data.userInfo.username,
            _id:data.userInfo._id,
            loginTime:new Date(),
        }));*/
        res.render('main/view',data)
})

})
module.exports=router;
