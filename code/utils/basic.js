/*

小程序基础js功能模块
包括：
1、页面跳转；
2、分页数据请求；
3、基础数据请求；
4、自定义toast样式；
5、自定义modal样式；
6、防止按钮点击过快（可自定义按钮失效时长ms）；
7、搜索功能

持续完善中...
 
*/

// 页面跳转
// page: 目标页面字段;
// that: 调用页面对象;
// e: 调用页面事件;
// params: 需要往下一页传递的参数，JSON字符串类型，所以整个小程序的onLoad函数里面接受参数名字都叫params
function goPage(page, that, e, params) {
  var go = function (e) {
    // 有参数的时候就传参
    if (params) {
      wx.navigateTo({
        url: '../' + page + '/' + page + '?params=' + JSON.stringify(params)
      })
    } else {
      wx.navigateTo({
        url: '../' + page + '/' + page
      })
    }
  }
  // 直接写成clickTooFast(go, e, that)也可以传参的，但是这样子就限制了参数的顺序；
  // 把参数外面再包裹一层对象，目标函数获取参数时候按照属性值获取，让传参更灵活；
  var data = { go, e, that, time: 1000 }
  clickTooFast(data)
}

// 防止按钮点击、页面跳转、提交等事件操作过快
// time: 间隔时间;
// that: 调用页面对象;
// e: 调用页面事件;
// go: 回调事件;
function clickTooFast(params) {
  var lastTime = params.that.data.lastTime
  var curTime = params.e.timeStamp
  if (lastTime > 0) {
    // 事件间隔时间，默认1000ms
    if (curTime - lastTime < (params.time || 1000)) {
      console.log('点击太快了')
      return
    } else {
      params.go(params.e)
    }
  } else {
    params.go(params.e)
  }
  params.that.setData({
    lastTime: curTime
  })
}

// 搜索功能
// 输入搜索文字
function input(e, that) {
  var search_key = e.detail.value
  that.setData({
    search_key: search_key
  })
}
// 确认搜索
function search(e) {
  var search_key = this.data.search_key
  if (search_key.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
    wx.showToast({
      title: '请输入您要搜索的商品',
      duration: 1000
    })
  } else {
    var go = function (e) {
      that.setData({
        search_key: ''
      })
      search_key = JSON.stringify(search_key)
      wx.navigateTo({
        url: '../search/search?search_key=' + search_key
      })
    }
    var data = { go, e }
    that.clickTooFast(data)
  }
}
// 手机号验证
function checkedPhone(phone){
  var reg = /^1[3|5|7|8]\d{9}$/;
  if (!phone || !reg.test(phone)) {
    return false
  }else{
    return true
  }
}

module.exports = {
  goPage: goPage,
  clickTooFast: clickTooFast,
  checkedPhone: checkedPhone,
}