/**
 * @overview XFH5
 *
 * =============================================================================
 *  History 页面历史
 * =============================================================================
 *
 *  说明:
 *    处理单页模式的页面历史
 *
 * =============================================================================
 *
 * @require modules/Core/core.js, modules/Core/fn.js, modules/Core/event.js
 * @require ./page.js
 *
 * @author dondevi
 * @create 2014-03-31
 * @version 1.4.2
 *
 * @update 2015-09-17 dondevi
 *   1.添加页面定位功能
 * @update 2016-04-22 dondevi
 *   1.Fixed bug
 * @update 2016-07-14 dondevi
 *   1.Add: sessionStorage
 * @update 2016-08-02 dondevi
 *   1.Reduce First screen time
 */





/**
 * ---------------------------------------------------------------------------
 *  Init
 * ---------------------------------------------------------------------------
 */
if ($(".page")[0]) {
  setHomeByActive() || setHomeByHash() || setHomeByDefault();
}

// 从 className 设置首页
function setHomeByActive (nowID) {
  var home = $(".page.active")[0];
  if (!home) { return false; }
  var homeID = "#" + home.id;
  initReplace(homeID);
  return true;
}

// 从 URL Hash 设置首页
function setHomeByHash () {
  var hash = window.location.hash;
  var pageID = hash.split("&")[0];
  var page = $(pageID)[0];
  if (!page) { return false; }
  page.classList.add("active");
  initReplace(hash);
  return true;
}

// 设置默认首页
function setHomeByDefault () {
  var defHome = $(".page:not(.hide)")[0];
  if (!defHome) { return false; }
  var defID = "#" + defHome.id;
  defHome.classList.add("active");
  initReplace(defID);
  return true;
}

function initReplace (pageID) {
  if("complete" === document.readyState) {
    replace(pageID);
  } else {
    $(document).on("readystatechange", function (event) {
      if("complete" === document.readyState) {
        replace(pageID);
      }
    });
  }
}




/**
 * ---------------------------------------------------------------------------
 *  Variable
 * ---------------------------------------------------------------------------
 */

var _records = window.sessionStorage.getItem("BROWSER_history");
_records = _records && JSON.parse(_records) || [];





/**
 * ---------------------------------------------------------------------------
 *  Function
 * ---------------------------------------------------------------------------
 */

// 历史定位
function find (pageID) {
  return _records.indexOf(pageID) + 1;
};

// 更新历史
function update (pageID) {
  var index = find(pageID);
  if (index) {
    _records.splice(index);
  } else {
    _records.push(pageID);
  }
  window.sessionStorage.setItem("BROWSER_history", JSON.stringify(_records));
};

// 跳至历史
function go (pageID) {
  var index = find(pageID);
  if (index) {
    fallback(index);
  } else {
    window.location.hash = pageID;
  }
};

// 历史回退
function fallback (index) {
  var offset = index - _records.length;
  if (0 > offset) {
    window.history.go(offset);
  }
};

// 覆盖历史
function replace (pageID) {
  if (pageID !== $.history.nowID) {
    _records.pop();
    _records.push(pageID);
  }
  var url = window.location.href.split("#")[0] + pageID;
  if (window.history && window.history.replaceState) {
    // Fixed Android bug
    window.history.replaceState(null, document.title, url);
    $(window).trigger("hashchange");
  } else {
    if (pageID === window.location.hash) {
      $(window).trigger("hashchange");
    } else {
      window.location.replace(url);
    }
  }
};





/**
 * ---------------------------------------------------------------------------
 *  Export API
 * ---------------------------------------------------------------------------
 */

$.history = {
  locked:  false,
  nowID:   "",
  records: _records,
  go:      go,
  find:    find,
  update:  update,
  replace: replace
};
