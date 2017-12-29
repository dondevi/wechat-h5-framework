/**
 * @overview XFH5
 *
 * =============================================================================
 *  SPA 单页模式
 * =============================================================================
 *
 *  说明:
 *    1.实现 SPA 单页应用
 *
 *  结构:
 *    <body>
 *      <section class="page" id="page-id-1">...</section>
 *      <section class="page" id="page-id-2">...</section>
 *      ...
 *    </body>
 *
 *  API:
 *    1.HTML:
 *      1.显示页面同时记录历史: 指定 <a> 标签的 href 属性 (pageID + pageData)
 *        例如: <a href="#page-home&data=pageData">首页</a>
 *        注意:
 *          1.pageData 为 JSON 字符串格式
 *          2."&data=pageData" 会自动从 url 中清除
 *          3.如果使用 "&hold-data=pageData" 则不被清除
 *    2.Javascript:
 *      1.显示页面同时记录历史: $.ui.open(pageID, pageData);
 *      2.显示页面并覆盖当前历史: $.ui.replace(pageID, pageData);
 *    3.Event:
 *      1.获取数据: event.pageData;
 *      2.获取上文页面ID: event.referrer;
 *      3.阻止页面跳转: event.preventDefault();
 *      4.阻止页面显示: event.skipDisplay(callback);
 *
 *  原理:
 *    1.通过 pageID (例: #page-home) 找到相应页面
 *    2.设置 .active 显示页面
 *    3.设置 .left, .right, .next, .prev 等添加滑动效果
 *
 *  注意:
 *    1.历史记录只能由点击或程序产生，如果在地址栏输入将导致历史错乱
 *    2.pageID 可以是 DOM 或 $(DOM)
 *
 * =============================================================================
 *
 * @require modules/Core/core.js, modules/Core/fn.js, modules/Core/event.js
 * @require ./history.js
 *
 * @author dondevi
 * @create 2014-08-22
 * @version 1.4.0
 *
 * @update 2015-03-11 dondevi
 * @update 2015-03-31 dondevi
 *   1.重构, 优化
 *   2.将 history 分离
 *   3.去除 data-page, 所有页面均加入历史
 * @update 2015-06-09 dondevi
 *   1.抽离 triggerPageOpen 和 preventPageOpen 方法
 *   2.新增 setPageState 方法和 $.ui.page.setState 接口
 * @update 2015-09-16 dondevi
 *   1.新增 hold-data, 可保留在浏览器历史中不被清除
 * @update 2015-12-09 dondevi
 *   1.修复微信端不能改Title的Bug
 * @update 2016-05-17 dondevi
 *   1.Fix: first time skip history (HACK)
 * @update 2016-06-03 dondevi
 *   1.Fix: hold-data should add history
 * @update 2016-07-07 dondevi
 *   1.Add: page close event
 * @update 2016-10-10 dondevi
 *   1.Remove: ship history
 *   1.Fix: close event should not trigger on the first time
 * @update 2016-12-25 dondevi
 *   1.Add: event.holdData
 *
 */

/**
 * ---------------------------------------------------------------------------
 *  Event Binding
 * ---------------------------------------------------------------------------
 */
import iframHolder from "themes/default/images/1px.png";

if ($(".page")[0]) {
  $(window).on("hashchange", HANDLER_hashChange);
  /**
   * 修改微信 Webview 的 title
   * @since 1.3.0
   */
  var needFixedTitle = $.device.Wechat && $.device.iOS && !!$(".page[data-title]")[0];
  if (needFixedTitle) {
    var iframe = document.createElement("iframe");
    iframe.src = iframHolder;
    iframe.style.display = "none";
    document.body.classList.add("no-navbar");
    document.body.appendChild(iframe);
  }
}





/**
 * ---------------------------------------------------------------------------
 *  Event Handler
 * ---------------------------------------------------------------------------
 */

// 处理 URL 改变事件
function HANDLER_hashChange (event) {

  // 阻止覆盖历史时的重复执行
  if ($.history.locked) {
    $.history.locked = false;
    return;
  }

  // 获取页面ID
  var hash   = window.location.hash;
  var pageID = hash.split("&")[0];
  var nowID  = $.history.nowID;
  var page   = $(pageID)[0];

  if (!/#page-/.test(pageID)) {
    return true;
  }

  if (!page) {
    $.history.locked = true;
    return window.history.back();
  }

  // 获取数据
  var hashData = window.decodeURIComponent(hash.split(/&data=/)[1] || "");
  var holdData = window.decodeURIComponent(hash.split(/&hold-data=/)[1] || "");
  hashData = JSON.parse(hashData || null);
  holdData = JSON.parse(holdData || null);
  var pageData = $.history.data || hashData || holdData;

  if ($.history.data) {
    $.history.data = null;
  }

  // 触发 close 事件
  var closeEvent = triggerPageClose(nowID, pageID, pageData, holdData);

  // 触发 open 事件
  var openEvent = {};
  if (!closeEvent.defaultPrevented) {
    openEvent = triggerPageOpen(pageID, nowID, pageData, holdData);
  }

  // 判断是否阻止页面跳转
  // 需放在 $.history.update 之前
  if (closeEvent.defaultPrevented || openEvent.defaultPrevented) {
    if (holdData) {
      return preventPageEvent(hash);
    } else {
      return preventPageEvent(pageID);
    }
  }

  // 更新历史
  if (holdData) {
    $.history.update(hash);
  } else {
    $.history.update(pageID);
    // 清除 hash 里的 data
    // 需放在 $.history.update 之后
    if (hashData) {
      $.history.locked = true;
      $.history.replace(pageID);
    }
  }

  // 不显示页面
  if (openEvent.skipDisplay) {
    if ("function" === typeof openEvent.skipDisplay) {
      openEvent.skipDisplay();
    }
    return;
  }

  // 显示页面
  if (RENDER_displayPage(pageID, nowID)) {
    // 记录当前历史
    $.history.nowID = pageID;
  }

  // 百度统计PV跟踪
  // window._hmt && window._hmt.push(["_trackPageview", window.location.pathname.replace(/([^\/])$/,"$1/") + pageID.substring(1)]);

}





