/**
 * Created by Yan on 2017/10/16.
 */
var mongoose=require('mongoose');
var file=require("../schemas/files");
module.exports=mongoose.model("File",file);