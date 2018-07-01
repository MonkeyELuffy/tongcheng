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
        dateText: '',
        checked:true,
        index:0
      },
      {
        text: '明天',
        dateText: '',
        checked: false,
        index: 1
      },
      {
        text: '后天',
        dateText: '',
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
    time:'',
  },
  onLoad: function (options) {
    let params = JSON.parse(options.params)
    console.log(params)
    this.setData({
      orderDes: params.orderDes,
      time: this.getEnterAndLeaveDate_2(0)
    })
    wx.setStorageSync('newCpnsId', '')
    // 确认订单数据
    this.getOrderInfo(params.orderDes)
    this.getNowDate()
  },
  onShow() {
    //获取选择的预定时间
    let chooseDate = wx.getStorageSync('chooseDate') || ''
    let chooseDateText = wx.getStorageSync('chooseDateText') || ''
    let changeData = wx.getStorageSync('changeData') || false
    let newCpnsId = wx.getStorageSync('newCpnsId') || ''
    let changeCpnsId = wx.getStorageSync('changeCpnsId') || false
    if (changeData){
      // 判断是否是其他日期
      let showDate = false
      let idnex = 0
      for (let i in this.data.dateList){
        if (chooseDateText == this.data.dateList[i].dateText){
          showDate = false
          idnex = i
          break
        }
        showDate = true
      }
      if (showDate){
        this.data.dateList[3].dateText = chooseDateText
        this.data.dateList[3].time = chooseDate
      }else{
        this.data.dateList[3].dateText = ""
        this.data.dateList[3].time = ""
        for (let i in this.data.dateList) {
          this.data.dateList[i].checked = false
        }
        this.data.dateList[idnex].checked = true
      }
      this.setData({
        time: chooseDate,
        dateList: this.data.dateList
      })
      wx.setStorageSync('changeData', false)
      wx.setStorageSync('chooseDate', '')
      wx.setStorageSync('chooseDateText', '')
      this.getOrderInfo(this.data.orderDes)
    } else if (changeCpnsId){

      wx.setStorageSync('changeCpnsId', false)
      this.getOrderInfo(this.data.orderDes)
    }else{
      // 没有改变预定时间说明是直接返回本页
      // 不需要重新请求数据，但是顶部的日期样式要变回来
      for (let i in this.data.dateList) {
        if (this.data.time == this.data.dateList[i].time) {
          this.data.dateList[i].checked = true
        }else{
          this.data.dateList[i].checked = false
        }
      }
      console.log('??')
      this.setData({
        dateList: this.data.dateList
      })
    }
  },
  getNowDate(){
    let day_1 = this.getEnterAndLeaveDate(0)
    let time_1 = this.getEnterAndLeaveDate_2(0)
    let day_2 = this.getEnterAndLeaveDate(1)
    let time_2 = this.getEnterAndLeaveDate_2(1)
    let day_3 = this.getEnterAndLeaveDate(2)
    let time_3 = this.getEnterAndLeaveDate_2(2)
    let dateList = this.data.dateList
    dateList[0].dateText = day_1
    dateList[0].time = time_1
    dateList[1].dateText = day_2
    dateList[1].time = time_2
    dateList[2].dateText = day_3
    dateList[2].time = time_3
    this.setData({
      dateList: dateList
    })
  },
  getEnterAndLeaveDate(AddDayCount) {
    let dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1;//获取当前月份的日期
    let d = dd.getDate();
    return m + "月" + d + '日';
  },
  getEnterAndLeaveDate_2(AddDayCount) {
    let dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1;//获取当前月份的日期
    m = m > 10 ? m : '0' + m
    let d = dd.getDate();
    d = d > 10 ? d : '0' + d
    return y + "-" + m + "-" + d;
  },
  getOrderInfo(params){
    let data = {
      buy_key: params.product_id + '_' + this.data.orderInfo.goods_item[0].quantity || 1,
      member_id: app.globalData.member_id,
      time:this.data.time,
      cpns_id: wx.getStorageSync('newCpnsId') || ''
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
      wx.showModal({
        title: '提醒',
        content: res.msg,
      })
    }
  },
  //支付
  pay(e) {
    if (!basic.checkNull(this.data.ship_name)) {
      wx.showToast({
        title: '请输入姓名',
      })
      return
    }
    if (!basic.checkedPhone(this.data.ship_phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
      })
      return
    }
    let data = {
      buy_key: this.data.orderInfo.goods_item[0].product_id + '_' + this.data.orderInfo.goods_item[0].quantity,
      member_id: app.globalData.member_id,
      time: this.data.time,
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
      app.globalData.orderData = that.data.orderInfo
      app.globalData.orderData.time = that.data.time
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
    let dateList = this.data.dateList
    for (let i in dateList) {
      dateList[i].checked = false
    }
    dateList[item.index].checked = true
    if (item.text == '其他') {
      wx.navigateTo({
        url: '../../pages/chooseDate/chooseDate?product_id=' + this.data.orderInfo.goods_item[0].product_id,
      })
    }else{
      dateList[3].dateText = ''
      dateList[3].time = ""
      this.setData({
        time: dateList[item.index].time,
        dateList: dateList,
      })
      //重新获取订单数据
      this.getOrderInfo(this.data.orderDes)
    }
    this.setData({
      dateList: dateList
    })
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
  },
  onUnload(){
    wx.setStorageSync('newCpnsId', '')
  }
})