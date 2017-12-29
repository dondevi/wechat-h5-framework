/**
 * @overview 工具库
 *
 * =============================================================================
 *  GeoLocation 地理定位
 * =============================================================================
 *
 *  百度地图定位
 *  浏览器地理定位
 *
 * =============================================================================
 *
 * @require http://api.map.baidu.com/api?v=2.0
 * @require common/core/core.js
 *
 * @author dondevi
 * @create 2016-01-04
 * @version 1.1.2
 *
 * @update 2016-01-13 dondevi
 *   1. Error tips
 * @update 2016-05-11 dondevi
 *   1. Refactor
 * @update 2016-05-13 dondevi
 *   1. Transform to Event Callback API
 * @update 2016-05-13 dondevi
 *   1. Transform to Object API
 * @update 2016-05-16 dondevi
 *   1. Refactor: getGeoLocationByBroser
 * @update 2016-06-16 dondevi
 *   1. Add: getGeoLocationByWechat
 * @update 2016-06-28 dondevi
 *   1. Add: $.map.getGeoByCoords
 * @update 2017-04-10 dondevi
 *   1. Add: $.map.initBMap
 *
 */





/**
 * ---------------------------------------------------------------------------
 *  Variable
 * ---------------------------------------------------------------------------
 */

// 百度地图AK
var BMAP_AUTHENTIC_KEY = "b350mwMzIXGMnkrO1p3T6cCf";
var BMAP_SCRIPT_SRC = "http://api.map.baidu.com/api?v=2.0&ak=" + BMAP_AUTHENTIC_KEY;

var _geoLocation = null;





/**
 * ---------------------------------------------------------------------------
 *  Exports
 * ---------------------------------------------------------------------------
 */
$.map = $.map || {};

$.map.initBMap = function (callback) {
  var script = document.createElement("script");
  script.onload = callback;
  script.src = BMAP_SCRIPT_SRC;
  document.body.appendChild(script);
}

$.map.getGeolocation = function (options) {
  if (!options) { return; }
  if (_geoLocation) {
    options.success && options.success(_geoLocation);
    options.always && options.always(_geoLocation);
    return;
  }
  if (window.wx && window.wx.checkJsApi) {
    options.type = "WX";
  }
  if (window.BMap && window.BMap.Geolocation) {
    options.type = "BMap";
  }
  switch (options.type) {
    case "WX":
      return getGeoLocationFromWechat(options);
    case "BMap":
      if (!window.BMap || !window.BMap.Geolocation) {
        return $.map.initBMap(function () {
          getGeoLocationFromBaidu(options);
        });
      }
      return getGeoLocationFromBaidu(options);
    default:
      return getGeoLocationFromBrowser(options);
  }
};

$.map.getGeoByCoords = function (options) {
  JSONP_geoCoder(options.latitude, options.longitude, options.type, function (json) {
    var geo = convertGeo(json.result);
    options.success && options.success(geo);
  });
};





/**
 * ---------------------------------------------------------------------------
 *  Business Logic
 * ---------------------------------------------------------------------------
 */

/**
 * 微信地理定位
 * @param  {Object} options - 配置
 */
function getGeoLocationFromWechat (options) {
  window.wx.ready(function () {
    window.wx.getLocation({
      type: 'wgs84',
      success: function (coords) {
        // 转换为百度定位
        JSONP_geoCoder(coords.latitude, coords.longitude, "GPS", function (json) {
          var geo = convertGeo(json.result);
          geoSuccess(geo, options["success"], options["always"]);
        });
      }
    });
  });
}

/**
 * 百度地理定位
 * @param  {Object} options - 配置
 */
function getGeoLocationFromBaidu (options) {

  // 百度地图错误提示
  var BMAP_ERROR = {};
  BMAP_ERROR[BMAP_STATUS_UNKNOWN_LOCATION]    = "位置结果未知"; // 2
  BMAP_ERROR[BMAP_STATUS_UNKNOWN_ROUTE]       = "导航结果未知"; // 3
  BMAP_ERROR[BMAP_STATUS_INVALID_KEY]         = "非法密钥";     // 4
  BMAP_ERROR[BMAP_STATUS_INVALID_REQUEST]     = "非法请求位置"; // 5
  BMAP_ERROR[BMAP_STATUS_PERMISSION_DENIED]   = "没有权限";     // 6
  BMAP_ERROR[BMAP_STATUS_SERVICE_UNAVAILABLE] = "服务不可用";   // 7
  BMAP_ERROR[BMAP_STATUS_TIMEOUT]             = "请求超时";     // 8

  // 百度地图定位
  var geoLocation = new BMap.Geolocation();
  geoLocation.getCurrentPosition(function (geo) {
    var status = geoLocation.getStatus();
    switch(status) {
      case BMAP_STATUS_SUCCESS: // 0: 检索成功
        geoSuccess(geo, options["success"], options["always"]);
        break;
      case BMAP_STATUS_CITY_LIST: // 1: 城市列表
        break;
      default:
        geoError(BMAP_ERROR[status], options["fail"], options["always"]);
        break;
    }
  });

}


