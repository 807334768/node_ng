/**
 * Created by Yan on 2017/7/3.
 * �û�ģ����,ֻд����ģ�����������ݿ����
 */
var mongoose=require("mongoose");
var userSchema=require("../schemas/users");
module.exports=mongoose.model('User',userSchema);
