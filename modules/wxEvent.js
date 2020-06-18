'use strict'

const { WxReplyTextMessage } = require("./wxReplyMessage")

class WxEvent {
    constructor(data) {
        // 开发者微信号
        this.ToUserName = data.ToUserName || ''
        // 发送方帐号（一个OpenID）
        this.FromUserName = data.FromUserName || ''
        // 消息创建时间 （整型）
        this.CreateTime = data.CreateTime || ''
        // 消息类型，event
        this.MsgType = data.MsgType || ''
        // 事件类型
        this.Event = data.Event || ''
        // 事件KEY值，
        this.EventKey = data.EventKey || ''

        // 二维码的ticket，可用来换取二维码图片
        this.Ticket = data.Ticket || ''

        // 地理位置纬度
        this.Latitude = data.Latitude || ''
        // 地理位置经度
        this.Longitude = data.Longitude || ''
        // 地理位置精度
        this.Precision = data.Precision || ''

        if (typeof data.onSubscribe === 'function') this.onSubscribe = data.onSubscribe
        if (typeof data.onUnSubscribe === 'function') this.onUnSubscribe = data.onUnSubscribe
        if (typeof data.onScanQRCode === 'function') this.onScanQRCode = data.onScanQRCode
        if (typeof data.onUploadLocation === 'function') this.onUploadLocation = data.onUploadLocation
        if (typeof data.onMenuClick === 'function') this.onMenuClick = data.onMenuClick
        if (typeof data.onMenuLinkClick === 'function') this.onMenuLinkClick = data.onMenuLinkClick
    }

    // 用户关注公众号
    onSubscribe() {
        const now = new Date().getTime()
        const wxReplyTextMessage = new WxReplyTextMessage({
            ToUserName: this.ToUserName,
            FromUserName: this.FromUserName,
            CreateTime: now,
        })

        return wxReplyTextMessage.reply('欢迎关注公众号!')
    }

    // 用户取消关注公众号
    onUnSubscribe() {
        return ''
    }

    // 用户扫二维码进入公众号（未实现）
    onScanQRCode() {}

    // 用户上报地址信息（未实现）
    onUploadLocation() {}

    // 用户点击自定义菜单后，微信会把点击事件推送给开发者，请注意，点击菜单弹出子菜单，不会产生上报。
    onMenuClick() {}

    // 用户点击菜单链接后跳转事件
    onMenuLinkClick() {}

    reply() {
        switch(this.Event) {
            case 'subscribe': {
                return this.onSubscribe()
            }
            case 'unsubscribe': {
                return this.onUnSubscribe()
            }
            case 'SCAN': {
                return this.onScanQRCode()
            }
            case 'LOCATION': {
                return this.onUploadLocation()
            }
            case 'CLICK': {
                return this.onMenuClick()
            }
            case 'VIEW': {
                return this.onMenuLinkClick()
            }
        }
    }
}

module.exports = WxEvent