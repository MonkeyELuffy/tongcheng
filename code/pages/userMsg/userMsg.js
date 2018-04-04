// pages/personCenter/personCenter.js
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    userInfo: [{
      key: '更换头像',
      value: '',
      image: 'img/about.png',
      can_change: true
    }, {
      key: '真实姓名',
      value: '张三',
      can_change: false
    }, {
      key: '绑定手机号',
      value: '18200298897',
      can_change: false
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var globalDatauserInfo = app.globalData.userInfo
    var userInfo = this.data.userInfo
    userInfo[0]["image"] = globalDatauserInfo.img_url
    userInfo[1]["value"] = globalDatauserInfo.rel_name
    userInfo[2]["value"] = globalDatauserInfo.phone
    that.setData({
      userInfo: userInfo
    })
  },
  // 修改手机号和昵称
  changeNameAndMobil: function (e) {
    var that = this;
    var index = e.target.dataset.index
    var userInfo = this.data.userInfo
    userInfo[index].value = e.detail.value
  },
  //点击确认，返回上界面
  sure: function (e) {
    var that = this
    var go = function (e) {
      var rel_name = that.data.userInfo[1].value
      var phone = that.data.userInfo[2].value
      var openid = app.globalData.openid
      // var avatar = that.data.userInfo[0].image
      var reg = /^1[3|5|7|8]\d{9}$/;
      if (!phone || !reg.test(phone)) {
        wx.showToast({
          title: '请输入正确的手机号',
          content: '1000',
        })
      } else {
        var data = {
          openid: openid,
          phone: phone,
          rel_name: rel_name,
        }
        //请求用户地址
        util.httpPost(app.globalUrl + app.Memberid, data, this.processData);
      }
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  processrData: function (res) {
    if (res.suc == 'y') {
      console.log(res.data)
      app.globalData.userInfo = res.data
      app.globalData.userInfo.token = res.data.id
      wx.showToast({
        title: '保存成功'
      })
      wx.navigateBack()
    } else {
      wx.showToast({
        title: res.msg,
      })
    }
  },
  //修改头像
  changeImg: function () {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          'userInfo[0].image': tempFilePaths
        })
        // wx.uploadFile({
        //   url: app.globalData.rootUrl + '/info/update_name',
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   formData: {
        //     'user': 'test'
        //   },
        //   success: function (res) {
        //     var data = res.data
        //     console.log('修改头像之后的res：', tempFilePaths[0])
        //     that.setData({
        //       'userInfo[0].image': tempFilePaths[0]
        //     })

        //     var userInfo = wx.getStorageSync("userInfo")
        //     userInfo.avatar = tempFilePaths[0]
        //     wx.setStorage({
        //       key: "userInfo",
        //       data: userInfo
        //     })
        //     //do something
        //   }
        // })
      }
    })
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