
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    checkedImg: '../../img/moren.png',
    unCheckedImg: '../../img/unCheckedImg.png',
    usedImg:'../../img/used.png',
    bottomBtn:'管理',
    // 是否展示编辑选择框
    showDel:false,
    // 全选
    chooseAll: false,
    page_no: 0,
    //顶部菜单类型
    index:0,
    navItems: [
      {
        name:'店铺',
        id:0,
        checked:true,
      },
      {
        name: '商品',
        id: 1,
        checked: false,
      }],
    dataList: [],
    attentionType:1,
    //返回分页数据的总页数
    total_page:1
  },
  onShow: function () {
    var that = this;
    //数据初始化
    that.setData({
      bindDownLoad: true,
      page_no: 0,
      dataList: [],
    })
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 70 * res.screenWidth / 750
        });
      }
    });
    //获取关注记录
    var params = {
      type: this.data.attentionType,  //类型(1商家，2商品)
      page_no: 1,
      page_size: 15,
      member_id: app.globalData.member_id
    }
    this.loadData(params);
  },
  // 管理
  guanli:function(e){
    var bottomBtn = this.data.bottomBtn
    if(this.data.dataList.length){
      if (bottomBtn === '管理') {
        this.setData({
          showDel: true,
          bottomBtn: '删除'
        })
      } else {
        var dataList = this.data.dataList;
        var delList = [];
        var nowType = 1;
        if (this.data.navItems[0].checked){
          for (var i in dataList) {
            if (dataList[i].checked) {
              delList.push(dataList[i].th_id)
            }
          } 
          nowType = 1
        }else{
          for (var i in dataList) {
            if (dataList[i].checked) {
              delList.push(dataList[i].th_id)
            }
          }
          nowType = 2
        }
        var ids = delList.join(',')
        this.cancelAttention(ids, nowType)
      }
    }
  },
  //批量取消关注
  cancelAttention(ids, nowType) {
    var params = {
      ids: ids,
      type: nowType,
      member_id: app.globalData.member_id
    }
    util.httpPost(app.globalUrl + app.CancelPayAttention, params, this.processCancelData);
  },
  processCancelData(res) {
    if (res.suc == 'y') {
      this.setData({
        status: 0
      })
      wx.showToast({
        title: '取消关注成功',
      })
      this.quxiao();
      var params = {
        page_no: 1,
        page_size: 15,
        member_id: app.globalData.member_id
      }
      this.loadData(params)
    } else {
      // console.log('关注错误', res);
      wx.showModal({
        title: '提醒',
        content: res.msg,
      })
    }
  },
  //取消
  quxiao: function () {
    var dataList = this.data.dataList;
    for (var i in dataList) {
      dataList[i].checked = false
    }
    this.setData({
      showDel: false,
      dataList: dataList,
      dataList: dataList,
      chooseAll: false,
      bottomBtn: '管理'
    })
  },
  // 全选
  chooseAll: function (e) {
    var that = this;
    var dataList = that.data.dataList;
    var chooseAll = that.data.chooseAll;
    if (chooseAll){
      for (var i in dataList){
        dataList[i].checked = false
      }
    }else{
      for (var i in dataList) {
        dataList[i].checked = true
      }
    }
    this.setData({
      chooseAll: !chooseAll,
      dataList: dataList,
    })
  },
  //进入详情
  goDetail: function (e) {
    var that = this;
    if (that.data.bottomBtn === '管理'){
      var go = function (e) {
        var item = e.currentTarget.dataset.item
        //有goods_id就进去商品详情
        if (item.goods_id) {
          var params = { seller_id: item.seller_id, goods_id: item.goods_id }
          params = JSON.stringify(params)
          wx.navigateTo({
            url: '/pages/productDetail/productDetail?params=' + params,
          })
        } else {
          var seller_id = item.seller_id
          wx.navigateTo({
            url: '/pages/shangjiadianpu/shangjiadianpu?seller_id=' + seller_id,
          })
        }
        console.log(item)
      }
      var data = { go, e }
      that.clickTooFast(data)
    } else if (that.data.bottomBtn === '删除') {
      // 编辑时候的选择不需要防止快速点击
      var dataList = that.data.dataList;
      var chooseAll = that.data.chooseAll;
      var index = e.currentTarget.dataset.index
      dataList[index].checked = !dataList[index].checked;
      that.setData({
        dataList: dataList
      })
      //如果全部都已经选中了，则底部全选状态改变
      var chooseAll = true;
      for (var i in dataList){
        if (!dataList[i].checked){
          chooseAll = false
          break;
        }
      } that.setData({
        chooseAll: chooseAll
      })
    }
  },
  /* ===选择顶部菜单 */
  checked: function (e) {
    // 初始化编辑状态
    this.setData({
      chooseAll:false,
      showDel: false,
      bottomBtn: '管理',
    })
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
        page_no: 0,
        youhuiquan_list: [],
        bindDownLoad: true,
        total_page: 1,
        index: index,
        attentionType: index + 1, //	类型(1商家，2商品)
        name: name,
        dataList: []
      })
      var params = {
        type: that.data.attentionType,  //类型(1商家，2商品)
        page_no: 1,
        page_size: 15,
        member_id: app.globalData.member_id
      }
      that.loadData(params);
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
    var params = {
      page_no: this.data.page_no,
      page_size: 15,
      member_id: app.globalData.member_id
    }
    this.loadData(params)
  },
  /*===========
  加载数据
  ===========*/
  loadData: function (params) {
    var that = this
    console.log(params)
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
      util.httpPost(app.globalUrl + app.PayAttentionList, params, that.processData);
    }
    //1000ms之后才可以继续加载，防止加载请求过多
    setTimeout(function () {
      that.setData({
        bindDownLoad: true
      })
    }, 1000)
  },
  processData(res) {
    if (res.suc == 'y') {
      var dataList = this.data.dataList
      console.log('获取PayAttentionList成功', res.data);
      if ((res.data.list instanceof Array && res.data.list.length < 15) || (res.data.list == '')) {
        this.setData({
          showNomore: true
        })
      }
      for (var i in res.data.list) {
        if (res.data.list[i].store_img_src){
          res.data.list[i].logo_url = app.globalImageUrl + res.data.list[i].store_img_src
        }else{
          res.data.list[i].logo_url = app.globalImageUrl + res.data.list[i].logo_url
        }
        if (res.data.list[i].special){
          res.data.list[i].special = res.data.list[i].special.split(',')
        }
        res.data.list[i].checked = false
      }
      //获取数据之后需要改变page和totalPage数值，保障上拉加载下一页数据的page值，其余没有需要修改的数据
      dataList = dataList.concat(res.data.list)
      this.setData({
        page_no: this.data.page_no + 1,
        total_page: res.data.total_page,
        dataList: dataList,
      })
    } else {
      console.log('获取PayAttentionList错误', res);
    }
  },
  /*==========
  防止快速点击
  ===========*/
  clickTooFast: function (data) {
    var lastTime = this.data.lastTime
    var curTime = data.e.timeStamp
    if (lastTime > 0) {
      if (curTime - lastTime < 500) {
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
