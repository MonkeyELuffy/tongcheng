// pages/address/address.js
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    edit: '../../img/address_con_edit.png',
    del: '../../img/address_con_delete.png',
    checkedImg: '../../img/moren.png',
    unCheckedImg:'../../img/unCheckedImg.png',
    address: [],
  },
  onShow:function(){
    var data = {
      member_id: app.globalData.member_id
    }
    //请求用户地址
    util.httpPost(app.globalUrl + app.GETADDRESS, data, this.processAddrData);
  },
  processAddrData: function (res) {
    if (res.suc == 'y') {
      console.log('获取用户地址成功', res.data);
      var address = res.data.list
      for (var i in address){
        address[i].checked = address[i].status == '1' ? true : false
      }
      this.setData({
        address: address
      })
    } else {
      console.log('获取用户地址错误', res);
    }
  },
  // 选择地址
  // 如果用户的从订单页面跳转过来，则可以选择地址；
  // 如果是从管理地址进来的，则点击没有效果；
  // 选择地址之后调用接口，重新获取订单数据，然后返回
  choose: function (e) {
    var that = this
    var go = function (e) {
      if (app.globalData.enterAddressFromOrder){
        //地址id
        var id = e.currentTarget.dataset.id;
        // 返回之前修改app.globalData.enterAddressFromOrder
        app.globalData.enterAddressFromOrder = false;
        var params = {
          address_id: id,
          // 此时需要修改ship_type，告诉后台当前的ship_type值为快递配送，而不是到店自提；
          ship_type: 2,
          token: app.globalData.userInfo.token,
          buy_key: app.globalData.buy_key
        }
        util.httpPost(app.globalUrl + app.CONFIRMINFO, params, that.processSubmitData);
      }
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  processSubmitData: function (res) {
    if (res.suc == 'y') {
      console.log('获取最新订单数据成功', res.data);
      this.goPayPage(res.data)
    } else {
      console.log('获取最新订单数据错误', res);
      wx.showModal({
        title: '提醒',
        content: res.msg,
      })
    }
  },
  //返回结算页面
  goPayPage: function (orderData) {
    var that = this
    app.globalData.orderData = orderData
    wx.navigateBack()
  },
  addAdderss: function (e) {
    var that = this
    var go = function (e) {
      wx.navigateTo({
        url: "../add_address/add_address" 
      })
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  //修改地址
  editAddress: function (e) {
    var that = this
    var go = function (e) {
      var item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: '../editAddress/editAddress?item=' + JSON.stringify(item)
      })
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  //删除地址
  delAddress: function (e) {
    var that = this
    var go = function(e) {
      var item = e.currentTarget.dataset.item
      var address = that.data.address
      wx.showModal({
        title: '确认删除',
        content: '是否删除选中地址？',
        success: function (res) {
          if (res.confirm) {
            var params = {
              member_id: app.globalData.member_id,
              address_id: item.id
            }
            util.httpPost(app.globalUrl + app.DELADDRESS, params, that.processDelData);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  processDelData(res){
    if (res.suc == 'y') {
      console.log('删除用户地址成功', res.data);
      this.onShow();
    } else {
      console.log('删除用户地址错误', res);
    }
  },
  chooseMoRen(e) {
    var that = this
    var go = function (e) {
      var item = e.currentTarget.dataset.item
      if (!item.checked){
        var params = {
          member_id: app.globalData.member_id,
          address_id: item.id
        }
        util.httpPost(app.globalUrl + app.EXAMINEADDRESS, params, that.processExamineData);
      }
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  processExamineData(res) {
    if (res.suc == 'y') {
      console.log('切换用户地址成功', res.data);
      this.onShow();
    } else {
      console.log('切换用户地址错误', res);
    }
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