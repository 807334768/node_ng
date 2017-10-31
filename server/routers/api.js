/**
 * Created by Yan on 2017/6/27.
 */


let express=require('express');//引入框架

let fs = require('fs');
let crypto = require('crypto');
let multer = require('multer');
let xlsx = require('node-xlsx');
let router=express.Router();
let User=require("../models/User");//返回的是一个构造函数，通过这些方法操作数据库
let Content=require("../models/Content");
let Trans=require("../models/Trans");
let Files=require("../models/File");
//定义统一返回格式
var responseData;
router.use(function (req,res,next){
    responseData={
        code:0,
        message:""
    }
    next();
})


router.get('/user',function (req,res,next){
    res.send('api');
})
/*用户注册
* 1、用户名不能为空
*  2、密码不能为空
*  3、两次密码一致
*  4、用户名是否被注册
* */
router.post('/user/register',function (req,res,next){

    var username=req.body.email;
    var password=req.body.password;
    var repassword=req.body.repassword;

    if(username==''){
        responseData.code=1;
        responseData.message="用户名不能为空";
        res.json(responseData);//会把responseData对象转成json返回给前台
        console.log("用户名不能为空")
        return;
    }
    if(password==''){
        responseData.code=1;
        responseData.message="密码不能为空";
        res.json(responseData);
        console.log("密码不能为空")
        return;
    }
    if(password!=repassword){
        responseData.code=1;
        responseData.message="两次密码输入不一致";
        res.json(responseData);
        return;
    }


    //用户名是否注册
    //查找,参数是查询条件，返回的是promise对象

    User.findOne({
       username:username
    }).then(function(userInfo){
        if(userInfo){
            //存在表示数据库中有该记录
            responseData.code=4;
            responseData.message="用户名已经被注册";
            res.json(responseData);
            return;
        }else{
            let hash = crypto.createHmac('sha256', password)
                .update('hi')
                .digest('hex');
            //保存该数据
            var user=new User({
                username:username,
                password:hash,
                regTime:new Date().getTime()
            });

            return user.save();
        }
    }).then(function (newUserInfo){

            responseData.message="success!!";
            responseData.userInfo={
                _id:newUserInfo._id,
                username:newUserInfo.username,
                password:newUserInfo.password,
            }
            //发送cookies到浏览器
            req.cookies.set('userInfo',JSON.stringify({//存成一个字符串
                username:newUserInfo.username,
                _id:newUserInfo._id
            }));
            res.json(responseData);
    });

})

/*用户登录
*
* */
router.post('/user/login',function (req,res,next){

    var username=req.body.username;
    var password=req.body.password;
    if(username==""||password==""){
        responseData.code=1;
        responseData.message="请输入用户名密码！";
        res.json(responseData);
    }
    let hash = crypto.createHmac('sha256', password)
        .update('hi')
        .digest('hex');
    //查询是否有相同用户名和密码的记录是否存在
    User.findOne({
        username:username,
        password:hash
    }).then(function (userInfo){
        if(!userInfo){
            responseData.code=2;
            responseData.message="用户名或密码错误";
            res.json(responseData);
            return;
        }

       User.update({
           'username':userInfo.username
       },{
         //  password:33,
           loginTime:new Date()
       }).then(function (){
           res.json("修改成功");
           return;
       })
   /* }).then(function (result){
        console.log(result)*/
        //登录成功
        responseData.message="登录成功!!";
        responseData.userInfo={
            _id:userInfo._id,
            username:userInfo.username,
            loginTime:new Date()
        }
        //发送cookies到浏览器
        req.cookies.set('userInfo',JSON.stringify({
            username:userInfo.username,
            _id:userInfo._id,
            loginTime:new Date(),
        }));
        res.json(responseData);//返回信息到页面，code，message，用户信息
        return;
    })

})

/*退出*/
router.get('/user/logout',function (req,res){
    req.cookies.set('userInfo',null);
    res.json("退出");
})
/*
* 获取指定文章的所有评论
* */
router.post("/common",function(res,req){
        var contentId=res.body.contentid||'';
        Content.findOne({
            _id:contentId
        }).then(function(content){
            responseData.data=content;
            req.json(responseData)
        })
})
/*
* 评论提交
* */
router.post('/common/post',function(req,res){
    //获取基本信息数据
    var postData={
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content,
        contentid:req.body.contentId,//文章id
    }
    //查询当前内容信息
    Content.findOne({
        _id:postData.contentid
    }).then(function (c){
        c.comments.push(postData);//添加到comments字段中
        return c.save();
    }).then(function (newContent){
        //接受当前文章新内容
        responseData.message='评论成功';
        responseData.data=newContent;//返回新添加的评论内容及其他数据
        res.json(responseData);
        return;
    })

})