/**
 * 浏览器地理定位
 * @param  {Object} options - 配置
 */
function getGeoLocationFromBrowser (options) {
  if (!window.navigator.geolocation) {
    return geoError("您的浏览器不支持地理定位", options["fail"], options["always"]);
  }
  var ERROR = {};
  window.navigator.geolocation.getCurrentPosition(function (position) {
    var coords = position.coords;
    // 转换为百度定位
    JSONP_geoCoder(coords.latitude, coords.longitude, "GPS", function (json) {
      var geo = convertGeo(json.result);
      geoSuccess(geo, options["success"], options["always"]);
    });
  }, function (error) {
    ERROR[error.PERMISSION_DENIED]    = "用户不允许地理定位";  // 1
    ERROR[error.POSITION_UNAVAILABLE] = "无法获取当前位置";    // 2
    ERROR[error.TIMEOUT]              = "操作超时";            // 3
    ERROR[error.UNKNOWN_ERROR]        = "未知错误";
    geoError(ERROR[error.code], options["fail"], options["always"]);
    console.error("%cGeolocation Error: %c%s", "color:red", "", error.message);
  }, { timeout: 8000, maximumAge: 1000 });
}

// 转换定位数据
function convertGeo (result) {
  var coords = result.location;
  var address = result.addressComponent;
  address["city_code"] = result.cityCode;
  return {
    address:   address,
    latitude:  coords.lat,
    longitude: coords.lng,
    point: {
      lat: coords.lat,
      lng: coords.lng
    }
  };
};





/**
 * ---------------------------------------------------------------------------
 *  Core Logic
 * ---------------------------------------------------------------------------
 */

// 地理定位成功
function geoSuccess (geo, success, always) {
  // geo.address.city = {
  //   "阿坝藏族羌族自治州": "阿坝州",
  //   "甘孜藏族自治州": "甘孜州",
  //   "凉山彝族自治州": "凉山州",
  // }[geo.address.city] || geo.address.city;
  window.SESSION = window.SESSION || {};
  window.SESSION.geo = geo;
  _geoLocation = geo;
  success && success(geo);
  always && always(geo);
}

// 地理定位失败
function geoError (message, fail, always) {
  var geo = {
    point:     {},
    address:   {},
    latitude:  "",
    longitude: ""
  };
  window.alert(["定位失败", message || ""].join(": "));
  fail && fail(geo);
  always && always(geo);
}





/**
 * ---------------------------------------------------------------------------
 *  External API
 * ---------------------------------------------------------------------------
 */

/**
 * 访问百度地图 WebAPI
 * 转换成百度坐标
 * @param {string}   latitude  纬度
 * @param {string}   longitude 经度
 * @param {string}   type      定位类型
 * @param {Function} callback  回调函数
 * @see http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding
 */
function JSONP_geoCoder (latitude, longitude, type, callback) {
  var coordtype = { GPS: "wgs84ll", baidu: "bd09ll" };
  var api = "http://api.map.baidu.com/geocoder/v2/?output=json"
          + "&ak=" + BMAP_AUTHENTIC_KEY
          + "&coordtype=" + coordtype[type || "baidu"]
          + "&location=" + [latitude, longitude].join(",");
  JSONP(api, callback);
}

// 使用 Jsonp 方式调用接口
function JSONP (api, callback) {
  var script = document.createElement("script");
  var hook   = "_cbk" + Math.floor(1e4 * Math.random());
  window[hook] = function (result) {
    callback(result);
    script.parentNode.removeChild(script);
    script = null;
    delete window[hook];
  };
  script.src = api + "&callback=" + hook;
  document.body.appendChild(script);
}
