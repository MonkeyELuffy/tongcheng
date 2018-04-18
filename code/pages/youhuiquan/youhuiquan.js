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
    console.log('可领取')
    var item = e.target.dataset.item
    var index = e.target.dataset.index
    var dataList = this.data.dataList
    dataList[index].status = 1
    this.setData({
      dataList: dataList
    })
  },
})