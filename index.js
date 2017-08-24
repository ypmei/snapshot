"use strict";
var dns = require('dns')
var _ = require('lodash')
var http = require('http')

const domains = ['www.baidu.com','www.baidu.com','www.ypmei.com','www.oneapm.com','www.github.com']

let ips = []

var promise = new Promise((resolve, reject)=>{
  domains.forEach((d,index)=>{
    dns.lookup(d, (err, addresses) => {
      ips.push(addresses)
      if((index+1) === domains.length){
        resolve(ips)
      }
    })
  })
})

var loadPage = (url) => {
  return new Promise((resolve, reject) => {
    let html = ''
    let t = 0;
    let httpFn = () => {
      t = t + 1
      http.get(url, (res) => {
        res.on('data', (d) => {
          html += d.toString()
        })
        res.on('end', () => resolve(html))
      }).on('error', (e) => {
        if(t > 3){
          reject(e)
        }else{
          httpFn()
        }
      })
    }
    httpFn()
  })
}
promise
  .then((ips)=>_.uniq(ips))  //去重
  .then((ips)=>{
    ips.forEach((ip)=>{
      loadPage(`http://${ip}`).then((html)=>{
        console.log(html);
      })
    })
  })
