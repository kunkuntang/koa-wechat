'use strict'

module.exports = async (ctx, next) => {
    const data = await ctx.wxAccessToken.getAccessToken()
    await next()
    // ctx.body = 'get accessToken' + JSON.stringify(data)
}