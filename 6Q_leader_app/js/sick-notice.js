(function () {
  "use strict";
  var LIST = "pages/message/noticeList";
  var DETAIL = "pages/message/sickDetail";
  var MY_CLASS = "A1班";
  var q = "";
  var read = false;
  var demo = { role: "chief", unread: 1 };
  var RECORDS = [
    { flag: "发热", userType: "学员", name: "王小满", klass: "A1班", when: "2026-10-18 09:20", detail: "体温38.6℃，已服布洛芬", status: "正常" },
    { flag: "上呼吸道感染", userType: "学员", name: "李可", klass: "A1班", when: "2026-10-18 14:10", detail: "咳嗽流涕，对症用药", status: "正常" },
    { flag: "外伤", userType: "学员", name: "孙悦", klass: "A2班", when: "2026-10-18 16:00", detail: "膝盖擦伤，已消毒", status: "正常" },
    { flag: "胃肠道感染", userType: "工作人员", name: "周宁", klass: "A1班", when: "2026-10-18 11:30", detail: "腹泻，已休息", status: "正常" },
    { flag: "发热", userType: "工作人员", name: "韩朔", klass: "B1班", when: "2026-10-18 08:10", detail: "低热，继续观察", status: "正常" },
    { flag: "发热", userType: "学员", name: "赵一", klass: "A1班", when: "2026-10-17 20:10", detail: "已退热", status: "作废" }
  ];

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }
  function alive() { return RECORDS.filter(function (r) { return r.status === "正常"; }); }
  function students() {
    return alive().filter(function (r) { return r.userType === "学员" && r.klass === MY_CLASS; });
  }
  function staffCount() {
    return alive().filter(function (r) { return r.userType === "工作人员"; }).length;
  }
  function summary() {
    return MY_CLASS + "生病学员" + students().length + "人，工作人员生病" + staffCount() + "人";
  }
  /* 原型评审第二轮第9条：就医消息的可见范围放开到
     助教正团、助教副团、见习副团（助教团长保留）。
     其他岗位仍可进消息列表看历史，但没有就医通知。 */
  var SICK_POSTS = ["助教团长", "助教正团", "助教副团", "见习副团"];

  function isChief() {
    if (demo.role === "other") return false;
    if (demo.role === "chief") return true;
    if (demo.role === "vice") return true;
    if (demo.role === "vtrainee") return true;
    var post = "";
    if (window.EX && window.EX.actor) post = window.EX.actor().post || "";
    else if (window.APP && window.APP.aideChief && window.APP.aideChief()) post = "助教团长";
    return SICK_POSTS.indexOf(post) >= 0;
  }
  function hasUnread() {
    if (!isChief()) return false;
    if (demo.unread === 0) return false;
    if (demo.unread === 1) return !read;
    return true;
  }
  function nav(title) {
    return '<header class="sn-nav"><button type="button" data-back="1" aria-label="返回"></button><h1>' + esc(title) + "</h1></header>";
  }
  function entryCard() {
    if (hasUnread()) {
      return '<button type="button" class="sn-entry" data-go="' + LIST + '"><span class="sn-entry-ic"><i class="sn-dot"></i></span>' +
        '<div class="sn-entry-txt"><b>消息通知</b><p>学员就医通知：' + esc(summary()) + "</p></div>" +
        '<em class="sn-entry-new">未读</em></button>';
    }
    var quiet = isChief() ? "已读" : "暂无新消息";
    return '<button type="button" class="sn-entry is-quiet" data-go="' + LIST + '"><span class="sn-entry-ic"></span>' +
      '<div class="sn-entry-txt"><b>消息通知</b></div><em>' + quiet + "</em></button>";
  }
  function listPage() {
    var chief = isChief();
    if (chief) read = true;
    var text = "学员就医通知 " + summary();
    var show = chief && (!q || text.indexOf(q) >= 0);    var html = nav("消息通知");
    html += '<div class="sn-search"><input data-sick-q="1" value="' + esc(q) + '" placeholder="搜索消息通知内容" /><button type="button" data-sick="search">搜索</button></div>';
    html += '<div class="sn-body">';
    if (!show) {
      html += '<div class="sn-empty"><i></i><p>暂无内容～</p></div>';
    } else {
      html += '<button type="button" class="sn-card" data-go="' + DETAIL + '"><b>学员就医通知</b><span>' + esc(summary()) + '</span><em>2026-10-18 15:06 · 已读</em></button>';
    }
    html += "</div>";
    html += '<button type="button" class="sn-note" data-note="44">1</button>';
    return html;
  }
  function detailPage() {
    var rows = students().map(function (r) {
      return '<article class="sn-person"><div class="sn-person-hd"><strong>' + esc(r.name) + '</strong><span>' + esc(r.flag) + "</span></div><p>" + esc(r.klass) + " · " + esc(r.when) + "</p><p>" + esc(r.detail) + "</p></article>";
    }).join("");
    return nav("通知详情") +
      '<div class="sn-body"><div class="sn-sum">' + esc(summary()) + "</div><h2>生病学员名单</h2>" +
      rows +
      '<p class="sn-staff">工作人员生病 ' + staffCount() + " 人，仍只显示人数。</p></div>" +
      '<button type="button" class="sn-note" data-note="44">1</button>';
  }
  function notes() {
    /* 注释走手机右侧的侧栏，不覆盖原型画面。 */
    var panel = window.NoteDock.host();
    panel.innerHTML =
      '<h2>消息通知 · 本页 1 条需求</h2>' +
      '<p class="sn-rule">一个红色序号对应一条需求。</p>' +
      '<h3><span>1</span><i>new</i> 学员就医通知 <b>清单第 44 条</b></h3>' +
      '<div><h4>过往逻辑 · v3.4.0</h4><p>学员就医的通知在 6Q商城通知里。助教团长只能看到自己班级的生病学员人数，以及工作人员生病的人数。领袖营 APP 的待办里没有消息入口。就医记录在薪酬板块按人登记，类别是上呼吸道感染、胃肠道感染、发热、外伤、其他，人员类型是学员或工作人员，状态是正常或作废。</p></div>' +
      '<div><h4>现在的逻辑 · v3.5.0</h4><p>设计已实现。待办首页顶部有消息通知入口，所有岗位都能看到。有新的就医通知时展开成卡片，带红点并给人数摘要；没有新消息时收成一条细行，只写消息通知和暂无新消息，不打扰。点开是消息列表，再点开是通知详情。详情用状态为正常的就医记录组名单，本班学员带姓名、就医类别、就医时间和用药及情况概述。作废记录和其他班学员不进名单。工作人员仍只报人数。原型评审第二轮第9条将就医通知的可见范围放开到：助教团长、助教正团、助教副团、见习副团。这四类岗位点开列表即已读，入口收回细行并显示已读。其他岗位仍能进消息列表查历史，但没有就医通知，列表为空。问卷催办等其它消息本次不展示。</p></div>' +
      '<h4 class="sn-demo-hd">状态演示</h4>' +
      '<p class="sn-rule">点下面的按钮可以直接切换入口状态，不用改岗位。</p>' +
      '<div class="sn-demo">' +
      '<span>入口状态</span>' +
      '<button type="button" data-sick-demo="unread" class="' + (isChief() && hasUnread() ? "on" : "") + '">有未读：展开+红点</button>' +
      '<button type="button" data-sick-demo="read" class="' + (isChief() && !hasUnread() ? "on" : "") + '">已读：收成细行</button>' +
      '<button type="button" data-sick-demo="none" class="' + (!isChief() ? "on" : "") + '">无消息：细行暂无新消息</button>' +
      "</div>" +
      '<div class="sn-demo"><span>当前身份</span>' +
      '<button type="button" data-sick-demo="chief" class="' + (demo.role === "chief" || (demo.role !== "other" && demo.role !== "vice" && demo.role !== "vtrainee" && isChief()) ? "on" : "") + '">助教正团 / 助教团长</button>' +
      '<button type="button" data-sick-demo="vice" class="' + (demo.role === "vice" ? "on" : "") + '">助教副团（有就医通知）</button>' +
      '<button type="button" data-sick-demo="vtrainee" class="' + (demo.role === "vtrainee" ? "on" : "") + '">见习副团（有就医通知）</button>' +
      '<button type="button" data-sick-demo="other" class="' + (!isChief() ? "on" : "") + '">其他岗位（无就医通知）</button>' +
      "</div>" +
      '<table><tr><th>元素</th><th>说明</th></tr><tr><td>消息通知</td><td>所有岗位可见。有未读时展开带红点，无未读时收成细行。</td></tr><tr><td>消息列表</td><td>和 6Q商城通知同一套列表，先给人数。没有消息时显示暂无内容。</td></tr><tr><td>生病学员名单</td><td>通知详情。只列本班正常学员。可见岗位：助教团长、助教正团、助教副团、见习副团。</td></tr><tr><td>已读</td><td>上述四类岗位点开消息列表即已读，入口收回细行。</td></tr><tr><td>状态切换</td><td>本演示专用。有未读、已读、无消息、助教团长、其他岗位五种。</td></tr></table>' +
      '<button type="button" data-sick="close-note">关闭</button>';
    panel.classList.add("is-open");
  }
  function closeNotes() {
    window.NoteDock.hide();
  }
  function applyDemo(demoKey) {
    if (demoKey === "unread") { demo.role = "chief"; demo.unread = 2; read = false; }
    if (demoKey === "read") { demo.role = "chief"; demo.unread = 0; read = true; }
    if (demoKey === "none") { demo.role = "other"; }
    if (demoKey === "chief") { demo.role = "chief"; demo.unread = 1; read = false; }
    if (demoKey === "vice") { demo.role = "vice"; demo.unread = 1; read = false; }
    if (demoKey === "vtrainee") { demo.role = "vtrainee"; demo.unread = 1; read = false; }
    if (demoKey === "other") { demo.role = "other"; }
    if (window.APP) {
      var path = window.APP.path ? window.APP.path() : "";
      if (demo.role === "other" && path.indexOf("pages/message/") === 0) window.APP.go("pages/tabBar/pending");
      else window.APP.render();
    }
    notes();
  }
  document.addEventListener("click", function (event) {
    var btn = event.target.closest && event.target.closest("[data-sick-demo]");
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    applyDemo(btn.getAttribute("data-sick-demo"));
  }, true);

  window.SICK = {    has: function (path) { return path === LIST || path === DETAIL; },
    render: function (path) { return path === DETAIL ? detailPage() : listPage(); },
    entry: entryCard,
    guard: function () {
      var path = window.APP && window.APP.path ? window.APP.path() : "";
      if (!isChief() && path === DETAIL) {
        window.APP.go(LIST);
        return true;
      }
      return false;
    },
    openNotes: notes,
    handle: function (el) {
      var demoKey = el.getAttribute("data-sick-demo");
      if (demoKey) { applyDemo(demoKey); return true; }
      if (el.getAttribute("data-sick") === "close-note") { closeNotes(); return true; }
      if (el.getAttribute("data-sick") === "search") {
        var input = document.querySelector("[data-sick-q]");
        q = input ? input.value.trim() : "";
        if (window.APP) window.APP.render();
        return true;
      }
      if (el.getAttribute("data-note") === "44") { notes(); return true; }
      return false;
    }
  };
})();
