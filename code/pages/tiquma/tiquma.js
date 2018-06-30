// pages/dingdanxiangqing/dingdanxiangqing.js
//导入js
var network = require("../../utils/network.js")
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kefu: '../../img/tel.png',
    nowDate:''
  },
  onLoad: function (options) {
    var orderDetail = JSON.parse(options.orderDetail)
    console.log('订单数据', orderDetail)
    let now = new Date()
    let y = now.getFullYear();
    let m = now.getMonth() + 1;//获取当前月份的日期
    m = m > 10 ? m : '0' + m
    let d = now.getDate();
    let nowDate =  y + "-" + m + "-" + d;
    this.setData({
      orderDetail: orderDetail,
      nowDate: nowDate,
    })
  },
})