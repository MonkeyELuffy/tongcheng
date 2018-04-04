// 封装网络请求
// api默认地址链接
var API_URL = 'https://muban.jikeyun.net/index.php'

var requestHandler = {
  params: {},
  success: function (res) {
    // success
  },
  fail: function () {
    // fail
  },
}

//GET请求
function GET(requestHandler) {
  request('GET', requestHandler)
}
//POST请求
function POST(requestHandler) {
  request('POST', requestHandler)
}

function request(method, requestHandler) {
  //注意：可以对params加密等处理
  var ordersn = requestHandler.params.ordersn;
  var api_name = requestHandler.params.api_name
  console.log(API_URL + api_name +'?ordersn='+ordersn)
      let extData = wx.getExtConfigSync();
    let appid = extData.authorizer_appid;
      wx.request({
         header: {
            'data': appid
        },
    url: API_URL + api_name + '?ordersn=' + ordersn,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      //注意：可以对参数解密等处理
      requestHandler.success(res)
    },
    fail: function () {
      requestHandler.fail()
    },
    complete: function () {
      // complete
    }
  })
}
module.exports = {
  GET: GET,
  POST: POST
}
