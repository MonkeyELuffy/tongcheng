const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function httpPost(url, data, callBack) {
  wx.request({
    url: url,
    method: 'POST', 
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    data: data, 
    success: function (res) {
      console.log('请求参数', data)
      callBack(res.data);
    },
    fail: function (error) {
      console.log(error)
    }
  });
}
function httpGet(url, data, callBack) {
  wx.request({
    url: url,
    method: 'GET',
    data: data,
    success: function (res) {
      console.log('请求参数', data)
      callBack(res.data);
    },
    fail: function (error) {
      console.log(error)
    }
  });
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function loadingshow(title = '加载中') {
  wx.showToast({
    title: title,
    icon: 'loading'
  })
}

function showTip(title = '提示成功') {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: 6000,
  });
}

// Promise形式
function httpPost2(url, data) {
  return new Promise((resolve, reject) =>{
    wx.request({
      url: url,
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: data,
      success: function (res) {
        console.log('请求参数', data)
        resolve(res.data);
      },
      fail: function (error) {
        console.log(error)
        reject(error)
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  httpPost: httpPost,
  httpPost2: httpPost2,
  httpGet: httpGet,
  formatNumber: formatNumber,
  loadingshow: loadingshow,
  showTip: showTip
}

