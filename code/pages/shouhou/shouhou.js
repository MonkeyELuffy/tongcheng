var app = getApp()
Page({
  data: {
    checkedImg: '../../img/moren.png',
    unCheckedImg: '../../img/unCheckedImg.png',
    usedImg:'../../img/used.png',
    //返回分页数据的总页数
    total_page:1,
    dataList: [
      {
        img: '../../img/test.png',
        name: '商务大床房',
        price: 390,
        num: 1
      },
      {
        img: '../../img/test.png',
        name: '商务大床房',
        price: 390,
        num: 1
      },
    ],
    total:780,
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
    //加载文章列表数据
    // that.loadData()
  },
  tuikuan:function(){
    wx.showModal({
      title: '提醒',
      content: '该订单使用了代金券，退款的话代金券不返还哦~确定要退吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          setTimeout(function(){
            wx.redirectTo({
              url: '../orderDetail/orderDetail'
            })
          },600)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /*==========
  防止快速点击
  ===========*/
  clickTooFast: function (data) {
    var lastTime = this.data.lastTime
    var curTime = data.e.timeStamp
    if (lastTime > 0) {
      if (curTime - lastTime < 500) {
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

})