/**
 * ---------------------------------------------------------------------------
 *  Core Logic
 * ---------------------------------------------------------------------------
 */

// 页面滑动效果
// function animate ($target, $current, isBack) {

//   $target.removeClass("left");
//          .removeClass("right");
//          .removeClass("next");
//          .removeClass("prev");

//   var dir = "left";
//   var sib = "next";

//   if (isBack) {
//     dir = "right";
//     sib = "prev";
//   }

//   $current.addClass(dir);
//   $target.addClass(sib);

//   setTimeout(function () {
//     $target.addClass(dir);
//   }, 3);

//   setTimeout(function () {
//     $current.removeClass("active" + " " + dir);
//     $target.removeClass(sib + " " + dir).addClass("active");
//   }, 224);

// }


/**
 * 显示页面
 * @param {string} pageID - 目标页面ID
 * @param {string} nowID  - 当前页面ID
 */
function RENDER_displayPage (pageID, nowID) {
  if (pageID === nowID) {
    return false;
  }
  var $current = $(nowID);
  var $target  = $(pageID);
  // 切换页面
  // if (false && $.device.iOS) {
  //   animate($target, $current, isBack);
  // } else {
    $target.addClass("active");
    $current.removeClass("active");
  // }
  // 改变 Title
  var title = $target[0].dataset['title'];
  title && RENDER_documentTitle(title);
  return true;
}

// 改变文档标题
function RENDER_documentTitle (title) {
  document.title = title;
  if (needFixedTitle) {
    window.setTimeout(function () {
      iframe.contentWindow.location.reload();
    });
  }
}


// 触发页面 open 事件
function triggerPageOpen (pageID, nowID, pageData, holdData) {
  /**
   * @event Page#open
   * @property {String} referrer 上一个页面ID
   * @property {*}      pageData  页面数据
   */
  var pageEvent = $.Event("open", {
    referrer: nowID || pageID,
    pageData: pageData,
    holdData: holdData
  });
  $(pageID).trigger(pageEvent);
  return pageEvent;
}


// 触发页面 close 事件
function triggerPageClose (nowID, pageID, pageData, holdData) {
  if (!nowID) { return {}; }
  /**
   * @event Page#close
   */
  var pageEvent = $.Event("close", {
    referrer: pageID || nowID,
    pageData: pageData,
    holdData: holdData
  });
  $(nowID).trigger(pageEvent);
  return pageEvent;
}


// 阻止页面跳转
function preventPageEvent (pageID) {
  if ($.history.nowID) {
    $.history.locked = true;
  } else {
    $(pageID).removeClass("active");
    return window.history.back();
  }
  // 预期后退
  if ($.history.find(pageID)) {
    window.history.forward();
  // 预期前进
  } else {
    window.history.back();
  }
}





/**
 * ---------------------------------------------------------------------------
 *  Exports
 * ---------------------------------------------------------------------------
*/
$.ui = $.ui || {};

/**
 * @extension $.ui
 */
$.ui.page = {

  // 打开页面
  open (pageID, pageData, isHoldData) {
    if (isHoldData) {
      $.history.go(pageID + "&hold-data=" + window.encodeURIComponent(JSON.stringify(pageData)));
    } else {
      $.history.data = pageData;
      $.history.go(pageID);
    }
    return $(pageID);
  },

  // 打开页面(覆盖当前历史)
  replace (pageID, pageData, isHoldData) {
    if (isHoldData) {
      $.history.replace(pageID + "&hold-data=" + window.encodeURIComponent(JSON.stringify(pageData)));
    } else {
      $.history.data = pageData;
      $.history.replace(pageID);
    }
    return $(pageID);
  },

  // 返回首页
  home (pageData) {
    var pageID = $.history.records[0];
    $.history.data = pageData;
    $.history.go(pageID);
    return $(pageID);
  },

  // 后退页面
  back (pageData) {
    $.history.data = pageData;
    window.history.back();
  },

  // 设置文档标题 (微信)
  setTitle (pageID, title){
    var page = $(pageID)[0];
    if (page) {
      if (needFixedTitle) {
        page.dataset["title"] = title;
      } else {
        var navTitle = $(page).find(".navbar").find("h2")[0];
        navTitle && (navTitle.innerHTML = title);
      }
    }
    RENDER_documentTitle(title);
  },

  // 获取页面状态
  getState (pageID, stateID) {
    var page = $(pageID)[0];
    if (!page) {
      return;
    }
    return +page.className.match(/.*page-type-(\d)|/)[1];
  },

  /**
   * 设置页面状态
   * @deprecated
   */
  setState (pageID, stateID) {
    var page = $(pageID)[0];
    if (!page) {
      return;
    }
    var className = page.className;
    var stateName = stateID ? "page-type-" + stateID : "";
    if (/page-type-\d/.test(className)) {
      page.className = className.replace(/page-type-(\d)/, stateName);
    } else {
      page.className += " " + stateName;
    }
  }

};
