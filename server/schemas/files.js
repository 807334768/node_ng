/**
 * Created by Yan on 2017/10/16.
 */
var mongoose =require('mongoose');
module.exports=new mongoose.Schema({
    //�����ֶ� ���� �û�id
    userId:{//populate('users')
        //����
        type:mongoose.Schema.Types.ObjectId,
        //����(models)
        ref:'Users'//���÷����ģ��
    },

    fileName:{
        type:String,
        default:""
    }
})