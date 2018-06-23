// pages/youhuiquan/youhuiquan.js
var util = require('../../utils/util.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    dataList: []
  },
  onLoad(options) {
    var params = {
      member_id: app.globalData.member_id
    }
    util.httpPost(app.globalUrl + app.CouponList, params, this.processCouponListData);
  },
  processCouponListData(res) {
    if (res.suc == 'y') {
      console.log('获取优惠券list成功', res.data);
      if ((res.data instanceof Array && res.data.length < 15) || (res.data == '')) {
        this.setData({
          showNomore: true
        })
      }
      this.setData({
        dataList: res.data,
      })
    } else {
      console.log('获取优惠券list错误', res);
    }
  },
  lingqu: function (e) {
    var that = this
    var index = e.target.dataset.index
    var params = {
      member_id: app.globalData.member_id,
      balance_id: e.target.dataset.item.balanceid
    }
    // 领取优惠券
    util.httpPost2(app.globalUrl + app.GetCoupon, params)
      .then(function (res) { that.processGetCouponData(res, index) });
  },
  processGetCouponData(res, index) {
    if (res.suc == 'y') {
      console.log('领取优惠券成功', res.data);
      var dataList = this.data.dataList
      console.log(index)
      dataList[index].is_get = 1
      this.setData({
        dataList: dataList
      })
      console.log(dataList)
    } else {
      console.log('领取优惠券错误', res);
    }
  },
})