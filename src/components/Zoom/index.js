/**
 * @overview XFH5
 *
 * =============================================================================
 *  Zoom 查看大图
 * =============================================================================
 *
 *  说明:
 *    实现点击显示大图效果
 *
 *  结构:
 *    <img src="/photo1.jpg" data-zoomset='["http://wx.xfxg.cn/photo1.jpg", "http://wx.xfxg.cn/photo2.jpg"]'>
 *
 *  原理:
 *    使用微信JSSDK
 *
 *  使用:
 *    1.HTML:
 *      1.指定 <img> 标签的 data-zoomset 属性(图片完整地址数组)
 *
 * =============================================================================
 *
 * @require modules/Core/core.js, modules/Core/fn.js, modules/Core/event.js
 *
 * @author dondevi
 * @create 2014-09-04
 * @update 2015-01-20
 *
 */


$(document.body).on("click", function (event) {
  var target = event.target;
  if ("zoomset" in target.dataset) {
    var zoomset = target.dataset["zoomset"];
    zoomset = zoomset || "[\"" + target.src + "\"]";
    window.wx.previewImage({
      current: target.src,
      urls: JSON.parse(zoomset)
    });
    return false;
  }
});
