/**
 * Created by Yan on 2017/7/22.
 */
var mongoose=require('mongoose');
var category=require("../schemas/category");
module.exports=mongoose.model("Category",category);