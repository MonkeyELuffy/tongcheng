var app = getApp()
Page({
  data: {
    checkedImg: '../../img/quanxuan.png',
    unCheckedImg: '../../img/unCheckedImg.png',
    usedImg:'../../img/used.png',
    bottomBtn:'管理',
    // 是否展示编辑选择框
    showDel:false,
    // 全选
    chooseAll: false,
    page: 0,
    allDataList: [
      {
        fatherindex:0,
        time: '3月3日',
        dataList: [
          {
            img: '../../img/test.png',
            name: '深圳市三九胃泰有限公司',
            labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
            haoping: '98',
            sale: 1234,
            dic: 12.3,
            checked: false,
            id: 0
          },
          {
            img: '../../img/test.png',
            name: '深圳市三九胃泰有限公司',
            labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
            haoping: '98',
            sale: 1234,
            dic: 12.3,
            checked: false,
            id: 0
          },
          {
            img: '../../img/test.png',
            name: '深圳市三九胃泰有限公司',
            labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
            haoping: '98',
            sale: 1234,
            dic: 12.3,
            checked: false,
            id: 0
          },
        ],
      },
      {
        fatherindex: 1,
        time: '3月2日',
        dataList: [
          {
            img: '../../img/test.png',
            name: '深圳市三九胃泰有限公司',
            labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
            haoping: '98',
            sale: 1234,
            dic: 12.3,
            checked: false,
            id: 0
          },
          {
            img: '../../img/test.png',
            name: '深圳市三九胃泰有限公司',
            labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
            haoping: '98',
            sale: 1234,
            dic: 12.3,
            checked: false,
            id: 0
          },
          {
            img: '../../img/test.png',
            name: '深圳市三九胃泰有限公司',
            labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
            haoping: '98',
            sale: 1234,
            dic: 12.3,
            checked: false,
            id: 0
          },
        ],
      },
      {
        fatherindex: 2,
        time: '3月1日',
        dataList: [
          {
            img: '../../img/test.png',
            name: '深圳市三九胃泰有限公司',
            labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
            haoping: '98',
            sale: 1234,
            dic: 12.3,
            checked: false,
            id: 0
          },
          {
            img: '../../img/test.png',
            name: '深圳市三九胃泰有限公司',
            labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
            haoping: '98',
            sale: 1234,
            dic: 12.3,
            checked: false,
            id: 0
          },
          {
            img: '../../img/test.png',
            name: '深圳市三九胃泰有限公司',
            labels: [{ name: '铝制品', bgColor: '#fff' }, { name: '满减', bgColor: '#f68076' }],
            haoping: '98',
            sale: 1234,
            dic: 12.3,
            checked: false,
            id: 0
          },
        ],
      },
      ],
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
  },
  // 管理
  guanli:function(e){
    var bottomBtn = this.data.bottomBtn
    if (bottomBtn === '管理'){
      this.setData({
        showDel: true,
        bottomBtn: '删除'
      })
    }else{
      var allDataList = this.data.allDataList;
      var delList = [];
      for (var i in allDataList){
        for (var j in allDataList[i].dataList){
          if (allDataList[i].dataList[j].checked) {
            delList.push(allDataList[i].dataList[j])
          }
        }
      }
      console.log(delList);
    }
  },
  //取消
  quxiao: function () {
    var allDataList = this.data.allDataList;
    for (var i in allDataList) {
      for (var j in allDataList[i].dataList) {
        if (allDataList[i].dataList[j].checked) {
          allDataList[i].dataList[j].checked = false
        }
      }
    }
    this.setData({
      showDel: false,
      allDataList: allDataList,
      chooseAll: false,
      bottomBtn: '管理'
    })
  },
  // 全选
  chooseAll: function (e) {
    var that = this;
    var allDataList = this.data.allDataList;
    var chooseAll = that.data.chooseAll;
    if (chooseAll) {
      for (var i in allDataList) {
        for (var j in allDataList[i].dataList) {
          allDataList[i].dataList[j].checked = false
        }
      }
    }else{
      for (var i in allDataList) {
        for (var j in allDataList[i].dataList) {
          allDataList[i].dataList[j].checked = true
        }
      }
    }
    this.setData({
      chooseAll: !chooseAll,
      allDataList: allDataList,
    })
  },
  //进入详情
  goDetail: function (e) {
    var that = this;
    if (that.data.bottomBtn === '管理'){
      var go = function (e) {
        var id = e.currentTarget.dataset.id
          // var params = { title: title, id: id, time: time, author: author }
          // params = JSON.stringify(params)
          // wx.navigateTo({
          //   url: '/pages/articleDetail/articleDetail?params=' + params,
          // })
          console.log(id)
      }
      var data = { go, e }
      that.clickTooFast(data)
    } else if (that.data.bottomBtn === '删除') {
      // 编辑时候的选择不需要防止快速点击
      var allDataList = this.data.allDataList;
      var chooseAll = that.data.chooseAll;
      var index = e.currentTarget.dataset.index
      var fatherindex = e.currentTarget.dataset.fatherindex
      console.log('index=', index)
      console.log('fatherindex=', fatherindex)
      allDataList[fatherindex].dataList[index].checked = !allDataList[fatherindex].dataList[index].checked;
      that.setData({
        allDataList: allDataList
      })
      //如果全部都已经选中了，则底部全选状态改变
      var chooseAll = true;
      for (var i in allDataList) {
        for (var j in allDataList[i].dataList) {
          if (!allDataList[i].dataList[j].checked) {
            chooseAll = false
            break;
          }
        }
      }
      that.setData({
        chooseAll: chooseAll
      })
    }
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
