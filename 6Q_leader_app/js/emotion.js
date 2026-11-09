(function () {
  "use strict";

  var INDEX = "pages/work/emotion/index";
  var ARCHIVE = "pages/work/emotion/archive";
  var FORM = "pages/work/emotion/form";
  var DETAIL = "pages/work/emotion/detail";
  var PLANS = ["2026年暑假领袖营【华东基地-湖州】", "2026暑假广州第二期", "2026暑假广州第一期"];
  var WEEKS = ["第一周", "第二周", "第三周", "第四周", "第五周", "第六周", "第七周"];
  var CURRENT_PLAN = PLANS[0];
  var CURRENT_WEEK = "第六周";
  var KLASS = "A1班";

  var STUDENTS = [
    { id: "s-wang", name: "王小满", team: "1", bench: "VV之星" },
    { id: "s-li", name: "李可", team: "1", bench: "" },
    { id: "s-zhao", name: "赵欣然", team: "", bench: "" },
    { id: "s-sun", name: "孙悦", team: "2", bench: "VV之星" }
  ];

  var em = {
    tab: 2,
    team: "",
    keyword: "",
    archiveId: "",
    sheet: "",
    menu: "",
    dialog: "",
    view: "",
    editing: "",
    form: blank(),
    rows: seed()
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function blank() {
    return { memberId: "", memberName: "", team: "", plan: CURRENT_PLAN, week: CURRENT_WEEK, recordedTime: "", moodDesc: "", pics: 0, processes: [], status: 1 };
  }
  function seed() {
    return [
      {
        id: "m1", status: 2, memberId: "s-wang", memberName: "王小满", team: "1", klass: "A1班",
        plan: CURRENT_PLAN, week: CURRENT_WEEK,
        recordedTime: 1, moodDesc: "开营当晚想家，晚饭后哭了十几分钟。", pics: 0,
        registrar: "余炜烽", releaseTime: "2026/07/08 21:10",
        processes: [{ time: "2026-07-08 21:20", text: "陪她走到宿舍门口，打电话给妈妈后情绪平稳。", pics: 0, supplements: [{ text: "已告知班级导师今晚多看一眼。", time: "2026/07/08 22:05" }] }]
      },
      {
        id: "m1b", status: 2, memberId: "s-wang", memberName: "王小满", team: "1", klass: "A1班",
        plan: CURRENT_PLAN, week: "第四周",
        recordedTime: 3, moodDesc: "小组讨论时和同组争执，把本子推到一边。", pics: 0,
        registrar: "陈可", releaseTime: "2026/06/26 15:20",
        processes: [{ time: "2026-06-26 15:40", text: "分开坐了两分钟，她自己把事情说清楚后回到小组。", pics: 0, supplements: [] }]
      },
      {
        id: "m1c", status: 2, memberId: "s-wang", memberName: "王小满", team: "2", klass: "B2班",
        plan: "2026暑假广州第一期", week: "第二周",
        recordedTime: 1, moodDesc: "换到新班级第一天不肯进教室，在走廊站了很久。", pics: 1,
        registrar: "赵岚", releaseTime: "2026/07/14 09:30",
        processes: [{ time: "2026-07-14 09:45", text: "导师在门口陪了她一会儿，进教室后坐在靠门的位置。", pics: 0, supplements: [] }]
      },
      {
        id: "m2", status: 2, memberId: "s-li", memberName: "李可", team: "1", klass: "A1班",
        plan: CURRENT_PLAN, week: "第五周",
        recordedTime: 2, moodDesc: "课间突然不说话，把帽子拉下来。", pics: 1,
        registrar: "陈可", releaseTime: "2026/07/02 16:40",
        processes: [{ time: "2026-07-02 16:50", text: "单独问过后，他说是没听清题目。重新讲了一遍，后面能跟上。", pics: 0, supplements: [] }]
      },
      {
        id: "m3", status: 1, memberId: "s-zhao", memberName: "赵欣然", team: "", klass: KLASS,
        plan: CURRENT_PLAN, week: CURRENT_WEEK,
        recordedTime: 1, moodDesc: "分组时不愿进组，一个人站在教室门口。", pics: 0,
        registrar: "余炜烽", releaseTime: "",
        processes: []
      },
      {
        id: "m4", status: 2, memberId: "s-zhao", memberName: "赵欣然", team: "", klass: "A1班",
        plan: CURRENT_PLAN, week: "第三周",
        recordedTime: 4, moodDesc: "点名时没应，低头一直捏衣角。", pics: 0,
        registrar: "余炜烽", releaseTime: "2026/06/18 08:40",
        processes: [{ time: "2026-06-18 08:50", text: "蹲下来叫了她的名字，她点头后跟着队伍走了。", pics: 0, supplements: [] }]
      },
      {
        id: "m5", status: 2, memberId: "s-sun", memberName: "孙悦", team: "2", klass: "A2班",
        plan: "2026暑假广州第二期", week: "第三周",
        recordedTime: 2, moodDesc: "得知改期后一直问能不能留下，晚饭没怎么吃。", pics: 0,
        registrar: "孙衡", releaseTime: "2026/07/16 18:20",
        processes: [{ time: "2026-07-16 18:40", text: "和她说明下一期还是这个班，吃了半碗饭后去找同组伙伴。", pics: 0, supplements: [] }]
      }
    ];
  }
  function student(id) { return STUDENTS.filter(function (s) { return s.id === id; })[0]; }
  function rowBy(id) { return em.rows.filter(function (r) { return r.id === id; })[0]; }
  function has(path) { return path === INDEX || path === ARCHIVE || path === FORM || path === DETAIL; }
  function dirty() {
    var form = em.form;
    return !!(form.memberId || form.moodDesc || form.pics || form.processes.length || form.recordedTime !== "");
  }
  function bar(title) {
    return '<header class="nav"><div><button type="button" data-back="1">返回</button></div><h1>' + esc(title) + '</h1><div class="side"></div></header>';
  }
  function card(item, operate) {
    var html = '<div class="em-card" data-em="open" data-id="' + item.id + '">';
    html += '<h3><b>问题表现</b>' + (operate ? '<button type="button" data-em="more" data-id="' + item.id + '">···</button>' : "") + "</h3>";
    if (item.moodDesc) html += "<p>" + esc(item.moodDesc) + "</p>";
    html += '<div class="em-meta"><span>处理对象：' + esc(item.memberName || "-") + "</span>";
    if (!operate) html += "<span>登记人：" + esc(item.registrar) + "</span>";
    html += "<span>所属班级：" + esc(item.klass) + "</span><span>所属小组：" + (item.team ? esc(item.team) + "组" : "-") + "</span>";
    html += '<span class="is-full">计划：' + esc(item.plan || "-") + "</span>";
    html += '<span class="is-full">周营：' + esc(item.week || "-") + "</span>";
    /* 原型评审第二轮第28条：每条记录都要带出处理次数 */
    html += '<span class="is-full">处理次数：' + ((item.processes || []).length) + " 次</span></div>";
    if (item.status === 2) html += '<p class="em-time">发布于 ' + esc(item.releaseTime) + "</p>";
    return html + "</div>";
  }
  function list(items, operate) {
    if (!items.length) return '<p class="em-empty">暂无数据</p>';
    return items.map(function (item) { return card(item, operate); }).join("");
  }
  function indexPage() {
    var items = em.rows.filter(function (item) { return item.status === em.tab; });
    var html = '<div class="em">' + bar("情绪处理管理");
    html += '<div class="em-pills"><button type="button" data-em="tab" data-val="2" class="' + (em.tab === 2 ? "is-on" : "") + '">已登记</button><button type="button" data-em="tab" data-val="1" class="' + (em.tab === 1 ? "is-on" : "") + '">草稿</button></div>';
    html += '<div class="em-body"><div class="ex-anchor"><button type="button" class="ex-dot" data-em="note" title="需求 26"><span class="ex-num">1</span></button></div>' + list(items, true) + "</div>";
    html += '<button type="button" class="em-add" data-em="add">+</button>';
    html += sheet();
    return html + "</div>";
  }
  function planRank(name) {
    var index = PLANS.indexOf(name);
    return index < 0 ? 99 : index;
  }
  function weekRank(name) {
    var index = WEEKS.indexOf(name);
    return index < 0 ? 0 : index;
  }
  function byTime(a, b) {
    var plan = planRank(a.plan) - planRank(b.plan);
    if (plan) return plan;
    return weekRank(b.week) - weekRank(a.week);
  }
  function publishedRows() {
    return em.rows.filter(function (item) { return item.status === 2; });
  }
  function historyOf(id) {
    return publishedRows().filter(function (item) { return item.memberId === id; }).sort(byTime);
  }
  function distinctCount(rows, field) {
    var keys = {};
    rows.forEach(function (row) { keys[row[field]] = 1; });
    return Object.keys(keys).length;
  }
  function spanCount(rows) {
    var keys = {};
    rows.forEach(function (row) { keys[row.plan + "|" + row.week] = 1; });
    return Object.keys(keys).length;
  }
  function archiveGroups() {
    var word = em.keyword;
    var map = {};
    publishedRows().forEach(function (item) {
      if (em.team && item.team !== em.team) return;
      if (word && item.memberName.indexOf(word) < 0 && (item.registrar || "").indexOf(word) < 0) return;
      if (!map[item.memberId]) map[item.memberId] = true;
    });
    return Object.keys(map).map(function (id) {
      var rows = historyOf(id);
      var stu = student(id) || { id: id, name: rows[0].memberName, team: rows[0].team, bench: "" };
      return { stu: stu, rows: rows, latest: rows[0] };
    }).sort(function (a, b) { return byTime(a.latest, b.latest); });
  }
  function teamText(team) {
    return team ? team + "组" : "未分组";
  }
  function studentCard(group) {
    var stu = group.stu;
    var latest = group.latest;
    var html = '<button type="button" class="em-stu" data-em="archive" data-id="' + stu.id + '">';
    html += '<div class="em-stu__top"><i class="em-ava">' + esc((stu.name || "?").slice(0, 1)) + "</i><div>";
    html += '<div class="em-stu__name">' + esc(stu.name) + "</div>";
    html += '<div class="em-stu__sub">' + esc(latest.klass || KLASS) + " · " + teamText(stu.team || latest.team) + "</div></div>";
    html += '<div class="em-stu__count">' + group.rows.length + " 条<br>" + distinctCount(group.rows, "plan") + " 个计划</div></div>";
    if (stu.bench) html += '<div class="em-chips"><span class="em-chip em-chip--bench">标杆 · ' + esc(stu.bench) + "</span></div>";
    html += '<p class="em-stu__preview"><b>' + esc(latest.week) + "</b> " + esc(latest.moodDesc) + "</p>";
    html += '<p class="em-stu__foot">最近登记 ' + esc(latest.plan) + " · " + esc(latest.week) + " · " + esc(latest.registrar) + "</p>";
    return html + "</button>";
  }
  function dossier(id) {
    var rows = historyOf(id);
    var stu = student(id) || { id: id, name: rows[0] ? rows[0].memberName : "学员", team: "", bench: "" };
    var latest = rows[0];
    var html = '<div class="em em-archive"><div class="em-head">' + bar(stu.name + "的情绪档案");
    html += '<p class="em-archive-tip">这些记录跟着学员走。换班级、换周营之后仍然留在这份档案里。</p></div>';
    html += '<div class="em-body">';
    html += '<section class="em-cover"><div class="em-cover__name">' + esc(stu.name) + "</div>";
    html += '<div class="em-cover__sub">' + esc(latest ? latest.klass : KLASS) + " · " + teamText(stu.team || (latest && latest.team)) + "</div>";
    html += '<div class="em-cover__nums"><span><b>' + rows.length + '</b>条登记</span><span><b>' + distinctCount(rows, "plan") + '</b>个计划</span><span><b>' + spanCount(rows) + "</b>个周营</span></div>";
    html += '<div class="em-chips">' + (stu.bench ? '<span class="em-chip em-chip--bench">本期标杆 · ' + esc(stu.bench) + "</span>" : '<span class="em-chip">本期暂无标杆</span>') + "</div></section>";
    if (!rows.length) {
      html += '<p class="em-empty">还没有已提交的情绪登记。以后换到别的周营，旧记录也会出现在这里。</p>';
      return html + "</div></div>";
    }
    var plan = "";
    rows.forEach(function (item) {
      if (item.plan !== plan) {
        plan = item.plan;
        html += '<h3 class="em-plan">' + esc(plan) + "</h3>";
      }
      html += '<button type="button" class="em-tl" data-em="open" data-id="' + item.id + '">';
      html += '<div class="em-tl__week">' + esc(item.week) + " · 第" + item.recordedTime + "天</div>";
      html += "<p>" + esc(item.moodDesc) + "</p>";
      html += '<div class="em-tl__meta">' + esc(item.klass) + " · " + teamText(item.team) + " · 处理 " + (item.processes || []).length + " 次 · " + esc(item.registrar) + "</div>";
      html += "</button>";
    });
    return html + "</div></div>";
  }
  function archivePage() {
    if (em.archiveId) return dossier(em.archiveId);
    var groups = archiveGroups();
    var html = '<div class="em em-archive"><div class="em-head">' + bar("情绪档案");
    html += '<p class="em-archive-tip">档案跟着学员走。下一周的导师打开后，能看到这个孩子以前各周营的情绪登记。</p>';
    html += '<div class="em-search"><input id="em-kw" placeholder="搜索学员 / 登记人" value="' + esc(em.keyword) + '" /><button type="button" data-em="search">搜索</button></div></div>';
    html += '<div class="em-teams">';
    [{ name: "全部", value: "" }, { name: "1组", value: "1" }, { name: "2组", value: "2" }].forEach(function (tab) {
      html += '<button type="button" data-em="team" data-val="' + tab.value + '" class="' + (em.team === tab.value ? "is-on" : "") + '">' + tab.name + "</button>";
    });
    html += '</div><div class="em-body"><div class="ex-anchor"><button type="button" class="ex-dot" data-em="note" title="需求 26"><span class="ex-num">1</span></button></div>';
    if (!groups.length) html += '<p class="em-empty">这个范围里还没有情绪档案</p>';
    else html += groups.map(studentCard).join("");
    return html + "</div>" + sheet() + "</div>";
  }
  function photos(n, key) {
    var html = '<div class="em-photos">';
    for (var i = 0; i < n; i++) html += '<button type="button" class="em-photo" data-em="drop-pic" data-key="' + key + '" data-i="' + i + '">图' + (i + 1) + "<i>×</i></button>";
    if (n < 6) html += '<button type="button" data-em="add-pic" data-key="' + key + '">+</button>';
    return html + "</div>";
  }
  function formPage() {
    var form = em.form;
    var locked = em.editing && rowBy(em.editing) && rowBy(em.editing).status === 2;
    var html = '<div class="em">' + bar("情绪处理登记") + '<div class="em-body">';
    html += '<div class="em-row"><span>学员姓名</span><b><button type="button" data-em="students"' + (locked ? " disabled" : "") + ">" + esc(form.memberName || "请选择") + "</button></b></div>";
    if (form.memberId) {
      html += '<div class="em-row"><span>班级</span><b>' + KLASS + "</b></div>";
      html += '<div class="em-row"><span>小组</span><b>' + esc(form.team) + "组</b></div>";
    }
    html += '<div class="em-row"><span>计划</span><b><button type="button" data-em="plans">' + esc(form.plan || "请选择") + "</button></b></div>";
    html += '<div class="em-row"><span>周营</span><b><button type="button" data-em="weeks">' + esc(form.week || "请选择") + "</button></b></div>";
    html += '<div class="em-row"><span>记录时间</span><b><button type="button" data-em="days">' + (form.recordedTime ? "第" + form.recordedTime + "天" : "请选择") + "</button></b></div>";
    html += '<div class="em-block"><label class="em-label"><i>*</i>问题表现</label><textarea id="em-desc" maxlength="500" placeholder="说明孩子的情绪问题表现">' + esc(form.moodDesc) + "</textarea>";
    html += photos(form.pics, "mood");
    form.processes.forEach(function (item, index) {
      html += '<section class="em-process"><header><span>第' + (index + 1) + '次处理</span><button type="button" data-em="remove-proc" data-i="' + index + '">移除</button></header>';
      html += '<label class="em-label">处理时间</label><input class="lb-input" data-em-time="' + index + '" value="' + esc(item.time) + '" placeholder="请选择" />';
      html += '<label class="em-label"><i>*</i>处理过程及结果</label><textarea data-em-text="' + index + '" placeholder="请输入处理过程及结果">' + esc(item.text) + "</textarea>";
      html += photos(item.pics, "p" + index) + "</section>";
    });
    html += '<button type="button" class="em-more" data-em="add-proc"><i>+</i>添加处理过程</button></div></div>';
    html += '<div class="em-foot"><button type="button" data-em="submit">确认提交</button></div>' + sheet() + "</div>";
    return html;
  }
  function detailPage() {
    var item = rowBy(em.view);
    if (!item) return '<div class="em">' + bar("情绪处理登记") + '<div class="em-body"><p class="em-empty">记录不存在</p></div></div>';
    var html = '<div class="em">' + bar("情绪处理登记") + '<div class="em-body">';
    html += '<div class="em-row"><span>学员姓名</span><b>' + esc(item.memberName) + "</b></div>";
    html += '<div class="em-row"><span>班级</span><b>' + esc(item.klass) + "</b></div>";
    html += '<div class="em-row"><span>小组</span><b>' + (item.team ? esc(item.team) + "组" : "-") + "</b></div>";
    html += '<div class="em-row"><span>计划</span><b>' + esc(item.plan || "-") + "</b></div>";
    html += '<div class="em-row"><span>周营</span><b>' + esc(item.week || "-") + "</b></div>";
    html += '<div class="em-row"><span>记录时间</span><b>' + (item.recordedTime ? "第" + item.recordedTime + "天" : "-") + "</b></div>";
    html += '<div class="em-block"><label class="em-label"><i>*</i>问题表现</label><div class="em-grey">' + esc(item.moodDesc || "") + "</div>";
    item.processes.forEach(function (proc, index) {
      html += '<section class="em-card-box"><h4>第' + (index + 1) + '次处理</h4><div class="em-row"><span>处理时间</span><b>' + esc(proc.time || "-") + "</b></div>";
      html += '<label class="em-label"><i>*</i>处理过程及结果</label><div class="em-grey">' + esc(proc.text || "") + "</div>";
      (proc.supplements || []).forEach(function (sup) {
        html += "<h4>统筹办补充</h4><div class=\"em-grey\">" + esc(sup.text) + '<div class="em-sup">补充于：' + esc(sup.time) + "</div></div>";
      });
      html += "</section>";
    });
    return html + "</div></div>";
  }
  function sheet() {
    if (em.dialog) {
      var text = em.dialog === "delete" ? "确定删除该条情绪记录吗？" : "您还没提交，是否保存后续填写呢？";
      var no = em.dialog === "delete" ? "取消" : "不保存";
      var yes = em.dialog === "delete" ? "确定" : "保存";
      return '<div class="em-dialog"><div><p>' + text + '</p><footer><button type="button" data-em="dialog-no">' + no + '</button><button type="button" class="is-on" data-em="dialog-yes">' + yes + "</button></footer></div></div>";
    }
    if (em.menu) {
      return '<div class="em-sheet"><ul class="em-menu"><button type="button" data-em="edit">编辑</button><button type="button" data-em="ask-delete">删除</button><button type="button" data-em="close-sheet">取消</button></ul></div>';
    }
    if (em.sheet === "students") {
      return '<div class="em-sheet"><ul class="em-menu">' + STUDENTS.map(function (s) {
        return '<button type="button" data-em="pick-student" data-id="' + s.id + '">' + esc(s.name) + "</button>";
      }).join("") + '<button type="button" data-em="close-sheet">取消</button></ul></div>';
    }
    if (em.sheet === "plans") {
      return '<div class="em-sheet"><ul class="em-menu">' + PLANS.map(function (name) {
        return '<button type="button" data-em="pick-plan" data-val="' + esc(name) + '">' + esc(name) + "</button>";
      }).join("") + '<button type="button" data-em="close-sheet">取消</button></ul></div>';
    }
    if (em.sheet === "weeks") {
      return '<div class="em-sheet"><ul class="em-menu">' + WEEKS.map(function (name) {
        return '<button type="button" data-em="pick-week" data-val="' + name + '">' + name + "</button>";
      }).join("") + '<button type="button" data-em="close-sheet">取消</button></ul></div>';
    }
    if (em.sheet === "days") {
      var days = "";
      for (var d = 1; d <= 7; d++) days += '<button type="button" data-em="pick-day" data-val="' + d + '">第' + d + "天</button>";
      return '<div class="em-sheet"><ul class="em-menu">' + days + '<button type="button" data-em="close-sheet">取消</button></ul></div>';
    }
    return "";
  }
  function readForm() {
    var desc = document.getElementById("em-desc");
    if (desc) em.form.moodDesc = desc.value;
    document.querySelectorAll("[data-em-text]").forEach(function (el) {
      var proc = em.form.processes[Number(el.getAttribute("data-em-text"))];
      if (proc) proc.text = el.value;
    });
    document.querySelectorAll("[data-em-time]").forEach(function (el) {
      var proc = em.form.processes[Number(el.getAttribute("data-em-time"))];
      if (proc) proc.time = el.value;
    });
  }
  function copyForm(item) {
    em.form = {
      memberId: item.memberId, memberName: item.memberName, team: item.team,
      plan: item.plan || CURRENT_PLAN, week: item.week || CURRENT_WEEK,
      recordedTime: item.recordedTime, moodDesc: item.moodDesc, pics: item.pics, status: item.status,
      processes: item.processes.map(function (proc) { return { time: proc.time, text: proc.text, pics: proc.pics, supplements: proc.supplements || [] }; })
    };
  }
  function writeRow(status) {
    var now = "2026/07/10 09:41";
    var target = em.editing ? rowBy(em.editing) : null;
    var next = {
      id: target ? target.id : "m" + Date.now(),
      status: status,
      memberId: em.form.memberId,
      memberName: em.form.memberName,
      team: em.form.team,
      plan: em.form.plan,
      week: em.form.week,
      klass: KLASS,
      recordedTime: em.form.recordedTime,
      moodDesc: em.form.moodDesc,
      pics: em.form.pics,
      registrar: target ? target.registrar : "余炜烽",
      releaseTime: status === 2 ? (target && target.releaseTime ? target.releaseTime : now) : "",
      processes: em.form.processes.map(function (proc) {
        return { time: proc.time, text: proc.text, pics: proc.pics, supplements: proc.supplements || [] };
      })
    };
    if (target) {
      em.rows = em.rows.map(function (item) { return item.id === target.id ? next : item; });
    } else em.rows.unshift(next);
    return next;
  }
  function render(path) {
    if (path === INDEX) return indexPage();
    if (path === ARCHIVE) return archivePage();
    if (path === FORM) return formPage();
    if (path === DETAIL) return detailPage();
    return "";
  }
  function handle(el, api) {
    var act = el.getAttribute("data-em");
    if (!act) return false;
    if (act === "tab") { em.tab = Number(el.getAttribute("data-val")); api.render(); return true; }
    if (act === "team") { em.team = el.getAttribute("data-val"); api.render(); return true; }
    if (act === "search") {
      var input = document.getElementById("em-kw");
      em.keyword = input ? input.value.trim() : "";
      api.render();
      return true;
    }
    if (act === "more") {
      em.menu = el.getAttribute("data-id");
      api.render();
      return true;
    }
    if (act === "close-note") { window.NoteDock.hide(); return true; }
    if (act === "note") { openNotes(); return true; }
    if (act === "archive") { em.archiveId = el.getAttribute("data-id"); api.render(); return true; }
    if (act === "open") { em.view = el.getAttribute("data-id"); api.go(DETAIL); return true; }
    if (act === "add") {
      em.editing = "";
      em.form = blank();
      em.sheet = "";
      api.go(FORM);
      return true;
    }
    if (act === "edit") {
      var editing = rowBy(em.menu);
      em.editing = editing.id;
      copyForm(editing);
      em.menu = "";
      api.go(FORM);
      return true;
    }
    if (act === "ask-delete") { em.dialog = "delete"; em.sheet = ""; api.render(); return true; }
    if (act === "close-sheet") { em.sheet = ""; em.menu = ""; api.render(); return true; }
    if (act === "students") { readForm(); em.sheet = "students"; api.render(); return true; }
    if (act === "days") { readForm(); em.sheet = "days"; api.render(); return true; }
    if (act === "plans") { readForm(); em.sheet = "plans"; api.render(); return true; }
    if (act === "weeks") { readForm(); em.sheet = "weeks"; api.render(); return true; }
    if (act === "pick-plan") { em.form.plan = el.getAttribute("data-val"); em.sheet = ""; api.render(); return true; }
    if (act === "pick-week") { em.form.week = el.getAttribute("data-val"); em.sheet = ""; api.render(); return true; }
    if (act === "pick-student") {
      var stu = student(el.getAttribute("data-id"));
      em.form.memberId = stu.id;
      em.form.memberName = stu.name;
      em.form.team = stu.team;
      em.sheet = "";
      api.render();
      return true;
    }
    if (act === "pick-day") { em.form.recordedTime = Number(el.getAttribute("data-val")); em.sheet = ""; api.render(); return true; }
    if (act === "add-pic") {
      readForm();
      var key = el.getAttribute("data-key");
      if (key === "mood") { if (em.form.pics < 6) em.form.pics += 1; }
      else {
        var proc = em.form.processes[Number(key.slice(1))];
        if (proc && proc.pics < 6) proc.pics += 1;
      }
      api.render();
      return true;
    }
    if (act === "drop-pic") {
      readForm();
      var dropKey = el.getAttribute("data-key");
      if (dropKey === "mood") em.form.pics = Math.max(0, em.form.pics - 1);
      else {
        var dropProc = em.form.processes[Number(dropKey.slice(1))];
        if (dropProc) dropProc.pics = Math.max(0, dropProc.pics - 1);
      }
      api.render();
      return true;
    }
    if (act === "add-proc") {
      readForm();
      em.form.processes.push({ time: "", text: "", pics: 0, supplements: [] });
      api.render();
      return true;
    }
    if (act === "remove-proc") {
      readForm();
      em.form.processes.splice(Number(el.getAttribute("data-i")), 1);
      api.render();
      return true;
    }
    if (act === "submit") {
      readForm();
      if (!em.form.memberId) { api.toast("请选择学员"); return true; }
      if (!em.form.plan) { api.toast("请选择计划"); return true; }
      if (!em.form.week) { api.toast("请选择周营"); return true; }
      if (!em.form.recordedTime) { api.toast("请选择记录时间"); return true; }
      if (!em.form.moodDesc) { api.toast("请填写情绪描述"); return true; }
      var missing = em.form.processes.some(function (proc) { return !proc.text; });
      if (missing) { api.toast("请输入处理过程及结果"); return true; }
      writeRow(2);
      em.tab = 2;
      api.toast("提交成功");
      api.go(INDEX);
      return true;
    }
    if (act === "dialog-no") {
      var dropping = em.dialog === "back";
      em.dialog = "";
      if (dropping) { em.form = blank(); em.editing = ""; api.back(); return true; }
      em.menu = "";
      api.render();
      return true;
    }
    if (act === "dialog-yes") {
      if (em.dialog === "delete") {
        em.rows = em.rows.filter(function (item) { return item.id !== em.menu; });
        em.menu = "";
        em.dialog = "";
        api.toast("移除成功");
        api.render();
        return true;
      }
      readForm();
      var current = em.editing ? rowBy(em.editing) : null;
      var keep = current && current.status === 2 ? 2 : 1;
      if (keep === 2 && (!em.form.memberId || !em.form.recordedTime || !em.form.moodDesc)) {
        api.toast("请把必填项填完再保存");
        return true;
      }
      writeRow(keep);
      em.dialog = "";
      em.form = blank();
      em.editing = "";
      em.tab = keep;
      api.toast(keep === 1 ? "已保存草稿" : "更新成功");
      api.back();
      return true;
    }
    return false;
  }
  function openNotes() {
    var panel = window.NoteDock.host();
    panel.innerHTML =
      '<div class="ex-notes-head"><h2>情绪档案 · 本页 1 条需求</h2><button type="button" class="ex-note-close" data-sign-note="close">关闭</button></div>' +
      '<article class="ex-note-block"><h3><span class="ex-num">1</span> 情绪档案跟随学员 <span class="ex-ver">清单第 26 条</span></h3>' +
      '<div class="ex-logic"><h4>现在的逻辑</h4><p>登记、列表和详情都带计划和周营。档案按学员收拢。换班级、换周营之后，下一周导师打开仍能看到以前的登记。草稿不进档案。</p></div>' +
      '<div class="ex-logic"><h4>UI 要设计的状态</h4><ol>' +
      "<li>情绪登记列表：已登记</li>" +
      "<li>情绪登记列表：草稿</li>" +
      "<li>情绪登记列表：空</li>" +
      "<li>登记表：选择学员、计划、周营、记录时间</li>" +
      "<li>登记表：问题表现，以及多次处理过程</li>" +
      "<li>档案列表：按学员汇总，能看出跨了几个计划</li>" +
      "<li>档案列表：按小组筛选</li>" +
      "<li>档案列表：搜索没有结果</li>" +
      "<li>学员档案：同一学员跨计划和跨周营的时间线</li>" +
      "<li>学员档案：本期有标杆、本期没有标杆</li>" +
      "<li>学员档案：还没有已提交记录</li>" +
      "<li>单条详情：问题表现、每次处理、统筹办补充</li>" +
      "</ol></div></article>";
    panel.classList.add("is-open");
  }
  function openArchive(name) {
    em.keyword = "";
    em.team = "";
    em.archiveId = "";
    if (!name) return;
    var stu = STUDENTS.filter(function (item) { return item.name === name || item.id === name; })[0];
    if (stu) em.archiveId = stu.id;
  }
  function leaveForm() {
    if (window.APP && window.APP.path && window.APP.path() === ARCHIVE && em.archiveId && !em.dialog) {
      em.archiveId = "";
      return true;
    }
    if (!(window.APP && window.APP.path && window.APP.path() === FORM) || em.dialog) return false;
    readForm();
    if (!dirty()) return false;
    em.dialog = "back";
    return true;
  }

  window.EM = { has: has, render: render, handle: handle, leaveForm: leaveForm, openArchive: openArchive, openNotes: openNotes };
})();
