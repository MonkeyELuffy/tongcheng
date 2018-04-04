// pages/dingdanxiangqing/dingdanxiangqing.js
//导入js
var network = require("../../utils/network.js")
var util = require('../../utils/util.js');
const app = getApp()
Page({
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
    seemore: '../../img/logo.png',
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
      this.setData({
        orderData: orderData,
        typeList: typeList,
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
  //快递配送时选择收货地址
  chooseAddr:function(e){
    var that = this
    var go = function (e) {
      // 0选中代表是快递配送，否则是到店自提
      if (that.data.typeList[0].checked) {
        // enterAddressFromOrder字段用地址页面判断是否是从订单页面跳转过去的
        // 不用页面传参是因为地址页面只有onShow没有onLoad，不可以接收参数
        // buy_key同理
        app.globalData.enterAddressFromOrder = true;
        // 后台传过来的buy_key后面多了一个@from_cart，需要去除掉
        app.globalData.buy_key = that.data.orderData.buy_key.replace("@from_cart", "");
        wx.navigateTo({
          url: "../address/address"
        });
      }
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  //点击提交订单
  clickBtn: function (e) {
    var that = this
    var go = function (e) {
      var ship_type,data
      // 1=到店自提 2=送货上门
      if(that.data.typeList[0].checked){
        ship_type = 2
      }else{
        ship_type = 1
      }
      var orderData = that.data.orderData
      //到店自提时必须填写取货人姓名电话
      if (ship_type == 1 && (that.data.ship_phone == '' || that.data.ship_name == '')){
        console.log('到店自提时必须填写取货人姓名电话')
        wx.showModal({
          title: '提醒',
          content: '到店自提时必须填写取货人姓名电话',
        })
        return
      }
      data = {
        buy_key: orderData.buy_key,
        ship_type: ship_type,
        ship_name: that.data.ship_name,
        ship_phone: that.data.ship_phone,
        address_id: orderData.address.address_id,
        cpns_id: that.data.cpns_id,
        differ: 1,
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