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
    httpUrl: app.globalImageUrl,
    btns_1: [{ name: '取消订单', bgColor: '#d8d8d8' }, { name: '付款', bgColor: 'rgb(246,127,121)' }],
    btns_2: [{ name: '联系商家', bgColor: 'rgb(246,127,121)' },{ name: '确认收货', bgColor: 'rgb(246,127,121)' }],
    btns_3: [{ name: '评价', bgColor: 'rgb(246,127,121)' }],
    btns_4: [],
    btns: [],
  },
  onLoad: function (options) {
    var that = this
    var res = JSON.parse(options.res)
    console.log('res', res);
    this.setData({
      order_id: res.data.order_id,
    })
    that.processOrderData(res)
    //获取订单详情
    // util.httpPost(app.globalUrl + app.getCityOrderInfoById, { order_id: order_id }, that.processOrderData);
  },
  processOrderData: function (res) {
    if (res.suc == 'y') {
      console.log('获取订单详情成功', res.data);
      //根据订单状态展示不同的按钮组
      var btns;
      switch (res.data.type) {
        case '1':
          btns = this.data.btns_1;
          break;
        case '2':
          btns = this.data.btns_2;
          break;
        case '3':
          btns = this.data.btns_3;
          break;
        case '4':
          btns = this.data.btns_4;
          break;
      }
      // 计算房间数和总价
      var dataTotalQuantity = 0
      var dataTotalPrice = 0
      for (var i in res.data.items_list) {
        dataTotalPrice += parseFloat(res.data.items_list[i].goods_price) * parseInt(res.data.items_list[i].goods_number)
        dataTotalQuantity += parseInt(res.data.items_list[i].goods_number)
      }
      this.setData({
        orderDetail: res.data,
        dataTotalQuantity: dataTotalQuantity,
        dataTotalPrice: dataTotalPrice,
        btns: btns
      })
    } else {
      console.log('获取订单详情错误', res);
    }
  },
  // 删除订单
  del_order: function () {
    let _this = this
    var params = new Object()
    params.api_name = "/interfaces/info/del_order"
    params.ordersn = "1502178152718959"
    network.GET(
      {
        params: params,
        success: function (res) {
          console.log(res.data)
        }
      })
  },
  //评价
  pingjia: function (e) {
    var that = this
    function go(e) {
      var pingjia_goods_id = e.target.dataset.goodsid
      var pingjia_ordersn = e.target.dataset.ordersn
      var index = e.target.dataset.index
      var pingjia_goods = that.data.order_data.goods[index]
      wx.setStorageSync('pingjia_ordersn', pingjia_ordersn)
      wx.setStorageSync('pingjia_goods_id', pingjia_goods_id)
      wx.setStorageSync('pingjia_goods', pingjia_goods)
      wx.navigateTo({
        url: "../pingjia/pingjia"
      });
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  processCancelOrder(res) {
    var that = this
    if (res.suc == 'y') {
      console.log('取消订单成功', res.data);
      wx.showToast({
        title: res.msg,
      })
      setTimeout(function () {
        wx.navigateBack()
      }, 1000)
    } else {
      console.log('操作订单错误', res);
      wx.showToast({
        title: res.msg,
      })
    }
  },
  processReceiptOrder(res) {
    var that = this
    if (res.suc == 'y') {
      console.log('收货成功', res.data);
      wx.showToast({
        title: res.msg,
      })
      setTimeout(function () {
        wx.navigateBack()
      }, 1000)
    } else {
      console.log('收货错误', res);
      wx.showToast({
        title: res.msg,
      })
    }
  },
  clickBtn: function (e) {
    var that = this
    var go = function (e) {
      if (e.target.dataset.page === '取消订单') {
        wx.showModal({
          title: '提醒',
          content: '取消订单？',
          success: function (res) {
            if (res.confirm) {
              var order_id = that.data.order_id
              console.log('取消订单id', order_id)
              util.httpPost(app.globalUrl + app.cancelOrderById, { order_id: order_id }, that.processCancelOrder);
            }
          }
        })
      }
      if (e.target.dataset.page === '确认收货') {
        wx.showModal({
          title: '提醒',
          content: '确认收货？',
          success: function (res) {
            if (res.confirm) {
              var order_id = e.target.dataset.order_id
              console.log('订单id', order_id)
              util.httpPost(app.globalUrl + app.confirmReceipt, { order_id: order_id }, that.processReceiptOrder);
            }
          }
        })
      }
      if (e.target.dataset.page === '付款') {
        wx.navigateTo({
          url: "../pay/pay?order_id=" + e.target.dataset.order_id
        });
      }
      if (e.target.dataset.page === '评价') {
        var item = JSON.stringify(e.target.dataset.item)
        wx.navigateTo({
          url: "../pingjia/pingjia?item=" + item
        });
      }
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