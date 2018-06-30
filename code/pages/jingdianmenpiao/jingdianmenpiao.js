//index.js
const util = require('../../utils/util.js');
const config = require('../../utils/config.js');
const paixuTemp_2 = require('../../utils/paixuTemp_2.js');
const bannerTemp = require('../../utils/bannerTemp.js');
const navTemp = require('../../utils/navTemp.js');
const dataItemTemp = require('../../utils/dataItemTemp.js');
const loadListData = require('../../utils/loadListData.js');
const basic = require('../../utils/basic.js');
const app = getApp()
Page({
  data: {
    imgHttp: app.globalImageUrl,
    scrollHeight: app.globalData.scrollHeight,
    search_key: '',
    positionValue: '',
    slider1: [],
    slider2: [],
    saomiao: '../../img/saomiao.png',
    positionImg: '../../img/position.png',
    search_icon: '../../img/search.png',
    nav_3List: [
      {
        id: 0,
        img: '../../img/youshan.png',
        text: '游山玩水',
        page: ''
      },
      {
        id: 1,
        img: '../../img/kaogu.png',
        text: '考古穿越',
        page: ''
      },
      {
        id: 2,
        img: '../../img/shangqu.png',
        text: '夜游赏曲',
        page: ''
      },
      {
        id: 3,
        img: '../../img/zizhu.png',
        text: '休闲自助',
        page: ''
      },
    ],
    // 排序组件所需data
    allData: app.globalData.allPaiXuData,
    allData_2: app.globalData.allPaiXuData_2,
    // 底部数据列表
    dataList: [],
    page_no: 1,
    total_page: 1,
  },
  onLoad() {
    // 数据初始化
    this.inteData()
    // 请求景点数据
    this.loadStorData()
    //请求banner数据
    this.loadBannerData();
  },
  inteData() {
    this.setData({
      bindDownLoad: true,
      page_no: 1,
      dataList: [],
      total_page: 1,
      showNomore: false
    })
  },
  loadStorData() {
    var params = {
      order_by: this.data.allData.nowPaiXu,
      page_no: 1,
      page_size: 15,
      type: 3,
      cur_fixed: app.globalData.firstLongitude + ',' + app.globalData.firstLatitude
    }
    this.loadListData(params);
  },
  loadBannerData() {
    var params1 = {
      region_id: 3144,  //地区ID搜索
      loca_id: 1
    }
    util.httpPost2(app.globalUrl + app.BANNER, params1).then(this.processBannerData)
  },
  // 顶部banner
  processBannerData: function (res) {
    if (res.suc == 'y') {
      for (var i in res.data) {
        res.data[i].img_src = app.globalImageUrl + res.data[i].img_src
      }
      this.setData({
        slider1: res.data
      })
    }
  },
  saoyisao: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  },
  //页面跳转
  goPage: function (e) {
    var that = this
    var page = e.target.dataset.page
    basic.goPage(page, that, e, )
  },
  // 下拉加载更多购物车数据
  bindDownLoad: function (e) {
    var params = {
      order_by: this.data.allData.nowPaiXu,
      page_no: this.data.page_no,
      page_size: 15,
      type: 3,
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
      console.log('获取景点list成功', res.data);
      if ((res.data.list instanceof Array && res.data.list.length < 15) || (res.data.list == '')) {
        this.setData({
          showNomore: true
        })
      }
      // if (app.globalData.hasLogin){
      wx.hideLoading()
      // }
      for (var i in res.data.list) {
        res.data.list[i].store_img_src = app.globalImageUrl + res.data.list[i].store_img_src
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
      console.log('获取景点list错误', res);
    }
  },
  kefu() {
    wx.makePhoneCall({
      phoneNumber: '13067998666',
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
  //以下全是组件事件
  //点击广告
  clickBanner: function (e) {
    var that = this
    bannerTemp.clickBanner(e, that)
  },
  // 点击顶部大分类菜单
  clickSuperNav(e) {
    var that = this
    var item = e.currentTarget.dataset.item
    superNavTemp.clickSuperNav(e, that, item)
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
  jingdianpaixu: function (e) {
    // 数据初始化,但暂时不清空dataList
    this.setData({
      bindDownLoad: true,
      page_no: 1,
      total_page: 1
    })
    var that = this
    var nowPaiXu = paixuTemp_2.jingdianpaixu(e, that)
    this.loadStorDataByOrder(e)
  },
  xiaoliangpaixu: function (e) {
    // 数据初始化,但暂时不清空dataList
    this.setData({
      bindDownLoad: true,
      page_no: 1,
      total_page: 1
    })
    var that = this
    var nowPaiXu = paixuTemp_2.xiaoliangpaixu(e, that)
    this.loadStorDataByOrder(e)
  },
  jiagepaixu: function (e) {
    // 数据初始化,但暂时不清空dataList
    this.setData({
      bindDownLoad: true,
      page_no: 1,
      total_page: 1
    })
    var that = this
    var nowPaiXu = paixuTemp_2.jiagepaixu(e, that)
    this.loadStorDataByOrder(e)
  },
  julipaixu: function (e) {
    // 数据初始化,但暂时不清空dataList
    this.setData({
      bindDownLoad: true,
      page_no: 1,
      total_page: 1
    })
    var that = this
    var nowPaiXu = paixuTemp_2.julipaixu(e, that)
    this.loadStorDataByOrder(e)
  },
  // 点击排序重新请求数据，不能先清空dataList，会出现闪动；
  // 目前先单独处理，之后需要对请求data函数做处理，根据标志位判断当前的请求是加载下一页，还是完全更新数据
  loadStorDataByOrder(e) {
    var params = {
      order_by: this.data.allData.nowPaiXu,
      page_no: 1,
      page_size: 15,
      type: 3,
      cur_fixed: app.globalData.firstLongitude + ',' + app.globalData.firstLatitude
    }
    this.loadListDataByOrder(params);
  },
  loadListDataByOrder(params) {
    var that = this
    var allParams = {
      that: that,
      params: params,
      app: app,
      processData: that.processStoreByOrderData,
      API: app.STORELIST
    }
    loadListData.loadListData(allParams)
  },
  processStoreByOrderData(res) {
    if (res.suc == 'y') {
      var dataList = []
      console.log('获取景点list成功', res.data);
      if (app.globalData.hasLogin) {
        wx.hideLoading()
      }
      for (var i in res.data.list) {
        res.data.list[i].store_img_src = app.globalImageUrl + res.data.list[i].store_img_src
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
      console.log('获取景点list错误', res);
    }
  }
})