/**
 * @overview 工具库
 *
 * =============================================================================
 *  Time 时间处理
 * =============================================================================
 *
 *  API:
 *    1.比较时间:
 *      1. $.util.time(timeStr).lt(timeObj);  // 小于
 *      2. $.util.time(timeStr).eq(timeObj);  // 等于
 *      3. $.util.time(timeStr).gt(timeObj);  // 大于
 *      4. $.util.time(timeStr).lte(timeObj); // 小于等于
 *      5. $.util.time(timeStr).gte(timeObj); // 大于等于
 *    2.判断区间:
 *      1. $.util.time(intervalStr).has(timeObj);
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2015-02-11
 * @version 1.0.0
 *
 * @update 2015-02-28 dondevi
 */


function getTime (timeString) {
  var time = timeString.split(":");
  return { hour: +time[0], minute: +time[1] };
}

function getInterval (intervalString) {
  var interval = intervalString.split("-");
  return { start: getTime(interval[0]), end: getTime(interval[1]) };
}

function compareNum (num1, num2) {
  return num1 < num2 ? -1 : num1 > num2 ? 1 : 0;
}

function compareTime (time1, operator, time2) {
  var result = compareNum(time1.hour, time2.hour);
  if (0 === result) {
    result = compareNum(time1.minute, time2.minute);
  }
  switch (operator) {
    case "<":  return -1 === result;
    case "=":  return 0 === result;
    case ">":  return 1 === result;
    case "<=": return 0 >= result;
    case ">=": return 0 <= result;
    default:   return false;
  }
}

function inInterval (time, interval) {
  return compareTime(time, ">=", interval.start) &&
         compareTime(time, "<=", interval.end);
}

$.util.time = function (string) {
  if (/-/.test(string)) {
    var curInterval = getInterval(string);
    return {
      has: function (time) {
        return inInterval(time, curInterval);
      }
    };
  } else {
    var curTime = getTime(string);
    return {
      lt: function (time) {
        return compareTime(curTime, "<", time);
      },
      eq: function (time) {
        return compareTime(curTime, "=", time);
      },
      gt: function (time) {
        return compareTime(curTime, ">", time);
      },
      lte: function (time) {
        return compareTime(curTime, "<=", time);
      },
      gte: function (time) {
        return compareTime(curTime, ">=", time);
      }
    };
  }
}
