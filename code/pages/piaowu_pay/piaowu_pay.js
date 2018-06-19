// pages/piaowu_pay/piaowu_pay.js
// 票务预定支付页面
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addImg: '../../img/add.png',
    subImg: '../../img/sub.png',
    more: '../../img/more.png',
    dateList: [
      {
        text: '今天',
        dateText: '2月22号',
        checked:true
      },
      {
        text: '明天',
        dateText: '2月23号',
        checked: false
      },
      {
        text: '后天',
        dateText: '2月24号',
        checked: false
      },
      {
        text: '其他',
        dateText: '',
        checked: false
      },
    ],
    prizeNum: 260,
    num: 1,
    youhuiquanValue:'10.00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})