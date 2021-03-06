// pages/gonglve/gonglve.js
var util = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.httpPost(app.globalUrl + app.GongLve, {}, this.processGongLveData);
  },
  processGongLveData(res){
    if(res.suc == 'y'){
      let dataList = res.data
      let keys = Object.keys(dataList)
      let newList = []
      for(let i in keys){
        let menusItem = {
          title: keys[i],
          menusList: dataList[keys[i]]
        }
        newList.push(menusItem)
      }
      this.setData({
        dataList: newList
      })
    }
  },
  chooseType(e){
    let item = e.currentTarget.dataset.item
    var go = function (e) {
      wx.navigateTo({
        url: '../articleList/articleList?cat_id=' + item.id + '&title=' + item.cat_name
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