var app = getApp()
Page({
  data: {
    usedImg:'../../img/used.png',
    page: 0,
    //顶部菜单类型
    index:0,
    navItems: [
      {
        name:'未使用(2)',
        id:0,
        checked:true,
      },
      {
        name: '已使用(2)',
        id: 1,
        checked: false,
      },
      {
        name: '已过期(2)',
        id: 2,
        checked: false,
      }],
    youhuiquan_list: [{ title: '通用型', value: 50, disc: '订单总金额高于代金券即可使用', time: '2018-09-09', form: '活动赠送', used: false, cpns_id: 2 }, { title: '通用型', value: 150, disc: '订单总金额高于代金券即可使用', time: '2018-09-09', form: '活动赠送', used: false, cpns_id:3}],
    //返回分页数据的总页数
    total_page:1
  },
  onLoad: function () {
    var that = this;
    //数据初始化
    that.setData({
      bindDownLoad: true,
      page: 0,
    })
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    //加载文章列表数据
    // that.loadData()
  },
  //进入详情
  goDetail: function (e) {
    var that = this
    var go = function (e) {
      var cpns_id = e.currentTarget.dataset.cpns_id
      wx.setStorageSync('cpns_id', cpns_id);
      wx.navigateBack();
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  /* ===选择顶部菜单 */
  checked: function (e) {
    var that = this
    var article_type = e.target.dataset.id;
    //点击已选中的菜单时，直接返回
    if (article_type === that.data.article_type) {
      return
    } else {
      var index = e.target.dataset.index;
      var name = e.target.dataset.name;
      that.setData({
        article_type: article_type,
        page: 0,
        // youhuiquan_list: [],
        bindDownLoad: true,
        total_page: 1,
        index: index,
        name: name
      })
      // that.loadData(index)
      that.changeStyle(index)
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
          data:{
            curPage: that.data.page+1,
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
