/**
 * 家长端（小程序）演示：课程详情 → 入营问卷 / 离营问卷
 * 复刻对照：家长端「课程详情 · 待办事项」与「学习（入营 / 离营方式）」填写页截图。
 * 原型评审第二轮第48条把截止时间的落地页放在这里，功能清单第48 / 59 / 20 条跳转过来看。
 */
(function () {
  "use strict";

  var CAMP = {
    title: "EQ情感与合作",
    slogan: "让孩子成为自己情绪的主人",
    badge: "6天6夜，开启未来领袖营人生！",
    klass: "第六周EQ小班",
    kid: "王语晨",
    studyDay: 6,
    startText: "2023-08-12 16:00",
    endText: "2023-08-18 16:00",
    address: "广东省东莞市洪梅镇洪梅大道1号东莞市汇景酒店"
  };

  /* 截止时间按开营日推算：
     入营问卷 = 开营前 48 小时；离营问卷 = 开营第 4 天结束，即第 5 天 00:00。
     8-12 开营 → 入营 8-10 16:00 截止；8-15 为第 4 天 → 8-16 00:00 截止。 */
  var DEADLINE = {
    enter: "2026-08-10 16:00",
    leave: "2026-08-16 00:00"
  };

  var NOTICE = [
    "广州总部大巴：由总部统一发车，班期以通知为准，约 8:00 出发，车牌号在出发前一天通知。",
    "中山大巴：由中山办事处统一安排，集合点与时间以办事处通知为准。",
    "乘坐飞机、高铁到站的学员，请务必提前把航班 / 车次与到达时间告知老师，便于接站。"
  ];

  var NOTICE_TAIL = {
    leave: "抵达站点后如需他人代接，须提供亲属关系证明、亲属接送交接单及身份证件；学员独自离营须家长授权，学员签署免责声明并定期报告行程。",
    enter: "抵达站点后如需他人代送，须提供亲属关系证明、交接单及身份证件；学员独自到站须家长授权，学员签署安全责任书并定期报告行程。"
  };

  var WAYS = {
    leave: {
      key: "leave",
      nav: "离营方式",
      page: "离营问卷",
      no: "04",
      label: "离营方式？",
      req: "必填",
      hint: "按家长问卷填写的返程方式选择，选定后 05～07 跟着变。",
      opts: [
        { k: "A", t: "机场接离" },
        { k: "B", t: "火车/高铁接离" },
        { k: "C", t: "大巴接离（总站/固定区域/城市）" },
        { k: "D", t: "营地自离" }
      ],
      busLabel: "离营大巴路线（选择）",
      busHint: "选大巴接离时必填，其余方式可不填。",
      handLabel: "抵达站点后（区组固定下车点：车站 / 机场进站口），父母或他人接送情况（选择）",
      handOpts: [
        { k: "A", t: "父母到点自接" },
        { k: "B", t: "他人单独代接", sub: "需提供亲属关系证明、亲属接送交接单及身份证件" },
        { k: "C", t: "学员独自离营", sub: "需家长授权，学员签署免责声明并定期报告行程" }
      ],
      timeLabel: "父母/托人抵达站点时间（选择）",
      plateLabel: "车牌号（选填）",
      plateHint: "自驾接人时填写，便于营地放行。"
    },
    enter: {
      key: "enter",
      nav: "入营方式",
      page: "入营问卷",
      no: "04",
      label: "入营方式？",
      req: "必填",
      hint: "入营问卷只问抵达营地这一程，没有「营地自离」，到营地后由营地统一接收。",
      opts: [
        { k: "A", t: "机场接营" },
        { k: "B", t: "火车/高铁接营" },
        { k: "C", t: "大巴接营（总站/固定区域/城市）" },
        { k: "D", t: "家长自驾送达" }
      ],
      busLabel: "入营大巴路线（选择）",
      busHint: "选大巴接营时必填，其余方式可不填。",
      handLabel: "抵达站点后（区组固定上车点：车站 / 机场出站口），交接情况（选择）",
      handOpts: [
        { k: "A", t: "家长送到站点交给老师" },
        { k: "B", t: "他人单独代送", sub: "需提供亲属关系证明、交接单及身份证件" },
        { k: "C", t: "学员独自到站", sub: "需家长授权，学员签署安全责任书并定期报告行程" }
      ],
      timeLabel: "家长/托人送达站点时间（选择）",
      plateLabel: "车牌号（选填）",
      plateHint: "自驾送达时填写，便于营地放行。"
    }
  };

  var state = {
    page: "course",
    tab: "todo",
    /* 演示开关：问卷是否已过截止时间。用来对照第48条「截止前可改 / 截止后不可填」。 */
    closed: { enter: false, leave: false },
    ans: { enter: {}, leave: {} },
    submitted: { enter: "", leave: "" }
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function nav(title, back) {
    return (
      '<div class="cp-nav">' +
      (back ? '<button type="button" class="cp-back" data-nav="course" aria-label="返回"></button>' : "") +
      "<h1>" + esc(title) + "</h1>" +
      "</div>"
    );
  }

  /* ---------------- 课程详情 ---------------- */

  function todoRow(item) {
    var ic = item.done ? "cp-todo__ic cp-todo__ic--done" : "cp-todo__ic cp-todo__ic--wait";
    var btn = item.btn;
    var btnCls = "cp-todo__btn";
    if (btn === "去填写") btnCls += " cp-todo__btn--go";
    else if (btn === "修改") btnCls += " cp-todo__btn--edit";
    else btnCls += " cp-todo__btn--ghost";
    var dot = item.noteKey ? '<button type="button" class="qn-dot qn-dot--inline" data-note-key="' + esc(item.noteKey) + '"></button>' : "";
    return (
      '<div class="cp-todo">' +
      '<span class="' + ic + '"></span>' +
      '<div class="cp-todo__main"><b>' + esc(item.title) + dot + "</b><span>" + esc(item.date) + "</span></div>" +
      '<button type="button" class="' + btnCls + '" data-todo="' + esc(item.id || "") + '">' + esc(btn) + "</button>" +
      "</div>"
    );
  }

  function courseTodo() {
    var enterDone = !!state.submitted.enter;
    var leaveDone = !!state.submitted.leave;
    var pending = [];
    var done = [];

    pending.push({
      id: "enter",
      title: "入营方式问卷",
      date: enterDone ? "已提交 " + state.submitted.enter + " · 截止前可修改" : "截止 " + DEADLINE.enter + "（开营前 48 小时）",
      btn: enterDone ? "修改" : "去填写",
      noteKey: "todoEnter"
    });
    pending.push({
      id: "leave",
      title: "离营方式问卷",
      date: leaveDone ? "已提交 " + state.submitted.leave + " · 截止前可修改" : "截止 " + DEADLINE.leave + "（开营第 4 天）",
      btn: leaveDone ? "修改" : "去填写",
      noteKey: "todoLeave"
    });
    pending.push({
      id: "summary",
      title: "营后家长调查问卷",
      date: "2026-08-26",
      btn: "去填写",
      noteKey: "todoSummary"
    });

    done.push({ title: "加入领袖营班级群", date: "2023-08-10", btn: "已阅" });
    done.push({ title: "2023年青少年6Q领袖营假入营营前调查问卷", date: "2023-06-08", btn: "查看" });
    done.push({ title: "2023年青少年6Q领袖营暑假离营问卷", date: "2023-06-08", btn: "查看" });
    done.push({ title: "2024年暑假领袖营营前调查问卷", date: "2023-06-08", btn: "修改" });

    var html = '<div class="cp-sec"><h4>待办</h4>' + pending.map(todoRow).join("") + "</div>";
    html += '<div class="cp-sec"><h4>完成</h4>' + done.map(todoRow).join("") + "</div>";
    return html;
  }

  function courseTabs() {
    var tabs = [
      { k: "todo", l: "待办事项" },
      { k: "study", l: "学习情况" },
      { k: "growth", l: "学员成长" },
      { k: "camp", l: "营地详情" }
    ];
    return (
      '<div class="cp-tabs">' +
      tabs.map(function (t) {
        return '<button type="button" class="cp-tab' + (state.tab === t.k ? " is-on" : "") + '" data-tab="' + t.k + '">' + t.l + "</button>";
      }).join("") +
      "</div>"
    );
  }

  function courseBody() {
    if (state.tab === "study") {
      return '<div class="cp-sec"><div class="cp-empty">按现网展示本周签到、考勤与学习进度。<br />本页原型只做待办事项里的问卷入口。</div></div>';
    }
    if (state.tab === "growth") {
      return '<div class="cp-sec"><div class="cp-empty">学员成长印记由带队助教填写，家长在这里查看。<br />本页原型只做待办事项里的问卷入口。</div></div>';
    }
    if (state.tab === "camp") {
      return '<div class="cp-sec"><div class="cp-empty">营地地址、集合点与交通指引。<br />位置指示图见后台「会务工具 → 营地管理」。</div></div>';
    }
    return courseTodo();
  }

  function courseHtml() {
    return (
      nav("课程详情", true) +
      '<div class="cp-scroll">' +
      '<div class="cp-hero">' +
      '<i class="cp-hero__sun"></i>' +
      '<i class="cp-hero__cloud cp-hero__cloud--a"></i>' +
      '<i class="cp-hero__cloud cp-hero__cloud--b"></i>' +
      '<i class="cp-hero__hill cp-hero__hill--a"></i>' +
      '<i class="cp-hero__hill cp-hero__hill--b"></i>' +
      '<i class="cp-hero__hill cp-hero__hill--c"></i>' +
      '<span class="cp-hero__fig cp-hero__fig--1"><i></i><b></b></span>' +
      '<span class="cp-hero__fig cp-hero__fig--2"><i></i><b></b></span>' +
      '<span class="cp-hero__fig cp-hero__fig--3"><i></i><b></b></span>' +
      '<div class="cp-hero__txt"><h2>' + esc(CAMP.title) + "</h2><p>" + esc(CAMP.slogan) + '</p><span class="cp-hero__badge">' + esc(CAMP.badge) + "</span></div>" +
      '<div class="cp-dots"><i class="is-on"></i><i></i><i></i></div>' +
      "</div>" +
      '<div class="cp-done-bar">' +
      '<span class="cp-done-bar__ic">✓</span>' +
      '<span class="cp-done-bar__txt">已完成，学习 <span class="cp-done-bar__days">' + CAMP.studyDay + " 天</span></span>" +
      '<span class="cp-done-bar__deco"><i></i><i></i></span>' +
      "</div>" +
      '<div class="cp-info">' +
      "<h3>" + esc(CAMP.klass) + "</h3>" +
      '<div class="cp-meta"><span class="cp-meta__ic cp-meta__ic--user"></span><span class="cp-meta__body">上课人 <b>' + esc(CAMP.kid) + '</b><span class="cp-tag">新训</span></span></div>' +
      '<div class="cp-meta"><span class="cp-meta__ic cp-meta__ic--clock"></span><span class="cp-meta__body">开营时间 <b>' + esc(CAMP.startText) + "</b> ~ <b>" + esc(CAMP.endText) + "</b></span></div>" +
      '<div class="cp-addr"><span class="cp-addr__txt">' + esc(CAMP.address) + '</span><button type="button" class="cp-addr__btn" data-addr="1" aria-label="查看位置"></button></div>' +
      "</div>" +
      courseTabs() +
      courseBody() +
      "</div>" +
      '<div class="cp-foot"><button type="button" class="cp-primary" data-again="1">再学一次</button></div>'
    );
  }

  /* ---------------- 入营 / 离营问卷 ---------------- */

  function cfgOf(mode) {
    return WAYS[mode];
  }

  function statusHtml(mode) {
    var closed = !!state.closed[mode];
    var deadline = DEADLINE[mode];
    var sub = state.submitted[mode];
    var keys = mode === "enter" ? ["enterDeadline"] : ["leaveDeadline", "leavePublish"];
    var head = closed ? "已截止，不可填写与修改" : "可填写";
    var body = closed
      ? deadline + " 起关闭提交，已提交内容仍可查看。如需变更请联系家营。"
      : "截止 " + deadline + (mode === "enter" ? "（开营前 48 小时）" : "（开营第 4 天 00:00）") + "；截止前可反复修改。";
    if (sub && !closed) body = "已提交于 " + sub + "，截止前仍可修改。" + body;
    return (
      '<div class="qn-status ' + (closed ? "qn-status--closed" : "qn-status--open") + '">' +
      '<span class="qn-status__ic"></span>' +
      '<span style="flex:1"><b>' + head + '</b>' + esc(body) + "</span>" +
      '<span style="display:flex;gap:6px">' +
      keys.map(function (k) { return '<button type="button" class="qn-dot qn-dot--inline" data-note-key="' + k + '"></button>'; }).join("") +
      "</span>" +
      "</div>"
    );
  }

  function item(no, label, req, hint, inner, noteKey) {
    var dot = noteKey ? '<button type="button" class="qn-dot qn-dot--inline" data-note-key="' + noteKey + '"></button>' : "";
    return (
      '<section class="qn-item">' +
      '<div class="qn-item__label"><span class="qn-item__no">' + no + "</span><span>" + esc(label) + "</span>" +
      (req ? '<span class="qn-item__req">（' + esc(req) + "）</span>" : "") + dot + "</div>" +
      (hint ? '<p class="qn-item__hint">' + esc(hint) + "</p>" : "") +
      inner +
      "</section>"
    );
  }

  function optsHtml(mode, field, list, disabled) {
    var picked = (state.ans[mode] || {})[field];
    return (
      '<div class="qn-opts">' +
      list.map(function (o) {
        return (
          '<button type="button" class="qn-opt' + (picked === o.t ? " is-on" : "") + '" data-ans="' + field + '" data-val="' + esc(o.t) + '"' + (disabled ? " disabled" : "") + ">" +
          '<span class="qn-opt__key">' + o.k + "</span>" +
          '<span class="qn-opt__txt">' + esc(o.t) + (o.sub ? '<span class="qn-opt__sub">' + esc(o.sub) + "</span>" : "") + "</span>" +
          "</button>"
        );
      }).join("") +
      "</div>"
    );
  }

  function inputHtml(mode, field, placeholder, disabled) {
    var val = (state.ans[mode] || {})[field] || "";
    return (
      '<input class="qn-input" data-input="' + field + '" value="' + esc(val) + '" placeholder="' + esc(placeholder) + '"' +
      (disabled ? " disabled" : "") + " />"
    );
  }

  function timeHtml(mode, field, disabled) {
    var val = (state.ans[mode] || {})[field] || "";
    return (
      '<button type="button" class="qn-time' + (val ? " has-val" : "") + '" data-ans="' + field + '" data-val="' + esc(val || "2026-08-15 14:30") + '"' + (disabled ? " disabled" : "") + ">" +
      "<span>" + (val ? esc(val) : "请选择时间") + '</span><span class="qn-time__arrow">›</span>' +
      "</button>"
    );
  }

  function qnHtml(mode) {
    var c = cfgOf(mode);
    var closed = !!state.closed[mode];
    var ans = state.ans[mode];

    var html = nav(c.page, true);
    html += '<div class="qn-scroll">';
    html += statusHtml(mode);
    html +=
      '<div class="qn-demo"><span>演示状态</span>' +
      '<button type="button" class="' + (closed ? "" : "is-on") + '" data-demo="open">截止前</button>' +
      '<button type="button" class="' + (closed ? "is-on" : "") + '" data-demo="closed">已截止</button></div>';

    html += item("01", "学员姓名", "必填", "取报读时的报名人，家长不可改。",
      '<div class="qn-readonly"><span>' + esc(CAMP.kid) + "</span><em>来自报读记录</em></div>");

    html += item("02", "学员性别？", "单选", "",
      optsHtml(mode, "gender", [{ k: "A", t: "男" }, { k: "B", t: "女" }], closed));

    html += item("03", "学员年龄？", "填空", "",
      inputHtml(mode, "age", "请输入年龄", closed));

    html += item(c.no, c.label, c.req, c.hint,
      optsHtml(mode, "way", c.opts, closed),
      mode === "enter" ? "enterIssue" : "leaveWay");

    html += item("注意事项", "", "", "",
      '<div class="qn-note"><div class="qn-note__head"><span>注意事项</span><button type="button" class="qn-note__copy" data-copy="1">复制</button></div>' +
      "<ol>" + NOTICE.concat([NOTICE_TAIL[mode]]).map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ol></div>");

    html += item("05", c.busLabel, "选择", c.busHint,
      optsHtml(mode, "bus", [
        { k: "A", t: "中山大巴", sub: "由中山办事处统一安排，集合点以办事处通知为准" },
        { k: "B", t: "广州总部大巴", sub: "总部统一发车，班期以通知为准，约 8:00 出发" }
      ], closed));

    html += item("06", c.handLabel, "选择", "",
      optsHtml(mode, "hand", c.handOpts, closed));

    html += item("07", c.timeLabel, "选择", "",
      timeHtml(mode, "time", closed));

    html += item("08", "学员联系电话", "选填", "",
      inputHtml(mode, "kidPhone", "请输入学员联系电话", closed));

    html += item("09", "家长/联系人电话", "选填", "",
      inputHtml(mode, "parentPhone", "请输入家长或联系人电话", closed));

    html += item("10", "父亲姓名", "选填", "",
      inputHtml(mode, "father", "请输入父亲姓名", closed));

    html += item("11", "母亲姓名", "选填", "",
      inputHtml(mode, "mother", "请输入母亲姓名", closed));

    html += item("12", c.plateLabel, "选填", c.plateHint,
      inputHtml(mode, "plate", "请输入车牌号", closed));

    html += "</div>";
    html +=
      '<div class="qn-foot"><span class="qn-foot__tip">' +
      (closed ? "问卷已截止，不可再提交。" : "提交后仍可在截止前修改；改动会同步到后台与助教端。") +
      "</span>" +
      '<button type="button" class="qn-submit"' + (closed ? " disabled" : "") + ' data-submit="' + mode + '">' +
      (closed ? "已截止" : "提交") +
      "</button></div>";
    return html;
  }

  /* ---------------- 渲染与交互 ---------------- */

  function render() {
    var root = document.getElementById("parent-app");
    if (!root) return;
    root.innerHTML = state.page === "course" ? courseHtml() : qnHtml(state.page);
    if (window.ParentNotes) window.ParentNotes.mount(root, state.page);
  }

  function toast(text) {
    var root = document.getElementById("parent-app");
    if (!root) return;
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = text;
    root.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1700);
  }

  function go(page) {
    state.page = page;
    render();
    var scroll = document.querySelector(".qn-scroll, .cp-scroll");
    if (scroll) scroll.scrollTop = 0;
  }

  function submit(mode) {
    var ans = state.ans[mode] || {};
    var c = cfgOf(mode);
    if (!ans.way) {
      toast("请选择" + (mode === "enter" ? "入营方式" : "离营方式"));
      return;
    }
    if (/大巴/.test(ans.way || "") && !ans.bus) {
      toast("选大巴的请选择大巴路线");
      return;
    }
    if (!ans.hand) {
      toast("请选择抵达站点后的交接情况");
      return;
    }
    var d = new Date();
    var p = function (n) { return ("0" + n).slice(-2); };
    state.submitted[mode] = "2026-08-09 " + p(d.getHours()) + ":" + p(d.getMinutes());
    toast(mode === "enter" ? "入营问卷已提交" : "离营问卷已提交");
    setTimeout(function () {
      state.page = "course";
      state.tab = "todo";
      render();
    }, 700);
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var back = t.closest("[data-nav]");
    if (back) { go(back.getAttribute("data-nav")); return; }

    var tab = t.closest("[data-tab]");
    if (tab) { state.tab = tab.getAttribute("data-tab"); render(); return; }

    var todo = t.closest("[data-todo]");
    if (todo) {
      var id = todo.getAttribute("data-todo");
      if (id === "enter" || id === "leave") { go(id); return; }
      if (id === "summary") { toast("结营后开放，见清单第 56 条"); return; }
      toast("演示：该条按现网已完成");
      return;
    }

    var demo = t.closest("[data-demo]");
    if (demo) {
      state.closed[state.page] = demo.getAttribute("data-demo") === "closed";
      render();
      return;
    }

    var opt = t.closest("[data-ans]");
    if (opt && !opt.disabled) {
      var field = opt.getAttribute("data-ans");
      if (!state.ans[state.page]) state.ans[state.page] = {};
      state.ans[state.page][field] = opt.getAttribute("data-val");
      render();
      return;
    }

    var copy = t.closest("[data-copy]");
    if (copy) { toast("注意事项已复制"); return; }

    var submitBtn = t.closest("[data-submit]");
    if (submitBtn) { submit(submitBtn.getAttribute("data-submit")); return; }

    if (t.closest("[data-addr]")) { toast("打开地图查看营地位置"); return; }
    if (t.closest("[data-again]")) { toast("再学一次：按现网进入报读流程"); return; }
  });

  document.addEventListener("input", function (e) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    var field = t.getAttribute("data-input");
    if (!field) return;
    if (!state.ans[state.page]) state.ans[state.page] = {};
    state.ans[state.page][field] = t.value;
  });

  window.ParentApp = {
    render: render,
    go: go,
    state: state,
    deadline: DEADLINE
  };

  /* 进入页面：默认留在课程详情；带 ?page=enter / ?page=leave 直接进对应问卷。 */
  var want = new URLSearchParams(location.search).get("page");
  if (want === "enter" || want === "leave") state.page = want;
  render();
})();
