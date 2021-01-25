
const Koa = require('koa')
const app = new Koa()
let Router = require('koa-router')//路由
const koaBody = require('koa-body');//接收参数
const statics = require('koa-static')//访问文件
const fs = require('fs');
const path = require('path')
let cors = require('koa2-cors')//解决跨域
// app.use(cors());
app.use(
  cors({
    origin: function(ctx) { //设置允许来自指定域名请求
      // return '*';
      return ctx.header.origin
    },
    // maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization','Content-Type', 'Authorization', 'Accept'] //设置获取其他自定义字段
  })
);
app.use(koaBody({
  multipart:true, // 支持文件上传
  // encoding:'gzip',
  // formidable:{
  //     uploadDir:path.join(__dirname,'public/upload/'), // 设置文件上传目录
  //     keepExtensions: true,    // 保持文件的后缀
  //     maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
  //     onFileBegin:(name,file) => { // 文件上传前的设置
  //         // console.log(`name: ${name}`);
  //         // console.log(file);
  //     },
  // }
}));
app.use(statics(
  path.join(__dirname, '/upload')
))//可访问文件


//引入connect
const mongoose = require('mongoose')
const {connect , initSchemas} = require('./database/init.js')
const {getRandomString} = require('./tool.js')
// const {router,arr} = require('./router/publish')
// console.log(router)
//立即执行函数
;(async () =>{
    await connect()
    initSchemas()
    const User = mongoose.model('User')
    const Article = mongoose.model('Article')

    //子路由
    let api = new Router();
    api.post('/login', async(ctx) => {
      let { username ,password} = ctx.request.body;
      let result = await User.find({username});
      if(result.length === 0||result[0].password !== password){
        ctx.body = {
          state:1,
          msg:'账号或密码错误！'
        }
      }else{
        result = result[0];
        delete result.password;
        ctx.cookies.set('userinfo',Buffer.from(JSON.stringify(result)).toString('base64'),{
          domain:'127.0.0.1',
          maxAge:3000000,//最长有效时间
          //expires:new Date('2020-12-04'),//到那天失效
          httpOnly:false,//不只http生效 其他也可以
          overwrite:false,//不允许重写
        })
        ctx.body = {
          state:0,
          msg:'登陆成功！'
        }
      }
    }).post('/register', async(ctx, next) => {
      let { username ,password} = ctx.request.body;
      //先查询
      let result = await User.find({username});
      if(result.length != 0){
        ctx.body = {
          state:1,
          msg:'该用户名已存在！'
        }
        return;
      }
      // 随机字符串 开始
      let date = new Date();//实例一个时间对象；
      let year = date.getFullYear()+'';//获取系统的年；
      let month = date.getMonth()+1+'';//获取系统月份，由于月份是从0开始计算，所以要加1
      let day = date.getDate()+'';
      let temparr = ['a','b','c','d','e','f','m','h','i','k','w'];
      let str = '';
      for(let i = 0;i<=10;i++){
      let randomNumber = Math.floor(Math.random() * 10) + 1;
        let randStr = '';
        if(i%2 === 0){
          randStr = temparr[randomNumber]
        }else{
          randStr = randomNumber;
        }
        str += randStr;
      }
      // 随机字符串 结束
      let data ={
        username,
        password,
        userid:year+month+day+str
      }
      let oneUser = new User(data);
      await oneUser.save().then(()=>{
        ctx.body = {
          state:0,
          msg:'注册成功！'
        }
      }).catch(err=>{
        ctx.body = {
          state:1,
          msg:err
        }
      })
    }).get('/test', async(ctx, next) => {
      ctx.body = {
        state:0,
        data:[1,2,3],
        msg:'okok！'
      }
      // let oneUser = new Article({
      //   title:'我是个标题',
      //   imgUrl:'',
      //   author:'5fd1d09c408a7c1fcf59c52a',
      // });
      // await oneUser.save().then(()=>{
      //   ctx.body = {
      //     state:0,
      //     msg:'成功！'
      //   }
      // }).catch(err=>{
      //   ctx.body = {
      //     state:1,
      //     msg:err
      //   }
      // })


      // await db.collection('user').findAndModify({
      //    query:{username:'拔个大萝卜999'},
      //    update:{
      //      $set:{username:'拔个大萝卜'}
      //    }
      // }).then((e)=>{
      //   console.log(e)
      // })

      //修改
      // await User.updateOne(
      //     {username:'拔个大萝卜3'},
      //     {$set:{username:'拔个大萝卜999'}}
      // ).then((e)=>{
      //   console.log()
      //   if(e.nModified == 1){
      //     ctx.body = {
      //       msg:'修改成功'
      //     }
      //   }else{
      //     ctx.body = {
      //       msg:'修改失败'
      //     }
      //   }
      // })

    })

    //发布
    api.post('/publishArticles', async(ctx) => {
      let { title } = ctx.request.body;

      const file = ctx.request.files.file;	// 获取上传文件
      const reader = fs.createReadStream(file.path);	// 创建可读流
      const ext = file.name.split('.').pop();		// 获取上传文件扩展名
      let str = getRandomString();
      const upStream = fs.createWriteStream(`upload/${str+'img'}.${ext}`);		// 创建可写流
      reader.pipe(upStream);	// 可读流通过管道写入可写流

      let cookieStr = ctx.cookies.get('userinfo');//获取cookie
      if(!cookieStr){
        ctx.body = {
          state:401,
          msg:'登录失效！'
        }
        return;
      }
      let userInfo = new Buffer(cookieStr, 'base64').toString();//解码
      let data = {
        title,
        imgUrl:str+'img.'+ext,
        author:JSON.parse(userInfo)._id
      }

      let oneArticle = new Article(data);
      await oneArticle.save().then(()=>{
        ctx.body = {
          state:0,
          msg:'发布成功！'
        }
      }).catch(err=>{
        ctx.body = {
          state:1,
          msg:err
        }
      })
    }).post('/getArticleList', async(ctx, next) => {
      let { page } = ctx.request.body;
      let length = await Article.find().count();
      let result = await Article.find().limit(5).skip((page-1)*5).populate('author');
      console.log(result)
      ctx.body = {
        state:0,
        length,
        data:result,
        msg:'查询成功！'
      }
    }).post('/cuntu', async(ctx, next) => {
      let { str } = ctx.request.body;
      console.log(str)
      ctx.body = {
        msg:'ok！'
      }
      if(str){
        var base64 = Buffer.from(str,"base64")
        // 将接收到的图片base64编码转换成 demo.png
        fs.writeFile("demo.png",base64,function(){
          console.log("\033[34mdemo.png has been converted to complete!\033[39m")
        })
      }
    })

    //父路由
    let router = new Router();
    router.use('/api',api.routes(),api.allowedMethods())

    //启动路由
    app.use(router.routes()).use(router.allowedMethods());

})()

app.listen(5050,()=>{
    console.log('服务启动成功 50503')
})