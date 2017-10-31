/**
 * Created by Yan on 2017/6/27.
 */

var express=require('express');
var router=express.Router();
var Category=require('../models/Category');
var Content=require('../models/Content');

//����ͨ������
var data;
router.use(function (req,res,next){

    data={
        userInfo:req.userInfo,
        categories:[],
    }
    //������Ϣ
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
            /*req.cookies.set('userInfo',JSON.stringify({//���һ���ַ���
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
        if(contents.category){//����з��࣬���÷��࣬û�з��෵�ط���Ϊ��
            data.categoryId=contents.category._id;
        }else{
            data.categoryId="";
        }

        contents.views++;//�Ķ���+1
        contents.save();
        /*req.cookies.set('userInfo',JSON.stringify({//���һ���ַ���
            username:data.userInfo.username,
            _id:data.userInfo._id,
            loginTime:new Date(),
        }));*/
        res.render('main/view',data)
})

})
module.exports=router;
