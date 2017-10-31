/**
 * Created by Yan on 2017/7/25.
 */
var mongoose=require('mongoose');
var content=require("../schemas/content");
module.exports=mongoose.model("Content",content);