const getRawBody = require('raw-body')
const utils = require('../utils')
const { WxReplyTextMessage, WxReplyImageMessage, WxReplyVoiceMessage, WxReplyVideoMessage, WxLocationMessage, WxLinkMessage, WxReplyMusicMessage } = require('../modules/wxReplyMessage')
const WxEvent = require('../modules/wxEvent')
const WxMediaUpload = require('../modules/wxMediaUpload')
const path = require('path')
const WxAccount = require('../modules/wxAccount')

module.exports = async (ctx, next) => {
    if (ctx.method === 'POST') {
        try {
            const data = await getRawBody(ctx.req, {
                length: ctx.length,
                limit: '1mb',
            })

            const content = await utils.paserXMLAsync(data)
            const message = utils.formatXMLMessage(content.xml)

            console.log('message', message)

            ctx.status = 200
            ctx.tyep = 'application/xml'
            ctx.body = 'get it';

            switch (message.MsgType) {
                case 'event': {
                    const wxEvent = new WxEvent(message)
                    ctx.body = wxEvent.reply()
                    break;
                }
                case 'text': {
                    switch(message.Content) {
                        case 'upload pic': {
                            try {
                                const { access_token } = await ctx.wxAccessToken.getAccessToken()
                                const filePath = path.resolve(__dirname, '../media/logo.jpg');
                                const wxUpload = new WxMediaUpload(access_token, 'image', filePath);
                                const data = await wxUpload.upload()
                                const wxReplyImageMessge = new WxReplyImageMessage(message)
                                ctx.body = wxReplyImageMessge.reply({ MediaId: data.media_id })
                            } catch(e) {
                                console.log('get accessToken error: ', e)
                            }
                            break;
                        }
                        case 'upload video': {
                            try {
                                const { access_token } = await ctx.wxAccessToken.getAccessToken()
                                const filePath = path.resolve(__dirname, '../media/test.mp4');
                                const wxUpload = new WxMediaUpload(access_token, 'video', filePath);
                                const data = await wxUpload.upload()
                                console.log('upload video data', data)
                                const wxReplyVideoMessage = new WxReplyVideoMessage(message)
                                ctx.body = wxReplyVideoMessage.reply({ MediaId: data.media_id, Title: '测试视频', Description: '这是一条测试视频' })
                            } catch(e) {
                                console.log('get accessToken error: ', e)
                            }
                            break;
                        }
                        case 'music': {
                            try {
                                const wxReplyMusicMessage = new WxReplyMusicMessage(message)
                                ctx.body = wxReplyMusicMessage.reply({ Title: '测试音频', Description: '这是一条测试音频test', MusicURL: 'https://music.163.com/#/song?id=31877628', HQMusicUrl: 'https://music.163.com/#/song?id=31877628', ThumbMediaId: 'rGLCnImpJJfZhPWViKlkOhnKKPpUuiYLI7Jfq8DfdQvHF8' })
                            } catch(e) {
                                console.log('get accessToken error: ', e)
                            }
                            break;
                        }
                        case 'picture': {
                            const wxReplyImageMessge = new WxReplyImageMessage(message)
                            ctx.body = wxReplyImageMessge.reply({ MediaId: 'aHTm97Nmmfig2iafa-rGLCnImpJJfZhPWViKlkOhnKKPpUuiYLI7Jfq8DfdQvHF8' })
                            break;
                        }
                        case 'video': {
                            const wxReplyVideoMessage = new WxReplyVideoMessage(message)
                            ctx.body = wxReplyVideoMessage.reply({ MediaId: 'QUPhb3epa7L0tRBRh-3Ie4c7QcQygu1L_O87stdG7X36T_XVo2p50tTBDqEPUsvz', Title: '测试视频', Description: '这是一条测试视频' })
                            break;
                        }
                        case 'short url': {
                            const wxAccount = new WxAccount()
                            const { access_token } = await ctx.wxAccessToken.getAccessToken()
                            const data = await wxAccount.createShortUrl(access_token, 'https://www.baidu.com')
                            const wxReplyTextMessage = new WxReplyTextMessage(message)
                            ctx.body = wxReplyTextMessage.reply(data.short_url)
                            break;
                        }
                        default: {
                            const wxReplyTextMessage = new WxReplyTextMessage(message)
                            ctx.body = wxReplyTextMessage.reply('我已收到了你发送的文本，但是本公众号不能正确识别到你所发送的内容，请确认！')
                        }
                    }
                    break;
                }
                case 'image': {
                    const wxReplyImageMessge = new WxReplyImageMessage(message)
                    ctx.body = wxReplyImageMessge.reply()
                    break;
                }
                case 'voice': {
                    const wxReplyVoiceMessage = new WxReplyVoiceMessage(message)
                    ctx.body = wxReplyVoiceMessage.reply()
                    break;
                }
                case 'video': {
                    const wxReplyVideoMessage = new WxReplyVideoMessage(message)
                    ctx.body = wxReplyVideoMessage.reply()
                    break;
                }
                case 'location': {
                    const wxLocationMessage = new WxLocationMessage(message)
                    ctx.body = wxLocationMessage.reply()
                    break;
                }
                case 'link': {
                    const wxLinkMessage = new WxLinkMessage(message)
                    ctx.body = wxLinkMessage.reply()
                    break;
                }
            }
        } catch (e) {
            console.log('err: ', e)
            ctx.body = 'get error'
        }
    }
}