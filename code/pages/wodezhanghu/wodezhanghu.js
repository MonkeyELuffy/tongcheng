// pages/wodezhanghu/wodezhanghu.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    more:'../../img/more.png'
  },
  onShow(){
    var userInfo = app.globalData.userInfo
    this.setData({
      userInfo: userInfo
    })
  },
  //页面跳转
  goPage: function (e) {
    var that = this
    var go = function (e) {
      var url = e.currentTarget.dataset.page
      url = '../' + url + '/' + url
      console.log(url)
      wx.navigateTo({
        url: url
      })
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  /*==========
  防止快速点击
  ===========*/
  clickTooFast: function (data) {
    var lastTime = this.data.lastTime
    var curTime = data.e.timeStamp
    if (lastTime > 0) {
      if (curTime - lastTime < 1000) {
        console.log('点击太快了')
        return
      } else {
        data.go(data.e)
      }
    } else {
      data.go(data.e)
    }
    this.setData({
      lastTime: curTime
    })
  }
})