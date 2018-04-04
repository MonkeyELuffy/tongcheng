// pages/dingdanxiangqing/dingdanxiangqing.js
//导入js
var network = require("../../utils/network.js")
var util = require('../../utils/util.js'); 
var basic = require('../../utils/basic.js'); 
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remark:'',
    imgHttp: app.globalImageUrl,
    ship_phone: '',
    ship_name:'',
    typeList:[{
      text:'快递配送',
      checked:true,
    },{
        text: '到店自提',
        checked: false,
    }],
    checked: '../../img/moren.png',
    unchecked:'../../img/unCheckedImg.png',
    more:'../../img/more.png',
    // 收货方式
    shouhuoType: '到店取货-取货地址',
    //到店取货时，取货人信息
    userMsg: [{ name: '取货人姓名', value: '张三丰' }, { name: '取货人手机号', value: '18888888888' }],
    // 自提地址
    address: {},
    seemore: '../../img/logo.png',
    //结算的商品
    jiesuan: [],         // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
    isjiesuan: false,
    count: 1,   //商品数量默认是1
    total: 0,    //总金额
    goodsCount: 0, //数量
    // 订单数据
    order_data: {
      zhekouList: [{ name: '优惠券折扣', value: '0' }, { name: '活动折扣', value: '0' }],
      //实际付款
      shijifukuan: '0.01',
      yunfei: '0',
      totalPrice: '',
      goods_id: 0,
      num: 1,
      ordersn: 'TC3425324895739047',
      goods: [],
      all_price: 0,
      btns: [ { name: '提交订单', bgColor: 'rgb(246,127,121)' }]
    },
    showTable: false,
  },
  onShow: function () {
    //orderData放在全局变量里面而不是用路径传参的方式；
    //因为在当前页面可以进入选择地址和选择优惠券页面，在对应页面修改地址和优惠券的之后需要刷新数据，但是又不能用wx.navigateTo()这个API回来
    //所在商家店铺、选地址、选优惠券这三个地方请求了最新的orderData数据，都放在全局，然后在此处获取
    var orderData = app.globalData.orderData
    if (orderData){
      var typeList = this.data.typeList
      typeList[0].checked = (orderData.address.ship_type == 2)
      typeList[1].checked = (orderData.address.ship_type == 1)
      console.log(orderData)
      // 计算房间数和总价
      var dataTotalQuantity = 0
      var dataTotalPrice = 0
      for (var i in orderData.goods_item){
        dataTotalPrice += parseFloat(orderData.goods_item[i].goods_price) * parseInt(orderData.goods_item[i].quantity)
        dataTotalQuantity += parseInt(orderData.goods_item[i].quantity)
      }
      this.setData({
        orderData: orderData,
        typeList: typeList,
        dataTotalQuantity: dataTotalQuantity,
        dataTotalPrice: dataTotalPrice,
        ship_type: orderData.address.ship_type,
        ship_name: orderData.address.ship_name,
        ship_phone: orderData.address.ship_phone,
      })
    }
  },
  chooseType:function(e){
    var index = e.currentTarget.dataset.index
    var typeList = this.data.typeList
    for (var i in typeList){
      typeList[i].checked = false
    }
    typeList[index].checked = true
    this.setData({
      typeList: typeList
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
  //点击提交订单
  clickBtn: function (e) {
    var that = this
    var go = function (e) {
      var orderData = that.data.orderData
      //到店自提时必须填写取货人姓名电话
      if (that.data.ship_name.replace(/(^\s*)|(\s*$)/g, "").length == 0){
        wx.showModal({
          title: '提醒',
          content: '请填写您的姓名',
        })
        return
      }
      if (!basic.checkedPhone(that.data.ship_phone)){
        wx.showModal({
          title: '提醒',
          content: '请填写手机号码',
        })
        return
      }
      var data = {
        buy_key: orderData.buy_key,
        ship_type: 1,
        ship_name: that.data.ship_name,
        ship_phone: that.data.ship_phone,
        differ: 2,
        cpns_id: that.data.cpns_id,
        order_from: 'h5',
        remark: that.data.remark,
        token: app.globalData.userInfo.token
      }
      // 发送提交订单请求
      util.httpPost(app.globalUrl + app.ORDERSUBMIT, data, that.processSubmitData);
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  processSubmitData:function(res){
    if (res.suc == 'y') {
      console.log('提交订单成功', res.data);
      //成功之后需要清空app.globalData.orderData
      app.globalData.orderData = null
      wx.navigateTo({
        url: "../pay/pay?order_id=" + res.data.order_id
      });
    } else {
      console.log('提交订单错误', res);
    }
  },
  // 输入备注
  input: function (e) {
    var remark = e.detail.value
    this.setData({
      remark: remark
    })
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