/**
 * 注入顶栏、侧栏、面包屑；未复刻节点进占位页。
 */
(function () {
  "use strict";

  var PAGE = document.body.getAttribute("data-lb-page") || "";
  if (!PAGE) {
    PAGE = new URLSearchParams(location.search).get("p") || "";
    if (PAGE) document.body.setAttribute("data-lb-page", PAGE);
  }

  function placeholderHref(id, label) {
    return "placeholder.html?m=" + encodeURIComponent(id) + "&label=" + encodeURIComponent(label);
  }

  function nodeHref(node) {
    if (node.href) return node.href;
    return placeholderHref(node.id, node.label);
  }

  function isActive(node) {
    if (node.id === PAGE) return true;
    if (node.children) {
      return node.children.some(isActive);
    }
    return false;
  }

  /* 计划与实施的页面：营地管理。 */
  function isPlanPage() {
    return PAGE === "camp-manage";
  }

  /* 高EQ导师管理 → 档案管理。领袖营授课档案是原页，导师课程档案是第61条所在页。 */
  function isEqPage() {
    return PAGE === "mentor-lesson-archive" || PAGE === "mentor-course-archive";
  }

  function topHref(item) {
    if (item.id === "biz-6q") return "camp-implement.html";
    if (item.id === "lingxiu-pay") return "replica.html?p=talent-pool";
    if (item.id === "eq-mentor") return "replica.html?p=mentor-course-archive";
    if (item.id === "plan") return "replica.html?p=camp-manage";
    return placeholderHref("top-" + item.id, item.label);
  }

  function topCurrent(item) {
    if (isEqPage()) return item.id === "eq-mentor";
    if (isPlanPage()) return item.id === "plan";
    var line = document.body.getAttribute("data-lb-line") || "";
    if (line === "biz") return item.id === "biz-6q";
    return !!item.current;
  }

  function menuTree() {
    if (isEqPage() && window.LB_MENU.eqMenu) return window.LB_MENU.eqMenu;
    if (isPlanPage() && window.LB_MENU.planMenu) return window.LB_MENU.planMenu;
    var line = document.body.getAttribute("data-lb-line") || "";
    if (line === "biz" && window.LB_MENU.bizMenu) return window.LB_MENU.bizMenu;
    return window.LB_MENU.sideMenu;
  }

  function renderTop() {
    var el = document.getElementById("lb-header-mount");
    if (!el || !window.LB_MENU) return;
    var nav = window.LB_MENU.topNav
      .map(function (item) {
        var cls = topCurrent(item) ? ' class="is-current"' : "";
        return "<a" + cls + ' href="' + topHref(item) + '">' + item.label + "</a>";
      })
      .join("");
    el.innerHTML =
      '<div class="lb-brand"><span class="lb-brand__mark" aria-hidden="true"></span>6Q后台管理系统<span class="lb-ver">v3.4.0</span></div>' +
      '<nav class="lb-topnav" aria-label="业务线">' +
      nav +
      "</nav>" +
      '<div class="lb-header__user"><a class="lb-list-back" href="index.html">功能清单</a><a class="lb-list-back" href="../6Q_leader_app/index.html#/pages/tabBar/work">APP 端</a><span class="lb-avatar">余</span>余炜烽</div>';
  }

  function renderNode(node, depth) {
    if (node.children && node.children.length) {
      var open = isActive(node) ? " open" : "";
      var kids = node.children.map(function (c) {
        return renderNode(c, depth + 1);
      }).join("");
      return (
        "<details" +
        open +
        '><summary>' +
        node.label +
        "</summary><div class=\"lb-nav-sub\">" +
        kids +
        "</div></details>"
      );
    }
    var line = document.body.getAttribute("data-lb-line") || "";
    var bizOpen = { "connect-camp": 1, "camp-implement": 1 };
    var disabled = node.disabled || (line === "biz" && !bizOpen[node.id]);
    if (disabled) return '<span class="is-disabled">' + node.label + "</span>";
    var cls = node.id === PAGE ? " is-active" : "";
    if (node.isNew) cls += " is-new";
    var badge = node.badge ? '<em class="lb-menu-badge">' + node.badge + "</em>" : "";
    return '<a class="' + cls.trim() + '" href="' + nodeHref(node) + '">' + node.label + badge + "</a>";
  }

  function renderSide() {
    var el = document.getElementById("lb-side-mount");
    if (!el || !window.LB_MENU) return;
    el.innerHTML = menuTree().map(function (n) {
      return renderNode(n, 0);
    }).join("");
  }

  function findTrail(nodes, trail) {
    trail = trail || [];
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var next = trail.concat([n.label]);
      if (n.id === PAGE) return next;
      if (n.children) {
        var hit = findTrail(n.children, next);
        if (hit) return hit;
      }
    }
    return null;
  }

  function renderCrumb() {
    var el = document.getElementById("lb-crumb-mount");
    if (!el || !window.LB_MENU) return;
    var trail = findTrail(menuTree()) || [document.title];
    el.innerHTML =
      '<a href="index.html">原型导航</a><span>/</span>' +
      trail
        .map(function (t, i) {
          return i === trail.length - 1 ? "<strong>" + t + "</strong>" : "<span>" + t + "</span>";
        })
        .join("<span>/</span>");
  }

  window.LB = window.LB || {};
  window.LB.toast = function (text) {
    var el = document.getElementById("lb-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "lb-toast";
      el.className = "lb-toast";
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.add("is-on");
    clearTimeout(window.LB._toastTimer);
    window.LB._toastTimer = setTimeout(function () {
      el.classList.remove("is-on");
    }, 1800);
  };

  window.LB.openDrawer = function (title, html, opts) {
    var mask = document.getElementById("lb-mask");
    var drawer = document.getElementById("lb-drawer");
    if (!mask || !drawer) return;
    opts = opts || {};
    document.getElementById("lb-drawer-title").textContent = title;
    document.getElementById("lb-drawer-body").innerHTML = html;
    drawer.classList.toggle("lb-drawer--wide", !!opts.wide);
    drawer.classList.toggle("lb-drawer--staff", !!opts.staff);
    drawer.classList.toggle("lb-drawer--paper", !!opts.paper);
    mask.classList.add("is-open");
    drawer.classList.add("is-open");
  };

  window.LB.closeDrawer = function () {
    var mask = document.getElementById("lb-mask");
    var drawer = document.getElementById("lb-drawer");
    if (mask) mask.classList.remove("is-open");
    if (drawer) {
      drawer.classList.remove("is-open");
      drawer.classList.remove("lb-drawer--wide");
      drawer.classList.remove("lb-drawer--staff");
      drawer.classList.remove("lb-drawer--paper");
    }
  };

  function ensureModal() {
    if (document.getElementById("lb-modal")) return;
    var wrap = document.createElement("div");
    wrap.id = "lb-modal";
    wrap.className = "lb-modal";
    wrap.innerHTML =
      '<div class="lb-modal__card">' +
      '<p class="lb-modal__text" id="lb-modal-text"></p>' +
      '<div class="lb-modal__actions">' +
      '<button type="button" class="lb-btn" id="lb-modal-cancel">取消</button>' +
      '<button type="button" class="lb-btn lb-btn--primary" id="lb-modal-ok">确定</button>' +
      "</div></div>";
    document.body.appendChild(wrap);
  }

  window.LB.alert = function (text, onOk) {
    ensureModal();
    var box = document.getElementById("lb-modal");
    var cancel = document.getElementById("lb-modal-cancel");
    cancel.style.display = "none";
    document.getElementById("lb-modal-text").textContent = text;
    box.classList.add("is-open");
    function done() {
      box.classList.remove("is-open");
      cancel.style.display = "";
      document.getElementById("lb-modal-ok").onclick = null;
      if (onOk) onOk();
    }
    document.getElementById("lb-modal-ok").onclick = done;
  };

  window.LB.confirm = function (text, onOk) {
    ensureModal();
    var box = document.getElementById("lb-modal");
    var cancel = document.getElementById("lb-modal-cancel");
    cancel.style.display = "";
    document.getElementById("lb-modal-text").textContent = text;
    box.classList.add("is-open");
    function close() {
      box.classList.remove("is-open");
      document.getElementById("lb-modal-ok").onclick = null;
      cancel.onclick = null;
    }
    cancel.onclick = close;
    document.getElementById("lb-modal-ok").onclick = function () {
      close();
      if (onOk) onOk();
    };
  };

  renderTop();
  renderSide();
  renderCrumb();

  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "lb-mask") window.LB.closeDrawer();
    if (e.target && e.target.getAttribute("data-close-drawer") === "1") window.LB.closeDrawer();
  });
})();
