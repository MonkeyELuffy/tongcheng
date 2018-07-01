// pages/articleList/articleList.js
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    dataList:[]
  },
  onLoad: function (options) {
    let cat_id = options.cat_id
    let title = options.title
    wx.setNavigationBarTitle({
      title: title,
    })
    util.httpPost(app.globalUrl + app.ArticleList, { cat_id: cat_id }, this.processArticleListData);
  },
  processArticleListData(res) {
    if (res.suc == 'y') {
      let dataList = res.data
      for (let i in dataList){
        dataList[i].img_src = app.globalImageUrl + dataList[i].img_src
      }
      this.setData({
        dataList: dataList
      })
    }
  },
  //进入文章详情
  goDetail(e) {
    let item = e.currentTarget.dataset.item
    var go = function (e) {
      wx.navigateTo({
        url: '../articleDetail/articleDetail?id=' + item.id
      })
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
})