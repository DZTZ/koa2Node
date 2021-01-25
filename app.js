/*
 * @Description: 
 * @Version: 
 * @Author: wangjie
 * @Date: 2020-11-12 00:00:19
 * @LastEditors: wangjie
 * @LastEditTime: 2020-11-14 23:32:36
 */
const Koa = require('koa')
const app = new Koa()

app.use(async(ctx)=>{
    ctx.body = '<h1>hello Koa2</h1>'
})

app.listen(3000,()=>{
    console.log('[Server] starting at port 3000')
})