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
    console.log('item',item)
    wx.showModal({
      title: '提示',
      content: '该功能尚待完善，敬请期待',
    })
  }
})