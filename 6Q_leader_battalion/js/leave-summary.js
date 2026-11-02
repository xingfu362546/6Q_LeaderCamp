/**
 * 第10条 离营总表（后台）。菜单挂在 领袖营薪酬板块 → 薪酬管理 → 离营总表。
 *
 * 数据源（不要另起一套）：
 * - 学员名单与离营方式：conference/camps/member/travel/list
 *   入参 campsPeriodsProceedId（Q营ID）+ type=2（离营）。
 *   与「6Q业务 → 实施管理 → 领袖营实施 → Q营详情 → 迎接欢送 → 离营」同一张表、同一批字段。
 * - 离营方式取值 travelWay：1 机场接离、2 火车/高铁接离、3 大巴接离、4 营地自离、5 连营。
 * - 出发时间 travelStartTime、抵达时间 travelEndTime，按问卷所选交通方式给不同含义。
 *
 * 原型评审第二轮改动（本文件）：
 * - 第11条：已修改的数据要能筛出来。
 * - 第12条：原来单一的「预计离营」拆成「出发时间」「抵达时间」，按问卷交通工具标注。
 * - 第13条：新增 班级、小组、年龄、居住城市、问卷备注、是否送进安检、凭证。
 * - 第15条：助教在 APP「助教分组」发起离营方式变更申请，本页有独立的申请审批列表；
 *           总表对申请有一票否决权。通过后生效到学员信息上。
 * - 第16条：改后同步到 迎接欢送学员数据 / 助教分组学员-离营方式 / 总表，并标「已修改」。
 *           原值仍保留在过往记录表里，不被覆盖。
 * - 第17条：通过申请或人工修改时，逐条实时发送通知。
 * - 第14条（自离按父母接）本轮暂不实现，等确认页面。
 */
