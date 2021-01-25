const mongoose = require('mongoose')    //引入Mongoose
const Schema = mongoose.Schema          //声明Schema

//创建文章Schema
const Article = new Schema({
    title:{required:true,type:String},
    imgUrl:String,
    createDate:{type:Number,default:Date.parse(new Date())},
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        localField:'userid',
        //作者是用户集合的_id;
        required:[true,'请填写作者']
    }
},{
    collection:'article'
})

mongoose.model('Article',Article)