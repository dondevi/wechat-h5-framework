/**
 * @overview 工具库
 *
 * =============================================================================
 *  Date 时间处理
 * =============================================================================
 *
 *  API:
 *    1. Date.prototype.format(formatString);  // 格式化日期
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2016-01-18
 * @version 0.1.0
 *
 * @update 2017-05-23 dondevi
 *
 */


Date.prototype.format = function (format) {
  var values = {
    "(Y+)": this.getFullYear(),                     // year
    "(M+)": this.getMonth() + 1,                    // month
    "(D+)": this.getDate(),                         // day
    "(h+)": this.getHours(),                        // hour
    "(m+)": this.getMinutes(),                      // minute
    "(s+)": this.getSeconds(),                      // second
    "(q+)": Math.floor((this.getMonth() + 3) / 3),  // quarter
    "(ms)": this.getMilliseconds()                  // millisecond
  };
  var result = format || "YYYY-MM-DD";
  for (var key in values) {
    var value  = values[key].toString();
    var isUnit = 1 === value.length;
    value = isUnit ? "0" + value : value;
    if (new RegExp(key).test(result)) {
      var length = isUnit ? RegExp.$1.length : value.length;
      result = result.replace(RegExp.$1, value.substr(-length, length));
    }
  }
  return result;
};
