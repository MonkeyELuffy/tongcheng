// pages/index2/index2.js
const util = require('../../utils/util.js');
const config = require('../../utils/config.js');
const bannerTemp = require('../../utils/bannerTemp.js');
const basic = require('../../utils/basic.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    more: '../../img/more.png',
    best_list:[],
    slider: [],
    list_1: [],
    nav_1: {
      name: '千岛湖之夜',
      des: '体验科幻之夜',
      color: 'red',
      img: '../../img/banner.png'
    },
    nav_2: {
      name: '千岛湖之夜',
      des: '体验科幻之夜',
      color: 'blue',
      img: '../../img/banner.png'
    },
    nav_3: {
      name: '千岛湖之夜',
      des: '体验科幻之夜',
      color: 'green',
      img: '../../img/banner.png'
    },
    nav_4: {
      name: '千岛湖之夜',
      des: '体验科幻之夜',
      color: 'red',
      img: '../../img/banner.png'
    },
    nav_5: {
      name: '千岛湖之夜',
      des: '体验科幻之夜',
      color: 'green',
      img: '../../img/banner.png'
    },
    //热门商品
    list_2: [],
    askAnswerList: [
      {
        askTest: '请问啊是老大法律解释的卡上的卡号是抠脚大叔',
        answerTest: '请问啊是老大法律解释的卡上的卡号是抠脚大叔',
        total: 6
      },
      {
        askTest: '请问啊是老大法律解释的卡上的卡号是抠脚大叔',
        answerTest: '请问啊是老大法律解释的卡上的卡号是抠脚大叔',
        total: 6
      }
    ]
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    this.getIndexData()
    this.getHotGoods()
  },
  // 获取热门产品
  getHotGoods(){
    let params = {
      page_size:10,
      page_no:1
    }
    wx.showLoading({
      mask: true
    })
    util.httpPost2(app.globalUrl + app.HotGoods, params).then(this.processHotGoods)
  },
  processHotGoods(res){
    if (res.suc == 'y' && res.data.list.length > 0){
      for (let i in res.data.list) {
        wx.hideLoading()
        res.data.list[i].logo_url = app.globalImageUrl + res.data.list[i].logo_url
      }
      this.setData({
        list_2: res.data.list
      })
    }else{
      wx.hideLoading()
    }
  },
  // 获取同城首页banner、最佳路线、活动列表数据
  getIndexData() {
    wx.showLoading({
      mask: true
    })
    util.httpPost2(app.globalUrl + app.Index, {}).then(this.processIndexData)
  },
  processIndexData(res) {
    if (res.suc == 'y') {
      wx.hideLoading()
      // banner
      for (let i in res.data.banner_list){
        res.data.banner_list[i].image_src = app.globalImageUrl + res.data.banner_list[i].image_src
      }
      //最佳路线
      for (let i in res.data.best_list) {
        res.data.best_list[i].image_src = app.globalImageUrl + res.data.best_list[i].image_src
      }
      //五个菜单，按照左到右，上到下1-5顺序给与数据
      for (let i in res.data.five_list) {
        res.data.five_list[i].image_src = app.globalImageUrl + res.data.five_list[i].image_src
      }
      this.setData({
        slider: res.data.banner_list,
        best_list: res.data.best_list,
        list_1: res.data.tour,
        nav_1: res.data.five_list[0]
      })
    } else {
      wx.hideLoading()
    }
  },
})