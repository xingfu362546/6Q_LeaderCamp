/**
 * APP 端注释侧栏。
 *
 * 注释不再用覆盖手机的 fixed 抽屉，改成放在手机右侧的侧栏：
 * 手机始终完整可见，注释和原型可以并排看、边点边对照。
 *
 * 用法：
 *   NoteDock.host()          取侧栏容器（会自动插入 .stage），往里写 innerHTML
 *   NoteDock.show(html)      写入内容并展开
 *   NoteDock.hide()          收起并清空
 *   NoteDock.noMask          兼容旧代码的假遮罩，classList.add/remove 都是空操作
 */
(function () {
  "use strict";

  var HOST_ID = "note-dock";
  var noMask = {
    classList: {
      add: function () {},
      remove: function () {},
      toggle: function () {},
      contains: function () { return false; }
    }
  };

  function host() {
    var el = document.getElementById(HOST_ID);
    if (el) return el;
    var stage = document.querySelector(".stage");
    el = document.createElement("aside");
    el.id = HOST_ID;
    el.className = "note-dock";
    if (stage) stage.appendChild(el);
    else document.body.appendChild(el);
    return el;
  }

  function show(html) {
    var el = host();
    el.innerHTML = html || "";
    el.classList.add("is-open");
    el.scrollTop = 0;
    cleanupLegacy();
    return el;
  }

  function hide() {
    var el = document.getElementById(HOST_ID);
    if (el) {
      el.classList.remove("is-open");
      el.innerHTML = "";
    }
  }

  function isOpen() {
    var el = document.getElementById(HOST_ID);
    return !!el && el.classList.contains("is-open");
  }

  /* 旧版注释是 body 里的 fixed 面板 + 遮罩。切到侧栏后把它们清掉，
     避免上一版留下的节点继续盖在手机上。 */
  function cleanupLegacy() {
    ["ex-notes-panel", "ex-notes-mask", "sign-notes-panel", "sign-notes-mask",
     "gi-notes-panel", "gi-notes-mask", "feed-notes-panel", "feed-notes-mask",
     "award-notes-panel", "award-notes-mask", "sn-notes"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
  }

  window.NoteDock = {
    host: host,
    show: show,
    hide: hide,
    isOpen: isOpen,
    noMask: noMask,
    cleanupLegacy: cleanupLegacy
  };
})();
