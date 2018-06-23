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
        checked:true
      },
      {
        text: '明天',
        dateText: '2月23号',
        checked: false
      },
      {
        text: '后天',
        dateText: '2月24号',
        checked: false
      },
      {
        text: '其他',
        dateText: '',
        checked: false
      },
    ],
    prizeNum: 260,
    num: 1,
    youhuiquanValue:'10.00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let params = JSON.parse(options.params)
    console.log(params)
    // 确认订单数据
    this.orderInfo(params.orderInfo)
  },
  onShow(){

  },
  orderInfo(params){
    let data = {
      buy_key: params.product_id + '_1',
      member_id: app.globalData.member_id,
      time:'2018-06-25',
      cpns_id: ''
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
      buy_key: this.data.orderInfo.goods_item[0].product_id + '_1',
      member_id: app.globalData.member_id,
      time: '2018-06-25',
      cpns_id: this.data.orderInfo.cpns_info.cpns_id,
      ship_name: '林健',
      ship_phone: '18161295713',
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
})