/*
* 上传
*
* */
var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './upload/files')
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
});
var upload = multer({
    storage: storage
});
router.post('/uploade',upload.single('file'),function (req,res,next){
  //  console.log(req.file)

    Files({
        userId:'59df07d33eb73012f2b7e3cd',
        fileName:req.file.filename
    }).save().then(function (){
        Files.find().then(function (files){

            responseData.data=files;
            responseData.message='上传成功';
            res.json(responseData);
            return;
        })
    })
})
/*
* 读取上传文件名
* */
router.post('/getAllFile',function (req,res){
    Files.find().then(function (files){

        responseData.data=files;
        res.json(responseData);
        return;
    })
})
/*
 * 获取所有用户信息
 * */
router.post('/info',function(req,res){
        User.findOne({},{ "__v": 0}).sort({'regTime':-1}).then(function (users){
            responseData.content=users;//返回新添加的评论内容及其他数据
            res.json(responseData);
            return;
        })
})
/*
* 获取所有用户信息
* */
router.post('/allUserInfo',function(req,res){

    var paging={
        page:Number(req.body.currentPage || 1),//第几页
        limit:2,//每页条数
        pages:0,//总页数
        skip:10,
        count:0
    }
    //获取基本信息数据
    User.find().count().then(function (count){
        paging.pages=Math.ceil(count/paging.limit);
        paging.page=Math.min(paging.page,paging.pages);
        paging.page=Math.max(paging.page,1)
        paging.skip=(paging.page-1)*paging.limit;//当前页码
        User.find({},{ "__v": 0}).limit(paging.limit).skip(paging.skip).then(function (users){

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



             responseData.paging=paging;

            var usersInfo= {
                "head":[
                    "编号",
                    "用户名",
                    "密码",
                    "管理员",
                    "注册时间"
                ],
                "body":users
            }
            responseData.content=usersInfo;//返回新添加的评论内容及其他数据
            res.json(responseData);
            return;
        })
    })

})
/*
* 查询用户
* */
router.post('/searchUserInfo',function(req,res){

    //获取基本信息数据
    var where={
        isAdmin:req.body.isAdmin||"",
        username:req.body.name||""
    }
    var paging={
        page:Number(req.query.page || 1),//第几页
        limit:2,//每页条数
        pages:0,//总页数
        skip:10,
        count:0
    }
    User.find({
        isAdmin:req.body.isAdmin||"",
        username:{$regex:req.body.name||""}
    }).count().then(function (count){
        paging.pages=Math.ceil(count/paging.limit);
        paging.page=Math.min(paging.page,paging.pages);
        paging.page=Math.max(paging.page,1)
        paging.skip=(paging.page-1)*paging.limit;//当前页码

            User.find({
                isAdmin:req.body.isAdmin||"",
                username:{$regex:req.body.name||""}
            }).limit(paging.limit).skip(paging.skip).then(function (users){

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
                var usersInfo= {
                    "head":[
                        "编号",
                        "用户名",
                        "密码",
                        "管理员",
                        "注册时间"
                    ],
                    "body":users
                }
                        responseData.content=usersInfo,
                        responseData.paging=paging,
                        res.json(responseData);
                        return;
            })
    })
})
/*
* 获取图表数据
* */
router.post('/chartInfo',function(req,res){
    console.log(new Date(new Date().getTime()-24*60*60*1000*7));
    console.log(req.body.endTime)
    //默认查询最近7天
    let searchInfo={
        startTime:new Date(req.body.startTime).getTime()|| new Date().getTime()-24*60*60*1000*7,
        endTime:new Date(req.body.endTime).getTime()+24*60*60*1000 || new Date()
    }
    let limit=(new Date(searchInfo.endTime).getTime()-new Date(searchInfo.startTime).getTime())/1000/60/60/24;



    //获取基本信息数据
    Trans.find({'transTime':{　$gte:searchInfo.startTime,$lte:searchInfo.endTime　}}).then(function (contents){

        let time=new Array();
        let sumNumSd=0;//收单总笔数
        let sumMoneySd=0;//收单总金额
        let sumNumHl=0;//互联网总笔数
        let sumMoneyHl=0;//互联网总金额

        let sdNum=[];/*单日数据*/
        let sdMoney=[];
        let hlNum=[];
        let hlMoney=[];
        let timeArray=new Array();/*x轴时间集合*/
        for(let i=0;i<limit;i++){
            var tObj=new Date(searchInfo.startTime+24*60*60*1000*i+8*60*60*1000)

            let tTime=tObj.getFullYear()+"-"+(tObj.getMonth()+1)+"-"+tObj.getDate()

            timeArray.push(tTime);
            sdNum.push(Math.floor(Math.random()*10+1));
            hlNum.push(Math.floor(Math.random()*10+1));
            sdMoney.push(Math.floor(Math.random()*100+1));
            hlMoney.push(Math.floor(Math.random()*100+1));
        }

        for(let i=0;i<sdNum.length;i++){
            sumNumSd+=sdNum[i];
            sumMoneySd+=sdMoney[i];
        }
        for(let j=0;j<hlNum.length;j++){
            sumNumHl+=hlNum[j];
            sumMoneyHl+=hlMoney[j];
        }
        console.log(timeArray)
        let sumNum=sumNumSd+sumNumHl; //总笔数
        let sumMoney=sumMoneySd+sumMoneyHl; //总金额
    /*for(let i=0;i<contents.length;i++){
        let t=new Date(contents[i].transTime);
            time.push(t.getFullYear()+"-"+t.getMonth()+"-"+t.getDay());
            sumMoney+=contents[i].transMoney;
            if(contents[i].channelType==1){/!*收单*!/

                sumMoneySd+=sontents[i].transMoney;
            }
            if(contents[i].channelType==2){/!*互联网*!/

                sumMoneyHl+=contents[i].transMoney;
            }
    }*/

        let newData=[
            ["日期", "收单笔数", '收单金额', "互联网笔数","互联网笔数"]
        ];
        let body=[];
        console.log("time"+timeArray)
        for(let i=0;i<timeArray.length;i++){
            body.push([timeArray[i],sdNum[i],sdMoney[i],hlNum[i],hlMoney[i]]);
        }
        body.push(["合计",sumNumSd,sumMoneySd,sumNumHl,sumMoneyHl]);

        /*let start=new Date(searchInfo.startTime).getFullYear()+"年"+(new Date(searchInfo.startTime).getMonth()+1)+"月"+new Date(searchInfo.startTime).getDate()+"日"
        let end=new Date(searchInfo.endTime).getFullYear()+"年"+(new Date(searchInfo.endTime).getMonth()+1)+"月"+new Date(searchInfo.endTime).getDate()+"日";*/
        responseData.start=timeArray[0];
        responseData.end=timeArray[timeArray.length-1];

        responseData.sumNum=sumNum; //总笔数
        responseData.sumMoney=sumMoney; //总金额
        responseData.sumNumSd=sumNumSd;
        responseData.sumNumHl=sumNumHl;
        responseData.time=timeArray;
        responseData.sdNum=sdNum;
        responseData.sdMoney=sdMoney;
        responseData.hlNum=hlNum;
        responseData.hlMoney=hlMoney;
        responseData.tabeData=newData;
        responseData.body=body;
        res.json(responseData);
        return;
    })
})

