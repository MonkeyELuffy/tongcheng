// pages/pay/pay.js
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    tixian: '../../img/tixian.png',
    showSuccess: false,
    sn:'',
    money:0,
    payStyle:[
      {
        img:'../../img/weixin.png',
        name:'微信支付',
        paytype:'1'
      }, {
        img: '../../img/yu_e.png',
        name: '账户余额',
        paytype: '2'
      },
    ],
    // 倒计时
    Countdown :3,
  },
  onLoad:function(options){
    console.log('order_id', options.order_id);
    var data = {
      order_id: options.order_id,
      token: app.globalData.userInfo.token
    }
    //请求付款金额和订单号
    util.httpPost(app.globalUrl + app.ORDERPAY, data, this.processSubmitPayData);
  },
  processSubmitPayData: function (res) {
    if (res.suc == 'y') {
      console.log('提交支付申请成功', res.data); 
      this.setData({
        money: res.data.money,
        sn: res.data.sn,
      })
    } else {
      console.log('提交支付申请错误', res);
      wx.showToast({
        title: res.msg,
      })
    }
  },
  pay: function (e) {
    var that = this
    var go = function (e) {
      wx.showLoading({
        title: '支付中',
      })
      var data = {
        pay_sn: that.data.sn,
        member_id: app.globalData.member_id,
        type: e.currentTarget.dataset.paytype, 
        body: app.globalData.userInfo.nickname + '支付'
      }
      that.setData({
        payType: e.currentTarget.dataset.paytype
      })
      // 调用支付接口
      util.httpPost(app.globalUrl + app.Payment, data, that.processPayData);
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  //处理支付结果
  processPayData: function (res) {
    if (res.suc == 'y') {
      console.log('支付成功', res.data);
      var that = this;
      if (that.data.payType == '2'){
        util.showTip('支付成功');
        that.setData({
          showSuccess: true
        })
        that.startCountdown()
      }else{
        // 微信支付
        that.wxPay(res)
      }
    } else {
      wx.hideLoading();
      wx.showToast({
        title: res.msg,
      })
    }
  },
  // 调用微信支付
  wxPay(res) {
    var that = this
    wx.requestPayment({
      timeStamp: res.data.timeStamp.toString(),
      nonceStr: res.data.nonceStr,
      package: res.data.package,
      signType: res.data.signType,
      paySign: res.data.paySign,
      success: function (msg) {
        if (msg.errMsg == 'requestPayment:ok') {
          wx.hideLoading();
          util.showTip('支付成功');
          that.setData({
            showSuccess: true
          })
          that.startCountdown()
        }
      },
      fail: function (err) {
        util.showTip('支付失败');
        wx.hideLoading();
      }
    });
  },
  goOrder:function(){
    wx.switchTab({
      url: '../order/order',
    })
  },
  // 倒计时
  // 倒计时结束之后会跳到订单页面
  // 如果倒计时未结束，用户手动点击跳转页面，这里的goOrder方法也会触发，只是说，没有意义，不会再跳转
  startCountdown(){
    var that = this
    var Countdown = that.data.Countdown
    var Interval = setInterval(function(){
      if (Countdown > 1){
        Countdown--
        that.setData({
          Countdown: Countdown
        })
      }else{
        console.log('倒计时结束')
        clearInterval(Interval)
        that.goOrder()
      }
    },1000)
  },
  /*==========
  防止快速点击
  ===========*/
  clickTooFast: function (data) {
    var lastTime = this.data.lastTime
    var curTime = data.e.timeStamp
    if (lastTime > 0) {
      if (curTime - lastTime < 600) {
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
  },
  //如果直接返回上一页面，需要提醒用户是否放弃本次交易，然后跳过提交订单页面，返回至商家页面
  // onUnload: function () {
  //   // 页面关闭
  //   wx.showModal({
  //     title: '提醒',
  //     content: '是否放弃此次交易？',
  //     success: function (res) {
  //       if (res.confirm) {
  //         var pages = getCurrentPages()
  //         var prevPage = pages[pages.length - 1]
  //         var prevPrevPage = pages[pages.length - 2]
  //         prevPage.onUnload()
  //         prevPrevPage.onLoad({ seller_id:7})
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // }
})