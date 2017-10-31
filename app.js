/**
 * Created by Yan on 2017/10/11.
 */
/**
 * Created by Yan on 2017/6/26.
 * 应用程序的启动入口文件
 */
//加载express
var express=require('express');


//创建app应用(等同于nodejs 的 http.createServer())
var app=express();

//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应的 __dirname+'/public'下的文件
app.use('/public',express.static(__dirname+'/public'));


//加载模板处理模块
var swig=require("swig");


//数据库的初始化，加载数据库模块
var mongoose =require('mongoose');

//加载cookies模块
var Cookies=require('cookies');

//加载markdown

//var markdown=require('markdown');


var User=require("./server/models/User");

//配置应用模板
//定义当前应用所使用的模板引擎,第一个参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine('html',swig.renderFile);

//设置模板文件存放目录,第一个参数必须是views，第二个参数是目录
app.set("views","./server/views");

//注册所使用的的模板引擎,第一个参数必须是view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set('view engine',"html");

//开发过程当中，需要取消模板缓存
swig.setDefaults({cache:false})


//加载body-parser,用来处理post提交过来的数据
var bodyParser=require("body-parser");

var jsonParser = bodyParser.json();
//(中间件)body-parser设置
app.use(bodyParser.urlencoded({extended:true}));//设置之后会在app的req对象上增加一个属性：body，保存的就是post提交过来的数据


/*var multer = require('multer');*/



//设置cookies
app.use(function(req,res,next){

    req.cookies=new Cookies(req,res);
    //解析登录用户的cookie信息
    req.userInfo={};
    //有用户信息
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo=JSON.parse(req.cookies.get('userInfo'));//把字符串解析成json对象
            console.log("进入app.js-cookies")
            //查询当前登录用户类型 是否是管理员
            User.findById(req.userInfo._id).then(function (userInfo){
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin);//在其他页面通过req.userInfo.isAdmin判断是否是管理员
                // req.userInfo.loginTime=userInfo.loginTime;//保存登录时间

                next();
            })

        }catch(e){
            console.log("cookies_error");
            next();
        }

    }else{
        next();
    }


})


// 跨域支持
app.all('*', (req, res, next) => {
    const origin = req.headers.origin;
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token,sign');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
    next();
});

mongoose.Promise = global.Promise;




/*
 * 实时数据
 * */
var expressWs = require('express-ws')(app);
var util = require('util');
let Trans=require("./server/models/Trans");
app.use(express.static('./static'));
app.ws('/ws', function(ws, req) {
    util.inspect(ws);
    ws.on('message', function(msg) {

        let startTime=new Date(msg)-10*60*1000;/*+8*60*60*1000前十分钟*/
        let endTime=new Date(msg);


        let eHours=new Date(msg).getHours();
        let eMinutes=new Date(msg).getMinutes();
        let sHours=new Date(startTime).getHours();
        let sMinutes=new Date(startTime).getMinutes();
        let realTime=new Array();
        let num=new Array();
        for(let i=0;i<10;i++){
            let t=new Date(msg)-i*60*1000;
            let h=new Date(t).getHours();
            let m=new Date(t).getMinutes();
            realTime.push(h+":"+m);
            num.push(Math.round(Math.random()*9+1));
        }

        Trans.find(
            {
                'transTime':{ $gte:startTime,$lte:endTime　}
            }
        ).then(function (contents){
                let msg=realTime+"/"+num;

                ws.send(msg);
        })

    });
})



mongoose.connect("mongodb://localhost:27017/db",function (err){//在这用createConnect的话会导致数据库操作失效，你妹的我也很无奈啊

    if(err){
        console.log(err)
        console.log("error");
    }else{
        console.log("success");
        //监听http请求
        app.listen(8089);



    }
});//连接数据库



/*
 * 根据不同的功能划分模块（这些路由之类的最好都放在最下面，否则一些其他的中间件有可能会获取不到数据（bodyParser））
 * */
app.use('/admin',require('./server/routers/admin'));//路由为/admin加载routers/admin.js
app.use('/api',require('./server/routers/api'));
app.use('/',require('./server/routers/main'));











