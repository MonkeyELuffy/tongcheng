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
    nav_0: {
      image_src: '../../img/nav_0_default.png'
    },
    nav_1: {
      image_src: '../../img/nav_1_default.png'
    },
    nav_2: {
      image_src: '../../img/nav_2_default.png'
    },
    nav_3: {
      image_src: '../../img/nav_3_default.png'
    },
    nav_4: {
      image_src: '../../img/nav_4_default.png'
    },
    //热门商品
    list_2: [],  
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
        this.data['nav_' + i] = res.data.five_list[i]
      }
      this.setData({
        slider: res.data.banner_list,
        best_list: res.data.best_list,
        list_1: res.data.tour,
        nav_0: this.data.nav_0,
        nav_1: this.data.nav_1,
        nav_2: this.data.nav_2,
        nav_3: this.data.nav_3,
        nav_4: this.data.nav_4,
      })
    } else {
      wx.hideLoading()
    }
  },
  goDetail(e){
    let that = this
    let item = e.currentTarget.dataset.item
    let page = ''
    if (item.type == '1') {
      page = '../shangjiadianpu/shangjiadianpu?seller_id=' + item.seller_id
    }
    if (item.type == '2') {
      page = '../jiudianDetail/jiudianDetail?seller_id=' + item.seller_id
    }
    if (item.type == '3') {
      page = '../qiandaohudenglu/qiandaohudenglu?seller_id=' + item.seller_id
    }
    var go = function (e) {
      wx.navigateTo({
        url: page
      })
    }
    var data = { go, e }
    this.clickTooFast(data, that)
  },
  kefu() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phoneNumber,
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
  },
})