const mongoose = require('mongoose')    //引入Mongoose
const Schema = mongoose.Schema          //声明Schema
let ObjectId = Schema.Types.ObjectId    //声明Object类型

//创建我们的用户Schema
const userSchema = new Schema({
    userid:{required:true,type:String},
    username:{required:true,type:String},
    password:{required:true,type:String},
    objData:Object,
    createDate:{type:Number,default:Date.parse(new Date())},
    lastLoginDate:{type:Number,default:Date.parse(new Date())}
},{
    collection:'user'
})


//发布模型 大学名词  会转成小写名词复数 users
mongoose.model('User',userSchema)