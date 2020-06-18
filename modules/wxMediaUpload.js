// const { default: Axios } = require("axios")
const request = require('request')
const { api } = require("../config")
const fs = require('fs')

// 这个地方不能用 Axios，只能用 Request 库
class WxMediaUpload {
    constructor(accessToken, type, filePath) {
        this.accessToken = accessToken || ''
        this.type = type || ''
        this.filePath = filePath || ''
    }

    upload() {
        return new Promise((resolve, reject) => {
            if (this.accessToken && this.type && this.filePath) {
                const url = `${api.uploadTemplateMedia}?access_token=${this.accessToken}&type=${this.type}`
                request.post({ url, formData: {
                    media: fs.createReadStream(this.filePath)
                } }, function(err, httpResponse, body) {
                    if (!err && httpResponse.statusCode === 200) {
                        const data =  JSON.parse(body)
                        resolve(data)
                    } else {
                        console.log('upload media occur err', err)
                    }
                })
            } else {
                reject('WxMediaUpload 初始化参数有误')
            }
        })
    }
}

module.exports = WxMediaUpload