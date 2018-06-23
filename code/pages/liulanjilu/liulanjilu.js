
var util = require('../../utils/util.js');
var dataItemTemp = require('../../utils/dataItemTemp.js');
var app = getApp()
Page({
  data: {
    checkedImg: '../../img/moren.png',
    unCheckedImg: '../../img/unCheckedImg.png',
    usedImg: '../../img/used.png',
    bottomBtn: '管理',
    // 是否展示编辑选择框
    showDel: false,
    // 全选
    chooseAll: false,
    dataList: [],
    //返回分页数据的总页数
    total_page: 1,
    page_no: 1,
    bindDownLoad: true,
  },
  onLoad() {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 70 * res.screenWidth / 750
        });
      }
    });
  },
  onShow: function () {
    this.setData({
      page_no: 1,
      total_page: 1,
      bindDownLoad: true,
    })
    var params = {
      page_no: 1,
      page_size: 15,
      member_id: app.globalData.member_id
    }
    this.loadData(params);
  },
  // 下拉加载
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
      util.httpPost(app.globalUrl + app.GlanceList, params, that.processData);
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
      console.log('获取GlanceList成功', res.data);
      if ((res.data.list instanceof Array && res.data.list.length < 15) || (res.data.list == '')) {
        this.setData({
          showNomore: true
        })
      }
      for (var i in res.data.list) {
        res.data.list[i].store_img_src = app.globalImageUrl + res.data.list[i].store_img_src
        res.data.list[i].special = res.data.list[i].special.split(',')
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
      console.log('获取GlanceList错误', res);
    }
  },
  // 点击管理或者删除
  guanli: function (e) {
    var bottomBtn = this.data.bottomBtn
    if (bottomBtn === '管理') {
      if (this.data.dataList.length > 0) {
        this.setData({
          showDel: true,
          bottomBtn: '删除'
        })
      }
    } else {
      var dataList = this.data.dataList;
      var delList = [];
      for (var i in dataList) {
        if (dataList[i].checked) {
          delList.push(dataList[i])
        }
      }
      console.log('删除列表delList', delList);
      if (delList.length > 0) {
        // 删除记录
        this.delGlance(delList)
      } else {
        wx.showToast({
          title: '请先选中',
          mark: true
        })
      }
    }
  },
  delGlance(list) {
    var that = this
    var ids = []
    for (var i in list) {
      ids.push(list[i].id)
    }
    var params = {
      ids: ids.join(','),
      member_id: app.globalData.member_id
    }
    util.httpPost2(app.globalUrl + app.DelGlance, params)
      .then(res => {
        that.processDelData(res, ids)
      });
  },
  processDelData(res, ids) {
    if (res.suc == 'y') {
      console.log('删除GlanceList成功', res.data);
      // 取消编辑模式
      // this.quxiao();
      var dataList = this.data.dataList;
      for (var i in ids) {
        for (var j in dataList) {
          if (ids[i] == dataList[j].id) {
            dataList.splice(j, 1)
          }
        }
      }
      this.setData({
        dataList: dataList
      })
      // 如果dataList长度为0了，说明当前页都删除完了，需要重新请求数据
      if (dataList.length == 0) {
        this.setData({
          chooseAll: false
        })
        this.onShow();
      }
    } else {
      console.log('删除GlanceList错误', res);
    }
  },
  //进入详情
  clickItem: function (e) {
    var that = this;
    if (that.data.bottomBtn === '管理') {
      var item = e.currentTarget.dataset.item
      dataItemTemp.clickItem(e, that, item)
      setTimeout(() => {
        that.setData({
          dataList: []
        })
      }, 300)
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
      for (var i in dataList) {
        if (!dataList[i].checked) {
          chooseAll = false
          break;
        }
      } that.setData({
        chooseAll: chooseAll
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
      chooseAll: false,
      bottomBtn: '管理'
    })
  },
  // 全选
  chooseAll: function (e) {
    var that = this;
    var dataList = that.data.dataList;
    var chooseAll = that.data.chooseAll;
    if (chooseAll) {
      for (var i in dataList) {
        dataList[i].checked = false
      }
    } else {
      for (var i in dataList) {
        dataList[i].checked = true
      }
    }
    this.setData({
      chooseAll: !chooseAll,
      dataList: dataList,
    })
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

})
