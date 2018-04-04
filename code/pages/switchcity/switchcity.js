const city = require('../../utils/city.js');
const cityObjs = require('../../utils/city.js');
const config = require('../../utils/config.js');
const appInstance = getApp();
Page({
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "定位中",
    currentCityCode: '',
    hotcityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' }, { cityCode: 440100, city: '广州市' }, { cityCode: 440300, city: '深圳市' }, { cityCode: 330100, city: '杭州市' }, { cityCode: 320100, city: '南京市' }, { cityCode: 420100, city: '武汉市' },  { cityCode: 120000, city: '天津市' }, { cityCode: 610100, city: '西安市' }, ],
    commonCityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' }],
    countyList: [{ cityCode: 110000, county: 'A区' }, { cityCode: 310000, county: 'B区' }, { cityCode: 440100, county: 'C区' }, { cityCode: 440300, county: 'D区' }, { cityCode: 330100, county: 'E县' }, { cityCode: 320100, county: 'F县' }, { cityCode: 420100, county: 'G县' }],
    inputName: '',
    completeList: [],
    county: '',
    condition: false,
    // 搜索历史
    historyCity:[]
  },
  onLoad: function () {
    // 生命周期函数--监听页面加载
    const searchLetter = city.searchLetter;
    const cityList = city.cityList();
    const sysInfo = wx.getSystemInfoSync();
    console.log(sysInfo);
    const winHeight = sysInfo.windowHeight;
    const itemH = winHeight / searchLetter.length;
    let tempArr = [];

    const historyCity = wx.getStorageSync('historyCity') || []
    searchLetter.map(
      (item,index) => {
        // console.log(item);
        // console.log(index);
        let temp = {};
        temp.name = item;
        temp.tHeight = index * itemH;
        temp.bHeight = (index + 1) * itemH;
        tempArr.push(temp)
      }
    );
    // console.log(tempArr);
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempArr,
      cityList: cityList,
      historyCity: historyCity
    });

    this.getLocation();

  },

  clickLetter: function (e) {
    // console.log(e);
    console.log(e.currentTarget.dataset.letter)
    const showLetter = e.currentTarget.dataset.letter;
    this.setData({
      toastShowLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    const that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 500)
  },
  reGetLocation: function() {
    this.getLocation()
    appInstance.globalData.defaultCity = this.data.city
    appInstance.globalData.defaultCounty = this.data.county
    console.log(appInstance.globalData.defaultCity);
    //返回首页
    // wx.switchTab({
    //   url: '../index/index'
    // })
  },
  //选择城市
  bindCity: function (e) {
    // console.log("bindCity");
    console.log(e);
    this.setData({
      condition:true,
      city: e.currentTarget.dataset.city,
      currentCityCode: e.currentTarget.dataset.code,
      scrollTop: 0,
      completeList: [],
    })
    this.selectCounty()

    appInstance.globalData.defaultCity = this.data.city
    appInstance.globalData.defaultCounty = ''
    console.log(appInstance.globalData.defaultCity)
  },
  //选择搜索出来的城市，并且放入搜索历史纪录
  bindSearchCity: function (e) {
    console.log(e);
    console.log('搜索出来并点击了的城市code是', e.currentTarget.dataset.code)
    var searchCode = e.currentTarget.dataset.code+''
    var historyCity = wx.getStorageSync('historyCity') || []
    for (let i in cityObjs.cityObjs){
        if (searchCode === cityObjs.cityObjs[i].code) {
          //清洗historyCity里面重复的数据
          for (let j in historyCity){
            if (searchCode === historyCity[j].code){
              historyCity.splice(j,1)
            }
          }
          historyCity.unshift(cityObjs.cityObjs[i])
        }
    } 
    // 清洗historyCity里面重复的数据
    // historyCity = this.checkRepeat(historyCity)
    this.setData({
      condition: true,
      city: e.currentTarget.dataset.city,
      currentCityCode: e.currentTarget.dataset.code,
      scrollTop: 0,
      completeList: [],
      historyCity: historyCity
    })
    wx.setStorageSync('historyCity', historyCity)
    this.selectCounty()

    appInstance.globalData.defaultCity = this.data.city
    appInstance.globalData.defaultCounty = ''
    console.log(appInstance.globalData.defaultCity)
    // console.log('')
  },
  // checkRepeat:function(arr){
  //   var len = arr.length;
  //   var result = []
  //   for (var i = 0; i < len; i++) {
  //     var flag = true;
  //     for (var j = i; j < len-1; j++) {
  //       if (arr[i].code === arr[j + 1].code) {
  //         flag = false;
  //         break;
  //       }
  //     }
  //     if (flag) {
  //       result.push(arr[i])
  //     }
  //   }
  //   return result;
  // },

  bindCounty: function(e) {
    this.setData({ county: e.currentTarget.dataset.city })
    appInstance.globalData.defaultCounty = this.data.county
    console.log('筛选的县级城市信息', appInstance.globalData.defaultCounty);
    var now_lat = e.target.dataset.lat
    var now_lng = e.target.dataset.lng
    console.log('最终选择的位置经纬度是',now_lat,'  ',now_lng)
    
    appInstance.globalData.nowLongitude = now_lng
    appInstance.globalData.nowLatitude = now_lat
    appInstance.globalData.chooseNewCounty = true

    appInstance.getFirstLocation()

    wx.showLoading({
      title: '正在搜索...',
    })
    setTimeout(function () {
      wx.hideLoading()
      wx.switchTab({
        url: '../index/index'
      })
    },1000)
  },

  //点击热门城市回到顶部
  hotCity: function () {
    console.log("hotCity");
    this.setData({
      scrollTop: 0,
    })
  },
  bindScroll: function (e) {
  //  console.log(e.detail)
  },
  selectCounty: function() {
    console.log("正在定位区县");
    let code = this.data.currentCityCode
    console.log(code);
    const that = this;
    wx.request({
      url: `https://apis.map.qq.com/ws/district/v1/getchildren?&id=${code}&key=${config.key}`,
      success: function(res) {
        console.log(res.data.result[0]);
        that.setData({
          countyList: res.data.result[0],
        })
        console.log(that.data.countyList);
        console.log("请求区县成功"+`https://apis.map.qq.com/ws/district/v1/getchildren?&id=${code}&key=${config.key}`);
        console.log('区县返回数据',res)
      },
      fail: function() {
        console.log("请求区县失败，请重试");
      }
    })
  },
  getLocation: function() {
    console.log("正在定位城市");
    this.setData({
      county: ''
    })
    const that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        let latitude = res.latitude
        let longitude = res.longitude
        wx.request({
            url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${config.key}`,
            success: res => {
              console.log(res)
              console.log('点击重新定位城区时返回的res.data.result.ad_info.adcode', res.data.result.ad_info.adcode)
              console.log('点击重新定位城区时返回的res.data.result.ad_info.city_code', res.data.result.ad_info.city_code)
              var city_code = res.data.result.ad_info.city_code
              //city_code是城市code，比如成都是156510100，后面六位的成都是code，所以截取后六位
              city_code = city_code.slice(3)
              console.log('去掉前三位数值之后的city_code', city_code)
              console.log('点击重新定位城区时返回的res.data.result.ad_info.adcode', res.data)
              console.log(res.data.result.ad_info.city+res.data.result.ad_info.adcode);
              that.setData({
                city: res.data.result.ad_info.city,
                currentCityCode: city_code,
                county: res.data.result.ad_info.district
              })
              that.bindCity();
            }
        })
      }
    })
  },
  bindBlur: function(e) {
    this.setData({
      inputName: ''
    })
  },
  bindKeyInput: function(e) {
    console.log("input: " + e.detail.value);
    this.setData({
      inputName: e.detail.value
    })
    this.auto()
  },
  auto: function () {
    let inputSd = this.data.inputName.trim()
    let sd = inputSd.toLowerCase()
    let num = sd.length
    const cityList = cityObjs.cityObjs
    console.log(cityList.length)
    let finalCityList = []

    let temp = cityList.filter(
      item => {
        let text = item.short.slice(0, num).toLowerCase()
        return (text && text == sd)
      }
    )
    //在城市数据中，添加简拼到“shorter”属性，就可以实现简拼搜索
    let tempShorter = cityList.filter(
      itemShorter => {
        if (itemShorter.shorter) {
          let textShorter = itemShorter.shorter.slice(0, num).toLowerCase()
        return (textShorter && textShorter == sd)
        }
        return
      }
    )

    let tempChinese = cityList.filter(
      itemChinese => {
        let textChinese = itemChinese.city.slice(0, num)
        return (textChinese && textChinese == sd)
      }
    )

    if (temp[0]) {
      temp.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        }
      )
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempShorter[0]) {
      tempShorter.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        }
      );
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempChinese[0]) {
      tempChinese.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        })
      this.setData({
        completeList: finalCityList,
      })
    } else {
      return
    }
  },
})
