//index.js
var util = require('../../utils/util.js');
const config = require('../../utils/config.js');
var paixuTemp = require('../../utils/paixuTemp.js');
var bannerTemp = require('../../utils/bannerTemp.js');
var navTemp = require('../../utils/navTemp.js');
var dataItemTemp = require('../../utils/dataItemTemp.js');
var loadListData = require('../../utils/loadListData.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    scrollHeight: app.globalData.scrollHeight,
    slider1: [],
    slider2: [],
    nav_3List: [
      {
        trade_id: 57,
        img: '../../img/canting.png',
        text: '酒店餐厅',
        page: 'canyinList'
      },
      {
        trade_id: 56,
        img: '../../img/kafei.png',
        text: '咖啡茶座',
        page: 'canyinList'
      },
      {
        trade_id: 55,
        img: '../../img/tese.png',
        text: '特色餐厅',
        page: 'canyinList'
      },
      {
        trade_id: 54,
        img: '../../img/zaodian.png',
        text: '地方早点',
        page: 'canyinList'
      },
      {
        trade_id: 142,
        img: '../../img/hunyan.png',
        text: '宴会婚宴',
        page: 'canyinList'
      },
      {
        trade_id: 143,
        img: '../../img/xiaochi.png',
        text: '小吃宵夜',
        page: 'canyinList'
      },
      {
        trade_id: 144,
        img: '../../img/nongjia.png',
        text: '农家味道',
        page: 'canyinList'
      },
      {
        trade_id: 145,
        img: '../../img/xishi.png',
        text: '西式餐厅',
        page: 'canyinList'
      },
    ],
    // 排序组件所需data
    allData: app.globalData.allPaiXuData,
    // 底部数据列表
    dataList: [],
    page_no: 1,
    total_page: 1
  },
  onShow: function () {
    var that = this
    that.setData({
      bindDownLoad: true,
      page_no: 1,
      dataList: []
    })
    //请求banner数据
    this.loadBannerData();
    // 请求餐饮类别的商铺，关键词type: 1
    var params = {
      page_no: 1,
      total_page: 1,
      page_size: 15,
      type: '1',
      cur_fixed: app.globalData.firstLongitude + ',' + app.globalData.firstLatitude
    }
    that.loadListData(params);
  },
  loadBannerData() {
    var params1 = {
      region_id: 3144,  //地区ID搜索
      loca_id: 4
    }
    var params2 = {
      region_id: 3144,  //地区ID搜索
      loca_id: 5
    }
    util.httpPost(app.globalUrl + app.BANNER, params1, this.processBannerData);
    util.httpPost(app.globalUrl + app.BANNER, params2, this.processBannerCenterData);
  },
  // 顶部banner
  processBannerData: function (res) {
    if (res.suc == 'y') {
      console.log('顶部banner数据', res.data);
      for (var i in res.data) {
        res.data[i].img_src = app.globalImageUrl + res.data[i].img_src
      }
      this.setData({
        slider1: res.data
      })
    }
  },
  // 中间banner
  processBannerCenterData: function (res) {
    if (res.suc == 'y') {
      console.log('中间banner数据', res.data);
      for (var i in res.data) {
        res.data[i].img_src = app.globalImageUrl + res.data[i].img_src
      }
      this.setData({
        slider2: res.data
      })
    }
  },
  // 下拉加载更多购物车数据
  bindDownLoad: function (e) {
    var params = {
      page_no: this.data.page_no,
      page_size: 15,
      type: '1',
      cur_fixed: app.globalData.firstLongitude + ',' + app.globalData.firstLatitude
    }
    this.loadListData(params)
  },
  // 加载数据
  loadListData: function (params) {
    var that = this
    var allParams = {
      that: that,
      params: params,
      app: app,
      processData: that.processStoreData,
      API: app.STORELIST
    }
    loadListData.loadListData(allParams)
  },
  processStoreData(res) {
    if (res.suc == 'y') {
      var dataList = this.data.dataList
      console.log('获取商铺list成功', res.data);
      wx.hideLoading()
      for (var i in res.data.list) {
        res.data.list[i].store_img_src = app.globalImageUrl + res.data.list[i].store_img_src;
        res.data.list[i].special = res.data.list[i].special.split(",");
      }
      //获取数据之后需要改变page和totalPage数值，保障上拉加载下一页数据的page值，其余没有需要修改的数据
      dataList = dataList.concat(res.data.list)
      this.setData({
        page_no: this.data.page_no + 1,
        total_page: res.data.total_page,
        dataList: dataList,
      })
    } else {
      console.log('获取商铺list错误', res);
    }
  },
  //页面跳转
  goPage: function (e) {
    var that = this
    var go = function (e) {
      var page = e.target.dataset.page
      if (that.data.getFirst && page == 'switchcity') {
        app.getFirstLocation()
        that.data.getFirst = false
      }
      page = '../' + page + '/' + page
      wx.navigateTo({
        url: page
      })
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  // 分类
  fenlei: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var page = e.currentTarget.dataset.page
    var go = function (e) {
      page = '../' + page + '/' + page
      wx.navigateTo({
        url: page
      })
    }
    var data = { go, e }
    that.clickTooFast(data)
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
  //以下全是组件事件
  //点击广告
  clickBanner: function (e) {
    var that = this
    bannerTemp.clickBanner(e, that)
  },
  // 点击子菜单
  clickNav: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item
    navTemp.clickNav(e, that, item)
  },
  // 点击子数据
  clickItem: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item
    dataItemTemp.clickItem(e, that, item)
  },
  hangyepaixu: function (e) {
    var that = this
    paixuTemp.hangyepaixu(e, that)
  },
  xiaoliangpaixu: function (e) {
    var that = this
    paixuTemp.xiaoliangpaixu(e, that)
  },
  julipaixu: function (e) {
    var that = this
    paixuTemp.julipaixu(e, that)
  },
})