/**
 * Created by Yan on 2017/7/25.
 */
var mongoose =require('mongoose');

module.exports=new mongoose.Schema({

    //�����ֶ� ���� ����id
    category:{//populate('category')
        //����
        type:mongoose.Schema.Types.ObjectId,
        //����(models)
        ref:'Category'//���÷����ģ��
    },
    //���ݱ���
    title:String,
    //���
    description:{
        type:String,
        defalut:''
    },
    //����
    content:{
        type:String,
        default:""
    },
    //�����ֶ� �û�id
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //���ʱ��
    addTime:{
        type:Date,
        default:new Date()
    },
    //�����
    views:{
        type:Number,
        default:0
    },
    //����
    comments:{
        type:Array,
        default:[]
    }

})