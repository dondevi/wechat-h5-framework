/**
 * =============================================================================
 *  Wechat h5 Framework Documentation
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-04-12
 */

(function (window, document) {

  "use strict";

  /**
   * Custom Element for Modal Dialog of Demo
   */
  var ModalDemoProto = Object.create(HTMLElement.prototype);
  ModalDemoProto.createdCallback = function () {
    this.className = "modal fade scrollable";
    this.dataset.dismiss = "#" + this.id;
    var dialog = document.createElement("div");
    var demo = document.createElement("div");
    dialog.className = "modal-dialog modal-content";
    demo.className = "demo";
    var that = this;
    window.setTimeout(function () {
      [].slice.call(that.children).forEach(function (child) {
        demo.appendChild(child);
      });
      dialog.appendChild(demo);
      that.appendChild(dialog);
    });
  };
  document.registerElement("modal-demo", {
    prototype: ModalDemoProto,
    extends: "div"
  });

  /**
   * Menu bar Switch
   */
  document.body.classList.add("show-toc");
  document.getElementById("btn-switch-menu").onclick = function (event) {
    document.body.classList.toggle("show-toc");
    this.classList.toggle("icon-minus");
    this.classList.toggle("icon-plus");
  };

  /**
   * Menu bar Scroll spy
   * @requires ./scrollSpy.js
   */
  window.scrollSpy({ anchorSelector: ".toc a", spyOffset: 300 });

  /**
   * Menu bar Prevent scroll when overflow
   */
  document.getElementsByClassName("toc")[0].onmousewheel = function (event) {
    var willScrollTop = this.scrollTop + event.deltaY;
    var maxScrollTop = this.scrollHeight - this.clientHeight;
    if (0 >= willScrollTop) {
      event.preventDefault();
      this.scrollTop = 0;
    }
    if (maxScrollTop <= willScrollTop) {
      event.preventDefault();
      this.scrollTop = maxScrollTop;
    }
  }

})(window, document);
