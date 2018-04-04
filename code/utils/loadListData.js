var util = require('util.js');
function loadListData(allParams) {
  // 传递过来的页面对象
  var that = allParams.that
  // 请求参数
  var params = allParams.params
  // 全局变量
  var app = allParams.app
  // 请求回调函数
  var processData = allParams.processData
  // 请求地址路径
  var API = allParams.API
  console.log('??', that.data.page_no, that.data.total_page)
  if (that.data.bindDownLoad && parseInt(that.data.page_no) <= parseInt(that.data.total_page)) {
    that.setData({
      bindDownLoad: false
    })
    //加载数据
    wx.showLoading({
      mask: true
    })
    //获取list信息
    util.httpPost2(app.globalUrl + API, params).then(processData);
    //1000ms之后才可以继续加载，防止加载请求过多
    setTimeout(function () {
      that.setData({
        bindDownLoad: true
      })
    }, 1000)
  }
  if (that.data.bindDownLoad && parseInt(that.data.page_no) > parseInt(that.data.total_page)) {
    that.setData({
      showNomore:true
    })
  }
}
module.exports = {
  loadListData: loadListData,
}