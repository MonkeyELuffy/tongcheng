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
  return new Promise((resolve, reject) => {
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
// 上传单张图片
function UpLoadImg(data) {
  var that = this
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: data.url,
      filePath: data.path,
      name: 'file',
      success: function (res) {
        if (res.statusCode == 200) {
          console.log('上传图片成功', res)
          resolve(res.data);
        }
      },
      fail: function (res) {
        console.log('上传失败', res)
        reject(res)
      },
    })
  })
}
//多张图片上传
function UpLoadImgs(data) {
  var uploadImgList = []
  for (var i in data) {
    uploadImgList.push(UpLoadImg(data[i]))
  }
  return new Promise((resolve, reject) => {
    Promise.all(uploadImgList)
      .then(function (res) {
        resolve(res);
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
  UpLoadImg: UpLoadImg,
  UpLoadImgs: UpLoadImgs,
  showTip: showTip
}

