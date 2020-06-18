'use strict'

const request = require("request")
const { api } = require("../config")

class WxAccount {
    // 生成二维码ticket（认证后的服务号）
    createQRCodeTicket(accessToken = '', data = { expire_seconds: 2592000, action_name: '', action_info: '', scene_id: '', scene_str: '' }) {
        const url = `${api.createQRCode}?access_token=${data.accessToken}`
        return new Promise((resolve, reject) => {
            request.post(url, { body: data }, (err, response) => {
                if (!err && response.statusCode === 200) {
                    const data = JSON.parse(response.body)
                    resolve(data)
                } else {
                    reject(err)
                }
            })
        })
    }

    // 用ticket换取二维码图片
    fetchQRCodeWithTicket(ticket = '') {
        return new Promise((resolve, reject) => {
            request.get(`${api.fetchQRCodeWithTicket}?ticket=${encodeURI(ticket)}`, (err, response) => {
                if (!err && response.statusCode === 200) {
                    const data = JSON.parse(response.body)
                    resolve(data)      
                } else {
                    reject(err)
                }
            })
        })
    }

    // 长连接转换成短连接
    createShortUrl(accessToken = '', long_url = '', action = 'long2short') {
        return new Promise((resolve, reject) => {
            if (long_url) {
                request.post(`${api.createShortUrl}?access_token=${accessToken}`, {
                    body: {
                        long_url,
                        action,
                    },
                    json: true
                }, (err, response) => {
                    if (!err && response.statusCode === 200) {
                        resolve(response.body)
                    } else {
                        reject(err)
                    }
                })
            } else {
                reject('long_url 不能为空')
            }
        })
    }
}

module.exports = WxAccount