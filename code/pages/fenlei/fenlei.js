// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_icon: '../../img/search.png',
    dataList: [
      {
        img: '../../img/test.png',
        name: '深圳市三九胃泰有限公司',
        labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
        haoping: '98',
        sale: 1234,
        dic: 12.3
      },
      {
        img: '../../img/test.png',
        name: '深圳市三九胃泰有限公司',
        labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
        haoping: '98',
        sale: 1234,
        dic: 12.3
      },
      {
        img: '../../img/test.png',
        name: '深圳市三九胃泰有限公司',
        labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
        haoping: '98',
        sale: 1234,
        dic: 12.3
      },
      {
        img: '../../img/test.png',
        name: '深圳市三九胃泰有限公司',
        labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
        haoping: '98',
        sale: 1234,
        dic: 12.3
      },
      {
        img: '../../img/test.png',
        name: '深圳市三九胃泰有限公司',
        labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
        haoping: '98',
        sale: 1234,
        dic: 12.3
      },
      {
        img: '../../img/test.png',
        name: '深圳市三九胃泰有限公司',
        labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
        haoping: '98',
        sale: 1234,
        dic: 12.3
      },
      {
        img: '../../img/test.png',
        name: '深圳市三九胃泰有限公司',
        labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
        haoping: '98',
        sale: 1234,
        dic: 12.3
      }
    ],
    // 排序背景图
    hangyepaixu: '../../img/paixu0.png',
    xiaoliangpaixu: '../../img/paixu0.png',
    julipaixu: '../../img/paixu0.png',
    paixuList: ['../../img/paixu0.png', '../../img/paixu1.png', '../../img/paixu2.png'],
    // 排序规则：0代表众筹金额升序、1降序，2代表分红比例升序、3降序,4代表一开始不排序。
    nowPaiXu: 4,
    search_key: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var search_key = JSON.parse(options.search_key)
    //数据初始化
    that.setData({
      bindDownLoad: true,
      search_key: search_key,
      page: 0,
    })
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
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
  }
})