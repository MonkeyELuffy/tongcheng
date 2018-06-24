// pages/yudingpiaowu/yudingpiaowu.js
let util = require('../../utils/util.js');
let basic = require('../../utils/basic.js');
var WxParse = require('../../wxParse/wxParse.js');
let app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDes: {},
    guanzhu_0: '../../img/guanzhu0.png',
    guanzhu_1: '../../img/guanzhu1.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let item = JSON.parse(options.params)
    this.yuding(item)
  },
  //预定门票
  yuding(item) {
    let product_id = item.product_id
    let goods_id = item.goods_id
    let data = {
      member_id: app.globalData.member_id,
      goods_id: goods_id,
      product_id: product_id,
    }
    util.httpPost(app.globalUrl + app.TicketBook, data, this.processTicketBookData);
  },
  processTicketBookData(res) {
    let that = this
    if (res.suc == 'y') {
      console.log('预定门票成功', res.data);
      let content = ''
      for (let i in res.data.list) {
        content = res.data.list[i].explain_content
        WxParse.wxParse('article' + i, 'html', content, that, 5);
        res.data.list[i].article = this.data['article'+i]
      }
      this.setData({
        orderDes:res.data
      })
    } else {
      console.log('预定门票错误', res);
    }
  },
  //确定订单
  submitOrder(e) {
    var that = this
    var page = 'piaowu_pay'
    let orderDes = this.data.orderDes
    let params = { orderDes }
    basic.goPage(page, that, e, params)
  },
  //关注或者取消关注商品
  payAttention() {
    var url = ''
    if (this.data.orderDes.status == 1) {
      //已关注时点击，则取消关注
      url = 'CancelPayAttention'
    } else {
      url = 'PayAttention'
    }
    var data = {
      type: 2, //类型(1商家，2商品)
      member_id: app.globalData.member_id,
      product_id: this.data.orderDes.product_id,
      goods_id: this.data.orderDes.goods_id,
    }
    util.httpPost(app.globalUrl + app[url], data, this.processPayAttentionData);
  },
  processPayAttentionData: function (res) {
    if (res.suc == 'y') {
      if (this.data.orderDes.status == 1) {
        this.setData({
          'orderDes.status': 0
        })
        wx.showToast({
          title: '取消收藏成功',
        })
      } else {
        this.setData({
          'orderDes.status': 1
        })
        wx.showToast({
          title: '收藏成功',
        })
      }
    } else {
      // console.log('关注错误', res);
      wx.showModal({
        title: '提醒',
        content: res.msg,
      })
    }
  },
})