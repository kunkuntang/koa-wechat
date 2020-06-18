'use strict'

const Koa = require('koa')
const config = require('./config');
const AuthServer = require('./middleware/AuthServer');
const AuthAccessToekn = require('./middleware/AuthAccessToekn');
const WxAccessToken = require('./modules/wxAccessToken');
const wechatMessage = require('./middleware/WechatReply');

const app = new Koa();

app.context.wxAccessToken = new WxAccessToken({
    appID: config.wechat.appID,
    appScrect: config.wechat.appScrect,
})

app.use(AuthServer)
app.use(AuthAccessToekn)
app.use(wechatMessage)

app.listen(8090)
console.log('listening 8090')