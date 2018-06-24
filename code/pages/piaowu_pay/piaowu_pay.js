// pages/piaowu_pay/piaowu_pay.js
let util = require('../../utils/util.js');
let basic = require('../../utils/basic.js');
let app = getApp(); 
// 票务预定支付页面
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addImg: '../../img/add.png',
    subImg: '../../img/sub.png',
    more: '../../img/more.png',
    dateList: [
      {
        text: '今天',
        dateText: '2月22号',
        checked:true,
        index:0
      },
      {
        text: '明天',
        dateText: '2月23号',
        checked: false,
        index: 1
      },
      {
        text: '后天',
        dateText: '2月24号',
        checked: false,
        index: 2
      },
      {
        text: '其他',
        dateText: '',
        checked: false,
        index: 3
      },
    ],
    prizeNum: 260,
    youhuiquanValue:'10.00',
    // 获取当前页面订单的具体数据
    orderInfo: { goods_item: [{ quantity:1}]},
    //上一页传递过来的订单介绍
    orderDes:{},
    ship_name: '',
    ship_phone:'',
    time:'2018-06-25',
  },
  onLoad: function (options) {
    let params = JSON.parse(options.params)
    console.log(params)
    this.setData({
      orderDes: params.orderDes
    })
    // 确认订单数据
    this.getOrderInfo(params.orderDes)
  },
  onShow() {
    
  },
  getOrderInfo(params){
    let data = {
      buy_key: params.product_id + '_' + this.data.orderInfo.goods_item[0].quantity || 1,
      member_id: app.globalData.member_id,
      time:this.data.time,
      cpns_id: wx.getStorageSync('cpns_id')
    }
    util.httpPost(app.globalUrl + app.TicketConfirmInfo, data, this.processTicketConfirmInfoData);
  },
  processTicketConfirmInfoData(res) {
    if (res.suc == 'y') {
      console.log('订单数据成功', res.data);
      this.setData({
        orderInfo: res.data
      })
    } else {
      console.log('订单数据错误', res);
    }
  },
  //支付
  pay(e){

    let data = {
      buy_key: this.data.orderInfo.goods_item[0].product_id + '_' + this.data.orderInfo.goods_item[0].quantity,
      member_id: app.globalData.member_id,
      time: '2018-06-25',
      cpns_id: this.data.orderInfo.cpns_info.cpns_id,
      ship_name: this.data.ship_name,
      ship_phone: this.data.ship_phone,
      order_from: 'h5',
      token: app.globalData.userInfo.token
    }
    util.httpPost(app.globalUrl + app.TicketOrderSubmit, data, this.processTicketOrderSubmitData);
  },
  processTicketOrderSubmitData(res) {
    if (res.suc == 'y') {
      console.log('提交订单成功', res.data);
      wx.navigateTo({
        url: "../pay/pay?order_id=" + res.data.order_id
      });
    } else {
      console.log('提交订单错误', res);
    }
  },
  // 输入取货人姓名
  inputName: function (e) {
    var ship_name = e.detail.value
    this.setData({
      ship_name: ship_name
    })
  },
  // 输入取货人手机号
  inputPhone: function (e) {
    var ship_phone = e.detail.value
    this.setData({
      ship_phone: ship_phone
    })
  },
  // 选择优惠券
  chooseYouhui:function(e){
    var that = this
    var go = function (e) {
      wx.navigateTo({
        url: "../youhuiquanlingqu/youhuiquanlingqu"
      });
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  //选择日期
  chooseDate(e){
    let item = e.currentTarget.dataset.item
    if (item.text == '其他'){
      wx.navigateTo({
        url: '../../pages/chooseDate/chooseDate',
      })
    }else{
      let dateList = this.data.dateList
      for (let i in dateList){
        dateList[i].checked = false
      }
      dateList[item.index].checked = true
      this.setData({
        dateList: dateList
      })
    }
  },
  //减少数量
  subNum(e) {
    var that = this
    var go = function (e) {
      if (that.data.orderInfo.goods_item[0].quantity > 1) {
        that.data.orderInfo.goods_item[0].quantity += -1
        //重新获取订单数据
        that.getOrderInfo(that.data.orderDes)
      }
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  //增加数量
  addNum(e) {
    var that = this
    var go = function (e) {
      that.data.orderInfo.goods_item[0].quantity += 1
      //重新获取订单数据
      that.getOrderInfo(that.data.orderDes)
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