'use strict'

const sha1 = require('sha1');
const config = require('../config');

// 公众号 接口配置信息 验证代码
module.exports = async (ctx, next) => {

    const token = config.wechat.token
    const signature = ctx.query.signature
    const nonce = ctx.query.nonce
    const timestamp = ctx.query.timestamp
    const echostr = ctx.query.echostr

    const str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)

    if (sha === signature) {
        // 如果是是 get 请求，则当前微信是在验证服务器合法性
        if (ctx.method === 'GET') {
            ctx.body = echostr + ''
        } else { // 否则调用下面的中间件处理
            await next()
        }
    } else {
        ctx.body = 'signature is wrong, please check it right'
    }
}