/*
* 生成excel
* */
router.post('/createExcel',function (req,res){

        let startTime=req.body.startTime;
        let endTime=req.body.endTime;
    /* let time=req.body.time;
       let sdNum=req.body.sdNum;
        let sdMoney=req.body.sdMoney;
        let hlNum=req.body.hlNum;
        let hlMoney=req.body.hlMoney;*/


    let newData=[
        ["时间段", startTime+"-"+endTime, "总金额","1975.2","总笔数",1657],

    ];
    newData.push(req.body.head)

    for(let i=0;i<req.body.body.length;i++){
        newData.push(req.body.body[i]);
    }

  /*  let fileName='./upload/temporary/'+startTime+'至'+endTime+'.xlsx';
     var buffer = xlsx.build([{name: "mySheetName", data: newData}]); // Returns a buffer
     fs.writeFile(fileName,buffer, (err) => {
     console.log('saved!');
         res.json(startTime+'至'+endTime+'.xlsx' );
         return;

     });*/


    var buffer = xlsx.build([{name: "mySheetName", data: newData}]); // Returns a buffer
    fs.writeFile('./upload/temporary/导出数据.xlsx',buffer, (err) => {
        console.log('saved!');
    });
    res.json("导出数据.xlsx" );


})









module.exports=router;


