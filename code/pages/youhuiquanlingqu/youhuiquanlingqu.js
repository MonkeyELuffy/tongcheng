var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    usedImg: '../../img/used.png',
    page: 0,
    //顶部菜单类型
    index: 0,
    navItems: [
      {
        name: '未使用',
        coupon_type: 1,
        checked: true,
      },
      {
        name: '已使用',
        coupon_type: 2,
        checked: false,
      },
      {
        name: '已过期',
        coupon_type: 3,
        checked: false,
      }],
    dataList: [],
    coupon_type: 1,
    cpns_id:'',
    //返回分页数据的总页数
  },
  onLoad(options) {
    var params = {
      member_id: app.globalData.member_id,
      type: 1
    }
    util.httpPost(app.globalUrl + app.CouponList, params, this.processCouponListData);
  },
  processCouponListData(res) {
    if (res.suc == 'y') {
      console.log('获取优惠券list成功', res.data);
      if ((res.data instanceof Array && res.data.length < 15) || (res.data == '')) {
        this.setData({
          showNomore: true
        })
      }
      this.setData({
        dataList: res.data,
      })
    } else {
      console.log('获取优惠券list错误', res);
    }
  },
  // 点击优惠券
  clickCoupen: function (e) {
    var that = this
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    var go = function (e) {
      // 如果是从个人中心进来的,或者点击的是已使用和已过期的优惠券，则点击优惠券没有任何效果
      if (prevPage.route == 'pages/mine/mine' || that.data.coupon_type != 1) {
        return
      } else {
        that.setData({
          cpns_id: e.currentTarget.dataset.item.balanceid
        })
        var params = {
          cpns_id: e.currentTarget.dataset.item.balanceid,
          token: app.globalData.userInfo.token,
          buy_key: app.globalData.orderData.buy_key,
          address_id: app.globalData.orderData.address.address_id || '',
          ship_type: app.globalData.orderData.ship_type || '',
          time: app.globalData.orderData.time || '',
        }
        util.httpPost(app.globalUrl + app.CONFIRMINFO, params, that.processSubmitData);
      }
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  processSubmitData: function (res) {
    if (res.suc == 'y') {
      console.log('获取最新订单数据成功', res.data);
      //返回票务订单页面需要此参数
      let cpns_id = this.data.cpns_id
      wx.setStorageSync('newCpnsId', cpns_id)
      wx.setStorageSync('changeCpnsId', true)
      this.goPayPage(res.data)
    } else {
      //返回票务订单页面需要此参数
      wx.setStorageSync('newCpnsId', '')
      wx.setStorageSync('changeCpnsId', false)
      console.log('获取最新订单数据错误', res);
      wx.showModal({
        title: '提醒',
        content: res.msg,
      })
    }
  },
  //返回结算页面
  goPayPage: function (orderData) {
    app.globalData.orderData = orderData
    wx.navigateBack()
  },
  /* ===选择顶部菜单 */
  checked: function (e) {
    var that = this
    var coupon_type = e.target.dataset.coupon_type;
    //点击已选中的菜单时，直接返回
    if (coupon_type === that.data.coupon_type) {
      return
    } else {
      var index = e.target.dataset.index;
      var name = e.target.dataset.name;
      that.setData({
        coupon_type: coupon_type,
        bindDownLoad: true,
        index: index,
        name: name
      })
      that.changeStyle(index)
      var params = {
        member_id: app.globalData.member_id,
        type: coupon_type
      }
      util.httpPost(app.globalUrl + app.CouponList, params, this.processCouponListData);
    }

  },
  //修改顶部菜单样式
  changeStyle: function (index) {
    var navItems = this.data.navItems
    for (var i = 0; i < navItems.length; i++) {
      navItems[i]['checked'] = false
    };
    navItems[index]['checked'] = true
    this.setData({
      navItems: navItems
    })
  },
  // 下拉加载更多购物车数据
  bindDownLoad: function (e) {
    this.loadData()
  },
  /*===========
  加载数据
  ===========*/
  loadData: function (e) {
    var that = this
    var index = that.data.index
    var name = that.data.name
    if (that.data.bindDownLoad && parseInt(that.data.page) < parseInt(that.data.total_page)) {
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
      wx.request({
        url: app.globalUrl + app.GET_youhuiquan_list,
        data: {
          data: {
            curPage: that.data.page + 1,
            data: name
          }
        },
        method: 'POST',
        success: function (res) {
          var youhuiquan_list = that.data.youhuiquan_list || []
          for (var i in res.data.data.data) {
            youhuiquan_list.push({})
            youhuiquan_list[youhuiquan_list.length - 1] = res.data.data.data[i]
            youhuiquan_list[youhuiquan_list.length - 1].time = that.getLocalTime(youhuiquan_list[youhuiquan_list.length - 1].time, "yyyy-M-d")
          }
          that.setData({
            youhuiquan_list: youhuiquan_list,
            page: res.data.data.curPage,
            total_page: res.data.data.pageCount
          })
        }
      })
    }
    //1000ms之后才可以继续加载，防止加载请求过多
    setTimeout(function () {
      that.setData({
        bindDownLoad: true
      })
    }, 1000)
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
  getLocalTime: function (a, fmt) {
    var nowDate = new Date(a)
    var o = {
      "M+": nowDate.getMonth() + 1, //月份
      "d+": nowDate.getDate(), //日
      "h+": nowDate.getHours(), //小时
      "m+": nowDate.getMinutes(), //分
      "s+": nowDate.getSeconds(), //秒
      "q+": Math.floor((nowDate.getMonth() + 3) / 3), //季度
      "S": nowDate.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (nowDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },

})
