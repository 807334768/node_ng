/**
 * Created by Yan on 2017/7/3.
 * 用户模型类,只写操作模型类来对数据库操作
 */
var mongoose=require("mongoose");
var userSchema=require("../schemas/users");
module.exports=mongoose.model('User',userSchema);