(function () {
  "use strict";

  var WAYS = [
    { way: 1, label: "机场接离", short: "机场", cls: "air" },
    { way: 2, label: "火车/高铁接离", short: "车站", cls: "station" },
    { way: 3, label: "大巴接离", short: "大巴", cls: "bus" },
    { way: 4, label: "营地自离", short: "自离", cls: "self" },
    { way: 5, label: "连营", short: "连营", cls: "join" },
    { way: 0, label: "未填写", short: "未填", cls: "none" }
  ];

  var PLANS = [
    { id: "p1", plan: "2026年暑假领袖营【华东基地】", week: "第六周", base: "华东基地" },
    { id: "p2", plan: "2026年暑假领袖营【广东基地A】", week: "第一周", base: "广东基地A" },
    { id: "p3", plan: "2027年寒假领袖营【广东基地】", week: "第一周", base: "广东基地" },
    { id: "p4", plan: "2026年暑假领袖营【南宁基地】", week: "第三周", base: "南宁基地" }
  ];

  /* 名单与「迎接欢送 → 离营」同源。
     depart / arrive 按问卷交通工具：机场=航班起飞与落地，火车=发车与到站，大巴=发车与到达。
     security：是否送进安检；voucher：凭证；remark：问卷备注。 */
  var ROSTER = [
    { id: "A10281", plan: "p1", name: "王小满", klass: "A1班", team: "1组", age: 12, city: "广州天河", way: 1, place: "广州白云机场T1航站楼", flight: "CZ3101", depart: "10-23 08:20", arrive: "10-23 11:05", remark: "需提前 2 小时到机场", security: "是", voucher: "已上传", status: "已离开", verify: 1, updated: "2026-10-18 16:20", updater: "林晓雯" },
    { id: "A10282", plan: "p1", name: "李可", klass: "A1班", team: "2组", age: 11, city: "深圳南山", way: 2, place: "广州南站", flight: "G1002", depart: "10-26 08:40", arrive: "10-26 10:02", remark: "", security: "否", voucher: "已上传", status: "未离开", verify: 1, updated: "2026-10-19 10:02", updater: "林晓雯" },
    { id: "A10284", plan: "p1", name: "赵欣然", klass: "A2班", team: "1组", age: 13, city: "杭州临平", way: 3, place: "广州南站", flight: "南站大巴", depart: "10-26 11:30", arrive: "10-26 13:00", remark: "随大巴统一下车", security: "否", voucher: "未上传", status: "未离开", verify: 1, updated: "2026-10-20 09:41", updater: "苏晚" },
    { id: "A10283", plan: "p1", name: "孙悦", klass: "A2班", team: "2组", age: 10, city: "东莞南城", way: 4, place: "家长接", flight: "—", depart: "—", arrive: "—", remark: "妈妈 16:00 到营地门口", security: "否", voucher: "—", status: "未离开", verify: 1, updated: "2026-10-21 18:30", updater: "苏晚" },
    { id: "A10285", plan: "p1", name: "陈启航", klass: "A1班", team: "1组", age: 12, city: "佛山南海", way: 0, place: "未填写", flight: "—", depart: "—", arrive: "—", remark: "", security: "否", voucher: "—", status: "未离开", verify: 1, updated: "", updater: "" },
    { id: "A10288", plan: "p1", name: "郑一诺", klass: "A1班", team: "1组", age: 11, city: "广州越秀", way: 5, place: "连营", flight: "—", depart: "—", arrive: "—", remark: "连营到第七周", security: "否", voucher: "—", status: "未离开", verify: 2, updated: "2026-10-22 11:05", updater: "林晓雯" },
    { id: "B20101", plan: "p2", name: "林小满", klass: "B1班", team: "1组", age: 12, city: "深圳福田", way: 1, place: "深圳宝安机场T3航站楼", flight: "ZH9802", depart: "10-18 13:10", arrive: "10-18 15:10", remark: "", security: "是", voucher: "已上传", status: "未离开", verify: 1, updated: "2026-10-18 15:10", updater: "林晓雯" },
    { id: "B20102", plan: "p2", name: "何晓波", klass: "B1班", team: "2组", age: 10, city: "南宁青秀", way: 2, place: "广州南站", flight: "G6021", depart: "10-18 15:05", arrive: "10-18 16:40", remark: "", security: "否", voucher: "已上传", status: "已离开", verify: 1, updated: "2026-10-18 16:40", updater: "林晓雯" },
    { id: "B20103", plan: "p2", name: "安宇静", klass: "B2班", team: "1组", age: 10, city: "南宁兴宁", way: 3, place: "深圳北站", flight: "大巴1号", depart: "10-19 07:50", arrive: "10-19 09:22", remark: "晕车，安排前排", security: "否", voucher: "未上传", status: "未离开", verify: 1, updated: "2026-10-19 09:22", updater: "苏晚" },
    { id: "B20106", plan: "p2", name: "苏晚", klass: "B2班", team: "2组", age: 11, city: "东莞东城", way: 0, place: "未填写", flight: "—", depart: "—", arrive: "—", remark: "", security: "否", voucher: "—", status: "未离开", verify: 1, updated: "", updater: "" },
    { id: "C30101", plan: "p3", name: "许宁", klass: "C1班", team: "1组", age: 11, city: "广州番禺", way: 1, place: "广州白云机场T2航站楼", flight: "CA1301", depart: "10-18 08:10", arrive: "10-18 10:02", remark: "", security: "是", voucher: "已上传", status: "未离开", verify: 1, updated: "2026-10-18 10:02", updater: "林晓雯" },
    { id: "C30102", plan: "p3", name: "何倩", klass: "C1班", team: "2组", age: 12, city: "中山石岐", way: 2, place: "广州南站", flight: "G1010", depart: "10-19 10:05", arrive: "10-19 11:31", remark: "", security: "否", voucher: "已上传", status: "未离开", verify: 1, updated: "2026-10-19 11:31", updater: "苏晚" },
    { id: "C30104", plan: "p3", name: "钱柏", klass: "C2班", team: "1组", age: 11, city: "珠海香洲", way: 5, place: "连营", flight: "—", depart: "—", arrive: "—", remark: "", security: "否", voucher: "—", status: "未离开", verify: 1, updated: "2026-10-21 09:19", updater: "林晓雯" },
    { id: "D40101", plan: "p4", name: "韩朔", klass: "D1班", team: "1组", age: 12, city: "南宁西乡塘", way: 1, place: "南宁吴圩机场T2航站楼", flight: "CZ6301", depart: "10-18 12:40", arrive: "10-18 14:26", remark: "", security: "是", voucher: "已上传", status: "未离开", verify: 1, updated: "2026-10-18 14:26", updater: "林晓雯" },
    { id: "D40102", plan: "p4", name: "沈予", klass: "D1班", team: "2组", age: 11, city: "柳州城中", way: 2, place: "南宁东站", flight: "G4201", depart: "10-19 15:30", arrive: "10-19 17:03", remark: "", security: "否", voucher: "已上传", status: "已离开", verify: 1, updated: "2026-10-19 17:03", updater: "苏晚" },
    { id: "D40104", plan: "p4", name: "赵岚", klass: "D2班", team: "2组", age: 12, city: "桂林象山", way: 4, place: "家长接", flight: "—", depart: "—", arrive: "—", remark: "爸爸开车来接", security: "否", voucher: "—", status: "未离开", verify: 1, updated: "2026-10-21 19:40", updater: "林晓雯" }
  ];

  /* 第15条：助教在 APP 助教分组发起的离营方式变更申请。 */
  var APPLICATIONS = [
    { id: "AP1", sid: "A10282", name: "李可", klass: "A1班", plan: "p1", from: 2, to: 1, place: "广州白云机场T1航站楼", flight: "CZ3520", depart: "10-26 06:30", arrive: "10-26 08:15", reason: "家长改成坐飞机回深圳", by: "林晓雯", at: "2026-10-24 20:15", status: "待审批" },
    { id: "AP2", sid: "B20103", name: "安宇静", klass: "B2班", plan: "p2", from: 3, to: 2, place: "广州南站", flight: "G6033", depart: "10-19 08:10", arrive: "10-19 09:40", reason: "大巴临时取消，改为高铁", by: "苏晚", at: "2026-10-18 21:02", status: "待审批" },
    { id: "AP3", sid: "A10284", name: "赵欣然", klass: "A2班", plan: "p1", from: 3, to: 4, place: "家长接", flight: "—", depart: "—", arrive: "—", reason: "家长临时到营地接", by: "苏晚", at: "2026-10-23 09:30", status: "已通过" }
  ];

  var KEY = "lb-leave-summary-v2";
  var APPKEY = "lb-leave-apps-v1";
  var MSGKEY = "lb-leave-msgs-v1";
  var state = { plan: "", way: -1, kw: "", editing: "", tab: "summary", onlyEdited: false, appId: "", msgOpen: false };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function load() {
    try {
      var saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (saved && saved.length) return saved;
    } catch (e) {}
    return ROSTER.map(function (r) { return Object.assign({}, r); });
  }

  function save(rows) {
    try { sessionStorage.setItem(KEY, JSON.stringify(rows)); } catch (e) {}
  }

  function loadApps() {
    try {
      var saved = JSON.parse(sessionStorage.getItem(APPKEY) || "null");
      if (saved && saved.length) return saved;
    } catch (e) {}
    return APPLICATIONS.map(function (a) { return Object.assign({}, a); });
  }

  function saveApps(list) {
    try { sessionStorage.setItem(APPKEY, JSON.stringify(list)); } catch (e) {}
  }

  function loadMsgs() {
    try { return JSON.parse(sessionStorage.getItem(MSGKEY) || "[]"); } catch (e) { return []; }
  }

  function pushMsg(row, fromWay, toWay, note) {
    var msgs = loadMsgs();
    msgs.unshift({
      at: nowStamp(),
      name: row.name,
      sid: row.id,
      text: "【" + row.name + "】离营方式由「" + wayMeta(fromWay).label + "」改为「" + wayMeta(toWay).label + "」" + (note ? "，" + note : ""),
      to: "家营 / 欢送负责人 / 助教团"
    });
    try { sessionStorage.setItem(MSGKEY, JSON.stringify(msgs)); } catch (e) {}
  }

  function nowStamp() {
    var d = new Date();
    var p = function (n) { return ("0" + n).slice(-2); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }

  function wayMeta(way) {
    return WAYS.filter(function (m) { return m.way === way; })[0] || WAYS[5];
  }

  function canEdit(row) {
    return row.verify !== 2 && row.status !== "已离开";
  }

  function shortPlan(planId) {
    var p = PLANS.filter(function (x) { return x.id === planId; })[0];
    return p ? p.base : "";
  }

  function filtered(rows) {
    return rows.filter(function (r) {
      if (state.plan && r.plan !== state.plan) return false;
      if (state.way >= 0 && r.way !== state.way) return false;
      if (state.onlyEdited && !r.isEdited) return false;
      if (state.kw && (r.name + r.id + r.place).indexOf(state.kw) < 0) return false;
      return true;
    });
  }

  function countBy(rows, way) {
    return rows.filter(function (r) { return r.way === way; }).length;
  }

  function bar(rows) {
    var html = '<div class="ls-bar">';
    WAYS.forEach(function (m) {
      var n = countBy(rows, m.way);
      if (!n) return;
      html += '<i class="ls-bar__seg ls-bar__seg--' + m.cls + '" style="flex:' + n + '" title="' + esc(m.label) + " " + n + '"></i>';
    });
    return html + "</div>";
  }

  function chips(rows, withZero) {
    var html = '<div class="ls-chips">';
    WAYS.forEach(function (m) {
      var n = countBy(rows, m.way);
      if (!n && !withZero) return;
      html += '<span class="ls-chip ls-chip--' + m.cls + '"><i></i>' + esc(m.short) + "<b>" + n + "</b></span>";
    });
    return html + "</div>";
  }

  function hero(rows) {
    var signed = rows.filter(function (r) { return r.status === "已离开"; }).length;
    var pct = rows.length ? Math.round(signed / rows.length * 100) : 0;
    var edited = rows.filter(function (r) { return r.isEdited; }).length;
    var pending = loadApps().filter(function (a) { return a.status === "待审批"; }).length;
    var html = '<section class="ls-hero"><div class="ls-hero__top"><div>';
    html += '<p class="ls-hero__eye">' + (state.plan ? "单基地视图" : "全部基地") + "</p>";
    html += "<h2>" + esc(state.plan ? shortPlan(state.plan) : "离营总览") + "</h2>";
    html += '<p class="ls-hero__sub">应离营 ' + rows.length + " 人" +
      (edited ? ' · <button type="button" class="ls-inline-link" data-ls="onlyEdited">已修改 ' + edited + " 人</button>" : "") +
      (pending ? ' · <button type="button" class="ls-inline-link" data-ls="tab" data-v="apps">待审批 ' + pending + " 条</button>" : "") +
      "</p></div>";
    html += '<div class="ls-ring" style="--p:' + pct + '"><b>' + pct + '%</b><span>已签离</span></div></div>';
    html += bar(rows) + chips(rows, true) + "</section>";
    return html;
  }

  function tabs() {
    var pending = loadApps().filter(function (a) { return a.status === "待审批"; }).length;
    return '<div class="ls-tabs">' +
      '<button type="button" class="ls-tab' + (state.tab === "summary" ? " is-on" : "") + '" data-ls="tab" data-v="summary">离营总表</button>' +
      '<button type="button" class="ls-tab' + (state.tab === "apps" ? " is-on" : "") + '" data-ls="tab" data-v="apps">变更申请' + (pending ? '<em class="ls-tab__dot">' + pending + "</em>" : "") + "</button>" +
      "</div>";
  }

  function planSwitch(rows) {
    var html = '<div class="ls-planswitch">';
    html += '<button type="button" class="ls-planswitch__item' + (state.plan === "" ? " is-on" : "") + '" data-ls="plan" data-v=""><b>全部</b><em>' + rows.length + "</em></button>";
    PLANS.forEach(function (p) {
      var sub = rows.filter(function (r) { return r.plan === p.id; });
      var edited = sub.filter(function (r) { return r.isEdited; }).length;
      html += '<button type="button" class="ls-planswitch__item' + (state.plan === p.id ? " is-on" : "") + '" data-ls="plan" data-v="' + p.id + '">';
      html += "<b>" + esc(p.base) + "</b><em>" + sub.length + (edited ? '<i class="ls-planswitch__dot"></i>' : "") + "</em></button>";
    });
    html += "</div>";
    return html;
  }

  /* 第12条：按交通方式给出发 / 抵达的标注。
     机场=起飞与落地，火车=发车与到站，大巴=发车与到达，自离/连营不适用。 */
  function timeHeads(way) {
    if (way === 1) return { dep: "起飞时间", arr: "落地时间" };
    if (way === 2) return { dep: "发车时间", arr: "到站时间" };
    if (way === 3) return { dep: "发车时间", arr: "到达时间" };
    return { dep: "出发时间", arr: "抵达时间" };
  }

  function denseTable(rows) {
    var html = '<div class="ls-tablewrap"><table class="ls-table ls-table--wide"><thead><tr>';
    html += "<th>学员</th><th>学员ID</th><th>班级 / 小组</th><th>年龄</th><th>居住城市</th><th>基地</th><th>离营方式</th><th>站点 / 班次</th><th>出发时间</th><th>抵达时间</th><th>问卷备注</th><th>安检</th><th>凭证</th><th>签离</th><th>核销</th><th>修改时间</th><th>操作</th>";
    html += "</tr></thead><tbody>";
    if (!rows.length) html += '<tr><td colspan="17" class="ls-table__empty">没有符合条件的学员</td></tr>';
    rows.forEach(function (r) {
      var m = wayMeta(r.way);
      var signed = r.status === "已离开";
      var t = timeHeads(r.way);
      html += '<tr class="ls-row ls-row--' + m.cls + (r.isEdited ? " is-edited" : "") + '">';
      html += '<td class="ls-cell-name"><b>' + esc(r.name) + "</b>" + (r.isEdited ? '<span class="ls-dot-edit" title="已修改"></span>' : "") + "</td>";
      html += "<td>" + esc(r.id) + "</td>";
      html += "<td>" + esc(r.klass) + (r.team ? " / " + esc(r.team) : "") + "</td>";
      html += "<td>" + esc(r.age || "-") + "</td>";
      html += "<td>" + esc(r.city || "-") + "</td>";
      html += "<td>" + esc(shortPlan(r.plan)) + "</td>";
      html += '<td><span class="ls-waytag ls-waytag--' + m.cls + '"><i></i>' + esc(m.short) + "</span></td>";
      html += "<td>" + (r.place && r.place !== "未填写" ? esc(r.place) : "-") + (r.flight && r.flight !== "—" ? ' <em class="ls-flight">' + esc(r.flight) + "</em>" : "") + "</td>";
      html += '<td title="' + esc(t.dep) + '">' + (r.depart && r.depart !== "—" ? esc(r.depart) : "-") + "</td>";
      html += '<td title="' + esc(t.arr) + '">' + (r.arrive && r.arrive !== "—" ? esc(r.arrive) : "-") + "</td>";
      html += '<td class="ls-cell-remark">' + (r.remark ? esc(r.remark) : "-") + "</td>";
      html += "<td>" + (r.security === "是" ? '<span class="lb-tag lb-tag--ok">是</span>' : "否") + "</td>";
      html += "<td>" + (r.voucher === "已上传" ? '<span class="lb-tag lb-tag--ok">已上传</span>' : r.voucher === "未上传" ? '<span class="lb-tag lb-tag--wait">未上传</span>' : "-") + "</td>";
      html += '<td><span class="ls-state' + (signed ? " is-done" : "") + '">' + esc(r.status) + "</span></td>";
      html += "<td>" + (r.verify === 2 ? "已核销" : "未核销") + "</td>";
      html += "<td>" + (r.updated || "-") + "</td>";
      html += '<td class="ls-cell-ops"><button type="button" class="ls-mini" data-ls="detail" data-id="' + esc(r.id) + '">详情</button>';
      if (canEdit(r)) html += '<button type="button" class="ls-mini ls-mini--primary" data-ls="edit" data-id="' + esc(r.id) + '">修改</button>';
      html += "</td></tr>";
    });
    html += "</tbody></table></div>";
    return html;
  }

  function appTable() {
    var list = loadApps();
    var html = '<div class="ls-apphead"><div>';
    html += "<h3>离营方式变更申请</h3>";
    html += '<p class="ls-hero__sub">申请来自 领袖营 APP → 助教分组 → 学员 → 发起申请。总表有审批与一票否决权。通过后立刻生效到学员信息，并逐条发送通知。</p>';
    html += "</div></div>";
    html += '<div class="ls-tablewrap"><table class="ls-table"><thead><tr>';
    html += "<th>学员</th><th>班级</th><th>基地</th><th>原方式</th><th>申请改为</th><th>站点 / 班次</th><th>申请人</th><th>申请时间</th><th>理由</th><th>状态</th><th>操作</th>";
    html += "</tr></thead><tbody>";
    if (!list.length) html += '<tr><td colspan="11" class="ls-table__empty">还没有变更申请</td></tr>';
    list.forEach(function (a) {
      var st = a.status === "待审批" ? '<span class="lb-tag lb-tag--wait">待审批</span>' : a.status === "已通过" ? '<span class="lb-tag lb-tag--ok">已通过</span>' : '<span class="lb-tag">已否决</span>';
      html += "<tr>";
      html += "<td><b>" + esc(a.name) + "</b><br><em class=\"lb-hint\">" + esc(a.sid) + "</em></td>";
      html += "<td>" + esc(a.klass) + "</td>";
      html += "<td>" + esc(shortPlan(a.plan)) + "</td>";
      html += '<td><span class="ls-waytag ls-waytag--' + wayMeta(a.from).cls + '"><i></i>' + esc(wayMeta(a.from).short) + "</span></td>";
      html += '<td><span class="ls-waytag ls-waytag--' + wayMeta(a.to).cls + '"><i></i>' + esc(wayMeta(a.to).short) + "</span>" + (a.place ? '<br><em class="lb-hint">' + esc(a.place) + (a.flight && a.flight !== "—" ? " · " + esc(a.flight) : "") + "</em>" : "") + "</td>";
      html += "<td>" + (a.place ? esc(a.place) : "-") + (a.flight && a.flight !== "—" ? ' <em class="ls-flight">' + esc(a.flight) + "</em>" : "") + "</td>";
      html += "<td>" + esc(a.by) + "</td>";
      html += "<td>" + esc(a.at) + "</td>";
      html += "<td>" + esc(a.reason || "-") + "</td>";
      html += "<td>" + st + "</td>";
      if (a.status === "待审批") {
        html += '<td class="ls-cell-ops"><button type="button" class="ls-mini ls-mini--primary" data-ls="app-pass" data-id="' + esc(a.id) + '">通过</button><button type="button" class="ls-mini ls-mini--danger" data-ls="app-veto" data-id="' + esc(a.id) + '">否决</button></td>';
      } else {
        html += "<td>-</td>";
      }
      html += "</tr>";
    });
    html += "</tbody></table></div>";
    return html;
  }

  function editSheet(r) {
    var t = timeHeads(r.way);
    var html = '<div class="ls-mask"><div class="ls-sheet"><h3>修改离营方式 · ' + esc(r.name) + "</h3>";
    html += '<p class="ls-sheet__sub">当前：' + esc(wayMeta(r.way).label) + (r.place && r.place !== "未填写" ? " · " + esc(r.place) : "") + "</p>";
    html += '<div class="ls-field"><label>离营方式</label><div class="ls-ways">';
    WAYS.forEach(function (m) {
      if (!m.way) return;
      html += '<button type="button" class="ls-way' + (r.way === m.way ? " is-on" : "") + '" data-ls="pick-way" data-v="' + m.way + '">' + esc(m.label) + "</button>";
    });
    html += "</div></div>";
    html += '<div class="ls-field"><label>站点 / 目的地</label><input class="ls-input" id="ls-place" value="' + esc(r.place === "未填写" ? "" : r.place) + '" placeholder="如：广州白云机场T1航站楼" /></div>';
    html += '<div class="ls-field"><label>航班号 / 班次</label><input class="ls-input" id="ls-flight" value="' + esc(r.flight === "—" ? "" : r.flight) + '" placeholder="如：CZ3101" /></div>';
    html += '<div class="ls-field"><label>' + esc(t.dep) + '</label><input class="ls-input" id="ls-depart" value="' + esc(r.depart === "—" ? "" : r.depart) + '" placeholder="如：10-23 08:20" /></div>';
    html += '<div class="ls-field"><label>' + esc(t.arr) + '</label><input class="ls-input" id="ls-arrive" value="' + esc(r.arrive === "—" ? "" : r.arrive) + '" placeholder="如：10-23 11:05" /></div>';
    html += '<div class="ls-field"><label>问卷备注</label><input class="ls-input" id="ls-remark" value="' + esc(r.remark || "") + '" placeholder="来自家长填写的备注" /></div>';
    html += '<div class="ls-field"><label>是否送进安检</label><select class="ls-input" id="ls-security"><option' + (r.security === "是" ? " selected" : "") + '>是</option><option' + (r.security !== "是" ? " selected" : "") + ">否</option></select></div>";
    html += '<p class="ls-tip">保存后立即生效，并逐条发送通知到 家营 / 欢送负责人 / 助教团。该行会标「已修改」，并记录修改时间与修改人。原值仍保留在过往记录表里。</p>';
    html += '<div class="ls-sheet__ops"><button type="button" class="ls-btn" data-ls="cancel">取消</button><button type="button" class="ls-btn ls-btn--primary" data-ls="save" data-id="' + esc(r.id) + '">保存</button></div>';
    html += "</div></div>";
    return html;
  }

  function detailSheet(r) {
    var m = wayMeta(r.way);
    var t = timeHeads(r.way);
    var rows = [
      ["离营方式", m.label],
      ["站点 / 目的地", r.place || "-"],
      ["航班号 / 班次", r.flight || "-"],
      [t.dep, r.depart || "-"],
      [t.arr, r.arrive || "-"],
      ["班级 / 小组", r.klass + " / " + r.team],
      ["年龄", String(r.age || "-")],
      ["居住城市", r.city || "-"],
      ["所属基地", shortPlan(r.plan)],
      ["问卷备注", r.remark || "-"],
      ["是否送进安检", r.security || "否"],
      ["凭证", r.voucher || "-"],
      ["签离状态", r.status],
      ["核销状态", r.verify === 2 ? "已核销" : "未核销"],
      ["更新时间", r.updated || "-"],
      ["更新人", r.updater || "-"]
    ];
    if (r.isEdited) rows.push(["本次人工调整", "由「" + wayMeta(r.beforeWay).label + "」改为「" + m.label + "」"]);
    if (r.isEdited) rows.push(["调整时间 / 人", (r.editedAt || "-") + " · " + (r.editedBy || "-")]);
    var html = '<div class="ls-mask"><div class="ls-sheet"><h3>离营详情 · ' + esc(r.name) + "</h3>";
    if (r.isEdited) html += '<div class="ls-badge">已修改</div>';
    html += '<div class="ls-detail">';
    rows.forEach(function (pair) {
      html += '<div class="ls-detail__row"><span>' + esc(pair[0]) + "</span><b>" + esc(pair[1]) + "</b></div>";
    });
    html += "</div>";
    html += '<p class="ls-tip">离营方式来自家长填写的离营问卷。后台人工修改或审批通过后即时流转到欢送端，问卷原值不改写，原值仍保留在过往记录表里。</p>';
    html += '<div class="ls-sheet__ops"><button type="button" class="ls-btn ls-btn--primary" data-ls="cancel">关闭</button></div>';
    html += "</div></div>";
    return html;
  }

  function msgSheet() {
    var msgs = loadMsgs();
    var html = '<div class="ls-mask"><div class="ls-sheet"><h3>已发送的离营方式通知 · ' + msgs.length + " 条</h3>";
    html += '<p class="ls-sheet__sub">每次通过申请或人工修改，都会实时逐条发送一条。接收方：家营 / 欢送负责人 / 助教团。</p>';
    if (!msgs.length) {
      html += '<p class="ls-tip">还没有发送过通知。通过一条申请或保存一次修改后会在这里出现。</p>';
    } else {
      html += '<div class="ls-msglist">';
      msgs.forEach(function (m) {
        html += '<div class="ls-msg"><b>' + esc(m.at) + '</b><p>' + esc(m.text) + '</p><em>' + esc(m.to) + "</em></div>";
      });
      html += "</div>";
    }
    html += '<div class="ls-sheet__ops"><button type="button" class="ls-btn ls-btn--primary" data-ls="cancel">关闭</button></div>';
    html += "</div></div>";
    return html;
  }

  function render(root) {
    var rows = load();
    var list = filtered(rows);
    var scope = state.plan ? rows.filter(function (r) { return r.plan === state.plan; }) : rows;
    var msgCount = loadMsgs().length;
    var html = '<div class="ls-page">';
    html += hero(scope);
    html += tabs();
    if (state.tab === "apps") {
      html += appTable();
    } else {
      html += planSwitch(rows);
      html += '<div class="ls-toolbar">';
      html += '<input class="ls-input" id="ls-kw" placeholder="搜索学员姓名 / 学员ID / 站点" value="' + esc(state.kw) + '" />';
      html += '<button type="button" class="ls-btn ls-btn--primary" data-ls="search">搜索</button>';
      html += '<button type="button" class="ls-pill ls-pill--edit' + (state.onlyEdited ? " is-on" : "") + '" data-ls="onlyEdited">只看已修改</button>';
      html += '<button type="button" class="ls-pill' + (state.way < 0 ? " is-on" : "") + '" data-ls="way" data-v="-1">全部</button>';
      WAYS.forEach(function (m) {
        html += '<button type="button" class="ls-pill ls-pill--' + m.cls + (state.way === m.way ? " is-on" : "") + '" data-ls="way" data-v="' + m.way + '">' + esc(m.short) + "</button>";
      });
      html += '<span class="ls-count">' + list.length + " 人</span>";
      html += '<button type="button" class="ls-btn ls-msgbtn" data-ls="msgs">已发送通知 ' + msgCount + " 条</button>";
      html += "</div>";
      html += denseTable(list);
    }
    html += "</div>";
    if (state.msgOpen) html += msgSheet();
    else if (state.editing) {
      var target = rows.filter(function (r) { return r.id === state.editing; })[0];
      if (target) html += state.tab === "detail" ? detailSheet(target) : editSheet(target);
    }
    root.innerHTML = html;
  }

  function mount(root) {
    if (!root) return;
    state.editing = "";
    state.tab = "summary";
    state.msgOpen = false;
    render(root);
  }

  function onClick(event) {
    var t = event.target.closest ? event.target.closest("[data-ls]") : null;
    var root = document.getElementById("lb-replica");
    if (!t) {
      if (event.target.closest && event.target.closest(".ls-mask") && !event.target.closest(".ls-sheet")) {
        state.editing = "";
        state.msgOpen = false;
        state.tab = "summary";
        render(root);
      }
      return;
    }
    var act = t.getAttribute("data-ls");

    if (act === "tab") {
      state.tab = t.getAttribute("data-v");
      state.editing = "";
      state.msgOpen = false;
      render(root);
      return;
    }
    if (act === "plan") {
      state.plan = t.getAttribute("data-v");
      render(root);
      return;
    }
    if (act === "way") {
      state.way = Number(t.getAttribute("data-v"));
      render(root);
      return;
    }
    if (act === "onlyEdited") {
      state.onlyEdited = !state.onlyEdited;
      render(root);
      return;
    }
    if (act === "search") {
      var input = document.getElementById("ls-kw");
      state.kw = input ? input.value.trim() : "";
      render(root);
      return;
    }
    if (act === "msgs") {
      state.msgOpen = true;
      state.editing = "";
      render(root);
      return;
    }
    if (act === "edit") {
      state.editing = t.getAttribute("data-id");
      state.tab = "edit";
      render(root);
      return;
    }
    if (act === "detail") {
      state.editing = t.getAttribute("data-id");
      state.tab = "detail";
      render(root);
      return;
    }
    if (act === "cancel") {
      state.editing = "";
      state.msgOpen = false;
      state.tab = "summary";
      render(root);
      return;
    }
    if (act === "pick-way") {
      var sheet = t.closest(".ls-sheet");
      if (sheet) sheet.querySelectorAll(".ls-way").forEach(function (b) { b.classList.remove("is-on"); });
      t.classList.add("is-on");
      return;
    }
    if (act === "save") {
      var id = t.getAttribute("data-id");
      var rows = load();
      var row = rows.filter(function (r) { return r.id === id; })[0];
      if (!row || !canEdit(row)) { window.LB.toast("已签离或已核销，不可修改"); return; }
      var picked = document.querySelector(".ls-way.is-on");
      var way = picked ? Number(picked.getAttribute("data-v")) : row.way;
      var place = (document.getElementById("ls-place") || {}).value || "";
      var flight = (document.getElementById("ls-flight") || {}).value || "";
      var depart = (document.getElementById("ls-depart") || {}).value || "";
      var arrive = (document.getElementById("ls-arrive") || {}).value || "";
      var remark = (document.getElementById("ls-remark") || {}).value || "";
      var security = (document.getElementById("ls-security") || {}).value || "否";
      if (way === row.way && place === row.place && flight === row.flight && depart === row.depart && arrive === row.arrive && remark === (row.remark || "") && security === (row.security || "否")) {
        window.LB.toast("没有改动");
        return;
      }
      var beforeWay = row.way;
      row.beforeWay = row.way;
      row.way = way;
      row.place = place || "未填写";
      row.flight = flight || "—";
      row.depart = depart || "—";
      row.arrive = arrive || "—";
      row.remark = remark;
      row.security = security;
      row.isEdited = true;
      row.editedAt = nowStamp();
      row.editedBy = "余炜烽";
      row.updated = row.editedAt;
      row.updater = row.editedBy;
      save(rows);
      pushMsg(row, beforeWay, way, "人工修改");
      state.editing = "";
      state.tab = "summary";
      window.LB.toast("已保存，并逐条发送通知");
      render(root);
      return;
    }
    if (act === "app-pass" || act === "app-veto") {
      var apps = loadApps();
      var app = apps.filter(function (a) { return a.id === t.getAttribute("data-id"); })[0];
      if (!app) return;
      if (act === "app-veto") {
        window.LB.confirm("否决【" + app.name + "】的离营方式变更申请？", function () {
          app.status = "已否决";
          saveApps(apps);
          window.LB.toast("已否决");
          render(root);
        });
        return;
      }
      window.LB.confirm("通过【" + app.name + "】的申请，" + wayMeta(app.from).label + " → " + wayMeta(app.to).label + "？通过后立刻生效到学员信息并发送通知。", function () {
        app.status = "已通过";
        saveApps(apps);
        var rows = load();
        var row = rows.filter(function (r) { return r.id === app.sid; })[0];
        if (row && canEdit(row)) {
          var beforeWay = row.way;
          row.beforeWay = row.way;
          row.way = app.to;
          row.place = app.place || row.place;
          row.flight = app.flight || row.flight;
          row.depart = app.depart || row.depart;
          row.arrive = app.arrive || row.arrive;
          row.isEdited = true;
          row.editedAt = nowStamp();
          row.editedBy = app.by + "（申请）· 余炜烽 审批";
          row.updated = row.editedAt;
          row.updater = "余炜烽";
          save(rows);
          pushMsg(row, beforeWay, app.to, "申请通过");
        }
        window.LB.toast("已通过并生效，通知已发送");
        render(root);
      });
      return;
    }
  }

  document.addEventListener("click", onClick, true);

  window.LB_LEAVE_SUMMARY = { mount: mount, rows: load, ways: WAYS };
})();
