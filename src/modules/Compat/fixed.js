/**
 * @overview 核心库
 *
 * =============================================================================
 *  Compat - Feature Fixed 浏览器兼容补丁
 * =============================================================================
 *
 *  Intro:
 *    1.Not jQuery API design
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2016-07-05
 * @version 1.0.0
 * @todo Refactor
 *
 * @update 2017-05-23 dondevi
 *   1.Seperate from Core/compate.js
 *
 */

/**
 * Fixed Button :actived style
 * @author dondevi
 * @create 2015-08-13
 */
document.addEventListener("touchstart", () => {}, true);


/**
 * Fixed Audio
 * Some Android can't use play() by javascript
 * @author dondevi
 * @create 2016-07-05
 */
document.body.addEventListener("touchstart", HANDLER_touchBody);
function HANDLER_touchBody (event) {
  document.body.removeEventListener("touchstart", HANDLER_touchBody);
  audioFixed();
}
function fixedAudio () {
  var audios = document.getElementsByTagName("audio");
  Array.prototype.forEach.call(audios, audio => {
    if (!audio.paused) { return; }
    audio.play();
    audio.pause();
  });
}


/**
 * Fixed Keyboard Coverlap when editing
 * For Andriod
 */
if ($.device.Android) {
  var _editDom = null;
  var _editTimer = null;
  $(window).on("resize", function (event) {
    window.clearTimeout(_editTimer);
    _editTimer = window.setTimeout(function () {
      if (_editDom) {
        _editDom.scrollIntoView(false);
        _editDom = null;
      }
    }, 300);
  });
  $(document.body).on("focusin", function (event) {
    if (/INPUT|TEXAREA|SELECT/.test(event.target.nodeName)) {
      _editDom = event.target;
    }
  });
}
