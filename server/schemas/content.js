/**
 * Created by Yan on 2017/7/25.
 */
var mongoose =require('mongoose');

module.exports=new mongoose.Schema({

    //关联字段 引用 分类id
    category:{//populate('category')
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用(models)
        ref:'Category'//引用分类的模型
    },
    //内容标题
    title:String,
    //简介
    description:{
        type:String,
        defalut:''
    },
    //内容
    content:{
        type:String,
        default:""
    },
    //关联字段 用户id
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //添加时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //点击量
    views:{
        type:Number,
        default:0
    },
    //评论
    comments:{
        type:Array,
        default:[]
    }

})