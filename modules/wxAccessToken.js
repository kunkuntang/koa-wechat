const config = require("../config")
const fs = require('fs')
const path = require('path')
const { fileURLToPath } = require("url")
const { resolve } = require("any-promise")
const { default: Axios } = require("axios")

const defaultPath = '../.temp'
const defaultFile = 'accessToken.txt'

class WxAccessToken {
    constructor(opts) {
        this.appID = opts.appID
        this.appScrect = opts.appScrect
        this.access_token = null
        this.expires_in = null
        if(opts.getAccessToken) {
            this.getAccessToken = opts.getAccessToken
        }
        if(opts.saveAccessToken) {
            this.saveAccessToken = opts.saveAccessToken
        }
    }

    // 获取 accessToken
    getAccessToken() {
        const filePath = path.resolve(__dirname, defaultPath, defaultFile)
        return new Promise((resolve, reject) => {
            // 判断当前内存是否有记录
            if (this.access_token && this.expires_in) {
                const data = { access_token: this.access_token, expires_in: this.expires_in }
                if (this.isValidAccessToken(data)) resolve(data)
            } else if (fs.existsSync(filePath)) { // 判断有没有缓存文件
                const dataStr = fs.readFileSync(path.resolve(__dirname, defaultPath, defaultFile))
                try {
                    const data = JSON.parse(dataStr)
                    // 判断缓存的信息是否过期
                    if (this.isValidAccessToken(data)) {
                        resolve(data)
                    } else {
                        this.updateAccessToken().then(data => {
                            resolve(data)
                        })
                    }
                } catch(e) {
                    console.log('get access token error: ', e)
                    this.updateAccessToken().then(data => {
                        resolve(data)
                    })
                }
            } else {
                // 没有缓存文件调用更新 accessToken 方法
                this.updateAccessToken().then(data => {
                    resolve(data)
                })
            }
        })
    }

    // 保存 accessToken
    saveAccessToken(data) {
        this.access_token = data.access_token
        this.expires_in = data.expires_in
        
        const filePath = path.resolve(__dirname, defaultPath, defaultFile)
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true })
        }
        fs.writeFileSync(path.resolve(__dirname, defaultPath, defaultFile), JSON.stringify(data))
    }

    // 判断 accessToken 是否合法
    isValidAccessToken(data) {
        if (!data || !data.access_token || !data.expires_in) {
            return false
        }
    
        const access_token = data.access_token
        const expires_in = data.expires_in
        const now = (new Date().getTime())
    
        if(now < expires_in) {
            return true
        } else {
            return false
        }
    }

    // 更新 accessToken
    updateAccessToken() {
        const appID = this.appID
        const appScrect = this.appScrect
        const url = `${config.api.accessToken}?grant_type=client_credential&appid=${appID}&secret=${appScrect}`
    
        return new Promise((resolve, reject) => {
            Axios.get(url).then(({ data }) => {
                console.log('update access token', data)
                const now = (new Date().getTime())
                // 每隔2个小时刷新access_token
                const expires_in = now + (data.expires_in - 20) * 1000
        
                data.expires_in = expires_in

                // 获取到最新的 accessToken 后更新缓存文件
                this.saveAccessToken(data)
                resolve(data)
            })
        })
    }
}

module.exports = WxAccessToken