// pages/yudingpiaowu/yudingpiaowu.js
let util = require('../../utils/util.js');
let basic = require('../../utils/basic.js');
let app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:{}
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
    if (res.suc == 'y') {
      console.log('预定门票成功', res.data);
      this.setData({
        orderInfo:res.data
      })
    } else {
      console.log('预定门票错误', res);
    }
  },
  //确定订单
  submitOrder(e) {
    var that = this
    var page = 'piaowu_pay'
    let orderInfo = this.data.orderInfo
    let params = { orderInfo }
    basic.goPage(page, that, e, params)
  },
})