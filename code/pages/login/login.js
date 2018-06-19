const app = getApp()
const { wxRequest } = require('../../utils/http.js')
const { checkaAuthSetting, authorize, authSetting } = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    nickName: '',
    gender: 0,
    avatarUrl: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    // 对本地存储登录信息检查
    if (this.checkLoginStatus()) {
      wx.reLaunch({
        url: '/pages/index1/index1',
      })
    } else {
      this.setData({
        showLogin: true
      })
    }
  },
  //检查登录状态
  checkLoginStatus() {
    const { openid } = wx.getStorageSync('user')
    return !!openid
  },
  //获得微信授权
  getAuth() {
    const scope = 'scope.userInfo'
    //检查是否授权
    if (!checkaAuthSetting(scope)) {
      authorize(scope).then(() => {
        this.getWxLoginCode()
      }).catch(err => {
        this.setData({
          showLogin: true
        })
      })
    } else {
      this.getWxLoginCode()
    }
  },

  bindGetUserInfo: function (e) {
    const { errMsg, userInfo } = e.detail
    if (errMsg === 'getUserInfo:ok') {
      this.setData({
        nickName: userInfo.nickName,
        gender: userInfo.gender,
        avatarUrl: userInfo.avatarUrl,
      })
      this.getWxLoginCode()
    } else {
      wx.showModal({
        title: '授权登录被拒绝',
        content: '今日淘房未获取到您的信息，为您更好的服务，请允许获取您的信息',
        showCancel: false,
        confirmText: '我知道了'
      })
    }
      
  },

  //获取微信登录的code
  getWxLoginCode() {
    wx.showLoading({
      title: '正在登录中...'
    })
    wx.login({
      success: (res) => {
        if (res.code) {
          this.getWxUserID(res.code)
        }
      }
    })
  },
  //关注后可以直接获取
  getWxUserID(code) {
    wxRequest(app.globalData.baseUrl + '/member/getopenid', { code }).then(res => {
      const { suc, data, msg } = res
      if (suc === 'y') {
        this.data.openid = data.openid
        this.wechatLogin()
      } else {
        app.toast(msg)
      }
    }).catch(err => {
      app.toast(app.errMsg)
    })
  },
  
  /**
   * 微信登录
   */
  wechatLogin() {
    const { nickName, gender, avatarUrl, openid } = this.data
    const req = {
      openid,
      nickname: nickName,
      gender,
      img_url: avatarUrl
    }

    wxRequest(app.globalData.baseUrl + '/member/index', req).then(res => {
      const { suc, data, msg } = res
      if (suc === 'y') {
        app.userLogin(data)
        this.setCache(data)
        wx.reLaunch({
          url: '/pages/index1/index1',
        })
      } else {
        app.toast(msg)
      }
    }).catch(err => {
      app.toast(app.errMsg)
    })
  },

  /**
   * 设置本地缓存
   */
  setCache(data) {
    const { avatarUrl, openid } = this.data
    let user = {
      member_id: data.member_id,
      nickName: data.nickname,
      img_url: avatarUrl,
      openid
    }
    wx.setStorageSync('stall', {
      status: data.status,
    })
    wx.setStorageSync('user', user)
    wx.setStorageSync('member_id', user.member_id);
    wx.setStorageSync('openid', user.openid);
  }
})