// pages/recharge/recharge.js
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    // 充值类型
    rechargeType:[{name:'微信',id:0,img:'../../img/weixin.png'}],
    //充值金额选项
    rechargeItem: [{num: '10元',
      selected: true,
      amount:10
    }, {
      num: '20元',
      selected: false,
      amount: 20
      }, {
        num: '50元',
        selected: false,
        amount: 50
    }, {
      num: '100元',
      selected: false,
      amount: 100
      }, {
        num: '200元',
        selected: false,
        amount: 200
    }, {
      num: '500元',
      selected: false,
      amount: 500
    }],
    // 充值明细
    rechargeDetailItem: [{
      time: '2017-05-20 13:01',
      num: 10
    }, {
      time: '2017-05-20 13:01',
      num: 10
      }, {
        time: '2017-05-20 13:01',
        num: 10
    }, {
      time: '2017-05-20 13:01',
      num: 10
      }, {
        time: '2017-05-20 13:01',
        num: 10
      }],
  },
  /* 选择充值金额 */
  chooseNum: function(e) {
    var index = e.target.dataset.index
    var rechargeItem = this.data.rechargeItem
    for (var i = 0; i < rechargeItem.length; i++ ) {
      rechargeItem[i]["selected"] = false;
    }
    rechargeItem[index]["selected"] = true
    var amount = rechargeItem[index].amount
    console.log('用户选择了', rechargeItem[index]["num"],'的充值金额')
    this.setData({
      amount: amount,
      rechargeItem: rechargeItem,
    })
  },
  input(e){
    var amount =e.detail.value
    this.setData({
      amount: amount
    })
  },
  submit(e) {
    var that = this
    var go = function (e) {
      if (that.data.amount > 0) {
        var data = {
          member_id: app.globalData.member_id,
          amount: that.data.amount
        }
        wx.showLoading({
          title: '正在充值',
          mask: true
        })
        util.httpPost(app.globalUrl + app.Charge, data, that.processPayData);
      }
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  //去调微信支付
  processPayData: function (res) {
    if (res.suc == 'y') {
      console.log('支付成功', res.data);
      var that = this;
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
              amount: null
            })
            // 支付成功之后重新请求userInfo
            that.getUserInfoByMemberId()
          }
        },
        fail: function (err) {
          util.showTip('支付失败');
          wx.hideLoading();
        }
      });
    } else {
      wx.hideLoading();
      wx.showToast({
        title: res.msg,
      })
    }
  },
  getUserInfoByMemberId(){
    util.httpPost(app.globalUrl + app.GetUserInfoByMemberId, {member_id:app.globalData.member_id}, this.processRefreshData);
  },
  processRefreshData(res) {
    if (res.suc == 'y') {
      console.log('userInfo', res.data)
      app.globalData.userInfo = res.data;
      app.globalData.userInfo.token = res.data.id;
      wx.hideLoading()
      //返回个人中心
      wx.switchTab({
        url: "../mine/mine",
      })
    }else{
      // 返回个人中心
      wx.switchTab({
        url: "../mine/mine",
      })
    }
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