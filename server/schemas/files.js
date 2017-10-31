/**
 * Created by Yan on 2017/10/16.
 */
var mongoose =require('mongoose');
module.exports=new mongoose.Schema({
    //关联字段 引用 用户id
    userId:{//populate('users')
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用(models)
        ref:'Users'//引用分类的模型
    },

    fileName:{
        type:String,
        default:""
    }
})