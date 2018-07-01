// pages/search/search.js
var util = require('../../utils/util.js');
const config = require('../../utils/config.js');
var paixuTemp_2 = require('../../utils/paixuTemp_2.js');
var bannerTemp = require('../../utils/bannerTemp.js');
var navTemp = require('../../utils/navTemp.js');
var dataItemTemp = require('../../utils/dataItemTemp.js');
var loadListData = require('../../utils/loadListData.js');
//获取应用实例
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: app.globalData.scrollHeight,
    // 排序组件所需data
    allData_2: app.globalData.allPaiXuData_2,
    search_icon: '../../img/search.png',
    dataList: [],
    search_key: '',
    page_no: 1,
    total_page: 1
  },
  onLoad: function (options) {
    //数据初始化
    this.setData({
      bindDownLoad: true,
    })
    var params = {
      order_by: this.data.allData_2.nowPaiXu,
      page_no: 1,
      page_size: 15,
      type: 3,
      cur_fixed: app.globalData.firstLongitude + ',' + app.globalData.firstLatitude
    }
    this.loadData(params);
  },
  // 下拉加载更多购物车数据
  bindDownLoad: function (e) {
    var params = {
      type: '2',
      page_no: this.data.page_no,
      page_size: 15,
      cur_fixed: app.globalData.firstLongitude + ',' + app.globalData.firstLatitude,
      store_str: this.data.store_str,
      distance: this.data.distance,
      trade_id: this.data.trade_id,
    }
    this.loadData(params)
  },
  /*===========
  加载数据
  ===========*/
  loadData: function (params) {
    var that = this
    console.log(that.data.page_no, '??', that.data.total_page)
    if (that.data.bindDownLoad && parseInt(that.data.page_no) <= parseInt(that.data.total_page)) {
      that.setData({
        bindDownLoad: false
      })
      //加载数据
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 600)
      //获取订单信息
      util.httpPost(app.globalUrl + app.STORELIST, params, that.processStoreData);
    }
    //2000ms之后才可以继续加载，防止加载请求过多
    setTimeout(function () {
      that.setData({
        bindDownLoad: true
      })
    }, 1000)
  },
  processStoreData(res) {
    if (res.suc == 'y') {
      var dataList = this.data.dataList
      console.log('获取商铺list成功', res.data);
      for (var i in res.data.list) {
        res.data.list[i].store_img_src = app.globalImageUrl + res.data.list[i].store_img_src
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
  // 输入搜索文字
  input: function (e) {
    var search_key = e.detail.value
    this.setData({
      search_key: search_key
    })
    wx.setStorageSync("search_key", search_key);
  },
  // 确认搜索
  search: function (e) {
    var that = this
    var search_key = this.data.search_key
    if (search_key.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
      wx.showToast({
        title: '请输入您要搜索的商品',
        duration: 1000
      })
    } else {
      var go = function (e) {
        console.log(search_key)
        //搜索需要清空dataList
        that.setData({
          dataList: [],
          page_no: 1,
          total_page: 1,
        })
        var params = {
          page_no: that.data.page_no,
          page_size: 15,
          cur_fixed: app.globalData.firstLongitude + ',' + app.globalData.firstLatitude,
          seller_name: search_key
        }
        that.loadData(params)
      }
      var data = { go, e }
      that.clickTooFast(data)
    }
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
    console.log()
    this.loadStorDataByOrder(e)
  },
  // 点击排序重新请求数据，不能先清空dataList，会出现闪动；
  // 目前先单独处理，之后需要对请求data函数做处理，根据标志位判断当前的请求是加载下一页，还是完全更新数据
  loadStorDataByOrder(e) {
    var params = {
      order_by: this.data.allData_2.nowPaiXu,
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