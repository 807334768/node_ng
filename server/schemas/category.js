/**
 * Created by Yan on 2017/7/21.
 */
var mongoose =require('mongoose');//引入mongoose模块
//分类的表结构
module.exports=new mongoose.Schema({
//分类名
    name:String,
    label:String

})
