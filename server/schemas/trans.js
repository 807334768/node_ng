/**
 * Created by Yan on 2017/10/16.
 */
var mongoose =require('mongoose');
module.exports=new mongoose.Schema({
    transNum:{/*������ˮ��*/
        type:Number,
        default:""
    },
    orderNum:{/*������*/
        type:Number,
        default:""
    },
    transTime:{/*����ʱ��*/
        type:Date,
        default:""
    },
    transMoney:{/*���׽��*/
        type:Number,
        default:0
    },
    payType:{/*֧����ʽ*/
        type:Number,
        default:''
    },
    transChannel:{/*��������*/
        type:Number,
        default:''
    },
    merId:{/*�̻�id*/
        type:String,
        default:''
    }

})