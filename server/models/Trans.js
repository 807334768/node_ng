/**
 * Created by Yan on 2017/10/16.
 */
var mongoose=require("mongoose");
var transSchema=require("../schemas/trans");
module.exports=mongoose.model('Trans',transSchema);
