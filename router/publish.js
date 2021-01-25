let Router = require('koa-router')//路由
//父路由
let router = new Router();
//子路由
let api = new Router();

/*登录的实践 */
// router.get('/publishArticles',async(ctx)=>{
//     console.log(123123123)
// })

// api.get('/publishArticles', async(ctx) => {
//     console.log(9999999)
//     ctx.body = {
//         msg:'纽扣'
//     }
// })

router.get('/publishArticles', (ctx) => {
        ctx.body = 'hello koa'
    })

let arr = [1,2,3]

module.exports = {router,arr};

