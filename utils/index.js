'use strict'
const xml2js = require('xml2js')
const { isArray } = require('util')

// 处理微信发送过来的 xml 数据
function paserXMLAsync(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, { trim: true }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

// 格式化由 xml 转成 object 的数据
function formatXMLMessage(data) {
  const formatData = {}
  if(typeof data === 'object') {
    const keys = Object.keys(data)
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = data[keys[i]]

      if(!isArray(value) || value.length === 0) {
        continue
      }
      
      if(value.length === 1) {
        const val = value[0]
        if (typeof val === 'object') {
          formatData[key] = formatXMLMessage(val)
        } else {
          formatData[key] = (val || '').trim()
        }
      } else {
        formatData[key] = []
        for(let j = 0; j < value.length; j++) {
          formatData[key].push(formatXMLMessage(value[j]))
        }
      }
    }
  }

  return formatData
}

module.exports = {
  paserXMLAsync,
  formatXMLMessage,
}