// pages/tixian/tixian.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tixian:'../../img/tixian.png',
    showSuccess:false,
  },
  tixian:function(){
    this.setData({
      showSuccess: true
    })
    setTimeout(function(){
      wx.navigateBack();
    },1500)
  }
})