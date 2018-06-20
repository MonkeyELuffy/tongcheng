// pages/index2/index2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    more: '../../img/more.png',
    bestImg:'../../img/banner.png',
    slider: [
      {
        img_src: '../../img/banner.png'
      },
      {
        img_src: '../../img/banner.png'
      },
      {
        img_src: '../../img/banner.png'
      }
    ],
    list_1: [
      {
        name: '千岛湖休闲二日游'
      },
      {
        name: '千岛湖休闲二日游'
      }
    ],
    nav_1: {
      name: '千岛湖之夜',
      des: '体验科幻之夜',
      color: 'red',
      img: '../../img/banner.png'
    },
    nav_2: {
      name: '千岛湖之夜',
      des: '体验科幻之夜',
      color: 'blue',
      img: '../../img/banner.png'
    },
    nav_3: {
      name: '千岛湖之夜',
      des: '体验科幻之夜',
      color: 'green',
      img: '../../img/banner.png'
    },
    nav_4: {
      name: '千岛湖之夜',
      des: '体验科幻之夜',
      color: 'red',
      img: '../../img/banner.png'
    },
    nav_5: {
      name: '千岛湖之夜',
      des: '体验科幻之夜',
      color: 'green',
      img: '../../img/banner.png'
    },
    list_2: [
      {
        img: '../../img/banner.png',
        name: '千岛湖中心湖区门票+梦想一号船票（成人）',
        today: '今日可定',
        sale: 23,
        price: '360'
      },
      {
        img: '../../img/banner.png',
        name: '千岛湖中心湖区门票+梦想一号船票（成人）',
        today: '今日可定',
        sale: 23,
        price: '360'
      }
    ],
    askAnswerList: [
      {
        askTest: '请问啊是老大法律解释的卡上的卡号是抠脚大叔',
        answerTest: '请问啊是老大法律解释的卡上的卡号是抠脚大叔',
        total: 6
      },
      {
        askTest: '请问啊是老大法律解释的卡上的卡号是抠脚大叔',
        answerTest: '请问啊是老大法律解释的卡上的卡号是抠脚大叔',
        total: 6
      }
    ]
  
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