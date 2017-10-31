/**
 * Created by Yan on 2017/10/16.
 */
var mongoose =require('mongoose');
module.exports=new mongoose.Schema({
    transNum:{/*交易流水号*/
        type:Number,
        default:""
    },
    orderNum:{/*订单号*/
        type:Number,
        default:""
    },
    transTime:{/*交易时间*/
        type:Date,
        default:""
    },
    transMoney:{/*交易金额*/
        type:Number,
        default:0
    },
    payType:{/*支付方式*/
        type:Number,
        default:''
    },
    transChannel:{/*交易渠道*/
        type:Number,
        default:''
    },
    merId:{/*商户id*/
        type:String,
        default:''
    }

})