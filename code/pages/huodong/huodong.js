
var util = require('../../utils/util.js');
var dataItemTemp = require('../../utils/dataItemTemp.js');
var app = getApp()
Page({
  data: {
    dataList: [],
  },
  onLoad() {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    util.httpPost(app.globalUrl + app.ActiveList, {}, that.processData);
  },
  processData(res) {
    if (res.suc == 'y') {
      var dataList = this.data.dataList
      console.log('获取ActiveList成功', res.data);
      if ((res.data instanceof Array && res.data.length < 15) || (res.data == '')) {
        this.setData({
          showNomore: true
        })
      }
      for (var i in res.data) {
        res.data[i].img_url = app.globalImageUrl + res.data[i].img_url
      }
      //获取数据之后需要改变page和totalPage数值，保障上拉加载下一页数据的page值，其余没有需要修改的数据
      dataList = dataList.concat(res.data)
      this.setData({
        dataList: dataList,
      })
    } else {
      console.log('获取ActiveList错误', res);
    }
  },
  //进入详情
  clickItem: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item
    var link = e.currentTarget.dataset.item.link
    if (link.includes('index')){
      wx.switchTab({
        url: link,
      })
    }
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
