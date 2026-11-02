(function () {
  "use strict";

  var WORK = [
    { title: "工作", items: [
      ["督评结果", "pages/work/supervise/index"],
      ["助教分组", "pages/work/categoryClass/index"],
      ["疑异处理", "pages/work/suspicious/index"],
      ["班级考核", "pages/work/examine/index"],
      ["外出报备", "pages/work/reporting/index"],
      ["因私请假", "pages/work/askForLeave/index"],
      ["生病请假", "pages/work/fallForLeave/index"],
      ["薪酬账单", "pages/work/bill/index"],
      ["学员签到", "pages/work/studentSignIn/index"],
      ["班级确认", "pages/work/studentConfirm/index"],
      ["优秀助教/团长申请表", "pages/work/excellent/index"],
      ["问卷收集", "pages/work/questionnaireGather/overview"]
    ]},
    { title: "迎接欢送", items: [
      ["迎接学员", "pages/work/signInTask/detail", "1"],
      ["欢送学员", "pages/work/signInTask/detail", "2"],
      ["人员调整", "pages/work/memberAdjust/list"]
    ]},
    { title: "导师工作", items: [
      ["班级简报", "pages/work/categoryClass/growthJournal/form"],
      ["情绪处理记录", "pages/work/emotion/index"]
    ]}
  ];

  var TYPES = ["全部类型", "优秀助教", "优秀助教团长", "因私请假", "外出报备", "疑异处理", "生病请假", "补卡", "督评问卷", "互评问卷", "自评问卷", "学员问卷", "家长问卷", "提前离营"];
  var TYPE_PAGE = {
    "因私请假": "pages/work/askForLeave/detail",
    "外出报备": "pages/work/reporting/detail",
    "疑异处理": "pages/work/suspicious/detail",
    "生病请假": "pages/work/fallForLeave/detail",
    "补卡": "pages/work/replaceCard/detail",
    "督评问卷": "pages/work/questionnaire/index",
    "互评问卷": "pages/work/questionnaire/index",
    "自评问卷": "pages/work/questionnaire/index",
    "学员问卷": "pages/work/questionnaire/index",
    "家长问卷": "pages/work/questionnaire/index",
    "提前离营": "pages/pending/leaderCampLeaveEarlyApplyConfirm/index"
  };
  var TODOS = [
    { name: "刘中良", kind: "因私请假", status: "待处理", time: "2026-09-18 09:12" },
    { name: "赵欣然", kind: "疑异处理", status: "待处理", time: "2026-09-17 14:20" },
    { name: "孙悦", kind: "生病请假", status: "已处理", time: "2026-09-16 11:02" },
    { name: "林晓雯", kind: "外出报备", status: "待处理", time: "2026-09-18 08:40" },
    { name: "陈启航", kind: "补卡", status: "已处理", time: "2026-09-15 19:11" }
  ];

  var CAMP = {
    user: "余炜烽",
    id: "YWF3625",
    post: "导师",
    plan: "2026年暑假领袖营【华东基地-湖州】",
    week: "第六周",
    klass: "A1班",
    group: "1组"
  };

  var pages = {};
  (window.APP_PAGES || []).forEach(function (p) { pages[p.path] = p; });

  var APPLY = {
    "pages/work/askForLeave/index": { title: "因私请假", btn: "申请请假", search: "输入请假事由", fields: ["请假原因", "请假事由", "发生时间"], form: "pages/work/askForLeave/form", detail: "pages/work/askForLeave/detail" },
    "pages/work/fallForLeave/index": { title: "生病请假", btn: "申请请假", search: "输入请假事由", fields: ["请假原因", "请假事由", "发生时间"], form: "pages/work/fallForLeave/form", detail: "pages/work/fallForLeave/detail" },
    "pages/work/reporting/index": { title: "外出报备", btn: "申请报备", search: "输入报备事由", fields: ["报备原因", "报备事由", "报备时间"], form: "pages/work/reporting/form", detail: "pages/work/reporting/detail" },
    "pages/work/suspicious/index": { title: "疑异处理", btn: "申请疑异", search: "输入处理事由", fields: ["疑异原因", "处理事由", "发生时间"], form: "pages/work/suspicious/form", detail: "pages/work/suspicious/detail" },
    "pages/work/replaceCard/index": { title: "补卡申请", btn: "申请补卡", search: "输入补卡事由", fields: ["补卡时间", "补卡事由"], form: "pages/work/replaceCard/form", detail: "pages/work/replaceCard/detail" }
  };
  var APPLY_DETAIL = {};
  Object.keys(APPLY).forEach(function (key) { APPLY_DETAIL[APPLY[key].detail] = APPLY[key]; });

  var state = {
    path: "pages/tabBar/pending",
    stack: [],
    tab: 0,
    listTab: 0,
    type: "全部类型",
    aideChief: new URLSearchParams(location.search).get("role") === "chief",
    typeOpen: false,
    toast: "",
    keyword: "",
    detail: { type: 1, status: 1, name: "刘中良", reason: "因私事务", text: "回家处理事务" }
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pageOf(path) {
    return pages[path] || { path: path, title: "领袖营工作", kind: "page", labels: [], links: [] };
  }

  function go(path, replace, detail) {
    path = String(path || "").replace(/^\//, "").split("?")[0];
    if (!path) return;
    if (!replace && state.path !== path) state.stack.push(state.path);
    if (path === "pages/work/categoryClass/growthJournal/form" && state.path === "pages/tabBar/work" && window.CC && window.CC.setKind) window.CC.setKind("brief");
    state.path = path;
    state.typeOpen = false;
    if (detail) state.detail = detail;
    render();
  }

  function back() {
    if (state.stack.length) state.path = state.stack.pop();
    else state.path = "pages/tabBar/work";
    render();
  }

  function toast(text) {
    state.toast = text;
    render();
    setTimeout(function () {
      state.toast = "";
      var el = document.querySelector(".toast");
      if (el) el.remove();
    }, 1400);
  }

  function isTab(path) {
    return path === "pages/tabBar/pending" || path === "pages/tabBar/work";
  }

  function nav(title, right) {
    var backBtn = isTab(state.path) ? "" : '<button type="button" data-back="1">返回</button>';
    return (
      '<header class="nav"><div>' + backBtn + '</div><h1>' + esc(title) + '</h1><div class="side">' +
      (right || "") + "</div></header>"
    );
  }

  function tabbar() {
    var pendingOn = state.path === "pages/tabBar/pending" ? " is-on" : "";
    var workOn = state.path === "pages/tabBar/work" ? " is-on" : "";
    return (
      '<footer class="tabbar">' +
      '<button type="button" class="tab-item' + pendingOn + '" data-go="pages/tabBar/pending"><i class="tab-ic tab-pending"></i>待办</button>' +
      '<button type="button" class="tab-item ai" data-go="pages/aiAssistant/index">' + (window.AI && window.AI.bubble ? window.AI.bubble() : "") + '<i>助</i>领袖营助手</button>' +
      '<button type="button" class="tab-item' + workOn + '" data-go="pages/tabBar/work"><i class="tab-ic tab-work"></i>工作</button>' +
      "</footer>"
    );
  }

  function workPage() {
    var html = nav("领袖营工作", '<button type="button" data-go="pages/work/toggleCamp/index">第六周</button>');
    html += '<div class="body">';
    WORK.forEach(function (group) {
      html += '<section class="section"><h2>' + esc(group.title) + '</h2><div class="card"><div class="grid">';
      group.items.forEach(function (item) {
        var travel = item[2] ? ' data-travel="' + item[2] + '"' : "";
        html += '<button type="button" data-go="' + item[1] + '"' + travel + '><i>' + esc(item[0].slice(0, 1)) + "</i>" + esc(item[0]) + "</button>";
      });
      html += "</div></div></section>";
    });
    html += "</div>" + tabbar();
    return html;
  }

  function pendingPage() {
    var extra = window.EX && window.EX.pendingRows ? window.EX.pendingRows() : [];
    var list = extra.concat(TODOS).filter(function (row) {
      if (state.type !== "全部类型" && row.kind !== state.type) return false;
      if (state.tab === 1) return row.status === "待处理";
      if (state.tab === 2) return row.status === "已处理";
      return true;
    });
    var actor = window.EX && window.EX.actor ? window.EX.actor() : null;
    var showName = actor ? actor.name : CAMP.user;
    var showPost = actor ? actor.post : CAMP.post;
    var html =
      '<div class="body"><div class="hero">' +
      '<div style="display:flex;justify-content:space-between;align-items:center"><strong>领袖营工作</strong><button type="button" data-clock="1" style="border:0;background:transparent;color:#fff;cursor:pointer">未签到</button></div>' +
      '<div class="who"><div class="avatar">' + esc(showName.slice(0, 1)) + '</div><div><h2>' + esc(showName) + '</h2><div class="meta">ID: ' +
      CAMP.id + "　　岗位: " + esc(showPost) + "</div></div></div>" +
      '<div class="camp"><button type="button" data-go="pages/work/toggleCamp/index">切换</button><div><div>' +
      esc(CAMP.plan) + "</div><div>" + esc(CAMP.week) + " | " + esc(CAMP.klass) + " | " + esc(CAMP.group) +
      "</div></div></div></div>";
    html += '<div class="sn-entry-wrap">' + (window.SICK && window.SICK.entry ? window.SICK.entry() : "") + "</div>";
    html += '<div class="filters"><button type="button" data-type-toggle="1">' + esc(state.type) + ' ▾</button><div class="tabs">';
    ["全部", "待处理", "已处理"].forEach(function (name, i) {
      html += '<button type="button" class="' + (state.tab === i ? "is-on" : "") + '" data-tab="' + i + '">' + name + (state.tab === i ? "(" + list.length + ")" : "") + "</button>";
    });
    html += "</div></div>";
    if (state.typeOpen) {
      html += '<div class="menu">';
      TYPES.forEach(function (name) {
        html += '<button type="button" data-type="' + esc(name) + '">' + esc(name) + "</button>";
      });
      html += "</div>";
    }
    html += '<div class="list">';
    if (!list.length) html += '<div class="empty">暂时没有待办～</div>';
    list.forEach(function (row) {
      var dest = row.dest || TYPE_PAGE[row.kind] || "pages/work/askForLeave/detail";
      if (row.exId) {
        html += '<button type="button" class="item" data-ex="open" data-id="' + esc(row.exId) + '">';
      } else if (APPLY_DETAIL[dest]) {
        html += '<button type="button" class="item" data-open-detail="' + dest + '" data-dtype="3" data-dstatus="1" data-dname="' + esc(row.name) + '" data-dreason="' + esc(row.kind) + '" data-dtext="待办审批">';
      } else {
        html += '<button type="button" class="item" data-go="' + dest + '">';
      }
      html += '<span class="tag ' + (row.status === "待处理" ? "wait" : "") + '">' +
        esc(row.status) + "</span><b>" + esc(row.name) + " · " + esc(row.kind) + (row.node ? " · " + esc(row.node) : "") + "</b><span>" + esc(row.time) + "</span></button>";
    });
    html += "</div></div>" + tabbar();
    return html;
  }

  function sibling(path, name) {
    var dir = path.split("/").slice(0, -1).join("/") + "/" + name;
    return pages[dir] ? dir : "";
  }

  function actions(page) {
    var labels = page.labels || [];
    var buttons = labels.filter(function (t) {
      return /提交|保存|确定|下一步|新增|导出|通过|驳回|撤销|签到|确认/.test(t);
    });
    if (!buttons.length && page.kind === "form") buttons = ["提交"];
    return buttons.slice(0, 3);
  }

  function fields(page) {
    var labels = page.labels || [];
    var rows = [];
    for (var i = 0; i < labels.length; i++) {
      var t = labels[i];
      if (/提交|保存|确定|下一步|新增|导出|通过|驳回/.test(t)) continue;
      if (t.indexOf("请") === 0) continue;
      var next = labels[i + 1] || "";
      rows.push({ label: t, placeholder: next.indexOf("请") === 0 ? next : "请输入" + t });
    }
    return rows.slice(0, 8);
  }

  function applyList(spec) {
    var mine = state.listTab === 0;
    var cards = mine
      ? [
          { status: 1, statusText: "申请中", name: "刘中良", reason: "因私事务", text: "回家处理事务", time: "09.18 09:00 至 09.18 18:00" },
          { status: 6, statusText: "请假中", name: "刘中良", reason: "家中有事", text: "已离营，待销假", time: "09.17 08:00 至 09.17 20:00" }
        ]
      : [
          { status: 1, statusText: "申请中", name: "赵欣然", reason: "待我审批", text: "申请处理", time: "09.18 10:20 至 09.18 16:00" }
        ];
    var key = state.keyword.trim();
    cards = cards.filter(function (row) { return !key || (row.text + row.reason + row.name).indexOf(key) >= 0; });
    var html = '<div class="body apply">';
    html += '<div class="apply-head"><div class="apply-nav"><button type="button" data-back="1">返回</button><div class="seg">';
    html += '<button type="button" class="' + (mine ? "is-on" : "") + '" data-list-tab="0">我发起的</button>';
    html += '<button type="button" class="' + (!mine ? "is-on" : "") + '" data-list-tab="1">我处理的</button>';
    html += '</div><span></span></div>';
    html += '<div class="search"><input id="kw" placeholder="' + esc(spec.search) + '" value="' + esc(state.keyword) + '" /><button type="button" data-search="1">搜索</button></div></div>';
    html += '<div class="list">';
    if (!cards.length) html += '<div class="empty">暂时没有数据～</div>';
    cards.forEach(function (row) {
      html += '<button type="button" class="apply-card" data-open-detail="' + spec.detail + '" data-dtype="' + (mine ? 1 : 3) + '" data-dstatus="' + row.status + '" data-dname="' + esc(row.name) + '" data-dreason="' + esc(row.reason) + '" data-dtext="' + esc(row.text) + '">';
      html += '<div class="apply-card__top"><b>' + (mine ? "" : esc(row.name)) + esc(spec.title) + '</b><em class="st st-' + row.status + '">' + esc(row.statusText) + '</em><span>' + esc(row.time.slice(0, 11)) + '</span></div>';
      spec.fields.forEach(function (label) {
        var val = label.indexOf("时间") >= 0 ? row.time : (label.indexOf("事由") >= 0 || label.indexOf("说明") >= 0 ? row.text : row.reason);
        html += '<div class="apply-card__row"><span>' + esc(label) + '：</span>' + esc(val) + '</div>';
      });
      html += '</button>';
    });
    html += '</div></div>';
    if (mine) html += '<div class="foot"><button type="button" class="btn" data-go="' + spec.form + '">' + esc(spec.btn) + '</button></div>';
    return html;
  }

  function applyDetail(spec) {
    var d = state.detail;
    var statusText = { 1: "申请中", 6: "请假中", 2: "已同意", 3: "已驳回", 4: "已撤回" }[d.status] || "申请中";
    var html = nav((d.type === 1 ? "" : d.name + "的") + spec.title);
    html += '<div class="body"><div class="warn">特别提醒：申请请假后务必到统筹办办公室领取【外出放行条】方可外出。</div><div class="detail">';
    [
      ["处理情况", statusText],
      ["申请人", d.name],
      [spec.fields[0] || "原因", d.reason],
      [spec.fields[2] || "时间", "09.18 09:00 至 09.18 18:00"],
      ["时长", "共 8 小时"],
      [spec.fields[1] || "事由", d.text]
    ].forEach(function (row) {
      html += '<div class="row"><b>' + esc(row[0]) + '</b><span>' + esc(row[1]) + '</span></div>';
    });
    html += '<div class="flow"><b>审批流程</b><div>余炜烽 · 发起</div><div>统筹办 · ' + esc(statusText) + '</div></div></div>';
    if (d.type === 1 && d.status === 6) {
      html += '<div class="form"><div class="field"><label>到岗时间</label><input placeholder="请选择实际到岗时间" /></div><div class="field"><label>销假说明</label><textarea placeholder="请输入销假说明"></textarea></div></div>';
    }
    if (d.type === 3 && d.status === 1) {
      html += '<div class="form"><div class="field"><label>结果</label><textarea placeholder="请输入审批结果"></textarea></div><div class="field"><label>附件</label><input placeholder="上传附件" /></div></div>';
    }
    html += '</div><div class="foot">';
    if (d.type === 1 && d.status === 1) html += '<button type="button" class="btn ghost" data-act="撤回">撤回</button>';
    else if (d.type === 1 && d.status === 6) html += '<button type="button" class="btn" data-act="提交销假">提交</button>';
    else if (d.type === 3 && d.status === 1) {
      html += '<button type="button" class="btn danger" data-act="不同意">不同意</button><button type="button" class="btn" data-act="同意">同意</button>';
    } else html += '<button type="button" class="btn ghost" data-back="1">返回</button>';
    html += '</div>';
    return html;
  }

  function generic(page) {
    var html = nav(page.title || "领袖营工作");
    html += '<div class="body">';
    if (page.path === "pages/work/signInTask/detail") {
      html += '<div class="ex-anchor"><button type="button" class="ex-dot" data-note="41" title="需求 41"><span class="ex-num">1</span></button></div>';
    }
    if (page.kind === "success" || /成功/.test(page.title)) {
      html += '<div class="ok"><i>✓</i><div>操作成功</div></div>';
    } else if (page.kind === "form") {
      html += '<div class="form">';
      fields(page).forEach(function (f) {
        var area = /事由|说明|备注|内容/.test(f.label);
        html += '<div class="field"><label>' + esc(f.label) + "</label>" +
          (area ? '<textarea placeholder="' + esc(f.placeholder) + '"></textarea>' : '<input placeholder="' + esc(f.placeholder) + '" />') +
          "</div>";
      });
      html += "</div>";
    } else if (page.kind === "detail") {
      html += '<div class="detail">';
      fields(page).forEach(function (f) {
        html += '<div class="row"><b>' + esc(f.label) + "</b><span>" + esc(f.label === "申请人" ? "刘中良" : "—") + "</span></div>";
      });
      html += "</div>";
    } else {
      var detail = sibling(page.path, "detail") || sibling(page.path, "form") || (page.links || [])[0] || "";
      html += '<div class="list">';
      if ((page.links || []).length) {
        page.links.forEach(function (link) {
          var target = pageOf(link.replace(/^\//, ""));
          html += '<button type="button" class="item" data-go="' + esc(link.replace(/^\//, "")) + '"><b>' + esc(target.title) + "</b><span>进入</span></button>";
        });
      }
      ["林晓雯", "陈启航", "王敏"].forEach(function (name, i) {
        html += '<button type="button" class="item" data-go="' + esc(detail || page.path) + '"><span class="tag">进行中</span><b>' +
          esc(name) + "</b><span>" + esc((page.labels && page.labels[0]) || page.title) + " · 09-" + (10 + i) + "</span></button>";
      });
      html += "</div>";
    }
    html += "</div>";
    var btns = actions(page);
    if (btns.length || page.kind === "form" || page.kind === "detail") {
      html += '<div class="foot">';
      (btns.length ? btns : ["确定"]).forEach(function (label, i) {
        var cls = i === 0 && /驳回|撤销/.test(label) ? "danger" : (i > 0 ? "ghost" : "");
        html += '<button type="button" class="btn ' + cls + '" data-act="' + esc(label) + '">' + esc(label) + "</button>";
      });
      html += "</div>";
    }
    return html;
  }

  function openSignNote() {
    var panel = document.getElementById("sign-notes-panel");
    var mask = document.getElementById("sign-notes-mask");
    if (!panel) {
      mask = document.createElement("div");
      mask.id = "sign-notes-mask";
      mask.className = "ex-notes-mask";
      mask.setAttribute("data-sign-note", "close");
      panel = document.createElement("aside");
      panel.id = "sign-notes-panel";
      panel.className = "ex-notes-panel";
      document.body.appendChild(mask);
      document.body.appendChild(panel);
    }
    panel.innerHTML =
      '<div class="ex-notes-head"><h2>迎接欢送 · 本页 1 条需求</h2><button type="button" class="ex-note-close" data-sign-note="close">关闭</button></div>' +
      '<p class="ex-note-rule">一个红色序号对应一条需求。点开后列出本页需求。字段说明在表格里，不在每个字段上打红点。</p>' +
      '<article class="ex-note-block"><h3><span class="ex-num">1</span> 学员签到权限 <span class="ex-ver">清单第 41 条</span></h3>' +
      '<div class="ex-logic"><h4>过往逻辑</h4><p>迎接欢送里的学员签到，只开放给助教正团和带队助教。助教副团、见习副团没有权限。</p></div>' +
      '<div class="ex-logic"><h4>现在的逻辑</h4><p>设计已实现。迎接学员、欢送学员进入的学员签到，开放给当班助教团相关岗位：助教正团、助教副团、见习副团、带队助教。这些岗位都可以确认签到。助教团以外的岗位仍不能操作。</p></div>' +
      '<table><thead><tr><th>元素名称</th><th>元素类型</th><th>是否必填</th><th>说明</th></tr></thead><tbody>' +
      "<tr><td>确认签到</td><td>按钮</td><td>是</td><td>原按钮。助教正团、助教副团、见习副团、带队助教都可以操作。</td></tr>" +
      "<tr><td>可操作岗位</td><td>说明</td><td>是</td><td>助教正团、助教副团、见习副团、带队助教。</td></tr>" +
      "<tr><td>无权限岗位</td><td>说明</td><td>否</td><td>助教团以外的岗位不能做学员签到。</td></tr>" +
      "</tbody></table></article>";
    panel.classList.add("is-open");
    mask.classList.add("is-open");
  }

  function closeSignNote() {
    var panel = document.getElementById("sign-notes-panel");
    var mask = document.getElementById("sign-notes-mask");
    if (panel) panel.classList.remove("is-open");
    if (mask) mask.classList.remove("is-open");
  }

  function openImprintNote() {
    var panel = document.getElementById("gi-notes-panel");
    var mask = document.getElementById("gi-notes-mask");
    if (!panel) {
      mask = document.createElement("div");
      mask.id = "gi-notes-mask";
      mask.className = "ex-notes-mask";
      mask.setAttribute("data-gi-note", "close");
      panel = document.createElement("aside");
      panel.id = "gi-notes-panel";
      panel.className = "ex-notes-panel";
      document.body.appendChild(mask);
      document.body.appendChild(panel);
    }
    panel.innerHTML =
      '<div class="ex-notes-head"><h2>学员成长印记 · 本页 1 条需求</h2><button type="button" class="ex-note-close" data-gi-note="close">关闭</button></div>' +
      '<p class="ex-note-rule">一个红色序号对应一条需求。点开后列出本页需求。字段说明在表格里，不在每个字段上打红点。</p>' +
      '<article class="ex-note-block"><h3><span class="ex-num">1</span> 班级填写进度 <span class="ex-ver">清单第 42 条</span></h3>' +
      '<div class="ex-logic"><h4>过往逻辑</h4><p>班级成长印记填写进度，以及按谁填了、谁没填进行筛选，在 3.3.0 已经实现，但没有上线。</p></div>' +
      '<div class="ex-logic"><h4>现在的逻辑</h4><p>本次版本主要将这套功能校验上线。上线后，班级可以看到填写进度，并按已填、未填筛选学员。</p></div>' +
      '<table><thead><tr><th>元素名称</th><th>元素类型</th><th>是否必填</th><th>说明</th></tr></thead><tbody>' +
      "<tr><td>日志/印记统计</td><td>页面</td><td>是</td><td>班级填写进度所在页。印记统计列出每名学员是已完善还是未完善。3.3.0 已实现，未上线，本次校验上线。</td></tr>" +
      "<tr><td>是否完善</td><td>筛选</td><td>否</td><td>按已填、未填收窄名单。3.3.0 已实现，本次校验上线。</td></tr>" +
      "<tr><td>学员成长</td><td>页面</td><td>是</td><td>从学员进入成长印记的页面。填写结果计入班级进度。</td></tr>" +
      "<tr><td>完型成长印记</td><td>按钮</td><td>是</td><td>单个学员的填写入口。提交后该学员记为已填。</td></tr>" +
      "<tr><td>成长印记填写</td><td>页面</td><td>是</td><td>出勤、Q营特征、生活情况、欣赏和变化四步。提交后计入班级填写进度。</td></tr>" +
      "</tbody></table></article>";
    panel.classList.add("is-open");
    mask.classList.add("is-open");
  }

  function closeImprintNote() {
    var panel = document.getElementById("gi-notes-panel");
    var mask = document.getElementById("gi-notes-mask");
    if (panel) panel.classList.remove("is-open");
    if (mask) mask.classList.remove("is-open");
  }

  function openFeedNote() {
    var panel = document.getElementById("feed-notes-panel");
    var mask = document.getElementById("feed-notes-mask");
    if (!panel) {
      mask = document.createElement("div");
      mask.id = "feed-notes-mask";
      mask.className = "ex-notes-mask";
      mask.setAttribute("data-feed-note", "close");
      panel = document.createElement("aside");
      panel.id = "feed-notes-panel";
      panel.className = "ex-notes-panel";
      document.body.appendChild(mask);
      document.body.appendChild(panel);
    }
    panel.innerHTML =
      '<div class="ex-notes-head"><h2>签到入营 · 本页 1 条需求</h2><button type="button" class="ex-note-close" data-feed-note="close">关闭</button></div>' +
      '<p class="ex-note-rule">一个红色序号对应一条需求。点开后列出本页需求。字段说明在表格里，不在每个字段上打红点。</p>' +
      '<article class="ex-note-block"><h3><span class="ex-num">1</span> 签到签离写入每日反馈 <span class="ex-ver">清单第 58 条</span></h3>' +
      '<div class="ex-logic"><h4>过往逻辑</h4><p>学员成长时间轴只有每日反馈和班级简报。迎接、欢送、大堂签到、班级确认成功后，不往学员成长写记录。日志统计只看手写的每日反馈。</p></div>' +
      '<div class="ex-logic"><h4>现在的逻辑</h4><p>设计已实现。签到成功后，给对应学员在学员成长时间轴各写一条。迎接、大堂签到、班级确认的类型是签到，子类型分别是迎接、大堂签到、班级确认。欢送成功写签离，不再挂子类型。每完成一步新写一条。撤销成功删掉对应那一条，再次签到再写一条。班级确认没有撤销。创建日期早于开营日期，标题为距离开营还有X天；营期内为第N天；晚于结营日期为结营已过X天。开营当天是第1天，结营当天仍是最后一天。这些记录不计入日志统计的已反馈。</p></div>' +
      '<table><thead><tr><th>元素名称</th><th>元素类型</th><th>是否必填</th><th>说明</th></tr></thead><tbody>' +
      "<tr><td>签到</td><td>记录类型</td><td>是</td><td>迎接、大堂签到、班级确认各写一条。子类型沿用这三个名称。</td></tr>" +
      "<tr><td>签离</td><td>记录类型</td><td>是</td><td>只在欢送确认签到成功时写一条。不挂子类型。</td></tr>" +
      "<tr><td>签到照片</td><td>图片</td><td>否</td><td>沿用签到页的签到照片，最多3张，可预览。班级确认沿用大堂那次的照片。</td></tr>" +
      "<tr><td>反馈信息</td><td>文本</td><td>否</td><td>沿用确认签到时填写的反馈信息。没填则不显示。班级确认不新填。</td></tr>" +
      "<tr><td>签到人</td><td>文本</td><td>是</td><td>迎接、欢送沿用 createUserName。大堂签到沿用 userName。班级确认沿用大堂签到人。</td></tr>" +
      "<tr><td>联系电话</td><td>文本</td><td>否</td><td>沿用签到人已有的联系电话 mobile。没有则显示 -。不新增字段。</td></tr>" +
      "<tr><td>时间分组</td><td>标题</td><td>是</td><td>按记录创建日期的日历日。距离开营还有X天、第N天、结营已过X天。同一天共用一个标题，按时间倒序，新的在前。</td></tr>" +
      "<tr><td>日志统计</td><td>页面</td><td>是</td><td>已反馈仍只统计手写的每日反馈。签到和签离不计入。</td></tr>" +
      "</tbody></table></article>";
    panel.classList.add("is-open");
    mask.classList.add("is-open");
  }

  function openAwardNote() {
    var panel = document.getElementById("award-notes-panel");
    var mask = document.getElementById("award-notes-mask");
    if (!panel) {
      mask = document.createElement("div");
      mask.id = "award-notes-mask";
      mask.className = "ex-notes-mask";
      mask.setAttribute("data-award-note", "close");
      panel = document.createElement("aside");
      panel.id = "award-notes-panel";
      panel.className = "ex-notes-panel";
      document.body.appendChild(mask);
      document.body.appendChild(panel);
    }
    panel.innerHTML =
      '<div class="ex-notes-head"><h2>学员评优 · 本页 1 条需求</h2><button type="button" class="ex-note-close" data-award-note="close">关闭</button></div>' +
      '<p class="ex-note-rule">一个红色序号对应一条需求。点开后列出本页需求。字段说明在表格里，不在每个字段上打红点。</p>' +
      '<article class="ex-note-block"><h3><span class="ex-num">1</span> 学员评优 <span class="ex-ver">清单第 35 条</span></h3>' +
      '<div class="ex-logic"><h4>过往逻辑</h4><p>学员评优靠电子表格收集。标杆学员是另一套流程，点学员可以评为标杆学员，填写主要事迹和学员照片。</p></div>' +
      '<div class="ex-logic"><h4>现在的逻辑</h4><p>设计已实现。标杆不改。助教团全员可以给还没有生效评优的学员做学员评优。一次只能选一个奖项，只填主要事迹。一名学员同时只能有一个生效评优，已有时不出现这个入口。名额按奖项、班级、当前周营计算，已满的奖项置灰，点击提示名额已满。后台禁用该记录后，标签去掉，入口才恢复。</p></div>' +
      '<table><thead><tr><th>元素名称</th><th>元素类型</th><th>是否必填</th><th>说明</th></tr></thead><tbody>' +
      "<tr><td>评优标签</td><td>标签</td><td>否</td><td>学员列表展示当前生效评优。能进入助教分组的人都能看到。失效后去掉。</td></tr>" +
      "<tr><td>学员评优</td><td>操作</td><td>否</td><td>在评为标杆学员之外。已有生效评优时不出现。</td></tr>" +
      "<tr><td>奖项</td><td>单选</td><td>是</td><td>一次只能选一个。名额已满时置灰，点击提示名额已满。</td></tr>" +
      "<tr><td>主要事迹</td><td>文本</td><td>是</td><td>沿用标杆已有字段。不上传照片。</td></tr>" +
      "</tbody></table></article>";
    panel.classList.add("is-open");
    mask.classList.add("is-open");
  }

  function closeAwardNote() {
    var panel = document.getElementById("award-notes-panel");
    var mask = document.getElementById("award-notes-mask");
    if (panel) panel.classList.remove("is-open");
    if (mask) mask.classList.remove("is-open");
  }

  function closeFeedNote() {
    var panel = document.getElementById("feed-notes-panel");
    var mask = document.getElementById("feed-notes-mask");
    if (panel) panel.classList.remove("is-open");
    if (mask) mask.classList.remove("is-open");
  }

  function openLeaveSyncNote() {
    var panel = document.getElementById("leave-sync-panel");
    var mask = document.getElementById("leave-sync-mask");
    if (!panel) {
      mask = document.createElement("div");
      mask.id = "leave-sync-mask";
      mask.className = "ex-notes-mask";
      mask.setAttribute("data-leave-note", "close");
      panel = document.createElement("aside");
      panel.id = "leave-sync-panel";
      panel.className = "ex-notes-panel";
      document.body.appendChild(mask);
      document.body.appendChild(panel);
    }
    panel.innerHTML =
      '<div class="ex-notes-head"><h2>欢送 · 本页 1 条需求</h2><button type="button" class="ex-note-close" data-leave-note="close">关闭</button></div>' +
      '<p class="ex-note-rule">一个红色序号对应一条需求。点开后列出本页需求。字段说明在表格里，不在每个字段上打红点。</p>' +
      '<article class="ex-note-block"><h3><span class="ex-num">3</span> 离营方式同步到欢送 <span class="ex-ver">清单第 10 条</span></h3>' +
      '<div class="ex-logic"><h4>过往逻辑</h4><p>学员在离营问卷里填的离营方式和站点，只落在报名侧的离营问卷。欢送页按本营地、本接送方式、本接送站点取学员，页面只显示站点和到达时间，没有一行汇总的离营方式，也没标出这条方式是何时被谁改过。各基地的欢送情况要靠线下表格汇总。</p></div>' +
      '<div><h4>现在的逻辑</h4><p>设计已实现。欢送学员卡片增加「离营方式」一行，取自学员在离营问卷里的填写，只读同步，不在这里改原始填写值。点击离营方式上浮离营详情，展示离营方式、接离方式、凭证、接待、陪伴员、其他需求，以及最后修改时间。页面右上角增加「总表」入口，按计划（即基地）汇总应欢送人数与机场、车站、大巴、自离、连营、未填写各多少，点一行可下钻到该基地的逐个学员名单，名单可按离营方式筛选、按姓名/学员ID/站点搜索。汇总数与名单同源。</p></div>' +
      '<div class="ex-logic"><h4>数据流（与后台离营总表打通）</h4><p>① 家长在离营问卷填离营方式与站点，写入 travelWay、campsPlacePickupId，这是原值。<br>② 后台「薪酬管理 → 离营总表」读同一份 travel/list（type=2）数据，按计划汇总。<br>③ 后台在总表点「修改离营方式」，仅在未核销 + 未签离时可用，提交 PUT conference/camps/member/travel/leave/modify，追加一条人工调整（原方式、新方式、时间、人）。<br>④ 本页读同一份数据，离营方式显示新值并标「已修改」；离营详情多一行「本次人工调整：由 X 改为 Y」和最后修改时间。<br>⑤ 已签离或已核销后不再允许改。改动不覆盖问卷原值。</p></div>' +
      '<div class="ex-logic"><h4>演示开关</h4><p>本演示分两个端口，跨端口读不到同一份存储。下面可以切换「已修改」示例，用来预览欢送端如何标记。真实环境由后端下发。</p><p><button type="button" data-sc="demo-edited" class="sc-demo-btn">切换「已修改」示例</button></p></div>' +
      '<table><thead><tr><th>元素名称</th><th>元素类型</th><th>是否必填</th><th>说明</th></tr></thead><tbody>' +
      "<tr><td>离营方式</td><td>卡片行</td><td>否</td><td>欢送页每张学员卡片新增。取离营问卷的值：机场接离、火车/高铁接离、大巴接离、营地自离、连营。没填显示未填写。只读。</td></tr>" +
      "<tr><td>离营详情</td><td>上浮弹窗</td><td>否</td><td>点离营方式打开。沿用助教分组那套离营详情字段。最后一行是最后修改时间。</td></tr>" +
      "<tr><td>最后修改时间</td><td>字段</td><td>是</td><td>离营方式或站点每次被修改都要落时间与操作人。欢送端只展示，不改。</td></tr>" +
      "<tr><td>总表</td><td>按钮</td><td>否</td><td>欢送页右上角。按计划汇总，点一行看该基地学员名单。</td></tr>" +
      "<tr><td>学员名单</td><td>列表</td><td>否</td><td>总表下方。学员、学员ID、班级、离营方式、站点/班次、签离状态、修改时间。可按离营方式筛选、搜索。</td></tr>" +
      "<tr><td>基地</td><td>口径</td><td>是</td><td>基地就是不同的计划。一个计划一行。</td></tr>" +
      "</tbody></table></article>";
    panel.classList.add("is-open");
    mask.classList.add("is-open");
  }

  function closeLeaveSyncNote() {
    var panel = document.getElementById("leave-sync-panel");
    var mask = document.getElementById("leave-sync-mask");
    if (panel) panel.classList.remove("is-open");
    if (mask) mask.classList.remove("is-open");
  }

  function render() {
    var page = pageOf(state.path);
    var html = "";
    if (state.path === "pages/tabBar/work") html = workPage();
    else if (state.path === "pages/tabBar/pending") html = pendingPage();
    else if (state.path === "pages/load/index") html = '<div class="body"><div class="ok"><i>营</i><div>领袖营工作</div></div></div>';
    else if (window.CC && window.CC.has(state.path)) html = window.CC.render(state.path);
    else if (window.SC && window.SC.has(state.path)) html = window.SC.render(state.path);
    else if (window.EX && window.EX.has(state.path)) html = window.EX.render(state.path);
    else if (window.AI && window.AI.has(state.path)) html = window.AI.render(state.path);
    else if (window.EM && window.EM.has(state.path)) html = window.EM.render(state.path);
    else if (window.SICK && window.SICK.has(state.path)) html = window.SICK.render(state.path);
    else if (APPLY[state.path]) html = applyList(APPLY[state.path]);
    else if (APPLY_DETAIL[state.path]) html = applyDetail(APPLY_DETAIL[state.path]);
    else html = generic(page);
    if (state.toast) html += '<div class="toast">' + esc(state.toast) + "</div>";
    document.getElementById("screen").innerHTML = html;
    if (window.EX && window.EX.mount) window.EX.mount();
    if (window.EX && window.EX.roles && document.getElementById("role-dock")) paintRoles();
    location.hash = "#/" + state.path;
  }

  window.APP = {
    path: function () { return state.path; },
    go: go,
    back: back,
    toast: toast,
    render: render,
    aideChief: function () { return !!state.aideChief; },
    closeSignNote: closeSignNote,
    closeImprintNote: closeImprintNote,
    closeFeedNote: closeFeedNote,
    closeAwardNote: closeAwardNote,
    openLeaveSyncNote: openLeaveSyncNote,
    closeLeaveSyncNote: closeLeaveSyncNote
  };

  document.getElementById("screen").addEventListener("click", function (e) {
    var t = e.target.closest("[data-note],[data-sick],[data-sick-demo],[data-ex],[data-ai],[data-sc],[data-cc],[data-em],[data-go],[data-back],[data-tab],[data-type],[data-type-toggle],[data-clock],[data-act],[data-list-tab],[data-search],[data-open-detail]");
    if (!t) {
      state.typeOpen = false;
      return;
    }
    if (t.getAttribute("data-note") === "41") {
      openSignNote();
      return;
    }
    if (t.getAttribute("data-note") === "42") {
      openImprintNote();
      return;
    }
    if (t.getAttribute("data-note") === "58") {
      openFeedNote();
      return;
    }
    if (t.getAttribute("data-note") === "35") {
      openAwardNote();
      return;
    }
    if (t.getAttribute("data-note") === "10") {
      openLeaveSyncNote();
      return;
    }
    if (window.SICK && (t.getAttribute("data-note") === "44" || t.hasAttribute("data-sick") || t.hasAttribute("data-sick-demo")) && window.SICK.handle(t)) {
      return;
    }
    if (t.getAttribute("data-sc") === "demo-edited") {
      try {
        var on = sessionStorage.getItem("sc-demo-edited") !== "0";
        sessionStorage.setItem("sc-demo-edited", on ? "0" : "1");
      } catch (e) {}
      render();
      if (document.getElementById("leave-sync-panel").classList.contains("is-open")) openLeaveSyncNote();
      return;
    }
    if (t.hasAttribute("data-ex") || t.hasAttribute("data-note")) {
      window.EX.handle(t, window.APP);
      return;
    }
    if (t.hasAttribute("data-ai")) {
      window.AI.handle(t, window.APP);
      return;
    }
    if (t.hasAttribute("data-sc")) {
      window.SC.handle(t, window.APP);
      return;
    }
    if (t.hasAttribute("data-cc")) {
      window.CC.handle(t, window.APP);
      return;
    }
    if (t.hasAttribute("data-em")) {
      window.EM.handle(t, window.APP);
      return;
    }
    if (t.hasAttribute("data-back")) {
      if (window.CC && window.CC.leaveForm && window.CC.leaveForm()) { render(); return; }
      if (window.EM && window.EM.leaveForm && window.EM.leaveForm()) { render(); return; }
      back();
      return;
    }
    if (t.hasAttribute("data-go")) {
      var dest = t.getAttribute("data-go").replace(/^\//, "");
      if (t.hasAttribute("data-travel") && window.SC && window.SC.setTravel) window.SC.setTravel(t.getAttribute("data-travel"));
      if (!dest || dest === state.path) {
        toast("当前页");
        return;
      }
      if (isTab(dest)) {
        state.stack = [];
        state.path = dest;
        state.typeOpen = false;
        render();
        return;
      }
      go(dest);
      return;
    }
    if (t.hasAttribute("data-tab")) { state.tab = Number(t.getAttribute("data-tab")); render(); return; }
    if (t.hasAttribute("data-type-toggle")) { state.typeOpen = !state.typeOpen; render(); return; }
    if (t.hasAttribute("data-type")) { state.type = t.getAttribute("data-type"); state.typeOpen = false; render(); return; }
    if (t.hasAttribute("data-list-tab")) { state.listTab = Number(t.getAttribute("data-list-tab")); render(); return; }
    if (t.hasAttribute("data-search")) {
      var input = document.getElementById("kw");
      state.keyword = input ? input.value : "";
      render();
      return;
    }
    if (t.hasAttribute("data-open-detail")) {
      go(t.getAttribute("data-open-detail"), false, {
        type: Number(t.getAttribute("data-dtype")),
        status: Number(t.getAttribute("data-dstatus")),
        name: t.getAttribute("data-dname"),
        reason: t.getAttribute("data-dreason"),
        text: t.getAttribute("data-dtext")
      });
      return;
    }
    if (t.hasAttribute("data-clock")) { toast("已签到"); return; }
    if (t.hasAttribute("data-act")) {
      var act = t.getAttribute("data-act");
      if (act === "撤回") {
        state.detail.status = 4;
        toast("撤回成功");
        render();
        return;
      }
      if (act === "不同意") {
        state.detail.status = 3;
        toast("已驳回");
        render();
        return;
      }
      if (act === "同意") {
        state.detail.status = 2;
        toast("已同意");
        render();
        return;
      }
      if (act === "提交销假") {
        state.detail.status = 2;
        toast("销假成功");
        render();
        return;
      }
      var success = sibling(state.path, "success");
      if (/提交|保存|确定|下一步|通过|确认/.test(act)) {
        toast(act + "成功");
        if (success) go(success);
        return;
      }
      toast(act + "成功");
    }
  });

  function roleDock() {
    if (document.getElementById("role-dock")) return;
    var box = document.createElement("aside");
    box.id = "role-dock";
    box.className = "role-dock is-min";
    box.innerHTML = '<button type="button" class="role-dock__toggle" data-role-toggle="1"><i></i>演示身份</button><div class="role-dock__body"><h3>演示身份</h3><p>切换岗位后，待办和消息通知按这个身份显示。学员就医通知只有助教正团有，其他岗位的消息列表为空。</p><div class="role-list"></div></div>';
    document.body.appendChild(box);
    paintRoles();
    box.addEventListener("click", function (event) {
      if (event.target.closest("[data-role-toggle]")) {
        box.classList.toggle("is-min");
        return;
      }
      var btn = event.target.closest("[data-role-who]");
      if (btn) {
        if (window.EX && window.EX.setWho) window.EX.setWho(btn.getAttribute("data-role-who"));
        if (window.SICK && window.SICK.guard && window.SICK.guard()) return;
        render();
        paintRoles();
      }
    });
  }
  function paintRoles() {
    var box = document.getElementById("role-dock");
    if (!box || !window.EX || !window.EX.roles) return;
    var list = box.querySelector(".role-list");
    if (!list) return;
    var now = window.EX.current ? window.EX.current() : "";
    list.innerHTML = window.EX.roles().map(function (role) {
      return '<button type="button" data-role-who="' + esc(role.id) + '" class="' + (role.id === now ? "is-on" : "") + '">' + esc(role.name) + " · " + esc(role.post) + "</button>";
    }).join("");
  }

  var hash = (location.hash || "").replace(/^#\/?/, "");
  if (pages[hash] || (window.EX && window.EX.has(hash)) || (window.AI && window.AI.has(hash)) || (window.SC && window.SC.has(hash)) || (window.CC && window.CC.has(hash)) || (window.EM && window.EM.has(hash)) || (window.SICK && window.SICK.has(hash))) state.path = hash;
  if (state.aideChief && window.EX && window.EX.setWho) window.EX.setWho("p-chief");
  render();
  roleDock();
  var entryNote = new URLSearchParams(location.search).get("note");
  if (entryNote === "41") openSignNote();
  else if (entryNote === "42") openImprintNote();
  else if (entryNote === "58") openFeedNote();
  else if (entryNote === "35") openAwardNote();
  else if (entryNote === "36" && window.EX && window.EX.openNotes) window.EX.openNotes();
  else if (entryNote === "44" && window.SICK) window.SICK.openNotes();
  else if (entryNote === "10") openLeaveSyncNote();
})();

document.body.addEventListener("click", function (e) {
  var gi = e.target.closest("[data-gi-note]");
  if (gi && gi.getAttribute("data-gi-note") === "close") {
    if (window.APP && window.APP.closeImprintNote) window.APP.closeImprintNote();
    return;
  }
  var sign = e.target.closest("[data-sign-note]");
  if (sign && sign.getAttribute("data-sign-note") === "close") {
    if (window.APP && window.APP.closeSignNote) window.APP.closeSignNote();
    return;
  }
  var feed = e.target.closest("[data-feed-note]");
  if (feed && feed.getAttribute("data-feed-note") === "close") {
    if (window.APP && window.APP.closeFeedNote) window.APP.closeFeedNote();
    return;
  }
  var awardNote = e.target.closest("[data-award-note]");
  if (awardNote && awardNote.getAttribute("data-award-note") === "close") {
    if (window.APP && window.APP.closeAwardNote) window.APP.closeAwardNote();
    return;
  }
  var leaveNote = e.target.closest("[data-leave-note]");
  if (leaveNote && leaveNote.getAttribute("data-leave-note") === "close") {
    if (window.APP && window.APP.closeLeaveSyncNote) window.APP.closeLeaveSyncNote();
    return;
  }
  if (!window.EX || e.target.closest("#screen")) return;
  var t = e.target.closest("[data-ex],[data-note]");
  if (!t) return;
  window.EX.handle(t, window.APP);
});
