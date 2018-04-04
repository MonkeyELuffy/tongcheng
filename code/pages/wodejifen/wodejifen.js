// pages/cashOutDetail/cashOutDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 明细
    dataList: [{
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
      name: '购买商品',
      value: '10.00',
      time: '2017-05-20 13:01',
    }, {
        name: '购买商品',
        value: '101.00',
        time: '2017-05-20 13:01',
    }],
    jifen: 1200
  },

  onLoad: function () {
    var that = this;
    //数据初始化
    that.setData({
      bindDownLoad: true,
      page: 0,
    })
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    //加载数据
    // that.loadData()
  },
})