// pages/cashOutDetail/cashOutDetail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: app.globalData.scrollHeight,
    // 明细
    dataList: [{
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
        name: '购买商品',
        value: '101.00',
        time: '2017-05-20 13:01',
    }],
    cashOutMoney: 5.00
  },
  onShow() {
    var userInfo = app.globalData.userInfo
    this.setData({
      userInfo: userInfo
    })
  },
})