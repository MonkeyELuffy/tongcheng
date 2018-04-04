// pages/equipmentShare/equipmentShare.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topNav:[{
        img:'../../img/center/saoyisao.png',
      name:'扫一扫'
    }],
    walletDetail: [{
      value: 123.34,
      name: '账户余额',
      page: 'wodezhanghu'
    }, {
      value: 44.43,
      name: '红包',
      page: 'hongbao'
      }],
    orderNav: [{
      img: '../../img/center/wode_dizhi.png',
      name: '收货地址',
      page:'address'
    }, {
        img: '../../img/center/wode_youhui.png',
        name: '优惠券',
        page: 'youhuiquanlingqu'
      }, {
        img: '../../img/center/wode_kefu.png',
        name: '客户服务',
        page: 'kehufuwu'
    }, {
        img: '../../img/center/wode_xiaoxi.png',
        name: '消息中心',
        page: 'msgCenter'
      }, {
        img: '../../img/center/wode_liulan.png',
        name: '浏览记录',
        page: 'liulanjilu'
    }, {
        img: '../../img/center/wode_jilu.png',
      name: '关注记录',
      page: 'wodeguanzhu'
      }, {
        img: '../../img/center/wode_guanyu.png',
        name: '关于我们',
        page: 'about'
    }, {
        img: '../../img/center/wode_yijian.png',
      name: '意见反馈',
      page: 'kehufuwu'
    }],
    user_name:'请登录',
    avatar:'../../img/user_img.png',
    level: '会员级别',
    // 用户等级icon
    level_icon: '../../img/center/huangguan.png',
    bg: '../../img/user_bg.png',
  },
  onShow: function () {
    console.log('app.globalData.userInfo',app.globalData.userInfo)
    this.setData({
      userInfo: app.globalData.userInfo
    })
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
    var go = function(e){
      var url = e.currentTarget.dataset.page
      url = '../' + url + '/' + url
      console.log(url)
      wx.navigateTo({
        url: url
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
  }
  // postMessage: function() {
  //   var that = this
  //       let extData = wx.getExtConfigSync();
    // let appid = extData.authorizer_appid;
    //   wx.request({
    //      header: {
    //         'data': appid
    //     },
  //     url: 'http://zhlp.test.gobrand.top.jikeyun.net/index.php/interfaces/home/test', 
  //     method: 'POST',
  //     data: {
  //       name:'lin',
  //       sex:'male'
  //     },
  //     success: function (res) {
  //       console.log(res.data)
  //       var newName = res.data.message
  //     },
  //     fail: function() {
  //       console.log('fail')
  //     }
  //   })
  // }
})