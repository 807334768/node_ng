/**
 * Created by Yan on 2017/6/27.
 * 结构文件
 */
var mongoose =require('mongoose');//引入mongoose模块
//用户的表结构
module.exports=new mongoose.Schema({
    username:String,
    password:String,
    regTime:{
        type:Date,
        default:Date()
    },
    //是否是管理员，（这个最好记录在cookie中，随时检查是否为管理员）
    isAdmin:{
        type:Boolean,
        default:false
    }
})


