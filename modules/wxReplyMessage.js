'use strict'

const { extname } = require("path")

class WxMessage {
    constructor(data) {
        this.ToUserName = data.ToUserName || ''
        this.FromUserName = data.FromUserName || ''
        this.CreateTime = data.CreateTime || ''
        this.MsgType = data.MsgType || ''
        this.MsgId = data.MsgId || ''
    }
}

class WxTextMessage extends WxMessage {
    constructor(data) {
        super(data)
        this.MsgType = 'text'
        // 文本消息内容
        this.Content = data.Content || ''
    }
}

class WxReplyTextMessage extends WxTextMessage {
    constructor(data) {
        super(data)
    }

    reply(text = '') {
        const now = new Date().getTime()
        return `<xml>
            <ToUserName><![CDATA[${this.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${this.ToUserName}]]></FromUserName>
            <CreateTime>${now}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${text}]]></Content>
        </xml>` 
    }
}

class WxImageMessage extends WxMessage {
    constructor(data) {
        super(data)
        this.MsgType = 'image'
        // 图片链接（由系统生成）
        this.PicUrl = data.PicUrl || ''
        // 图片消息媒体id，可以调用获取临时素材接口拉取数据。
        this.MediaId = data.MediaId || ''
    }
}

class WxReplyImageMessage extends WxImageMessage {
    constructor(data) {
        super(data)
    }

    reply(data = { MediaId: '' }) {
        const now = new Date().getTime()
        return `<xml>
            <ToUserName><![CDATA[${this.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${this.ToUserName}]]></FromUserName>
            <CreateTime>${now}</CreateTime>
            <MsgType><![CDATA[image]]></MsgType>
            <Image>
                <MediaId><![CDATA[${data.MediaId}]]></MediaId>
            </Image>
        </xml>` 
    }
}

class WxVoiceMessage extends WxMessage {
    constructor(data) {
        super(data)
        this.MsgType = 'voice'
        // 语音消息媒体id，可以调用获取临时素材接口拉取数据。
        this.MediaId = data.MediaId || ''
        // 语音格式，如amr，speex等
        this.Format = data.Format || ''
        // 语音识别结果，UTF8编码
        this.Recognition = data.Recognition || ''
    }
}

class WxReplyVoiceMessage extends WxVoiceMessage {
    constructor(data) {
        super(data)
    }

    reply(data = { MediaId: '' }) {
        const now = new Date().getTime()
        return `<xml>
            <ToUserName><![CDATA[${this.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${this.ToUserName}]]></FromUserName>
            <CreateTime>${now}</CreateTime>
            <MsgType><![CDATA[voice]]></MsgType>
            <Voice>
                <MediaId><![CDATA[${data.MediaId}]]></MediaId>
            </Voice>
        </xml>`
    }
}

class WxVideoMessage extends WxMessage {
    constructor(data) {
        super(data)
        this.MsgType = 'video'
        // 视频消息媒体id，可以调用获取临时素材接口拉取数据。
        this.MediaId = data.MediaId || ''
        // 视频消息缩略图的媒体id，可以调用多媒体文件下载接口拉取数据。
        this.ThumbMediaId = data.ThumbMediaId || ''
    }
}

class WxReplyVideoMessage extends WxVideoMessage {
    constructor(data) {
        super(data)
    }

    reply(data = { MediaId: '', Title: '', Description: '' }) {
        const now = new Date().getTime()
        return `<xml>
            <ToUserName><![CDATA[${this.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${this.ToUserName}]]></FromUserName>
            <CreateTime>${now}</CreateTime>
            <MsgType><![CDATA[video]]></MsgType>
            <Video>
                <MediaId><![CDATA[${data.MediaId}]]></MediaId>
                <Title><![CDATA[${data.Title}]]></Title>
                <Description><![CDATA[${data.Description}]]></Description>
            </Video>
        </xml>`
    }
}

class WxReplyMusicMessage extends WxMessage {
    constructor(data) {
        super(data)
    }

    reply(data = { Title: '', Description: '', MusicURL: '', HQMusicUrl: '', ThumbMediaId: ''}) {
        const now = new Date().getTime()
        return `<xml>
            <ToUserName><![CDATA[${this.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${this.ToUserName}]]></FromUserName>
            <CreateTime>${now}</CreateTime>
            <MsgType><![CDATA[music]]></MsgType>
            <Music>
                <Title><![CDATA[${data.Title || ''}]]></Title>
                <Description><![CDATA[${data.Description || ''}]]></Description>
                <MusicUrl><![CDATA[${data.MusicURL || ''}]]></MusicUrl>
                <HQMusicUrl><![CDATA[${data.HQMusicUrl || ''}]]></HQMusicUrl>
                <ThumbMediaId><![CDATA[${data.ThumbMediaId || ''}]]></ThumbMediaId>
            </Music>
        </xml>`
    }
}

class WxReplyNewsMessage extends WxMessage {
    constructor(data) {
        super(data)
    }

    reply(data = { ArticleCount: number, news: [{Title: '', Description: '', Url: '', PicUrl: '' }]}) {
        const now = new Date().getTime()
        let str = `<xml>
            <ToUserName><![CDATA[${this.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${this.ToUserName}]]></FromUserName>
            <CreateTime>${now}</CreateTime>
            <MsgType><![CDATA[music]]></MsgType>
            <ArticleCount>${data.ArticleCount}</ArticleCount>
            <Articles>`
        for(let i = 0; i < data.news.length; i++) {
            const _new = data.news[i]
            str += `<item>
                    <Title><![CDATA[${_new.Title}]]></Title>
                    <Description><![CDATA[${_new.Description}]]></Description>
                    <PicUrl><![CDATA[${_new.PicUrl}]]></PicUrl>
                    <Url><![CDATA[${_new.Url}]]></Url>
                </item>`
        }
        str += `</Articles>
            </xml>`
        return str
    }
}

class WxLocationMessage extends WxMessage {
    constructor(data) {
        super(data)
        // 地理位置维度
        this.Location_X = data.Location_X || ''
        // 地理位置经度
        this.Location_Y = data.Location_Y || ''
        // 地图缩放大小
        this.Scale = data.Scale || ''
        // 地理位置信息
        this.Label = data.Label || ''
    }
}

class WxLinkMessage extends WxMessage {
    constructor(data) {
        super(data)
        // Title
        this.Title = data.Title || ''
        // Description
        this.Description = data.Description || ''
        // 消息链接
        this.Url = data.Url || ''
    }
}


module.exports = {
    WxTextMessage,
    WxReplyTextMessage,
    WxImageMessage,
    WxReplyImageMessage,
    WxVoiceMessage,
    WxReplyVoiceMessage,
    WxVideoMessage,
    WxReplyVideoMessage,
    WxLocationMessage,
    WxLinkMessage,
    WxReplyMusicMessage,
    WxReplyNewsMessage,
}