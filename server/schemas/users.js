/**
 * Created by Yan on 2017/6/27.
 * �ṹ�ļ�
 */
var mongoose =require('mongoose');//����mongooseģ��
//�û��ı�ṹ
module.exports=new mongoose.Schema({
    username:String,
    password:String,
    regTime:{
        type:Date,
        default:Date()
    },
    //�Ƿ��ǹ���Ա���������ü�¼��cookie�У���ʱ����Ƿ�Ϊ����Ա��
    isAdmin:{
        type:Boolean,
        default:false
    }
})


