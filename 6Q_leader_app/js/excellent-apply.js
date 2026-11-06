(function () {
  "use strict";

  var HOME = "pages/work/excellent/index";
  var FORM = "pages/work/excellent/form";
  var DETAIL = "pages/work/excellent/detail";
  var MINE = "pages/work/excellent/mine";
  var CAMP = "2026年暑假领袖营【华东基地-湖州】第6周";
  var KLASS = "A1班";

  var ROLES = [
    { id: "p-aide", name: "林晓雯", post: "带队助教", key: "applicant", corps: "aide", dock: true, viewResult: true },
    { id: "p-su", name: "苏晚", post: "带队助教", key: "applicant", corps: "aide" },
    { id: "p-xu", name: "许宁", post: "带队助教", key: "applicant", corps: "aide" },
    { id: "p-he", name: "何倩", post: "带队助教", key: "applicant", corps: "aide" },
    { id: "p-jiang", name: "江澄", post: "见习副团", key: "applicant", corps: "aide" },
    { id: "p-qian", name: "钱柏", post: "助教副团", key: "applicant", corps: "aide" },
    { id: "p-han", name: "韩朔", post: "助教正团", key: "applicant", corps: "aide" },
    { id: "p-shen", name: "沈予", post: "助教正团", key: "applicant", corps: "aide" },
    { id: "p-vice", name: "陈可", post: "助教副团", key: "vice", corps: "aide", dock: true },
    { id: "p-vtr", name: "周宁", post: "见习副团", key: "vice-trainee", corps: "aide", dock: true },
    { id: "p-chief", name: "李正", post: "助教正团", key: "chief", corps: "aide", dock: true },
    { id: "p-chief2", name: "周岚", post: "助教正团", key: "chief", corps: "aide", dock: true },
    { id: "p-mtr", name: "赵岚", post: "见习导师", key: "mentor-trainee", corps: "mentor", dock: true },
    { id: "p-mtr2", name: "钱岚", post: "见习导师", key: "mentor-trainee", corps: "mentor", dock: true },
    { id: "p-mv", name: "孙衡", post: "导师副团", key: "mentor-vice", corps: "mentor", dock: true },
    { id: "p-mv2", name: "何衡", post: "导师副团", key: "mentor-vice", corps: "mentor", dock: true },
    { id: "p-mentor", name: "吴正", post: "导师正团", key: "mentor", corps: "mentor", dock: true },
    { id: "p-mentor2", name: "郑衡", post: "导师正团", key: "mentor", corps: "mentor", dock: true },
    { id: "p-office", name: "郑主任", post: "统筹办主任", key: "office", corps: "office", dock: true }
  ];

  var AIDE_ITEMS = [
    { name: "K1 6Q体系与课程知识", max: 10, bands: [[6, 7], [8, 9], [10, 10]], hint: "6-7 知道6Q文化；8-9 能在陪伴中运用；10 能向家长传递6Q价值" },
    { name: "K2 营地制度与流程知识", max: 8, bands: [[4, 5], [6, 7], [8, 8]], hint: "4-5 常见问题需请示；6-7 能独立处理多数问题；8 全流程无盲区" },
    { name: "K3 学员发展阶段知识", max: 7, bands: [[4, 5], [6, 6], [7, 7]], hint: "4-5 了解大小班差异；6 能按年龄调整沟通；7 无一次方法用错" },
    { name: "S1 学员陪伴与链接技能", max: 10, bands: [[6, 7], [8, 9], [10, 10]], hint: "6-7 能建立基础对话；8-9 五大链接工具熟练；10 学员愿意主动分享" },
    { name: "S2 课程支持专业技能", max: 10, bands: [[5, 7], [8, 9], [10, 10]], hint: "5-7 能主持分享；8-9 选队长/裁判熟练；10 对落选学员主动关怀" },
    { name: "S3 家长沟通有效技能", max: 10, bands: [[5, 7], [8, 9], [10, 10]], hint: "5-7 完成家营沟通；8-9 反馈有温度；10 无越权私下承诺" },
    { name: "S4 信息处理与危机响应", max: 10, bands: [[5, 7], [8, 9], [10, 10]], hint: "5-7 能识别异常并上报；8-9 信息记录完整；10 零漏报零延误" },
    { name: "Q1 人际连接素养", max: 10, bands: [[5, 6], [7, 8], [9, 10]], hint: "5-6 与多数学员有基本连接；7-8 主动看见沉默学员；9-10 每位学员感到被看见" },
    { name: "Q2 职业操守与执行风控", max: 10, bands: [[5, 6], [7, 8], [9, 10]], hint: "5-6 执行到位、保密合格；7-8 压力下保持执行力；9-10 无越权或各自为战" },
    { name: "Q3 心智成长与内在品格", max: 8, bands: [[4, 5], [6, 7], [8, 8]], hint: "4-5 情绪稳定、边界清晰；6-7 主动接纳反馈；8 能把成长感悟变成行动" },
    { name: "Q4 身体素养与品牌形象", max: 7, bands: [[3, 4], [5, 6], [7, 7]], hint: "3-4 精力与仪容基本合格；5-6 形象符合品牌；7 全营精力在线" }
  ];

  var LEADER_ITEMS = [
    { name: "开营前组织联系、物资、开营离营岗位", max: 5 },
    { name: "课前就位、清点、热身、排除隐患", max: 5 },
    { name: "组织每日助教培训会议并跟进", max: 5 },
    { name: "上课巡堂、家长群互动、课间链接学员", max: 15 },
    { name: "抽查家校沟通并处理助教沟通问题", max: 10 },
    { name: "准时参加会议、巡寝、关心学员生活", max: 15 },
    { name: "服从导师安排，正副团及时复盘", max: 10 },
    { name: "角色亮清、男女界限、协助他人", max: 10 },
    { name: "保护知识产权与隐私、学员财产安全", max: 10 },
    { name: "情绪稳定，处理冲突与学员情绪", max: 15 }
  ];

  var ex = { who: "p-vice", type: "aide", view: "", note: "", apps: seedApps() };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function person(id) { return ROLES.filter(function (r) { return r.id === id; })[0] || ROLES[0]; }
  function me() { return person(ex.who); }
  function countFor(id) {
    return ex.apps.filter(function (app) {
      return app.status === "审批中" && assignees(app).indexOf(id) >= 0 && !doneBy(app, id);
    }).length;
  }
  function nowText() { return "10-08 16:40"; }
  function has(path) { return path === HOME || path === FORM || path === DETAIL || path === MINE; }
  function appBy(id) { return ex.apps.filter(function (a) { return a.id === id; })[0]; }
  function itemsOf(app) { return app.type === "aide" ? AIDE_ITEMS : LEADER_ITEMS; }
  function typeName(type) { return type === "aide" ? "优秀助教" : "优秀助教团长"; }
  function reqDot() {
    return '<button type="button" class="ex-dot" data-note="1" title="需求 36"><span class="ex-num">1</span></button>';
  }

  function bar(title, right) {
    return '<header class="nav"><div><button type="button" data-back="1">返回</button></div><h1>' + esc(title) + '</h1><div class="side">' + (right || "") + "</div></header>";
  }

  function sumItems(values, defs) {
    var total = 0;
    for (var i = 0; i < defs.length; i++) total += Number(values[i] || 0);
    return Math.round(total * 10) / 10;
  }

  function inBand(def, score) {
    return def.bands.some(function (band) { return score >= band[0] && score <= band[1]; });
  }

  function rolePeople(key, app) {
    return ROLES.filter(function (r) {
      return r.key === key && (!app || r.id !== app.applicantId);
    });
  }

  function nodePeople(app, node) {
    var at = node || app.node;
    if (at === "vice") return viceActors(app);
    if (at === "chief") return rolePeople("chief", app);
    if (at === "mentor-trainee") return rolePeople("mentor-trainee", app);
    if (at === "mentor-vice") return rolePeople("mentor-vice", app);
    if (at === "mentor") return rolePeople("mentor", app);
    if (at === "office") return rolePeople("office", app);
    return [];
  }

  function nodeList(app, node) {
    if (node === "vice") return app.vice || [];
    if (node === "chief") return app.chiefList || (app.chief ? [app.chief] : []);
    if (node === "mentor-trainee") return app.traineeList || (app.mentorTrainee ? [app.mentorTrainee] : []);
    if (node === "mentor-vice") return app.mentorViceList || (app.mentorVice ? [app.mentorVice] : []);
    if (node === "mentor") return app.mentorList || (app.mentor ? [app.mentor] : []);
    return [];
  }

  function remember(list, row) {
    var next = (list || []).filter(function (item) { return item.personId !== row.personId; });
    next.push(row);
    return next;
  }

  function allScored(app, node) {
    var people = nodePeople(app, node);
    if (!people.length) return true;
    var list = nodeList(app, node);
    return people.every(function (p) {
      return list.some(function (row) { return row.personId === p.id && row.total != null; });
    });
  }

  function viceActors(app) {
    return ROLES.filter(function (r) {
      return (r.key === "vice" || r.key === "vice-trainee") && r.id !== app.applicantId;
    });
  }

  function avgOf(list, fallback) {
    var rows = (list || []).filter(function (row) { return row && row.total != null; });
    if (!rows.length && fallback && fallback.total != null) return fallback.total;
    if (!rows.length) return null;
    var sum = rows.reduce(function (n, row) { return n + row.total; }, 0);
    return Math.round((sum / rows.length) * 10) / 10;
  }

  function aideFinal(app) {
    if (!allScored(app, "chief") || !allScored(app, "mentor")) return null;
    var chief = avgOf(app.chiefList, app.chief);
    var mentor = avgOf(app.mentorList, app.mentor);
    if (chief == null || mentor == null) return null;
    var vice = viceAverage(app);
    if (vice == null) return Math.round((mentor * 40 / 75 + chief * 35 / 75) * 10) / 10;
    return Math.round((mentor * 0.4 + chief * 0.35 + vice * 0.25) * 10) / 10;
  }

  function viceAverage(app) {
    var list = app.vice || [];
    if (!list.length) return null;
    var sum = list.reduce(function (n, row) { return n + row.total; }, 0);
    return Math.round((sum / list.length) * 10) / 10;
  }

  function leaderFinal(app) {
    var nodes = ["mentor-trainee", "mentor-vice", "mentor"];
    var ready = nodes.every(function (node) {
      return !nodePeople(app, node).length || allScored(app, node);
    });
    if (!ready) return null;
    var scores = [
      avgOf(app.traineeList, app.mentorTrainee),
      avgOf(app.mentorViceList, app.mentorVice),
      avgOf(app.mentorList, app.mentor)
    ].filter(function (n) { return n != null; });
    if (!scores.length) return null;
    var sum = scores.reduce(function (n, value) { return n + value; }, 0);
    return Math.round((sum / scores.length) * 10) / 10;
  }

  function statusText(app) {
    if (app.status === "已通过") return "已通过";
    if (app.status === "已驳回") return "已驳回";
    if (app.status === "未通过") return "未通过";
    return "审批中";
  }

  function nodeText(app) {
    var map = { vice: "助教副团/见习副团打分", chief: "助教正团打分", "mentor-trainee": "见习导师打分", "mentor-vice": "导师副团打分", mentor: "导师正团打分", office: "统筹办主任审批", done: "已结束" };
    return map[app.node] || "已结束";
  }

  function pendingRows() {
    var who = me();
    return ex.apps.filter(function (app) {
      return app.status === "审批中" && assignees(app).indexOf(who.id) >= 0 && !doneBy(app, who.id);
    }).map(function (app) {
      return { name: app.applicantName, kind: typeName(app.type), status: "待处理", time: app.updated, exId: app.id, node: nodeText(app) };
    });
  }

  function assignees(app) {
    if (app.node === "office") return ["p-office"];
    return nodePeople(app).map(function (role) { return role.id; });
  }

  function scoredRow(app, id) {
    return nodeList(app, app.node).some(function (row) {
      return row.personId === id && (row.total != null || row.decision === "no");
    });
  }

  function doneBy(app, id) {
    return scoredRow(app, id);
  }

  function log(app, action) {
    app.logs.push({ who: me().name, post: me().post, action: action, time: nowText() });
    app.updated = nowText();
  }

  function homePage() {
    var html = bar("优秀申请", '<button type="button" data-go="' + MINE + '">我的申请</button>');
    html += '<div class="body ex"><div class="ex-anchor">' + reqDot() + "</div>";
    html += '<button type="button" class="ex-pick" data-ex="pick" data-type="aide"><b>优秀助教</b><span>填写竞选宣言后提交。分数由后续节点填写。</span></button>';
    html += '<button type="button" class="ex-pick" data-ex="pick" data-type="leader"><b>优秀助教团长</b><span>填写自述后提交。分数由导师节点填写。</span></button>';
    html += '<div class="ex-block"><span class="ex-muted">本期是带队助教才能申请优秀助教。本期是见习副团、助教副团或助教正团才能申请优秀团长。</span></div></div>';
    return html;
  }

  function resultCards() {
    var html = '<h3>申请结果</h3><p>点一条就在手机里打开申请人看到的状态。</p>';
    ex.apps.filter(function (app) { return app.status !== "审批中"; }).forEach(function (app) {
      html += '<button type="button" class="' + (ex.view === app.id ? "is-on" : "") + '" data-ex="open" data-id="' + app.id + '">' + esc(app.applicantName) + " · " + typeName(app.type) + " · " + statusText(app) + "</button>";
    });
    return html;
  }

  function field(note, label, value, editable, id) {
    var html = '<div class="ex-line"><label>' + esc(label) + "</label>";
    if (editable) html += '<textarea id="' + id + '">' + esc(value || "") + "</textarea>";
    else html += '<div class="val">' + esc(value || "-") + "</div>";
    html += "</div>";
    return html;
  }

  function scoreTable(app, editable) {
    var defs = itemsOf(app);
    var mine = editable ? currentScore(app) : null;
    var html = '<div class="ex-block"><h3>评分</h3>';
    defs.forEach(function (def, i) {
      html += '<div class="ex-score"><b>' + (i + 1) + ". " + esc(def.name) + "（满分" + def.max + "）</b>";
      if (def.hint) html += '<span class="ex-muted">' + esc(def.hint) + "</span>";
      if (editable) html += '<input id="ex-s-' + i + '" type="number" min="0" max="' + def.max + '" step="0.5" value="' + esc(mine && mine[i] != null ? mine[i] : "") + '" />';
      else html += '<div class="ex-muted">' + scorePreview(app, i) + "</div>";
      html += "</div>";
    });
    var finalScore = app.finalScore != null ? app.finalScore : (app.type === "aide" ? aideFinal(app) : leaderFinal(app));
    html += '<div class="ex-final">综合分：' + (finalScore == null ? "未形成" : finalScore) + "</div></div>";
    return html;
  }

  function currentScore(app) {
    return null;
  }

  function scorePreview(app, index) {
    var bits = [];
    (app.vice || []).forEach(function (row) {
      if (row.items && row.items[index] != null) bits.push(person(row.personId).name + " " + row.items[index]);
    });
    ["chief", "mentor-trainee", "mentor-vice", "mentor"].forEach(function (node) {
      nodeList(app, node).forEach(function (row) {
        if (row.items && row.items[index] != null) bits.push(person(row.personId).name + " " + row.items[index]);
      });
    });
    return bits.length ? bits.join("；") : "本节点尚未打分";
  }

  function formPage() {
    var who = me();
    var aide = ex.type === "aide";
    var html = bar(typeName(ex.type));
    html += '<div class="body ex"><div class="ex-anchor">' + reqDot() + '</div><div class="ex-card"><h3>' + typeName(ex.type) + "评价表</h3>";
    html += field(aide ? "a1" : "b1", "营期", CAMP, false);
    html += field(aide ? "a2" : "b2", "班级", KLASS, false);
    html += field(aide ? "a3" : "b3", "姓名", who.name, false);
    html += field(aide ? "a4" : "b4", "岗位", who.post, false);
    html += field(aide ? "a5" : "b5", "日期", "2026-10-08", false);
    if (aide) html += field("a6", "入营期数", "", true, "ex-periods");
    html += field(aide ? "a7" : "b6", aide ? "竞选宣言" : "申请自述", "", true, "ex-decl");
    html += "</div>";
    html += scoreTable({ type: ex.type, vice: [], chief: null, mentor: null, mentorTrainee: null, mentorVice: null }, false);
    html += '<div class="ex-actions"><button type="button" data-ex="submit">提交并发起流程</button></div></div>';
    return html;
  }

  function flow(app) {
    var names = app.type === "aide"
      ? [["submit", "申请人提交"], ["vice", "助教副团/见习副团打分"], ["chief", "助教正团打分"], ["mentor", "导师正团打分"], ["office", "统筹办主任审批"]]
      : [["submit", "申请人提交"], ["mentor-trainee", "见习导师打分"], ["mentor-vice", "导师副团打分"], ["mentor", "导师正团打分"], ["office", "统筹办主任审批"]];
    var order = names.map(function (row) { return row[0]; });
    var cursor = app.node === "done" ? app.endedAt : app.node;
    var current = order.indexOf(cursor);
    var html = '<div class="ex-flow"><h3 style="margin:0 0 10px;font-size:15px">审批流程</h3>';
    names.forEach(function (row, index) {
      var cls = "ex-step";
      var extra = "";
      if (index < current) cls += " is-done";
      else if (index === current && app.status === "审批中") cls += " is-now";
      else if (index === current && app.status === "已通过") cls += " is-done";
      else if (index === current) cls += " is-stop";
      if (row[0] === "vice" && app.type === "aide" && !viceActors(app).length) extra = "（已跳过）";
      html += '<div class="' + cls + '">' + esc(row[1] + extra) + "<div>" + esc(stepDetail(app, row[0])) + "</div></div>";
    });
    html += '<div class="ex-muted">任务状态：' + statusText(app) + (app.status === "审批中" ? "。当前节点：" + nodeText(app) : endedNote(app)) + "</div></div>";
    return html;
  }

  function stepDetail(app, key) {
    if (key === "submit") return app.applicantName + " · " + app.applicantPost + " · 已提交 " + app.created;
    if (key === "vice" && app.type === "aide" && !viceActors(app).length) return "无副团和见习副团，已跳过";
    if (key === "vice") {
      var viceText = (app.vice || []).map(whoLine).join("；");
      if (app.node === "vice" && app.status === "审批中") return (viceText ? viceText + "；" : "") + waitLine(app);
      return viceText || "待打分";
    }
    if (key === "chief") {
      var chiefBits = nodeList(app, "chief").map(function (row) {
        if (row.decision === "no") return person(row.personId).name + " · " + person(row.personId).post + " · 不同意";
        if (row.total != null) return whoLine(row) + " · 同意流转";
        return "";
      }).filter(Boolean);
      if (app.node === "chief" && app.status === "审批中") return (chiefBits.length ? chiefBits.join("；") + "；" : "") + waitLine(app);
      return chiefBits.join("；");
    }
    if (key === "mentor-trainee") return scoredOrWait(app, "mentor-trainee");
    if (key === "mentor-vice") return scoredOrWait(app, "mentor-vice");
    if (key === "mentor") {
      if (app.status === "已驳回" && app.endedAt === "chief") return "未进入";
      return scoredOrWait(app, "mentor");
    }
    if (key === "office") {
      if (app.office) return person(app.office.personId).name + " · 统筹办主任 · " + (app.office.decision === "yes" ? "同意成为" + typeName(app.type) : "不同意");
      if (app.status !== "审批中") return "未进入";
      if (app.node === "office") return "待 郑主任 · 统筹办主任 确认是否成为" + typeName(app.type);
      return "";
    }
    return "";
  }

  function whoLine(row) {
    var who = person(row.personId);
    return who.name + " · " + who.post + " · " + row.total + "分";
  }

  function waitLine(app) {
    var list = nodeList(app, app.node);
    var people = nodePeople(app);
    var pending = people.filter(function (role) {
      return !list.some(function (row) {
        return row.personId === role.id && (row.total != null || row.decision === "no");
      });
    });
    var done = people.length - pending.length;
    if (!people.length) return "本节点无人，已跳过";
    if (!pending.length) return "本节点已全部打完";
    var names = pending.map(function (role) { return role.name + " · " + role.post; });
    return "待 " + names.join("、") + " 打分（" + done + "/" + people.length + "）";
  }

  function scoredOrWait(app, node) {
    var bits = nodeList(app, node).filter(function (row) { return row.total != null; }).map(function (row) {
      return whoLine(row) + (row.reason ? "。原因：" + row.reason : "");
    });
    if (app.node === node && app.status === "审批中") return (bits.length ? bits.join("；") + "；" : "") + waitLine(app);
    return bits.join("；");
  }

  function endedNote(app) {
    if (app.status === "已通过") return "。统筹办主任已同意成为" + typeName(app.type);
    if (app.status === "已驳回" && app.endedAt === "office") return "。统筹办主任不同意";
    if (app.status === "已驳回") return "。助教正团不同意，流程结束";
    if (app.status === "未通过") return "。综合分未达标，未进入统筹办";
    return "";
  }

  function scoresNow(app) {
    return app.node === "vice" || app.node === "chief" || app.node === "mentor-trainee" || app.node === "mentor-vice" || app.node === "mentor";
  }

  function detailPage() {
    var app = appBy(ex.view);
    if (!app) return bar("申请详情") + '<div class="body"><div class="empty">申请不存在</div></div>';
    var html = bar(typeName(app.type) + "申请");
    html += '<div class="body ex"><div class="ex-anchor">' + reqDot() + "</div>";
    html += flow(app);
    html += '<div class="ex-card"><h3>申请内容</h3>';
    html += field(app.type === "aide" ? "a3" : "b3", "申请人", app.applicantName + " / " + app.applicantPost, false);
    html += field(app.type === "aide" ? "a7" : "b6", app.type === "aide" ? "竞选宣言" : "申请自述", app.declaration, false);
    if (app.type === "aide") html += field("a6", "入营期数", app.periods, false);
    html += "</div>";
    html += scoreTable(app, canScore(app) && scoresNow(app));
    if (canScore(app)) html += actionBox(app);
    else html += '<div class="ex-block"><span class="ex-muted">' + (app.status === "审批中" ? "当前身份不处理这一节点，只能查看。" : "这是申请人可查看的结果。流程已结束。") + "</span></div>";
    html += "</div>";
    return html;
  }

  function canScore(app) {
    return app.status === "审批中" && assignees(app).indexOf(me().id) >= 0 && !doneBy(app, me().id);
  }

  function actionBox(app) {
    var html = '<div class="ex-block">';
    if (app.node === "chief") {
      html += field("a10", "突出表现（5W2H）", "", true, "ex-w2h");
      html += '<div class="ex-line"><label>推荐团长梯队</label><select id="ex-ladder"><option value="">请选择</option><option>是</option><option>否</option><option>仍需观察</option></select></div>';
    }
    if (app.type === "leader" && app.node === "mentor") html += field("b9", "闪光点（5W2H）", "", true, "ex-w2h");
    if (app.node === "office") {
      html += '<p class="ex-muted">统筹办主任不打分，只确认该申请人是否成为' + typeName(app.type) + '。</p>';
      html += field(app.type === "aide" ? "a12" : "b10", "统筹办意见", "", true, "ex-opinion");
      html += field(app.type === "aide" ? "a11" : "b11", "不同意时的原因", "", true, "ex-reason");
      html += '</div><div class="ex-actions">';
      html += '<button type="button" class="is-no" data-ex="decide" data-val="no">不同意</button>';
      html += '<button type="button" data-ex="decide" data-val="yes">同意成为' + typeName(app.type) + "</button>";
      html += "</div>";
      return html;
    }
    html += field(app.type === "aide" ? "a11" : "b11", "原因", "", true, "ex-reason");
    html += '</div><div class="ex-actions">';
    if (app.node === "chief") {
      html += '<button type="button" class="is-no" data-ex="decide" data-val="no">不同意</button>';
      html += '<button type="button" data-ex="decide" data-val="yes">同意流转</button>';
    } else html += '<button type="button" data-ex="save-score">提交分数</button>';
    html += "</div>";
    return html;
  }

  function minePage() {
    var list = ex.apps.filter(function (app) { return app.applicantId === me().id && app.status === "审批中"; });
    var html = bar("我的申请") + '<div class="body ex"><div class="ex-anchor">' + reqDot() + "</div>";
    if (!list.length) html += '<div class="empty">还没有提交过申请</div>';
    list.forEach(function (app) {
      var cls = app.status === "已通过" ? "ok" : (app.status === "审批中" ? "wait" : "no");
      html += '<button type="button" class="ex-mine" data-ex="open" data-id="' + app.id + '"><b>' + typeName(app.type) + ' <em class="ex-status ' + cls + '">' + statusText(app) + "</em></b><span class=\"ex-muted\">" + esc(app.created) + " · " + esc(nodeText(app)) + "</span></button>";
    });
    html += "</div>";
    return html;
  }

  function render(path) {
    if (path === FORM) return formPage();
    if (path === DETAIL) return detailPage();
    if (path === MINE) return minePage();
    return homePage();
  }

  function notesFor() {
    var path = window.APP && window.APP.path ? window.APP.path() : "";
    var app = appBy(ex.view);
    var type = path === FORM ? ex.type : app && app.type;
    if (path === HOME || path === MINE) return homeNotes();
    if (type === "leader") return leaderNotes();
    if (type === "aide") return aideNotes();
    return [];
  }

  function homeNotes() {
    return [
      note("h1", "入口", "按钮", "是", "工作台「优秀助教/团长申请表」。必须是本期周营的对应岗位才能申请对应头衔。"),
      note("h2", "申请类型", "单选", "是", "优秀助教仅带队助教可申请。优秀团长仅见习副团、助教副团、助教正团可申请。岗位不符时提示：岗位不符合申请条件，请联系统筹。")
    ];
  }

  function aideNotes() {
    return [
      note("a1", "营期", "只读文本", "是", "自动带出当前周营，申请人不能改。"),
      note("a2", "班级", "只读文本", "是", "自动带出当前班级。"),
      note("a3", "姓名", "只读文本", "是", "自动带出当前申请人。"),
      note("a4", "岗位", "只读文本", "是", "自动带出本期岗位。只有带队助教可以进入这张表。"),
      note("a5", "日期", "只读文本", "是", "提交当天。"),
      note("a6", "入营期数", "数字", "否", "纸质表有此栏。本期不因少于4期拦截提交。"),
      note("a7", "竞选宣言", "多行文本", "是", "申请人填写。结合入营初心、助教经历、优势和成长感悟。申请人不能打分。"),
      note("a8", "评分", "数字", "审批人必填", "11项按三档区间打分，可按0.5分细分。区间外分数必须填原因。助教副团与见习副团都在这一节点打分，多人先取平均，占25%，不能驳回。没有副团和见习副团则跳过。助教正团打本列35%，同一节点的正团全部打完才流转，任一人不同意则结束。导师正团打本列40%，同一节点的导师正团全部打完才算综合分。综合分=导师正团均分×40%+助教正团均分×35%+助教副团均分×25%。≥90自动到统筹办；＜90必须写原因，状态为未通过。"),
      note("a9", "审批流程", "只读", "是", "节点顺序不变：申请人提交 → 副团/见习副团 → 助教正团 → 导师正团 → 综合分≥90到统筹办。优秀助教每个节点上的全部团长打完，才进入下一节点。申请人和审批人都能看到已打分人数和还在等谁。"),
      note("a10", "突出表现", "多行文本", "助教正团必填", "仅助教正团节点填写，按5W2H写该助教的突出表现。"),
      note("a11", "原因", "多行文本", "驳回或未通过时必填", "助教正团不同意、导师正团打完不足90分、统筹办不同意时必填。流程结束，不退回。"),
      note("a12", "统筹办意见", "多行文本", "是", "统筹办主任不打分。同意为已通过，不同意为已驳回。")
    ];
  }

  function leaderNotes() {
    return [
      note("b1", "营期", "只读文本", "是", "自动带出当前周营。"),
      note("b2", "班级", "只读文本", "是", "自动带出当前班级。"),
      note("b3", "姓名", "只读文本", "是", "自动带出申请人。"),
      note("b4", "岗位", "只读文本", "是", "自动带出本期岗位。见习副团、助教副团、助教正团可以进入这张表。"),
      note("b5", "日期", "只读文本", "是", "提交当天。"),
      note("b6", "申请自述", "多行文本", "是", "团长本人填写。团长不能给自己打分。"),
      note("b7", "评分", "数字", "审批人必填", "10项按各自满分打分，不是助教那套三档区间。见习导师、导师副团、导师正团只打分。同一节点的导师全部打完才进入下一节点，多人先取该节点平均。没有见习导师则跳过且不计入人数。综合分=已出现节点的均分之和÷节点数。≥90自动到统筹办；＜90必须写原因，状态为未通过，不进统筹办。"),
      note("b8", "审批流程", "只读", "是", "节点顺序不变：申请人提交 → 见习导师 → 导师副团 → 导师正团 → 综合分≥90到统筹办。优秀助教团长每个节点上的全部导师打完，才进入下一节点。"),
      note("b9", "闪光点", "多行文本", "导师正团必填", "仅导师正团节点填写，按5W2H写该团长的闪光点。"),
      note("b10", "统筹办意见", "多行文本", "是", "统筹办主任不打分。同意为已通过，不同意为已驳回。"),
      note("b11", "原因", "多行文本", "未通过或驳回时必填", "综合分＜90，或统筹办不同意时必填。流程结束，不退回。")
    ];
  }

  function note(id, name, type, required, desc) {
    return { id: id, name: name, type: type, required: required, desc: desc };
  }

  function switcherHtml() {
    var who = me();
    var html = "<h3>演示身份</h3><p>切到审批人后，看手机底部待办。</p>";
    ROLES.filter(function (role) { return role.dock && !role.viewResult; }).forEach(function (role) {
      var n = countFor(role.id);
      html += '<button type="button" class="' + (role.id === who.id ? "is-on" : "") + '" data-ex="who" data-id="' + role.id + '">' + esc(role.name) + " · " + esc(role.post) + (n ? " · 待处理" + n : "") + "</button>";
    });
    html += resultCards();
    return html;
  }

  function drawerHtml() {
    var notes = notesFor();
    var aideRule = "节点顺序不变。优秀助教每个节点上的全部团长打完，才流转到下一节点。副团与见习副团先打分，多人取平均，占25%，不能驳回。没有这两类人则跳过。助教正团全部打完才到导师正团，任一人不同意则结束。导师正团全部打完才算综合分。综合分=导师正团均分×40%+助教正团均分×35%+助教副团均分×25%。≥90自动到统筹办；＜90须写原因，状态为未通过。";
    var leaderRule = "节点顺序不变。优秀助教团长每个节点上的全部导师打完，才流转到下一节点。见习导师、导师副团、导师正团只打分。同一节点多人先取平均。没有见习导师则跳过且不计入人数。综合分=已出现节点的均分之和÷节点数。≥90自动到统筹办；＜90须写原因，状态为未通过，不进统筹办。";
    var html = '<div class="ex-notes-head"><h2>注释</h2><button type="button" class="ex-note-close" data-ex="close-notes">关闭</button></div>';
    html += '<div class="ex-switch">' + switcherHtml() + "</div>";
    html += '<p class="ex-note-rule">下面是字段说明。一个红色序号对应一条需求。</p>';
    html += '<article class="ex-note-block" id="note-1"><h3><span class="ex-num">1</span> 优秀助教、优秀助教团长电子申请 <span class="ex-ver">清单第 36 条</span></h3>';
    html += '<div class="ex-logic"><h4>过往逻辑</h4><p>纸质评价表。优秀助教由班团与导师打分后上报；优秀助教团长由导师团打分后上报。</p></div>';
    html += '<div class="ex-logic"><h4>现在的逻辑 · 优秀助教</h4><p>' + esc(aideRule) + "</p></div>";
    html += '<div class="ex-logic"><h4>现在的逻辑 · 优秀助教团长</h4><p>' + esc(leaderRule) + "</p></div>";
    html += '<table><thead><tr><th>元素名称</th><th>元素类型</th><th>是否必填</th><th>说明</th></tr></thead><tbody>';
    notes.forEach(function (item) {
      html += "<tr><td>" + esc(item.name) + "</td><td>" + esc(item.type) + "</td><td>" + esc(item.required) + "</td><td>" + esc(item.desc) + "</td></tr>";
    });
    html += '</tbody></table></article>';
    return html;
  }

  function closeNotes() {
    window.NoteDock.hide();
  }

  function openNotes() {
    /* 注释走手机右侧的侧栏，不覆盖原型画面。 */
    var panel = window.NoteDock.host();
    panel.innerHTML = drawerHtml();
    panel.classList.add("is-open");
  }

  /* 助教分组页上的红点带 data-note="35 / 42 / 58"，按清单号分派到各自注释，
     不再所有红点都显示优秀助教那一条。 */
  function openNoteByReq(req) {
    var api = window.APP || {};
    if (req === "42" && api.openImprintNote) { api.openImprintNote(); return true; }
    if (req === "58" && api.openFeedNote) { api.openFeedNote(); return true; }
    if (req === "35" && api.openAwardNote) { api.openAwardNote(); return true; }
    return false;
  }

  function prefillBtn() {
    var viewing = appBy(ex.view);
    if (viewing && canScore(viewing) && scoresNow(viewing)) return '<button type="button" class="ex-prefill" data-ex="prefill">填入演示分数</button>';
    return "";
  }

  function mount() {
    var dock = document.getElementById("demo-dock");
    if (!dock) return;
    dock.innerHTML = "<h2>注释</h2>" + switcherHtml() + prefillBtn() + '<button type="button" data-note="1">字段说明</button>';
    /* 侧栏已经在显示时就地刷新内容，不再建 fixed 面板。 */
    if (window.NoteDock.isOpen()) window.NoteDock.host().innerHTML = drawerHtml();
  }

  function readList(defs) {
    var values = [];
    for (var i = 0; i < defs.length; i++) {
      var el = document.getElementById("ex-s-" + i);
      values.push(el ? el.value.trim() : "");
    }
    return values;
  }

  function textOf(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function validateScores(defs, values, api) {
    for (var i = 0; i < defs.length; i++) {
      if (values[i] === "") { api.toast("请填写「" + defs[i].name + "」"); return false; }
      var num = Number(values[i]);
      if (isNaN(num) || num < 0 || num > defs[i].max) { api.toast("「" + defs[i].name + "」需在0到" + defs[i].max + "之间"); return false; }
      if (defs[i].bands && !inBand(defs[i], num) && !textOf("ex-reason")) { api.toast("区间外分数请填写原因"); return false; }
    }
    return true;
  }

  function scored(id, items, extra) {
    var who = person(id);
    var total = 0;
    items.forEach(function (n) { total += n; });
    var row = { personId: id, name: who.name, items: items.slice(), total: Math.round(total * 10) / 10 };
    if (extra) Object.keys(extra).forEach(function (k) { row[k] = extra[k]; });
    return row;
  }

  function cloneScore(row) {
    if (!row) return null;
    var copy = { personId: row.personId, name: row.name, items: (row.items || []).slice(), total: row.total };
    ["decision", "w2h", "ladder", "flash", "reason"].forEach(function (k) {
      if (row[k]) copy[k] = row[k];
    });
    return copy;
  }

  function cloneList(list) {
    return (list || []).map(cloneScore).filter(Boolean);
  }

  function made(opts) {
    var who = person(opts.who);
    var chiefRows = opts.chiefList || (opts.chief ? [opts.chief] : []);
    var traineeRows = opts.traineeList || (opts.mentorTrainee ? [opts.mentorTrainee] : []);
    var viceRows = opts.mentorViceList || (opts.mentorVice ? [opts.mentorVice] : []);
    var mentorRows = opts.mentorList || (opts.mentor ? [opts.mentor] : []);
    return {
      id: opts.id,
      type: opts.type,
      applicantId: who.id,
      applicantName: who.name,
      applicantPost: who.post,
      declaration: opts.declaration,
      periods: opts.periods || "6",
      status: opts.status || "审批中",
      node: opts.status && opts.status !== "审批中" ? "done" : opts.node,
      endedAt: opts.endedAt || "",
      created: opts.created,
      updated: opts.updated,
      vice: (opts.vice || []).map(cloneScore),
      chiefList: cloneList(chiefRows),
      chief: cloneScore(opts.chief || chiefRows[chiefRows.length - 1] || null),
      traineeList: cloneList(traineeRows),
      mentorTrainee: cloneScore(opts.mentorTrainee || traineeRows[traineeRows.length - 1] || null),
      mentorViceList: cloneList(viceRows),
      mentorVice: cloneScore(opts.mentorVice || viceRows[viceRows.length - 1] || null),
      mentorList: cloneList(mentorRows),
      mentor: cloneScore(opts.mentor || mentorRows[mentorRows.length - 1] || null),
      office: opts.office || null,
      finalScore: opts.finalScore == null ? null : opts.finalScore,
      logs: [{ who: who.name, post: who.post, action: "提交申请", time: opts.created, node: "submit" }]
    };
  }

  function seedApps() {
    var aideHi = [10, 8, 7, 10, 10, 10, 10, 9, 9, 8, 7];
    var aideMid = [10, 8, 6, 10, 9, 10, 10, 9, 9, 8, 7];
    var leaderA = [5, 5, 5, 15, 10, 14, 10, 10, 10, 14];
    var leaderB = [5, 5, 5, 14, 10, 15, 9, 10, 10, 14];
    var leaderC = [5, 5, 5, 15, 9, 14, 10, 10, 9, 15];
    var viceDone = [scored("p-vice", aideHi), scored("p-vtr", aideMid)];
    var chiefDone = scored("p-chief", aideHi, { decision: "yes", w2h: "10月6日在A1班，主动处理两名学员冲突，课后家长正向反馈。", ladder: "仍需观察" });
    var chiefZhou = scored("p-chief2", aideMid, { decision: "yes", w2h: "10月7日巡堂时补上两名沉默学员。", ladder: "是" });
    var chiefBoth = [chiefDone, chiefZhou];
    var chiefNo = scored("p-chief", [], { decision: "no", reason: "课堂陪伴不稳定，本期不流转。" });
    chiefNo.total = null;
    chiefNo.items = [];
    var mentorHi = scored("p-mentor", aideHi);
    var mentorZheng = scored("p-mentor2", aideMid);
    var mentorBoth = [mentorHi, mentorZheng];
    var aideLow = [6, 4, 4, 6, 5, 5, 5, 5, 5, 4, 3];
    var chiefLow = scored("p-chief", aideLow, { decision: "yes", w2h: "能完成基础陪伴。", ladder: "仍需观察" });
    var chiefLowBoth = [chiefLow, scored("p-chief2", aideLow, { decision: "yes", w2h: "基础陪伴稳定，仍需观察。", ladder: "仍需观察" })];
    var mentorLow = scored("p-mentor", aideLow, { reason: "综合分未达90，本期不进入统筹办。" });
    var mentorLowBoth = [mentorLow, scored("p-mentor2", aideLow)];
    var leaderLow = [3, 3, 3, 8, 5, 8, 5, 5, 5, 8];
    var traineeBoth = [scored("p-mtr", leaderA), scored("p-mtr2", leaderB)];
    var traineeLow = [scored("p-mtr", leaderLow), scored("p-mtr2", leaderLow)];
    var mvBoth = [scored("p-mv", leaderB), scored("p-mv2", leaderA)];
    var mvLow = [scored("p-mv", leaderLow), scored("p-mv2", leaderLow)];
    var leadMentor = scored("p-mentor", leaderC, { flash: "10月7日离营前，把两组物资缺口当场补齐。" });
    var leadBoth = [leadMentor, scored("p-mentor2", leaderB, { flash: "例会跟进连续三天无遗漏。" })];
    var leadLowBoth = [scored("p-mentor", leaderLow, { reason: "综合分未达90，不进入统筹办。" }), scored("p-mentor2", leaderLow)];
    var officeYes = { personId: "p-office", name: "郑主任", decision: "yes", opinion: "同意推荐。" };
    var officeNo = { personId: "p-office", name: "郑主任", decision: "no", opinion: "本期先不授予。", reason: "现场执行仍不稳定。" };
    return [
      made({ id: "ex-aide-vice", who: "p-aide", type: "aide", node: "vice", created: "10-08 09:10", updated: "10-08 09:10", periods: "6", declaration: "这期我想把带队陪伴留下来，让每个孩子都被看见。" }),
      made({ id: "ex-aide-chief", who: "p-su", type: "aide", node: "chief", created: "10-07 11:20", updated: "10-08 10:05", periods: "5", declaration: "小班衔接我已经跑顺，希望把家营沟通做得更稳。", vice: viceDone, chief: chiefDone }),
      made({ id: "ex-aide-mentor", who: "p-xu", type: "aide", node: "mentor", created: "10-06 08:40", updated: "10-08 11:16", periods: "8", declaration: "大班分享会我想交给孩子自己主持，我在旁边补位。", vice: viceDone, chiefList: chiefBoth, mentor: mentorHi }),
      made({ id: "ex-aide-office", who: "p-he", type: "aide", node: "office", created: "10-05 14:02", updated: "10-08 15:20", periods: "7", declaration: "开营到离营我都在A2班，想把异常上报做到零漏报。", vice: viceDone, chiefList: chiefBoth, mentorList: mentorBoth }),
      made({ id: "ex-leader-trainee", who: "p-jiang", type: "leader", node: "mentor-trainee", created: "10-08 08:30", updated: "10-08 08:30", declaration: "见习副团这一期我补了班团的会前准备和巡寝。" }),
      made({ id: "ex-leader-vice", who: "p-qian", type: "leader", node: "mentor-vice", created: "10-07 09:18", updated: "10-08 09:40", declaration: "两组助教的开营岗位我按清单跟完了。", traineeList: traineeBoth }),
      made({ id: "ex-leader-mentor", who: "p-han", type: "leader", node: "mentor", created: "10-06 16:05", updated: "10-08 13:12", declaration: "助教例会的跟进我记成了可复用清单。", traineeList: traineeBoth, mentorViceList: mvBoth, mentor: leadMentor }),
      made({ id: "ex-leader-office", who: "p-shen", type: "leader", node: "office", created: "10-05 10:22", updated: "10-08 16:02", declaration: "这期正团岗位我把课前隐患连续三天清完。", traineeList: traineeBoth, mentorViceList: mvBoth, mentorList: leadBoth }),
      made({ id: "ex-aide-pass", who: "p-aide", type: "aide", status: "已通过", endedAt: "office", created: "10-01 09:00", updated: "10-04 18:20", periods: "6", declaration: "上一期带队的陪伴方法，我想留在班里。", vice: viceDone, chiefList: chiefBoth, mentorList: mentorBoth, office: officeYes, finalScore: 97.8 }),
      made({ id: "ex-aide-low", who: "p-aide", type: "aide", status: "未通过", endedAt: "mentor", created: "09-20 10:12", updated: "09-24 16:40", periods: "4", declaration: "这期我先把日常陪伴做稳。", vice: [scored("p-vice", aideLow), scored("p-vtr", aideLow)], chiefList: chiefLowBoth, mentorList: mentorLowBoth, finalScore: 52 }),
      made({ id: "ex-aide-reject", who: "p-aide", type: "aide", status: "已驳回", endedAt: "chief", created: "09-12 11:05", updated: "09-15 09:30", periods: "5", declaration: "我想申请优秀助教。", vice: viceDone, chief: chiefNo }),
      made({ id: "ex-aide-office-no", who: "p-su", type: "aide", status: "已驳回", endedAt: "office", created: "09-02 08:16", updated: "09-06 17:10", periods: "6", declaration: "分数到了统筹办，等待最终意见。", vice: viceDone, chiefList: chiefBoth, mentorList: mentorBoth, office: officeNo, finalScore: 97.8 }),
      made({ id: "ex-leader-pass", who: "p-jiang", type: "leader", status: "已通过", endedAt: "office", created: "10-01 14:00", updated: "10-04 19:00", declaration: "上一期副团岗位我把例会跟进做完了。", traineeList: traineeBoth, mentorViceList: mvBoth, mentorList: leadBoth, office: officeYes, finalScore: 97.3 }),
      made({ id: "ex-leader-low", who: "p-qian", type: "leader", status: "未通过", endedAt: "mentor", created: "09-18 09:40", updated: "09-22 15:12", declaration: "这期团长岗位我还在适应。", traineeList: traineeLow, mentorViceList: mvLow, mentorList: leadLowBoth, finalScore: 53 }),
      made({ id: "ex-leader-office-no", who: "p-han", type: "leader", status: "已驳回", endedAt: "office", created: "09-08 10:20", updated: "09-12 18:00", declaration: "分数达标后等统筹办意见。", traineeList: traineeBoth, mentorViceList: mvBoth, mentorList: leadBoth, office: officeNo, finalScore: 97.3 })
    ];
  }

  function blankApp(type, declaration, periods) {
    var who = me();
    return {
      id: "ap" + Date.now(),
      type: type,
      applicantId: who.id,
      applicantName: who.name,
      applicantPost: who.post,
      declaration: declaration,
      periods: periods,
      status: "审批中",
      node: type === "aide" ? (viceActors({ applicantId: who.id }).length ? "vice" : "chief") : "mentor-trainee",
      created: nowText(),
      updated: nowText(),
      vice: [],
      chief: null,
      chiefList: [],
      mentorTrainee: null,
      traineeList: [],
      mentorVice: null,
      mentorViceList: [],
      mentor: null,
      mentorList: [],
      office: null,
      finalScore: null,
      logs: [{ who: who.name, post: who.post, action: "提交申请", time: nowText(), node: "submit" }]
    };
  }

  function finishMentor(app, api) {
    var finalScore = app.type === "aide" ? aideFinal(app) : leaderFinal(app);
    app.finalScore = finalScore;
    var line = 90;
    if (finalScore >= line) {
      app.node = "office";
      log(app, "综合分" + finalScore + "，自动流转统筹办");
      api.toast("综合分" + finalScore + "，已流转统筹办");
    } else {
      app.status = "未通过";
      app.endedAt = "mentor";
      app.node = "done";
      log(app, "综合分" + finalScore + "，未达" + line + "分，流程结束");
      api.toast("未达" + line + "分，流程结束");
    }
  }

  function handle(el, api) {
    var act = el.getAttribute("data-ex") || (el.hasAttribute("data-note") ? "note" : "");
    if (!act) return false;
    if (act === "close-notes") { closeNotes(); return true; }
    if (act === "note") {
      if (openNoteByReq(el.getAttribute("data-note"))) return true;
      openNotes();
      return true;
    }
    if (act === "who") {
      ex.who = el.getAttribute("data-id");
      if (api.path && api.path() === HOME) api.go("pages/tabBar/pending");
      else api.render();
      return true;
    }
    if (act === "pick") {
      var picked = el.getAttribute("data-type");
      var post = me().post || "";
      var leaderPost = post === "见习副团" || post === "助教副团" || post === "助教正团";
      var ok = picked === "aide" ? post === "带队助教" : leaderPost;
      if (!ok) { api.toast("岗位不符合申请条件，请联系统筹"); return true; }
      ex.type = el.getAttribute("data-type");
      api.go(FORM);
      return true;
    }
    if (act === "submit") {
      var decl = textOf("ex-decl");
      if (!decl) { api.toast(ex.type === "aide" ? "请填写竞选宣言" : "请填写申请自述"); return true; }
      var app = blankApp(ex.type, decl, textOf("ex-periods"));
      ex.apps.unshift(app);
      ex.view = app.id;
      api.toast("已发起流程");
      api.go(DETAIL);
      return true;
    }
    if (act === "open") { ex.view = el.getAttribute("data-id"); api.go(DETAIL); return true; }
    if (act === "prefill") { prefill(); return true; }
    var current = appBy(ex.view);
    if (!current) return false;
    if (act === "save-score") return saveScore(current, api);
    if (act === "decide") return decide(current, el.getAttribute("data-val"), api);
    return false;
  }

  function prefill() {
    var app = appBy(ex.view);
    if (!app) return;
    var defs = itemsOf(app);
    defs.forEach(function (def, i) {
      var input = document.getElementById("ex-s-" + i);
      if (!input) return;
      var value = def.bands ? def.bands[def.bands.length - 1][0] : def.max;
      input.value = value;
    });
    var w2h = document.getElementById("ex-w2h");
    if (w2h && !w2h.value) w2h.value = "10月8日在A1班课堂，主动处理两名学员冲突，课后家长正向反馈。";
    var ladder = document.getElementById("ex-ladder");
    if (ladder && !ladder.value) ladder.value = "仍需观察";
    var opinion = document.getElementById("ex-opinion");
    if (opinion && !opinion.value) opinion.value = "同意推荐。";
  }

  function othersPending(app, node, personId) {
    var list = nodeList(app, node);
    return nodePeople(app, node).filter(function (role) {
      if (role.id === personId) return false;
      return !list.some(function (item) { return item.personId === role.id && item.total != null; });
    });
  }

  function previewFinal(app, row) {
    var copy = {
      type: app.type,
      applicantId: app.applicantId,
      vice: app.vice || [],
      chiefList: app.chiefList,
      chief: app.chief,
      traineeList: app.traineeList,
      mentorTrainee: app.mentorTrainee,
      mentorViceList: app.mentorViceList,
      mentorVice: app.mentorVice,
      mentorList: remember(app.mentorList, row),
      mentor: row
    };
    return app.type === "aide" ? aideFinal(copy) : leaderFinal(copy);
  }

  function saveScore(app, api) {
    var defs = itemsOf(app);
    var values = readList(defs);
    if (!validateScores(defs, values, api)) return true;
    var total = sumItems(values, defs);
    var row = { personId: me().id, name: me().name, items: values.map(Number), total: total };
    if (app.node === "vice") {
      app.vice = remember(app.vice, row);
      log(app, "提交副团分数" + total);
      if (allScored(app, "vice")) {
        app.node = "chief";
        api.toast("副团已全部打完，流转到助教正团");
      } else api.toast("已提交，还需其他团长打完");
      api.render();
      return true;
    }
    if (app.node === "mentor-trainee" || app.node === "mentor-vice") {
      var label = app.node === "mentor-trainee" ? "见习导师" : "导师副团";
      var nextName = app.node === "mentor-trainee" ? "导师副团" : "导师正团";
      if (app.node === "mentor-trainee") {
        app.traineeList = remember(app.traineeList, row);
        app.mentorTrainee = row;
      } else {
        app.mentorViceList = remember(app.mentorViceList, row);
        app.mentorVice = row;
      }
      log(app, "提交" + label + "分数" + total);
      if (allScored(app, app.node)) {
        app.node = app.node === "mentor-trainee" ? "mentor-vice" : "mentor";
        api.toast(label + "已全部打完，流转到" + nextName);
      } else api.toast("已提交，还需其他导师打完");
      api.render();
      return true;
    }
    if (app.node === "mentor") {
      if (app.type === "leader" && !textOf("ex-w2h")) { api.toast("请填写闪光点"); return true; }
      if (app.type === "aide" && !allScored(app, "chief")) { api.toast("助教正团尚未全部打完"); return true; }
      row.flash = textOf("ex-w2h");
      var reason = textOf("ex-reason");
      var last = !othersPending(app, "mentor", me().id).length;
      if (last) {
        var finalScore = previewFinal(app, row);
        if (finalScore < 90 && !reason) { api.toast("未达90分，请填写原因"); return true; }
        row.reason = reason;
        app.mentorList = remember(app.mentorList, row);
        app.mentor = row;
        log(app, "提交导师正团分数" + total);
        finishMentor(app, api);
        api.render();
        return true;
      }
      app.mentorList = remember(app.mentorList, row);
      app.mentor = row;
      log(app, "提交导师正团分数" + total);
      api.toast("已提交，还需其他导师打完");
      api.render();
      return true;
    }
    api.render();
    return true;
  }

  function decide(app, val, api) {
    var reason = textOf("ex-reason");
    if (val === "no" && !reason && app.node !== "office") { api.toast("请填写原因"); return true; }
    if (app.node === "office" && !textOf("ex-opinion")) { api.toast("请填写统筹办意见"); return true; }
    if (app.node === "chief") {
      if (val === "yes") {
        var defs = AIDE_ITEMS;
        var values = readList(defs);
        if (!validateScores(defs, values, api)) return true;
        if (!textOf("ex-w2h")) { api.toast("请填写突出表现"); return true; }
        if (!textOf("ex-ladder")) { api.toast("请选择是否推荐团长梯队"); return true; }
        var yesRow = { personId: me().id, name: me().name, items: values.map(Number), total: sumItems(values, defs), decision: "yes", w2h: textOf("ex-w2h"), ladder: textOf("ex-ladder") };
        app.chiefList = remember(app.chiefList, yesRow);
        app.chief = yesRow;
        log(app, "同意流转");
        if (allScored(app, "chief")) {
          app.node = "mentor";
          api.toast("助教正团已全部打完，流转到导师正团");
        } else api.toast("已提交，还需其他助教正团打完");
      } else {
        var noRow = { personId: me().id, name: me().name, items: [], total: null, decision: "no", reason: reason };
        app.chiefList = remember(app.chiefList, noRow);
        app.chief = noRow;
      app.status = "已驳回";
      app.endedAt = "chief";
      app.node = "done";
        log(app, "不同意，流程结束");
        api.toast("流程已结束");
      }
      api.render();
      return true;
    }
    if (app.node === "office") {
      app.office = { personId: me().id, name: me().name, decision: val, opinion: textOf("ex-opinion"), reason: reason };
      app.status = val === "yes" ? "已通过" : "已驳回";
      app.endedAt = "office";
      app.node = "done";
      log(app, val === "yes" ? "统筹办同意" : "统筹办不同意");
      api.toast(app.status);
      api.render();
    }
    return true;
  }

  window.EX = { has: has, render: render, handle: handle, mount: mount, openNotes: openNotes, pendingRows: pendingRows, roles: function () { return ROLES.filter(function (r) { return r.dock; }).map(function (r) { return { id: r.id, name: r.name, post: r.post }; }); }, current: function () { return ex.who; }, setWho: function (id) { if (person(id)) ex.who = id; }, actor: function () { var who = me(); return { name: who.name, post: who.post }; } };
})();
