(function () {
  "use strict";

  var CAMPS = [
    { id: "eq-small", name: "EQ营《口才与情商》", group: "EQ小班", plan: "2026年暑假领袖营【华东基地】", week: "第一周", base: "南宁基地", closed: false, read: "报读中", open: "待开营", impl: "正常", planN: "5/54", actual: "1/16", fresh: "0/16", again: "1/16", wait: "0/10", klass: "新训", start: "2026-07-07 16:00:00", end: "2026-07-13 16:00:00" },
    { id: "eq-mid", name: "EQ营《口才与情商》", group: "EQ中班", plan: "2026年暑假领袖营【华东基地】", week: "第二周", base: "南宁基地", closed: false, read: "报读中", open: "待开营", impl: "正常", planN: "10/54", actual: "5/26", fresh: "4/16", again: "1/10", wait: "0/10", klass: "新训", start: "2026-07-14 16:00:00", end: "2026-07-20 16:00:00" },
    { id: "sq", name: "SQ营《思维与合作》", group: "SQ小班", plan: "2026年暑假领袖营【华东基地】", week: "第一周", base: "南宁基地", closed: false, read: "报读中", open: "待开营", impl: "已满员", planN: "0/72", actual: "0/22", fresh: "0/22", again: "0/0", wait: "0/10", klass: "新训", start: "2026-07-07 16:00:00", end: "2026-07-13 16:00:00" },
    { id: "winter-eq", name: "EQ营《口才与情商》", group: "EQ小班", plan: "2027年寒假领袖营【广东基地】", week: "第一周", base: "南宁基地", closed: false, read: "报读中", open: "待开营", impl: "正常", planN: "8/40", actual: "2/16", fresh: "2/16", again: "0/0", wait: "0/8", klass: "新训", start: "2027-01-18 16:00:00", end: "2027-01-24 16:00:00" },
    { id: "nn-closed", name: "EQ营《口才与情商》", group: "EQ大班", plan: "2026年暑假领袖营【华东基地】", week: "第三周", base: "南宁基地", closed: true, read: "已结束", open: "已结营", impl: "正常", planN: "12/40", actual: "12/16", fresh: "8/16", again: "4/0", wait: "0/0", klass: "新训", start: "2026-06-01 16:00:00", end: "2026-06-07 16:00:00" },
    { id: "gz-eq", name: "EQ营《口才与情商》", group: "EQ小班", plan: "2026年暑假领袖营【广东基地A】", week: "第一周", base: "广州基地", closed: false, read: "报读中", open: "待开营", impl: "正常", planN: "6/40", actual: "1/16", fresh: "1/16", again: "0/0", wait: "0/8", klass: "新训", start: "2026-07-07 16:00:00", end: "2026-07-13 16:00:00" }
  ];

  var view = document.body.getAttribute("data-lb-view") || "list";
  var campId = new URLSearchParams(location.search).get("camp") || "eq-small";
  var detailTab = new URLSearchParams(location.search).get("tab") || "基础信息";
  var enrollTab = "已报读";
  var dialog = null;
  var picked = {};
  var q = { name: "", sid: "", oldWeek: "", newWeek: "", order: "", status: "已确认", from: "", to: "" };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function camp() {
    return CAMPS.filter(function (item) { return item.id === campId; })[0] || CAMPS[0];
  }

  function listHtml() {
    var html = '<div class="qd-query">';
    html += '<label class="qd-field"><span>Q营</span><input class="lb-input" placeholder="请输入Q营" /></label>';
    html += '<label class="qd-field"><span>计划名称</span><input class="lb-input" placeholder="请输入计划名称" /></label>';
    html += '<label class="qd-field"><span>周营</span><input class="lb-input" placeholder="请输入周营" /></label>';
    html += '<label class="qd-field"><span>报读状态</span><select class="lb-select"><option>请选择报读状态</option><option>待报读</option><option>报读中</option><option>截止报读</option></select></label>';
    html += '<label class="qd-field"><span>开营状态</span><select class="lb-select"><option>请选择开营状态</option><option>待开营</option><option>开营中</option><option>已结营</option></select></label>';
    html += '<label class="qd-field"><span>实施状态</span><select class="lb-select"><option>请选择实施状态</option><option>正常</option><option>已取消</option><option>已核销</option></select></label>';
    html += '<div class="qd-query__actions"><button type="button" class="lb-btn lb-btn--primary">查询</button><button type="button" class="lb-btn">重置</button><button type="button" class="lb-btn" id="biz-export">导出</button></div>';
    html += "</div>";
    html += '<div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>Q营</th><th>所属计划</th><th>所属周营</th><th>报读状态</th><th>开营状态</th><th>实施状态</th><th>计划名额(人)</th><th>实际报读(人)</th><th>新训报读(人)</th><th>复训报读(人)</th><th>候补人数(人)</th><th>班级状态</th><th>开营时间</th><th>结营时间</th><th>操作</th></tr></thead><tbody>';
    CAMPS.forEach(function (item) {
      html += "<tr><td><a href=\"camp-detail.html?camp=" + item.id + "\">" + esc(item.name) + "<br>" + esc(item.group) + "</a></td><td>" + esc(item.plan) + "</td><td>" + esc(item.week) + "</td><td>" + esc(item.read) + "</td><td>" + esc(item.open) + "</td><td>" + esc(item.impl) + "</td><td>" + item.planN + "</td><td>" + item.actual + "</td><td>" + item.fresh + "</td><td>" + item.again + "</td><td>" + item.wait + "</td><td>" + item.klass + "</td><td>" + item.start + "</td><td>" + item.end + '</td><td><a href="camp-detail.html?camp=' + item.id + '">标签</a> <button type="button" class="lb-btn" data-code="1">二维码</button></td></tr>';
    });
    return html + "</tbody></table></div>";
  }

  function enrollHtml() {
    var tabs = ["已报读", "候补中", "改期中", "已取消", "已改期", "提前离营中", "提前离营", "锁定名额"];
    var html = '<div class="qd-tabs">';
    tabs.forEach(function (name) {
      html += '<button type="button" class="' + (enrollTab === name ? "is-on" : "") + '" data-enroll="' + name + '">' + name + "</button>";
    });
    html += "</div><div class=\"lb-table-wrap\"><table class=\"lb-table\"><thead><tr><th>学员姓名</th><th>学员ID</th><th>连营状态</th><th>订单状态</th><th>连营费</th><th>操作</th></tr></thead><tbody>";
    var rows = window.LB_JOIN.load().filter(function (row) { return row.camp === campId && row.enroll === enrollTab; });
    if (!rows.length) html += '<tr><td colspan="6">暂无数据</td></tr>';
    rows.forEach(function (row) {
      html += "<tr><td>" + esc(row.name) + "</td><td>" + esc(row.sid) + "</td><td>" + esc(row.status) + "</td><td>" + esc(row.orderStatus) + "</td><td>￥" + row.fee + "</td><td>";
      if (enrollTab === "已报读") html += '<button type="button" class="lb-btn" data-drop="' + row.id + '">取消报读</button> <button type="button" class="lb-btn" data-move="' + row.id + '">改期</button>';
      html += "</td></tr>";
    });
    return html + "</tbody></table></div>";
  }

  var travelMode = "入营";
  var travelOpen = false;
  var travelCopy = false;
  var travelPick = {};
  var travelForm = null;
  var SURVEY_KEY = "lb-enter-way-v1";

  function loadSurveys() {
    try { return JSON.parse(sessionStorage.getItem(SURVEY_KEY) || "{}"); } catch (e) { return {}; }
  }

  function saveSurveys(map) {
    sessionStorage.setItem(SURVEY_KEY, JSON.stringify(map));
  }

  var PLACE = {
    "南宁基地": {
      airports: ["南宁吴圩机场T2航站楼", "南宁吴圩机场T1航站楼"],
      stations: ["南宁东站"],
      buses: ["南宁办事处大巴（第1辆）6Q林晓雯:13800001111", "柳州办事处大巴（第1辆）6Q陈启航:13800002222", "桂林办事处大巴（第1辆）6Q王敏:13800003333", "北海办事处大巴（第1辆）6Q郑海:13800004444"]
    },
    "广州基地": {
      airports: ["广州白云机场T2航站楼", "广州白云机场T3航站楼"],
      stations: ["广州南站"],
      buses: ["广州办事处大巴（第1辆）6Q马丽:13800005555", "佛山办事处大巴（第1辆）6Q周宁:13800006666"]
    }
  };

  function emptyTeacher() {
    return { name: "", flight: "", depart: "", arrive: "" };
  }

  function emptyStop(name) {
    return { name: name, on: false, company: "", contacts: [""], teachers: [emptyTeacher()] };
  }

  function blankForm() {
    var place = PLACE[camp().base] || PLACE["南宁基地"];
    return {
      mode: travelMode,
      airOn: true,
      airports: place.airports.map(emptyStop),
      airNote: "",
      trainOn: true,
      stations: place.stations.map(emptyStop),
      trainNote: "",
      busOn: true,
      buses: place.buses.map(function (name) { return { name: name, on: false }; }),
      busNote: "",
      leaveStart: "",
      leaveEnd: "",
      leaveNote: "",
      entrust: [],
      safety: []
    };
  }

  function surveyId(id) {
    return id + "|" + travelMode;
  }

  function readStop(kind, item, index) {
    var box = document.querySelector("[data-stop='" + kind + ":" + index + "']");
    if (box) item.on = box.checked;
    if (kind === "bus") return;
    var company = document.getElementById("tv-co-" + kind + "-" + index);
    if (company) item.company = company.value;
    var contacts = [];
    document.querySelectorAll("[data-contact='" + kind + ":" + index + "']").forEach(function (el) { contacts.push(el.value); });
    if (contacts.length) item.contacts = contacts;
    item.teachers.forEach(function (teacher, ti) {
      ["name", "flight", "depart", "arrive"].forEach(function (key) {
        var el = document.getElementById("tv-" + key + "-" + kind + "-" + index + "-" + ti);
        if (el) teacher[key] = el.value;
      });
    });
  }

  function syncForm() {
    if (!travelForm || !document.getElementById("tv-form")) return travelForm;
    var air = document.querySelector("input[name='tv-air']:checked");
    var train = document.querySelector("input[name='tv-train']:checked");
    var bus = document.querySelector("input[name='tv-bus']:checked");
    if (air) travelForm.airOn = air.value === "1";
    if (train) travelForm.trainOn = train.value === "1";
    if (bus) travelForm.busOn = bus.value === "1";
    travelForm.airports.forEach(function (item, i) { readStop("air", item, i); });
    travelForm.stations.forEach(function (item, i) { readStop("train", item, i); });
    travelForm.buses.forEach(function (item, i) { readStop("bus", item, i); });
    var airNote = document.getElementById("tv-air-note");
    var trainNote = document.getElementById("tv-train-note");
    var busNote = document.getElementById("tv-bus-note");
    var leaveNote = document.getElementById("tv-leave-note");
    var leaveStart = document.getElementById("tv-leave-start");
    var leaveEnd = document.getElementById("tv-leave-end");
    if (airNote) travelForm.airNote = airNote.value;
    if (trainNote) travelForm.trainNote = trainNote.value;
    if (busNote) travelForm.busNote = busNote.value;
    if (leaveNote) travelForm.leaveNote = leaveNote.value;
    if (leaveStart) travelForm.leaveStart = leaveStart.value;
    if (leaveEnd) travelForm.leaveEnd = leaveEnd.value;
    travelForm.mode = travelMode;
    return travelForm;
  }

  function clearStop(item) {
    item.on = false;
    item.company = "";
    item.contacts = [""];
    if (item.teachers) item.teachers = [emptyTeacher()];
  }

  function sameBaseCamps() {
    var base = camp().base;
    return CAMPS.filter(function (item) { return item.base === base && !item.closed; });
  }

  function infoLine(label, value) {
    return '<div class="qd-info"><span>' + label + "</span><b>" + value + "</b></div>";
  }

  function infoBlock(items) {
    return '<div class="qd-desc">' + items.map(function (pair) { return infoLine(pair[0], pair[1]); }).join("") + "</div>";
  }

  function sectionTitle(title, extra) {
    return '<div class="qd-title"><span>' + title + "</span><i></i>" + (extra || "") + "</div>";
  }

  function numPair(text) {
    var parts = String(text).split("/");
    return { used: Number(parts[0]) || 0, total: Number(parts.length > 1 ? parts[1] : parts[0]) || 0 };
  }

  function baseHtml() {
    var item = camp();
    var plan = numPair(item.planN);
    var fresh = numPair(item.fresh);
    var again = numPair(item.again);
    var wait = numPair(item.wait);
    var year = String(item.start).slice(0, 4);
    var openDay = String(item.start).slice(0, 10);
    var status = '<div class="qd-title__extra"><span>' + esc(item.read) + '</span><em>|</em><span>' + esc(item.open) + '</span><em>|</em><span>' + esc(item.impl) + "</span></div>";
    return '<div class="qd-info-page"><div class="qd-head"><span class="lb-act"><button type="button" class="lb-btn lb-btn--primary" data-extra-open="1">额外住宿费用收款码</button><button type="button" class="lb-num-btn" data-note-key="extraStay"></button></span><button type="button" class="lb-btn">核销</button><button type="button" class="lb-btn">报读二维码</button><button type="button" class="lb-btn">修改人数</button><button type="button" class="lb-btn">取消Q营</button><a class="lb-btn" href="camp-implement.html">返回</a></div>' +
      sectionTitle("周营信息", status) +
      infoBlock([
        ["所属计划", esc(item.plan)],
        ["开营周营", esc(item.week)],
        ["营地", esc(item.base)],
        ["开设Q营", esc(item.name)],
        ["开设班级", esc(item.group)],
        ["适用年龄", "6 至 12 岁"],
        ["报读时间", year + "-03-01 09:00:00-" + openDay + " 17:00:00"],
        ["开营时间", esc(item.start) + "-" + esc(item.end)],
        ["提前报读", year + "-03-01 09:00:00"],
        ["候补截止", openDay + " 17:00:00"]
      ]) +
      sectionTitle("招生情况") +
      infoBlock([
        ["总计划报读", plan.total + "人"],
        ["总实际报读", (fresh.used + again.used) + "人"],
        ["是否允许候补", "是"]
      ]) +
      sectionTitle("") +
      infoBlock([
        ["新训计划报读", fresh.total + "人"],
        ["新训实际报读", fresh.used + "人"],
        ["新训剩余报读", Math.max(fresh.total - fresh.used, 0) + "人"],
        ["新训冻结报读", "0人"],
        ["新训计划候补", wait.total + "人"],
        ["新训实际候补", wait.used + "人"],
        ["新训锁定名额", "0个"],
        ["已用新训锁定名额", "0个"]
      ]) +
      sectionTitle("") +
      infoBlock([
        ["复训计划报读", again.total + "人"],
        ["复训实际报读", again.used + "人"],
        ["复训剩余报读", Math.max(again.total - again.used, 0) + "人"],
        ["复训冻结报读", "0人"],
        ["复训计划候补", wait.total + "人"],
        ["复训实际候补", "0人"],
        ["复训锁定名额", "0个"],
        ["已用复训锁定名额", "0个"]
      ]) +
      sectionTitle("其他信息") +
      '<div class="qd-desc qd-desc--1">' + infoLine("入营须知", "—") + "</div></div>";
  }

  /* 迎接欢送 · 学员列表
     现网位置：6Q业务 → 实施管理 → 领袖营实施 → 点 Q营 → 左侧「迎接欢送」页签
     源码：views/leaderCamp/implement/manage/components/comeLeave/index.vue
     挂载：views/leaderCamp/implement/manage/detail.vue 的 tabList（name: comeLeave）
     列表接口：GET conference/camps/member/travel/list（入参 campsPeriodsProceedId + type，
     type 1 入营 / 2 离营；筛选参数 memberCode、memberName、memberMobile、unaccompanied、travelWay） */
  function travelRows(item) {
    var key = "lb-travel-rows-v1|" + item.id + "|" + (travelMode === "入营" ? 1 : 2);    var saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(key) || "null"); } catch (e) { saved = null; }
    if (saved && saved.length) return { key: key, rows: saved };
    /* 与 APP 助教分组里「离营方式」同源：travelWay 1机场 2火车高铁 3大巴 4自行/营地自离 5连营 */
    var base = travelMode === "入营"
      ? [
        { id: "A10281", name: "王小满", status: "已到达", sex: "女", phone: "13800001101", area: "广东省广州市", birth: "2014-05-08", age: 11, health: "良好", height: "140", weight: "35", dress: "130", city: "广州天河", klass: "A1班", team: "1组", way: 1, place: "广州白云机场T1航站楼", flight: "CZ3101", time: "10-14 16:20", updated: "2026-10-18 16:20", updater: "林晓雯", verify: "未核销" },
        { id: "A10282", name: "李可", status: "已到达", sex: "男", phone: "13900003303", area: "广东省深圳市", birth: "2015-01-20", age: 10, health: "花粉过敏", height: "138", weight: "33", dress: "140", city: "深圳南山", klass: "A1班", team: "2组", way: 2, place: "广州南站", flight: "G1002", time: "10-16 09:35", updated: "2026-10-19 10:02", updater: "林晓雯", verify: "未核销" },
        { id: "A10283", name: "孙悦", noOrder: true, status: "未到达", sex: "女", phone: "13600005505", area: "广东省东莞市", birth: "2015-09-02", age: 10, health: "良好", height: "130", weight: "28", dress: "120", city: "东莞南城", klass: "A2班", team: "2组", way: 4, place: "自行入营", flight: "—", time: "10-15 09:10", updated: "2026-10-21 18:30", updater: "苏晚", verify: "未核销" }
      ]
      : [
        { id: "A10281", name: "王小满", status: "已离开", sex: "女", phone: "13800001101", area: "广东省广州市", birth: "2014-05-08", age: 11, health: "良好", height: "140", weight: "35", dress: "130", city: "广州天河", klass: "A1班", team: "1组", way: 1, place: "广州白云机场T1航站楼", flight: "CZ3101", time: "10-23 11:05", updated: "2026-10-18 16:20", updater: "林晓雯", verify: "未核销" },
        { id: "A10282", name: "李可", status: "未离开", sex: "男", phone: "13900003303", area: "广东省深圳市", birth: "2015-01-20", age: 10, health: "花粉过敏", height: "138", weight: "33", dress: "140", city: "深圳南山", klass: "A1班", team: "2组", way: 2, place: "广州南站", flight: "G1002", time: "10-26 10:02", updated: "2026-10-19 10:02", updater: "林晓雯", verify: "未核销" },
        { id: "A10284", name: "赵欣然", status: "未离开", sex: "女", phone: "13700004404", area: "浙江省杭州市", birth: "2014-11-21", age: 11, health: "良好", height: "150", weight: "40", dress: "150", city: "杭州西湖", klass: "A2班", team: "1组", way: 3, place: "广州南站", flight: "南站大巴", time: "10-26 13:00", updated: "2026-10-20 09:41", updater: "苏晚", verify: "未核销" },
        { id: "A10285", name: "陈启航", status: "未离开", sex: "男", phone: "13800007707", area: "广东省佛山市", birth: "2014-02-14", age: 12, health: "良好", height: "142", weight: "36", dress: "140", city: "佛山禅城", klass: "A1班", team: "1组", way: 0, place: "未填写", flight: "—", time: "", updated: "", updater: "", verify: "未核销" }
      ];
    return { key: key, rows: base };
  }

  var travelCache = {};

  /* 后台「离营总表」人工改过的记录，同步到本页离营页签。
     数据源：sessionStorage lb-leave-summary-v1（leave-summary.js 写入）。
     只改展示与标记，不回写问卷原值。 */
  function leaveSummaryEdited() {
    var rows = [];
    try { rows = JSON.parse(sessionStorage.getItem("lb-leave-summary-v1") || "[]"); } catch (e) { rows = []; }
    var map = {};
    (rows || []).forEach(function (r) { if (r.isEdited) map[r.id] = r; });
    return map;
  }

  function travelPack(item) {
    if (!travelCache[item.id + travelMode]) travelCache[item.id + travelMode] = travelRows(item);
    return travelCache[item.id + travelMode];
  }

  function travelListHtml() {
    var item = camp();
    var saved = loadSurveys()[surveyId(item.id)];
    var tip = item.closed ? "本Q营已结营，不能再设置" + travelMode + "方式" : saved ? "本Q营的" + travelMode + "方式已设置成功并成功向用户发送调研" : "本Q营的" + travelMode + "方式暂未设置";
    var pack = travelPack(item);
    var edits = travelMode === "离营" ? leaveSummaryEdited() : {};
    var rows = pack.rows.map(function (r) {
      var e = edits[r.id];
      if (!e) return r;
      return Object.assign({}, r, { way: e.way, place: e.place, flight: e.flight, time: e.arrive || r.time, updated: e.editedAt, updater: e.editedBy, beforeWay: e.beforeWay, isEdited: true });
    });
    var html = '<div class="tv-switch"><button type="button" class="' + (travelMode === "入营" ? "is-on" : "") + '" data-travel-mode="入营">入营</button><button type="button" class="' + (travelMode === "离营" ? "is-on" : "") + '" data-travel-mode="离营">离营</button></div>';
    html += '<div class="qd-query">';
    html += '<label class="qd-field"><span>学员编号</span><input class="lb-input" placeholder="请输入学员编号" /></label>';
    html += '<label class="qd-field"><span>学员姓名</span><input class="lb-input" placeholder="请输入学员姓名" /></label>';
    html += '<label class="qd-field"><span>联系方式</span><input class="lb-input" placeholder="请输入联系方式" /></label>';
    html += '<label class="qd-field"><span>无人陪伴</span><select class="lb-select"><option>请选择</option><option>是</option><option>否</option></select></label>';
    var wayLabels = travelMode === "离营" ? ["机场接离", "火车/高铁接离", "大巴接离", "营地自离", "连营"] : ["机场接送", "火车站接送", "大巴接送", "自行入营", "连营"];
    html += '<label class="qd-field"><span>' + travelMode + '方式</span><select class="lb-select"><option>请选择</option>' + wayLabels.map(function (name) { return "<option>" + name + "</option>"; }).join("") + "</select></label>";
    html += '<div class="qd-query__actions"><button type="button" class="lb-btn lb-btn--primary">查询</button><button type="button" class="lb-btn">重置</button></div>';
    html += "</div>";
    html += '<div class="tv-tools"><span class="lb-act"><button type="button" class="lb-btn lb-btn--primary" data-travel-open="1">' + travelMode + '设置</button><button type="button" class="lb-num-btn" data-note-key="leaveDeadline"></button></span><button type="button" class="lb-btn lb-btn--primary" data-travel-confirm="1">确认' + (travelMode === "入营" ? "到达" : "离开") + '</button><button type="button" class="lb-btn" data-travel-msg="1">消息提醒</button><span class="lb-act"><button type="button" class="lb-btn">导出</button><button type="button" class="lb-num-btn" data-note-key="travelList"></button></span><button type="button" class="lb-btn">导出（含证件号）</button></div>';
    html += '<p class="tv-alert">' + esc(tip) + "</p>";
    html += '<div class="lb-table-wrap"><table class="lb-table tv-table"><thead><tr><th>学员ID</th><th>学员姓名</th><th>状态</th><th>性别</th><th>联系电话</th><th>所在地区</th><th>班级</th><th>小组</th><th>' + travelMode + '方式</th><th>接待</th><th>更新时间</th><th>更新人</th><th>核销状态</th><th>操作</th></tr></thead><tbody>';
    if (!rows.length) html += '<tr><td colspan="14">暂无数据</td></tr>';
    rows.forEach(function (row) {
      var wayName = row.way ? wayLabels[row.way - 1] : "未填写";
      var loc = row.way === 1 ? "航班楼：" + row.place + "<br>航班号：" + row.flight
        : row.way === 2 ? "火车站：" + row.place + "<br>班次：" + row.flight
          : row.way === 3 ? (travelMode === "入营" ? "入营大巴起点：" : "结营大巴终点：") + row.place
            : "-";
      html += "<tr><td>" + esc(row.id) + "</td><td>" + esc(row.name) + (row.isEdited ? ' <span class="tv-edited">已修改</span>' : "") + "</td><td>" + esc(row.status) + "</td><td>" + esc(row.sex) + "</td><td>" + esc(row.phone) + "</td><td>" + esc(row.area) + "</td><td>" + esc(row.klass) + "</td><td>" + esc(row.team) + "</td>";
      html += "<td>" + esc(wayName) + (row.time ? "<br><span class=\"tv-time\">" + esc(row.time) + "</span>" : "") + "</td><td>" + loc + "</td><td>" + esc(row.updated || "-") + "</td><td>" + esc(row.updater || "-") + "</td><td>" + esc(row.verify) + "</td>";
      html += '<td class="cc-ops"><button type="button" data-travel-detail="' + row.id + '">查看证件号</button>';
      if (!item.closed) html += '<button type="button" data-travel-one="' + row.id + '">' + (travelMode === "入营" ? "确认到达" : "确认离开") + "</button>";
      html += "</td></tr>";
    });
    html += "</tbody></table></div>";
    if (travelOpen) html += travelDrawerHtml(item);
    if (travelCopy) html += travelCopyHtml(item);
    return html;
  }

  function teacherHtml(kind, index, teacher, teacherIndex, locked) {
    var dis = locked ? " disabled" : "";
    var flightLabel = kind === "air" ? "航班号" : "班次";
    var flightHolder = kind === "air" ? "请输入航班号" : "请输入班次";
    var id = kind + "-" + index + "-" + teacherIndex;
    return '<div class="tv-teacher"><div class="tv-teacher__bar"><b>带队老师' + (teacherIndex + 1) + "</b>" + (locked ? "" : '<button type="button" data-remove-teacher="' + kind + ":" + index + ":" + teacherIndex + '">移除</button>') + "</div>" +
      '<label class="tv-line"><span>老师</span><input class="lb-input" id="tv-name-' + id + '" placeholder="请选择带队老师" value="' + esc(teacher.name) + '"' + dis + " /></label>" +
      '<label class="tv-line"><span>' + flightLabel + '</span><input class="lb-input" id="tv-flight-' + id + '" placeholder="' + flightHolder + '" value="' + esc(teacher.flight) + '"' + dis + " /></label>" +
      '<label class="tv-line"><span>出发时间</span><input class="lb-input" id="tv-depart-' + id + '" placeholder="请输入出发时间" value="' + esc(teacher.depart) + '"' + dis + " /></label>" +
      '<label class="tv-line"><span>抵达时间</span><input class="lb-input" id="tv-arrive-' + id + '" placeholder="请输入抵达时间" value="' + esc(teacher.arrive) + '"' + dis + " /></label></div>";
  }

  function stopHtml(kind, index, item, locked, label) {
    var dis = locked ? " disabled" : "";
    var html = '<div class="tv-opt"><div class="tv-opt__top" data-stop-toggle="' + kind + ":" + index + '"><span>' + label + " " + (index + 1) + "</span><b>" + esc(item.name) + '</b><input type="checkbox" data-stop="' + kind + ":" + index + '"' + (item.on ? " checked" : "") + dis + " /></div>";
    if (item.on && kind !== "bus") {
      html += '<div class="tv-opt__body">';
      if (kind === "air") html += '<label class="tv-line"><span>陪伴老师</span><input class="lb-input" id="tv-co-' + kind + "-" + index + '" placeholder="请选择陪伴老师" value="' + esc(item.company) + '"' + dis + " /></label>";
      item.contacts.forEach(function (contact, ci) {
        html += '<div class="tv-contact"><label class="tv-line"><span>联系老师' + (ci + 1) + '</span><input class="lb-input" data-contact="' + kind + ":" + index + '" value="' + esc(contact) + '"' + dis + " /></label>";
        if (!locked) {
          if (ci === item.contacts.length - 1 && item.contacts.length < 3) html += '<button type="button" class="tv-plus" data-add-contact="' + kind + ":" + index + '">+</button>';
          if (item.contacts.length > 1) html += '<button type="button" class="tv-minus" data-remove-contact="' + kind + ":" + index + ":" + ci + '">-</button>';
        }
        html += "</div>";
      });
      item.teachers.forEach(function (teacher, ti) { html += teacherHtml(kind, index, teacher, ti, locked); });
      if (!locked) html += '<button type="button" class="lb-btn lb-btn--primary" data-add-teacher="' + kind + ":" + index + '">添加老师</button>';
      html += "</div>";
    }
    return html + "</div>";
  }

  function noteHtml(id, value, locked) {
    return '<div class="tv-ask">注意事项</div><textarea class="tv-area" id="' + id + '"' + (locked ? " disabled" : "") + ">" + esc(value || "") + "</textarea>";
  }

  function uploadHtml(key, files, locked) {
    var html = '<div class="tv-uploads">';
    files.forEach(function (src, i) {
      html += '<div class="tv-shot"><img src="' + src + '" alt="" />' + (locked ? "" : '<button type="button" data-img-del="' + key + ":" + i + '">×</button>') + "</div>";
    });
    if (!locked && files.length < 3) html += '<label class="tv-upload">+<i>上传图片</i><input type="file" accept="image/*" data-file="' + key + '" /></label>';
    return html + "</div>";
  }

  function radioPair(name, on, dis) {
    return '<div class="tv-radios"><label><input type="radio" name="' + name + '" value="1"' + (on ? " checked" : "") + dis + ' /> 支持</label><label><input type="radio" name="' + name + '" value="0"' + (on ? "" : " checked") + dis + ' /> 不支持</label></div>';
  }

  function travelDrawerHtml(item) {
    var locked = !!item.closed;
    var dis = locked ? " disabled" : "";
    var leave = travelMode === "离营";
    var form = travelForm || blankForm();
    var airTitle = leave ? "机场接离" : "机场接送";
    var airPick = leave ? "接离机场" : "接送机场";
    var trainTitle = leave ? "火车/高铁接离" : "火车/高铁接送";
    var trainPick = leave ? "接离车站" : "接送车站";
    var busTitle = leave ? "大巴接离" : "大巴接送";
    var busPick = leave ? "结营大巴终点" : "入营大巴起点";
    var html = '<div class="tv-mask" data-travel-close="1"></div><aside class="tv-drawer" id="tv-form"><div class="tv-drawer__head"><b>' + travelMode + '方式设置</b><button type="button" data-travel-close="1">×</button></div><div class="tv-drawer__body">';
    if (locked) html += '<p class="tv-alert">已结营，不能再添加或发送' + travelMode + "方式。</p>";
    html += '<div class="tv-divider"><span>' + airTitle + "</span></div>";
    html += '<div class="tv-ask"><i>*</i>' + airTitle + "</div>" + radioPair("tv-air", form.airOn, dis);
    if (form.airOn) {
      html += '<div class="tv-ask"><i>*</i>' + airPick + "</div>";
      form.airports.forEach(function (ap, i) { html += stopHtml("air", i, ap, locked, "机场"); });
      html += noteHtml("tv-air-note", form.airNote, locked);
    }
    html += '<div class="tv-divider"><span>' + trainTitle + "</span></div>";
    html += '<div class="tv-ask"><i>*</i>' + trainTitle + "</div>" + radioPair("tv-train", form.trainOn, dis);
    if (form.trainOn) {
      html += '<div class="tv-ask"><i>*</i>' + trainPick + "</div>";
      form.stations.forEach(function (st, i) { html += stopHtml("train", i, st, locked, "车站"); });
      html += noteHtml("tv-train-note", form.trainNote, locked);
    }
    html += '<div class="tv-divider"><span>' + busTitle + "</span></div>";
    html += '<div class="tv-ask"><i>*</i>' + busTitle + "</div>" + radioPair("tv-bus", form.busOn, dis);
    if (form.busOn) {
      html += '<div class="tv-ask"><i>*</i>' + busPick + "</div>";
      form.buses.forEach(function (bus, i) { html += stopHtml("bus", i, bus, locked, busPick); });
      html += noteHtml("tv-bus-note", form.busNote, locked);
    }
    if (leave) {
      html += '<div class="tv-divider"><span>营地自离</span></div>';
      html += '<div class="tv-ask"><i>*</i>自离抵达时间段</div><div class="tv-range"><input id="tv-leave-start" placeholder="开始日期" value="' + esc(form.leaveStart) + '"' + dis + " /><span>~</span><input id=\"tv-leave-end\" placeholder=\"结束日期\" value=\"" + esc(form.leaveEnd) + "\"" + dis + " /></div>";
      html += noteHtml("tv-leave-note", form.leaveNote, locked);
      html += '<div class="tv-divider"><span>其他设置</span></div>';
      html += '<div class="tv-ask"><i>*</i>代接委托书示例</div>' + uploadHtml("entrust", form.entrust, locked);
      html += '<div class="tv-ask"><i>*</i>安全责任书示例</div>' + uploadHtml("safety", form.safety, locked);
    }
    html += '</div><div class="tv-drawer__foot"><button type="button" class="lb-btn" data-travel-close="1">取消</button><span class="lb-act"><button type="button" class="lb-btn lb-btn--primary" data-travel-send="1"' + dis + '>确认并发送</button><button type="button" class="lb-num-btn" data-note-key="enterWay"></button></span></div></aside>';
    return html;
  }

  function travelCopyHtml(item) {
    var rows = sameBaseCamps();
    var html = '<div class="aw-dialog"><div class="aw-dialog__box tv-copy"><h3>是否复制并发送</h3><p>问卷题目不变。当前这份' + travelMode + "问卷会发给本 Q营。营地同为「" + esc(item.base) + "」的其他 Q营、周营可以一起复制。营地相同，整份问卷照发，不会串到别的营地。</p>";
    rows.forEach(function (row) {
      var locked = row.id === item.id;
      html += '<label class="tv-copy__row"><input type="checkbox" data-copy-id="' + row.id + '"' + ((locked || travelPick[row.id]) ? " checked" : "") + (locked ? " disabled" : "") + " /><span><b>" + esc(row.plan) + "</b><i>" + esc(row.name) + " " + esc(row.group) + " · " + esc(row.week) + "</i></span></label>";
    });
    html += '<div class="aw-actions"><button type="button" class="lb-btn" data-copy-cancel="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-copy-ok="1">确认并发送</button></div></div></div>';
    return html;
  }

  function detailHtml() {
    var tabs = ["基础信息", "报读记录", "学员信息", "迎接欢送", "调查问卷", "分班分组", "人岗管理", "学员胸牌", "学员证书"];
    var html = '<div class="qd-layout"><nav class="qd-side">';
    tabs.forEach(function (name) {
      html += '<button type="button" class="' + (detailTab === name ? "is-on" : "") + '" data-tab="' + name + '">' + name + "</button>";
    });
    html += '</nav><div class="qd-main">';
    html += detailTab === "报读记录" ? enrollHtml() : detailTab === "迎接欢送" ? travelListHtml() : detailTab === "学员信息" ? studentHtml() : detailTab === "基础信息" ? baseHtml() : '<p class="lb-hint">这一页按现网保留。本次改动在学员信息的离营核销、报读记录的取消报读和改期，以及迎接欢送的离营方式。</p>';
    html += "</div></div>";
    return html;
  }

  /* 学员信息：列按现网 studentInfo/index.vue 抽。操作是编辑、离营核销、核销。 */
  var LEAVE_REASONS = ["身体原因", "家庭原因", "行程冲突", "其他"];
  var leaveDialog = null;

  var studentCache = null;

  function studentRows() {
    if (studentCache) return studentCache;
    var key = "lb-student-rows-v1|" + campId;
    var saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(key) || "null"); } catch (e) { saved = null; }
    if (saved && saved.length) {
      studentCache = { key: key, rows: saved };
      return studentCache;
    }
    studentCache = {
      key: key,
      rows: [
        { id: "C61001", name: "胡铭睿", sid: "C61001", sex: "男", klass: "A1班", team: "1组", rank: "第六周", actual: "2", phone: "13800001101", area: "广东省广州市", birthday: "2014-03-12", age: "11", health: "良好", height: "142", weight: "36", dress: "140", city: "广州天河", mother: "何晓兰", motherPhone: "13824490911", father: "胡阳", fatherPhone: "13377203188", status: "参课中", studyDay: "3/7", verify: "未核销", orderNo: "LD20260706001", leaveRecords: [] },
        { id: "A10281", name: "王小满", sid: "A10281", sex: "女", klass: "A1班", team: "1组", rank: "第六周", actual: "1", phone: "13800001101", area: "广东省广州市", birthday: "2014-05-08", age: "11", health: "良好", height: "140", weight: "35", dress: "130", city: "广州天河", mother: "王敏", motherPhone: "13800001101", father: "王强", fatherPhone: "13800002202", status: "参课中", studyDay: "5/7", verify: "未核销", orderNo: "LD20260706002", leaveRecords: [] },
        { id: "A10282", name: "李可", sid: "A10282", sex: "男", klass: "A2班", team: "2组", rank: "第六周", actual: "1", phone: "13900003303", area: "广东省深圳市", birthday: "2015-01-20", age: "10", health: "花粉过敏", height: "138", weight: "33", dress: "140", city: "深圳南山", mother: "", motherPhone: "", father: "李海", fatherPhone: "13900003303", status: "未完课", studyDay: "2/7", verify: "未核销", orderNo: "LD20260706003", leaveRecords: [] },
        { id: "A10283", name: "孙悦", noOrder: true, sid: "A10283", sex: "女", klass: "A2班", team: "2组", rank: "第六周", actual: "1", phone: "13600005505", area: "广东省东莞市", birthday: "2015-09-02", age: "10", health: "良好", height: "130", weight: "28", dress: "120", city: "东莞南城", mother: "孙兰", motherPhone: "13600005505", father: "", fatherPhone: "", status: "待参课", studyDay: "0/7", verify: "未核销", orderNo: "LD20260706004", leaveRecords: [] },
        { id: "33CWCC", name: "张沐轩", sid: "33CWCC", sex: "男", klass: "A1班", team: "1组", rank: "第六周", actual: "1", phone: "13824490911", area: "广东省广州市", birthday: "2014-07-19", age: "11", health: "良好", height: "145", weight: "38", dress: "150", city: "广州天河", mother: "何晓兰", motherPhone: "13824490911", father: "", fatherPhone: "", status: "参课中", studyDay: "4/7", verify: "未核销", orderNo: "LD20260706005", leaveRecords: [] },
        { id: "F29KZA", name: "何晓波", sid: "F29KZA", sex: "男", klass: "A2班", team: "2组", rank: "第六周", actual: "1", phone: "13807722183", area: "广西南宁市", birthday: "2015-03-05", age: "10", health: "良好", height: "136", weight: "31", dress: "140", city: "南宁青秀", mother: "李陈", motherPhone: "13807722183", father: "何阳", fatherPhone: "13377203188", status: "参课中", studyDay: "4/7", verify: "未核销", orderNo: "LD20260706006", leaveRecords: [] },
        { id: "RLDUY9", name: "安宇静卢", noOrder: true, sid: "RLDUY9", sex: "女", klass: "A1班", team: "1组", rank: "第六周", actual: "1", phone: "13377225331", area: "广西南宁市", birthday: "2015-11-23", age: "10", health: "良好", height: "132", weight: "29", dress: "130", city: "南宁兴宁", mother: "詹霞", motherPhone: "13377225331", father: "农晨", fatherPhone: "13377228206", status: "参课中", studyDay: "3/7", verify: "未核销", orderNo: "LD20260706007", leaveRecords: [] }
      ]
    };
    return studentCache;
  }

  function saveStudentRows(key, rows) {
    if (!studentCache) studentCache = { key: key, rows: rows };
    try { sessionStorage.setItem(key, JSON.stringify(rows)); } catch (e) {}
  }

  function studentHtml() {
    var pack = studentRows();
    var html = '<div class="cc-query">';
    html += field("学员ID", '<input class="lb-input" placeholder="请输入学员ID" />');
    html += field("学员姓名", '<input class="lb-input" placeholder="请输入学员姓名" />');
    html += field("学校", '<input class="lb-input" placeholder="请输入学校" />');
    html += field("学员联系电话", '<input class="lb-input" placeholder="请输入学员联系电话" />');
    html += '<div class="cc-actions"><button type="button" class="lb-btn lb-btn--primary">查询</button><button type="button" class="lb-btn">重置</button></div></div>';
    html += '<div class="cc-tools"><span class="lb-act"><button type="button" class="lb-btn lb-btn--primary" data-stu-batch="1">批量核销</button><button type="button" class="lb-num-btn" data-note-key="leavePlan"></button><button type="button" class="lb-num-btn" data-note-key="leavePartial"></button></span><button type="button" class="lb-btn">生日名单</button><button type="button" class="lb-btn">更新信息</button><button type="button" class="lb-btn">导出结果</button><button type="button" class="lb-btn">下载</button></div>';
    html += '<p class="lb-hint">学员中途离营或完课时请点击核销。批量核销只处理已勾选的学员，取消勾选的学员本次不核销，可稍后再处理。单条离营核销的处理方案见操作列。</p>';
    html += '<div class="lb-table-wrap"><table class="lb-table"><thead><tr><th class="cc-check"><input type="checkbox" data-stu-all="1" title="全选 / 取消全选" /></th><th>学员ID</th><th>学员姓名</th><th>资格</th><th>班级</th><th>小组</th><th>性别</th><th>学员联系电话</th><th>所在地区</th><th>年龄</th><th>健康状况</th><th>学习状态</th><th>学习天数</th><th>核销状态</th><th>操作</th></tr></thead><tbody>';
    pack.rows.forEach(function (row) {
      var state = row.lastPlan ? ' <span class="lb-tag lb-tag--ok">' + esc(row.lastPlan) + "</span>" : "";
      var done = row.verify === "已核销";
      html += '<tr><td class="cc-check"><input type="checkbox" data-stu-pick="' + row.id + '"' + (done ? " disabled" : "") + " /></td>";
      html += "<td>" + esc(row.sid) + "</td><td>" + esc(row.name) + state + "</td><td>" + esc(row.rank === "第六周" ? "新训" : "复训") + (row.noOrder ? '<em class="lb-hint"> · 无订单</em>' : "") + (row.qualifyStatus ? ' <span class="lb-tag lb-tag--wait">' + esc(row.qualifyStatus) + "</span>" : "") + "</td><td>" + esc(row.klass) + "</td><td>" + esc(row.team) + "</td><td>" + esc(row.sex) + "</td><td>" + esc(row.phone) + "</td><td>" + esc(row.area) + "</td><td>" + esc(row.age) + "</td><td>" + esc(row.health) + "</td><td>" + esc(row.status) + "</td><td>" + esc(row.studyDay) + "</td><td>" + esc(row.verify) + "</td>";
      html += '<td class="cc-ops"><button type="button" data-stu-edit="' + row.id + '">编辑</button>';
      if (row.verify !== "已核销") html += '<button type="button" data-leave-open="' + row.id + '">离营核销</button><button type="button" data-stu-check="' + row.id + '">核销</button>';
      html += "</td></tr>";
    });
    html += '</tbody></table></div><div class="cc-pager"><span>共 ' + pack.rows.length + ' 条记录</span><button type="button" class="is-on">1</button><span>10 条/页</span></div>';
    return html;
  }

  function leaveDrawerHtml(row) {
    /* 原型评审第二轮第10条：去掉「取消报读」。中途离营只保留离营核销与离营退费。
     过往未产生订单的资格数据，发生中途离营时资格状态直接变为「已退费」。 */
    var plans = ["离营核销", "离营退费"];
    var plan = leaveDialog && leaveDialog.plan ? leaveDialog.plan : "";
    var html = '<div class="lv-drawer">';
    html += '<section class="lv-sec"><h4>学员信息</h4><div class="qd-desc"><div><b>' + esc(row.name) + '</b>（' + esc(row.sid) + "）</div><div>" + esc(camp().plan) + " · " + esc(camp().week) + " · " + esc(row.klass) + " / " + esc(row.team) + "</div></div></section>";
    html += '<section class="lv-sec"><h4>离营详情</h4>';
    html += '<label class="lv-field"><span><i>*</i>离营原因</span><select class="lb-select" id="lv-reason"><option value="">请选择</option>' + LEAVE_REASONS.map(function (name) { return "<option" + (leaveDialog && leaveDialog.reason === name ? " selected" : "") + ">" + name + "</option>"; }).join("") + "</select></label>";
    html += '<label class="lv-field"><span>参训天数</span><input class="lb-input" id="lv-days" type="number" step="0.5" min="0" value="' + esc(leaveDialog && leaveDialog.days != null ? leaveDialog.days : row.studyDay.split("/")[0]) + '" /></label>';
    html += '<label class="lv-field"><span><i>*</i>下次参与意愿</span><select class="lb-select" id="lv-willing"><option>愿意</option><option>不愿意</option></select></label>';
    html += '<label class="lv-field lv-field--block"><span>备注</span><textarea class="lb-input" id="lv-note" rows="3" placeholder="请输入备注信息">' + esc(leaveDialog && leaveDialog.note ? leaveDialog.note : "") + "</textarea></label>";
    html += '<label class="lv-field"><span>凭证</span><button type="button" class="lb-btn">上传</button></label>';
    html += "</section>";
    html += '<section class="lv-sec"><h4>处理信息</h4>';
    html += '<label class="lv-field"><span><i>*</i>处理方案</span><select class="lb-select" id="lv-plan"><option value="">请选择</option>' + plans.map(function (name) { return "<option" + (plan === name ? " selected" : "") + ">" + name + "</option>"; }).join("") + "</select></label>";
    if (plan === "离营退费" && row.noOrder) {
      html += '<p class="lv-tip">该学员的资格没有产生订单。发生中途离营后，资格状态直接变为「已退费」，不发起退款流程。</p>';
    } else if (plan === "离营退费") {
      html += '<p class="lv-tip">离营退费按扣费明细和优惠券计算应退金额。没有课程订单的课程资格，退费后一并失效。</p>';
    } else if (plan === "离营核销") {
      html += '<p class="lv-tip">离营核销只核销离营，不改报读学习状态。</p>';
    }
    html += '<h5>退款方案</h5><div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>订单</th><th>交易类型</th><th>退款商品</th><th>订单金额</th><th>应退金额</th><th>预计扣除金额</th><th>预计实退金额</th></tr></thead><tbody><tr><td>' + esc(row.orderNo) + "</td><td>领袖营报读</td><td>2026暑假领袖营</td><td>￥6800</td><td>￥" + (plan === "离营退费" ? "4200" : "0") + "</td><td>￥" + (plan === "离营退费" ? "600" : "0") + "</td><td>￥" + (plan === "离营退费" ? "3600" : "0") + "</td></tr></tbody></table></div>";
    html += '<div class="lv-money"><span>应退金额 <b>￥' + (plan === "离营退费" ? "4200" : "0") + '</b></span><span>加除金额 <b>￥' + (plan === "离营退费" ? "600" : "0") + '</b></span><span>实退金额 <b>￥' + (plan === "离营退费" ? "3600" : "0") + "</b></span></div>";
    html += '<label class="lv-field lv-field--block"><span>提前离营备选方案</span><textarea class="lb-input" rows="2" placeholder="请输入提前离营备选方案"></textarea></label>';
    html += '<div class="lv-field"><span><i>*</i>退款方式</span><span class="lv-radios"><label><input type="radio" name="lv-way" checked />原路退还</label><label><input type="radio" name="lv-way" />银行卡退款</label></span></div>';
    html += "</section>";
    html += '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn" data-leave-run="' + row.id + '">立即执行</button><button type="button" class="lb-btn lb-btn--primary" data-leave-apply="' + row.id + '">发起申请</button></div>';
    return html + "</div>";
  }

  function field(label, inner) {
    return '<label class="cc-field"><span>' + label + "</span>" + inner + "</label>";
  }

  function input(id, placeholder, value) {
    return '<input class="lb-input" id="' + id + '" placeholder="' + placeholder + '" value="' + esc(value) + '" />';
  }

  function personCell(name, phone) {
    if (!name && !phone) return "-";
    return '<div class="cc-person"><b>' + esc(name || "-") + "</b><span>" + esc(phone || "-") + "</span></div>";
  }

  function matchConnect(row) {
    if (q.name && row.name.indexOf(q.name) < 0) return false;
    if (q.sid && row.sid.indexOf(q.sid) < 0) return false;
    if (q.oldWeek && row.startWeek.indexOf(q.oldWeek) < 0) return false;
    if (q.newWeek && row.endWeek.indexOf(q.newWeek) < 0) return false;
    if (q.order && row.orderStatus !== q.order) return false;
    if (q.status && row.status !== q.status) return false;
    if (q.from && row.joinTime.slice(0, 10) < q.from) return false;
    if (q.to && row.joinTime.slice(0, 10) > q.to) return false;
    return true;
  }

  function connectHtml() {
    var rows = window.LB_JOIN.load().filter(matchConnect);
    var orders = ["", "待支付", "已支付", "已取消", "待确认转账", "已退费", "退费失败", "退费中"];
    var states = ["", "未开通", "待确认", "已确认", "异常", "已取消", "已关闭"];
    var html = '<div class="cc-query">';
    html += field("学员姓名", input("q-name", "请输入学员姓名", q.name));
    html += field("学员ID", input("q-sid", "请输入学员ID", q.sid));
    html += field("原周营", input("q-old", "请输入原周营", q.oldWeek));
    html += field("新周营", input("q-new", "请输入新周营", q.newWeek));
    html += '<div class="cc-actions"><button type="button" class="lb-btn lb-btn--primary" data-query="1">查询</button><button type="button" class="lb-btn" data-reset="1">重置</button></div>';
    html += field("订单状态", '<select class="lb-select" id="q-order">' + orders.map(function (name) { return '<option value="' + esc(name) + '"' + (q.order === name ? " selected" : "") + ">" + esc(name || "请选择处理订单状态") + "</option>"; }).join("") + "</select>");
    html += field("状态", '<select class="lb-select" id="q-status">' + states.map(function (name) { return '<option value="' + esc(name) + '"' + (q.status === name ? " selected" : "") + ">" + esc(name || "请选择状态") + "</option>"; }).join("") + "</select>");
    html += field("连营时间", '<span class="cc-range"><input class="lb-input" id="q-from" type="date" value="' + esc(q.from) + '" /><i>至</i><input class="lb-input" id="q-to" type="date" value="' + esc(q.to) + '" /></span>');
    html += "</div>";
    html += '<div class="cc-tools"><button type="button" class="lb-btn lb-btn--primary" data-batch="1">批量处理</button><button type="button" class="lb-btn" id="biz-export">导出</button></div>';
    html += '<div class="lb-table-wrap cc-table"><table class="lb-table"><thead><tr><th class="cc-check"></th><th>学员姓名</th><th>学员ID</th><th>连营时间</th><th>连营开始周营</th><th>连营结束周营</th><th>订单状态</th><th>状态</th><th>连营情况备注</th><th>家庭ID</th><th>母亲姓名/电话</th><th>父亲姓名/电话</th><th>更新时间</th><th>操作</th></tr></thead><tbody>';
    if (!rows.length) html += '<tr><td colspan="14">暂无数据</td></tr>';
    rows.forEach(function (row) {
      html += '<tr><td><input type="checkbox" data-pick="' + row.id + '"' + (picked[row.id] ? " checked" : "") + " /></td>";
      html += "<td>" + esc(row.name) + "</td><td>" + esc(row.sid) + "</td><td>" + esc(row.joinTime) + "</td><td>" + esc(row.startWeek) + "</td><td>" + esc(row.endWeek) + "</td><td>" + esc(row.orderStatus) + "</td><td>" + esc(row.status) + "</td><td>" + esc(row.remark || "-") + "</td><td>" + esc(row.family) + "</td><td>" + personCell(row.mother, row.motherPhone) + "</td><td>" + personCell(row.father, row.fatherPhone) + "</td><td>" + esc(row.updated) + "</td><td class=\"cc-ops\">";
      if (row.orderStatus !== "已退费" && row.status === "待确认") html += '<button type="button" data-confirm="' + row.id + '">确认连营</button><button type="button" data-cancel-join="' + row.id + '">取消连营</button>';
      html += "</td></tr>";
    });
    html += '</tbody></table></div><div class="cc-pager"><span>共 ' + rows.length + ' 条记录</span><button type="button" class="is-on">1</button><span>10 条/页</span></div>';
    return html;
  }

  function dialogHtml() {
    if (!dialog) return "";
    return '<div class="aw-dialog"><div class="aw-dialog__box"><h3>' + esc(dialog.title) + "</h3><p>" + esc(dialog.text) + '</p><div class="aw-actions"><button type="button" class="lb-btn" data-no="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-yes="1">确定</button></div></div></div>';
  }

  function render() {
    var root = document.getElementById("biz-app");
    if (!root) return;
    var html = view === "detail" ? detailHtml() : view === "connect" ? connectHtml() : listHtml();
    root.innerHTML = html + extraSheetHtml() + dialogHtml();
  }

  /* 第1条：额外住宿费用收款码
     流程：选本 Q营已报读学员 → 填金额 → 生成二维码 → 家长扫码支付。
     支付成功后写入 6Q业务 → 订单中心 → 销售订单，渠道固定「领袖营-额外住宿费用」。
     本页不做订单列表，也不跳订单页；核对订单请到订单中心 → 销售订单按渠道筛选。
     不改报读、连营、考勤、薪资状态。 */
  var extraStay = { open: false, step: 1, kid: "", amount: "", note: "", code: "", history: false, viewId: "" };

  /* 学员取当前 Q营的已报读名单，与「报读记录 → 已报读」同一份数据。 */
  function extraStudents() {
    var item = camp();
    var pack = studentRows();
    return window.LB_JOIN.load()
      .filter(function (row) { return row.camp === campId && row.enroll === "已报读"; })
      .map(function (row) {
        var stu = pack.rows.filter(function (s) { return s.id === row.id || s.sid === row.sid; })[0] || null;
        return {
          id: row.id,
          name: row.name,
          sid: row.sid,
          klass: stu ? stu.klass : "-",
          week: item.week || "",
          plan: item.plan
        };
      });
  }

  function extraKid() {
    return extraStudents().filter(function (s) { return s.id === extraStay.kid; })[0] || null;
  }

  function qrSvg(seed) {
    var text = String(seed || "extra-stay");
    var hash = 7;
    for (var i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) % 2147483647;
    var cells = 21, unit = 8;
    var out = '<svg viewBox="0 0 ' + cells * unit + " " + cells * unit + '" xmlns="http://www.w3.org/2000/svg" role="img">';
    out += '<rect width="100%" height="100%" fill="#fff"/>';
    var inFinder = function (x, y) {
      return (x < 8 && y < 8) || (x > cells - 9 && y < 8) || (x < 8 && y > cells - 9);
    };
    for (var y = 0; y < cells; y++) {
      for (var x = 0; x < cells; x++) {
        if (inFinder(x, y)) continue;
        var v = (hash + x * 7919 + y * 104729 + x * y * 31) % 97;
        if (v % 3 !== 0) out += '<rect x="' + x * unit + '" y="' + y * unit + '" width="' + unit + '" height="' + unit + '" fill="#1f2430"/>';
      }
    }
    var finder = function (fx, fy) {
      out += '<rect x="' + fx * unit + '" y="' + fy * unit + '" width="' + 7 * unit + '" height="' + 7 * unit + '" fill="#1f2430"/>';
      out += '<rect x="' + (fx + 1) * unit + '" y="' + (fy + 1) * unit + '" width="' + 5 * unit + '" height="' + 5 * unit + '" fill="#fff"/>';
      out += '<rect x="' + (fx + 2) * unit + '" y="' + (fy + 2) * unit + '" width="' + 3 * unit + '" height="' + 3 * unit + '" fill="#1f2430"/>';
    };
    finder(0, 0);
    finder(cells - 7, 0);
    finder(0, cells - 7);
    return out + "</svg>";
  }

  /* 原型评审第二轮第5条：收款码要能追溯历史，并且仍处于待支付有效期内的二维码可以点开查看。
     二维码和订单是一对一关联：订单超时取消后，二维码不能再点开；订单还在待支付有效期内的，可以点开重看。
     真实环境从订单中心按渠道查；演示用 sessionStorage。 */
  var extraHistory = null;

  function extraHistoryRows() {
    if (extraHistory) return extraHistory;
    var saved = null;
    try { saved = JSON.parse(sessionStorage.getItem("lb-extra-qr") || "null"); } catch (e) { saved = null; }
    if (saved && saved.length) { extraHistory = saved; return extraHistory; }
    extraHistory = [
      { id: "QR1", kid: "A10281", name: "王小满", klass: "A1班", amount: "200.00", note: "提前 1 天入营", by: "余炜烽", at: "2026-10-28 11:40", order: "SO20261028114001", pay: "已支付" },
      { id: "QR2", kid: "A10282", name: "李可", klass: "A1班", amount: "300.00", note: "", by: "余炜烽", at: "2026-10-28 15:02", order: "SO20261028150201", pay: "待支付" },
      { id: "QR3", kid: "A10283", name: "孙悦", klass: "A2班", amount: "200.00", note: "提前 1 天入营", by: "林晓雯", at: "2026-10-27 09:15", order: "SO20261027091501", pay: "已超时取消" }
    ];
    return extraHistory;
  }

  function extraHistorySave(rows) {
    extraHistory = rows;
    try { sessionStorage.setItem("lb-extra-qr", JSON.stringify(rows)); } catch (e) {}
  }

  /* 只有待支付的二维码还能点开；已支付与超时取消都不能再打开。 */
  function extraQrViewable(row) {
    return row.pay === "待支付";
  }

  function extraHistoryHtml() {
    var rows = extraHistoryRows();
    var html = '<div class="aw-dialog ex-stay"><div class="aw-dialog__box ex-stay__box"><h3>收款码历史</h3>';
    html += '<p class="ex-stay__tip">二维码与订单一一关联。只有仍在待支付有效期内的二维码可以点开重看；订单已支付或超时取消后，二维码不能再打开。</p>';
    html += '<div class="ex-stay__hist"><table class="lb-table"><thead><tr><th>生成时间</th><th>学员</th><th>金额</th><th>备注</th><th>操作人</th><th>订单状态</th><th>操作</th></tr></thead><tbody>';
    if (!rows.length) html += '<tr><td colspan="7">还没有生成过收款码</td></tr>';
    rows.forEach(function (r) {
      var st = r.pay === "已支付" ? '<span class="lb-tag lb-tag--ok">已支付</span>' : r.pay === "待支付" ? '<span class="lb-tag lb-tag--wait">待支付</span>' : '<span class="lb-tag">已超时取消</span>';
      html += "<tr><td>" + esc(r.at) + "</td><td>" + esc(r.name) + "<br><em class=\"lb-hint\">" + esc(r.kid) + " · " + esc(r.klass) + "</em></td><td>￥" + esc(r.amount) + "</td><td>" + esc(r.note || "-") + "</td><td>" + esc(r.by) + "</td><td>" + st + "</td>";
      html += "<td>" + (extraQrViewable(r) ? '<button type="button" class="lb-link-btn" data-extra-view="' + esc(r.id) + '">查看二维码</button>' : '<span class="lb-hint">不可查看</span>') + "</td></tr>";
    });
    html += "</tbody></table></div>";
    html += '<div class="aw-actions"><button type="button" class="lb-btn" data-extra-hist-close="1">关闭</button></div></div></div>';
    return html;
  }

  function extraHistoryQrHtml(row) {
    var html = '<div class="aw-dialog ex-stay"><div class="aw-dialog__box ex-stay__box"><h3>收款码 · ' + esc(row.name) + "</h3>";
    html += '<div class="ex-stay__qr"><div class="ex-stay__code">' + qrSvg("LSCX-" + row.kid + "-" + Math.round(Number(row.amount) * 100)) + "</div>";
    html += '<p class="ex-stay__amt">￥' + esc(row.amount) + "</p>";
    html += '<p class="ex-stay__sub">' + esc(row.name) + " · 额外住宿费用</p>";
    html += '<p class="ex-stay__hint">这张码对应订单 ' + esc(row.order) + "，当前待支付。订单超时取消后就不能再打开。请家长扫码支付，或截图发给家长。</p></div>";
    html += '<div class="aw-actions"><button type="button" class="lb-btn" data-extra-hist-close="1">关闭</button></div></div></div>';
    return html;
  }

  function extraSheetHtml() {
    if (extraStay.history) return extraStay.viewId ? extraHistoryQrHtml(extraHistoryRows().filter(function (r) { return r.id === extraStay.viewId; })[0] || {}) : extraHistoryHtml();
    if (!extraStay.open) return "";
    var html = '<div class="aw-dialog ex-stay"><div class="aw-dialog__box ex-stay__box"><h3>额外住宿费用收款码</h3>';
    html += '<div class="ex-stay__steps"><span class="' + (extraStay.step === 1 ? "is-on" : "is-done") + '">1 选学员</span><span class="' + (extraStay.step === 2 ? "is-on" : extraStay.step > 2 ? "is-done" : "") + '">2 填费用</span><span class="' + (extraStay.step === 3 ? "is-on" : "") + '">3 出二维码</span></div>';
    if (extraStay.step === 1) {
      html += '<p class="ex-stay__tip">只列当前 Q营内已报读的学员。学员实际只来一周但提前入营进入连营的，在这里单独收额外住宿费。</p><div class="ex-stay__list">';
      extraStudents().forEach(function (s) {
        html += '<button type="button" class="ex-stay__kid' + (extraStay.kid === s.id ? " is-on" : "") + '" data-extra-pick="' + s.id + '"><span class="ex-stay__radio' + (extraStay.kid === s.id ? " is-on" : "") + '"></span><b>' + esc(s.name) + "</b><em>" + esc(s.sid) + " · " + esc(s.klass) + " · " + esc(s.week) + '</em><i class="ex-stay__st">已报读</i></button>';
      });
      html += "</div>";
    }
    if (extraStay.step === 2) {
      var k = extraKid();
      html += '<div class="ex-stay__who">学员：<b>' + esc(k ? k.name : "-") + "</b>　" + esc(k ? k.sid : "") + "　" + esc(k ? k.klass : "") + "</div>";
      html += '<label class="ex-stay__field"><span>费用名称</span><input class="lb-input" value="额外住宿费用" disabled /></label>';
      html += '<label class="ex-stay__field"><span><i>*</i>收款金额</span><input class="lb-input" id="ex-amount" type="number" min="0" step="0.01" placeholder="请输入金额，如 200" value="' + esc(extraStay.amount) + '" /></label>';
      html += '<label class="ex-stay__field"><span>备注</span><input class="lb-input" id="ex-note" placeholder="选填，如：提前 1 天入营" value="' + esc(extraStay.note) + '" /></label>';
      html += '<p class="ex-stay__tip">付款成功后自动写入 6Q业务 → 订单中心 → 销售订单，渠道为「领袖营-额外住宿费用」。</p>';
    }
    if (extraStay.step === 3) {
      var kid = extraKid();
      html += '<div class="ex-stay__qr"><div class="ex-stay__code">' + qrSvg(extraStay.code) + "</div>";
      html += '<p class="ex-stay__amt">￥' + esc(extraStay.amount) + "</p>";
      html += '<p class="ex-stay__sub">' + esc(kid ? kid.name : "") + " · 额外住宿费用</p>";
      html += '<p class="ex-stay__hint">请家长扫码支付，或截图发给家长。支付完成后在 6Q业务 → 订单中心 → 销售订单按渠道「领袖营-额外住宿费用」查看。</p></div>';
    }
    html += '<div class="aw-actions">';
    if (extraStay.step === 1) html += '<button type="button" class="lb-btn" data-extra-hist="1">历史</button><button type="button" class="lb-btn" data-extra-close="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-extra-next="1">下一步</button>';
    else if (extraStay.step === 2) html += '<button type="button" class="lb-btn" data-extra-hist="1">历史</button><button type="button" class="lb-btn" data-extra-back="1">上一步</button><button type="button" class="lb-btn lb-btn--primary" data-extra-make="1">生成收款码</button>';
    else html += '<button type="button" class="lb-btn" data-extra-hist="1">历史</button><button type="button" class="lb-btn" data-extra-done="1">完成</button>';
    html += "</div></div></div>";
    return html;
  }

  function ask(id, kind) {
    var rows = window.LB_JOIN.load();
    var row = rows.filter(function (item) { return item.id === id; })[0];
    if (!row) return;
    var action = kind === "drop" ? "取消报读" : "改期";
    if (row.status === "已确认") {
      dialog = { title: action, text: "【" + row.name + "】在连营管理中已确认连营。本次" + action + "不退连营费，订单保持已支付。", yes: function () { row.enroll = kind === "drop" ? "已取消" : "已改期"; window.LB_JOIN.save(rows); } };
    } else {
      dialog = { title: action, text: "【" + row.name + "】尚未确认连营。本次" + action + "将原路退回连营费 ￥" + row.fee + "。", yes: function () { row.enroll = kind === "drop" ? "已取消" : "已改期"; row.orderStatus = "已退费"; if (row.status === "待确认") row.status = "已取消"; window.LB_JOIN.save(rows); } };
    }
    render();
  }

  function readQuery() {
    function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
    q.name = val("q-name");
    q.sid = val("q-sid");
    q.oldWeek = val("q-old");
    q.newWeek = val("q-new");
    q.order = val("q-order");
    q.status = val("q-status");
    q.from = val("q-from");
    q.to = val("q-to");
  }

  function batchConfirm() {
    var rows = window.LB_JOIN.load();
    var hit = 0;
    rows.forEach(function (item) {
      if (picked[item.id] && item.status === "待确认" && item.orderStatus !== "已退费") {
        item.status = "已确认";
        hit += 1;
      }
    });
    window.LB_JOIN.save(rows);
    window.LB.toast(hit ? "已确认 " + hit + " 条连营" : "请勾选待确认的记录");
    render();
  }

  function findStudent(id) {
    return studentRows().rows.filter(function (row) { return row.id === id; })[0] || null;
  }

  function openLeave(id) {
    var row = findStudent(id);
    if (!row) return;
    leaveDialog = { id: id, plan: "", reason: "", days: Number(row.studyDay.split("/")[0]) || 0, note: "" };
    window.LB.openDrawer("离营核销 · " + row.name, leaveDrawerHtml(row), { wide: true });
  }

  function refreshLeave() {
    if (!leaveDialog) return;
    var row = findStudent(leaveDialog.id);
    if (!row) return;
    document.getElementById("lb-drawer-body").innerHTML = leaveDrawerHtml(row);
  }

  function runLeave(id) {
    var row = findStudent(id);
    if (!row || !leaveDialog) return;
    var planSel = document.getElementById("lv-plan");
    var reasonSel = document.getElementById("lv-reason");
    var plan = planSel ? planSel.value : "";
    var reason = reasonSel ? reasonSel.value : "";
    if (!reason) { window.LB.toast("请选择离营原因"); return; }
    if (!plan) { window.LB.toast("请选择处理方案"); return; }
    var daysInput = document.getElementById("lv-days");
    var noteInput = document.getElementById("lv-note");
    var days = daysInput ? Number(daysInput.value) || 0 : 0;
    var note = noteInput ? noteInput.value.trim() : "";
    leaveDialog.plan = plan;
    leaveDialog.reason = reason;
    leaveDialog.days = days;
    leaveDialog.note = note;
    if (plan === "离营退费") {
      window.LB.confirm(
        row.noOrder
          ? "【" + row.name + "】的资格没有产生订单。确认中途离营后，资格状态直接变为「已退费」。"
          : "确认对【" + row.name + "】发起中途离营退费？没有课程订单的课程资格会一并失效。",
        function () {
        row.status = "提前离营";
        row.verify = "已核销";
        /* 原型评审第二轮第10条：过往未产生订单的资格，中途离营时资格状态变为「已退费」。 */
        if (row.noOrder) row.qualifyStatus = "已退费";
        row.leaveRecords.push({ plan: plan, reason: reason, days: days, at: "2026-10-27 20:10", note: note, by: "余炜烽" });
        row.lastPlan = plan;
        saveStudentRows(studentRows().key, studentRows().rows);
        leaveDialog = null;
        window.LB.closeDrawer();
        window.LB.toast("已发起离营退费");
        render();
      });
      return;
    }
    window.LB.confirm("确认对【" + row.name + "】执行离营核销？", function () {
      row.status = "提前离营";
      row.verify = "已核销";
      row.leaveRecords.push({ plan: plan, reason: reason, days: days, at: "2026-10-27 20:10", note: note, by: "余炜烽" });
      row.lastPlan = plan;
      saveStudentRows(studentRows().key, studentRows().rows);
      leaveDialog = null;
      window.LB.closeDrawer();
      window.LB.toast("离营核销成功");
      render();
    });
  }

  function travelFind(id) {
    var pack = travelPack(camp());
    return pack.rows.filter(function (r) { return r.id === id; })[0] || null;
  }

  function travelSave() {
    var pack = travelPack(camp());
    try { sessionStorage.setItem(pack.key, JSON.stringify(pack.rows)); } catch (e) {}
  }

  /* 确认到达/离开
     现网走 mixin 的 disabledAndEnabled(1|2, ids, ['确认到达','确认离开'])，
     最终 PUT conference/camps/member/travel/arrived（到达）或 .../travel/leave（离开），
     入参 { ids }；成功后刷新列表。 */
  function travelConfirm(ids) {
    if (camp().closed) { window.LB.toast("本Q营已结营，不能再操作"); return; }
    if (!ids.length) { window.LB.toast("请选择操作项"); return; }
    var done = travelMode === "入营" ? "确认到达" : "确认离开";
    window.LB.confirm("您确定要" + done + "吗？", function () {
      var pack = travelPack(camp());
      pack.rows.forEach(function (row) {
        if (ids.indexOf(row.id) >= 0) {
          row.status = travelMode === "入营" ? "已到达" : "已离开";
          row.updater = "余炜烽";
          row.updated = "2026-10-27 21:40";
        }
      });
      travelSave();
      window.LB.toast(done + "成功");
      render();
    });
  }

  /* 消息提醒
     现网 PUT conference/camps/member/travel/message，入参 { ids, campsPeriodsProceedId, type }，
     确认文案「您确定要执行消息提醒操作吗？」，成功后清空勾选。 */
  function travelMessage() {
    window.LB.confirm("您确定要执行消息提醒操作吗？", function () {
      window.LB.toast("消息提醒成功");
    });
  }

  /* 查看证件号
     现网 GET conference/camps/member/travel/certificateDetail?id=，
     抽屉展示身份证信息：会员ID、会员姓名、电话号码、证件类型、证件号码、性别、出生日期。 */
  function travelCert(row) {
    if (!row) return;
    var body = '<div class="cc-desc">' +
      '<div><b>会员ID</b><span>' + esc(row.id) + "</span></div>" +
      '<div><b>会员姓名</b><span>' + esc(row.name) + "</span></div>" +
      '<div><b>电话号码</b><span>' + esc(row.phone) + "</span></div>" +
      '<div><b>证件类型</b><span>大陆居民身份证</span></div>' +
      '<div><b>证件号码</b><span>440106' + esc(row.birth.replace(/-/g, "").slice(2)) + "1234</span></div>" +
      '<div><b>性别</b><span>' + esc(row.sex) + "</span></div>" +
      '<div><b>出生日期</b><span>' + esc(row.birth) + "</span></div></div>";
    window.LB.openDrawer("查看证件号 · " + row.name, body, { wide: false });
  }

  function stopOf(kind, index) {    if (kind === "air") return travelForm.airports[index];
    if (kind === "train") return travelForm.stations[index];
    return travelForm.buses[index];
  }

  function formReady() {
    var leave = travelMode === "离营";
    if (travelForm.airOn && !travelForm.airports.some(function (item) { return item.on; })) return "请至少勾选一个接送机场";
    if (travelForm.trainOn && !travelForm.stations.some(function (item) { return item.on; })) return "请至少勾选一个接送火车站";
    if (travelForm.busOn && !travelForm.buses.some(function (item) { return item.on; })) return "请至少勾选一个" + (travelMode === "离营" ? "结营大巴终点" : "入营大巴起点");
    if (leave && (!travelForm.leaveStart || !travelForm.leaveEnd)) return "请选择自离抵达时间段";
    if (leave && !travelForm.entrust.length) return "请上传代接委托书示例";
    if (leave && !travelForm.safety.length) return "请上传安全责任书示例";
    return "";
  }

  document.addEventListener("change", function (e) {
    if (e.target.id === "lv-plan" && leaveDialog) {
      leaveDialog.plan = e.target.value;
      refreshLeave();
      return;
    }
    if (e.target.id === "lv-reason" && leaveDialog) { leaveDialog.reason = e.target.value; return; }
    if (e.target.id === "lv-days" && leaveDialog) { leaveDialog.days = Number(e.target.value) || 0; return; }
    if (e.target.id === "lv-note" && leaveDialog) { leaveDialog.note = e.target.value; return; }
    var file = e.target.closest("[data-file]");
    if (file && file.files && file.files[0]) {
      var key = file.getAttribute("data-file");
      var reader = new FileReader();
      reader.onload = function () {
        syncForm();
        if (travelForm[key].length >= 3) { window.LB.toast("最多上传 3 张"); return; }
        travelForm[key].push(reader.result);
        render();
      };
      reader.readAsDataURL(file.files[0]);
      return;
    }
    var stop = e.target.closest("[data-stop]");
    if (stop && travelForm) {
      var parts = stop.getAttribute("data-stop").split(":");
      var current = stopOf(parts[0], Number(parts[1]));
      var wasOn = current.on;
      if (!stop.checked && wasOn && !window.confirm("取消选中状态后内容将被清空,您确定继续?")) {
        stop.checked = true;
        return;
      }
      syncForm();
      if (!stop.checked) clearStop(current);
      render();
      return;
    }
    if (e.target.name === "tv-air" || e.target.name === "tv-train" || e.target.name === "tv-bus") {
      syncForm();
      render();
      return;
    }
    var copy = e.target.closest("[data-copy-id]");
    if (copy) { travelPick[copy.getAttribute("data-copy-id")] = copy.checked; return; }
    var box = e.target.closest("[data-pick]");
    if (!box) return;
    picked[box.getAttribute("data-pick")] = box.checked;
  });

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-query]")) { readQuery(); render(); return; }
    if (e.target.closest("[data-extra-open]")) {
      extraStay.open = true;
      extraStay.step = 1;
      extraStay.kid = "";
      extraStay.amount = "";
      extraStay.note = "";
      extraStay.code = "";
      extraStay.history = false;
      extraStay.viewId = "";
      render();
      return;
    }
    if (e.target.closest("[data-extra-hist]")) {
      extraStay.history = true;
      extraStay.viewId = "";
      render();
      return;
    }
    if (e.target.closest("[data-extra-hist-close]")) {
      extraStay.history = false;
      extraStay.viewId = "";
      render();
      return;
    }
    var extraView = e.target.closest("[data-extra-view]");
    if (extraView) {
      extraStay.viewId = extraView.getAttribute("data-extra-view");
      render();
      return;
    }
    if (e.target.closest("[data-extra-close]")) { extraStay.open = false; render(); return; }
    var extraPick = e.target.closest("[data-extra-pick]");
    if (extraPick) { extraStay.kid = extraPick.getAttribute("data-extra-pick"); render(); return; }
    if (e.target.closest("[data-extra-next]")) {
      if (!extraStay.kid) { window.LB.toast("请选择学员"); return; }
      extraStay.step = 2;
      render();
      return;
    }
    if (e.target.closest("[data-extra-back]")) { extraStay.step = 1; render(); return; }
    if (e.target.closest("[data-extra-make]")) {
      var amtEl = document.getElementById("ex-amount");
      var noteEl = document.getElementById("ex-note");
      extraStay.amount = amtEl ? amtEl.value.trim() : "";
      extraStay.note = noteEl ? noteEl.value.trim() : "";
      var amt = Number(extraStay.amount);
      if (!extraStay.amount || isNaN(amt) || amt <= 0) { window.LB.toast("请输入正确的收款金额"); return; }
      extraStay.code = "LSCX-" + extraStay.kid + "-" + Math.round(amt * 100) + "-20261028";
      extraStay.step = 3;
      render();
      return;
    }
    if (e.target.closest("[data-extra-done]")) {
      var doneKid = extraKid();
      var now = new Date();
      var p2 = function (n) { return ("0" + n).slice(-2); };
      var stamp = now.getFullYear() + "-" + p2(now.getMonth() + 1) + "-" + p2(now.getDate()) + " " + p2(now.getHours()) + ":" + p2(now.getMinutes());
      var rowsH = extraHistoryRows().slice();
      rowsH.unshift({
        id: "QR" + Date.now(),
        kid: doneKid ? doneKid.sid : "",
        name: doneKid ? doneKid.name : "",
        klass: doneKid ? doneKid.klass : "",
        amount: Number(extraStay.amount || 0).toFixed(2),
        note: extraStay.note || "",
        by: "余炜烽",
        at: stamp,
        order: "SO" + Date.now(),
        pay: "待支付"
      });
      extraHistorySave(rowsH);
      extraStay.open = false;
      window.LB.toast("已生成订单，渠道：领袖营-额外住宿费用");
      render();
      return;
    }
    if (e.target.closest("[data-reset]")) { q = { name: "", sid: "", oldWeek: "", newWeek: "", order: "", status: "", from: "", to: "" }; render(); return; }
    if (e.target.closest("[data-batch]")) { batchConfirm(); return; }
    /* 清单第 52 条：批量核销按勾选处理。取消勾选即本次不核销，先把其余的先批量核销。 */
    var pickAll = e.target.closest("[data-stu-all]");
    if (pickAll) {
      document.querySelectorAll("[data-stu-pick]").forEach(function (box) { if (!box.disabled) box.checked = pickAll.checked; });
      return;
    }
    var stuBatch = e.target.closest("[data-stu-batch]");
    if (stuBatch) {
      var bPack = studentRows();
      var picked = [];
      document.querySelectorAll("[data-stu-pick]").forEach(function (box) { if (box.checked && !box.disabled) picked.push(box.getAttribute("data-stu-pick")); });
      if (!picked.length) {
        window.LB.toast("请先勾选需要核销的学员，取消勾选的学员本次不核销");
        return;
      }
      var pickedNames = bPack.rows.filter(function (r) { return picked.indexOf(r.id) >= 0; }).map(function (r) { return r.name; });
      var skipped = bPack.rows.filter(function (r) { return r.verify !== "已核销" && picked.indexOf(r.id) < 0; }).map(function (r) { return r.name; });
      window.LB.confirm(
        "本次核销 " + picked.length + " 人：" + pickedNames.join("、") + (skipped.length ? "。未勾选的 " + skipped.length + " 人保持原状态：" + skipped.join("、") : "") + "。",
        function () {
          bPack.rows.forEach(function (r) { if (picked.indexOf(r.id) >= 0) r.verify = "已核销"; });
          saveStudentRows(bPack.key, bPack.rows);
          window.LB.toast("已核销 " + picked.length + " 人");
          render();
        }
      );
      return;
    }
    var leaveOpen = e.target.closest("[data-leave-open]");
    if (leaveOpen) { openLeave(leaveOpen.getAttribute("data-leave-open")); return; }
    var stuEdit = e.target.closest("[data-stu-edit]");
    if (stuEdit) {
      var editRow = findStudent(stuEdit.getAttribute("data-stu-edit"));
      if (editRow) window.LB.openDrawer("修改信息 · " + editRow.name, '<p class="lb-hint">现网同款修改信息抽屉。本页只做离营核销这一处。</p>', { wide: true });
      return;
    }
    var stuCheck = e.target.closest("[data-stu-check]");
    if (stuCheck) {
      var checkRow = findStudent(stuCheck.getAttribute("data-stu-check"));
      if (checkRow) window.LB.confirm("上课时间少于课程时长，是否需要发起中途离营的报读退款", function () {
        checkRow.verify = "已核销";
        saveStudentRows(studentRows().key, studentRows().rows);
        window.LB.toast("核销成功");
        render();
      });
      return;
    }
    var leaveRun = e.target.closest("[data-leave-run]") || e.target.closest("[data-leave-apply]");
    if (leaveRun) {
      runLeave(leaveRun.getAttribute("data-leave-run") || leaveRun.getAttribute("data-leave-apply"));
      return;
    }
    var cancelJoin = e.target.closest("[data-cancel-join]");
    if (cancelJoin) {
      var all = window.LB_JOIN.load();
      all.forEach(function (item) { if (item.id === cancelJoin.getAttribute("data-cancel-join")) item.status = "已取消"; });
      window.LB_JOIN.save(all);
      render();
      return;
    }
    if (e.target.id === "biz-export" || e.target.getAttribute("data-code")) {
      window.LB.toast("现网功能，本次不改");
      return;
    }
    var tab = e.target.closest("[data-tab]");
    if (tab) { detailTab = tab.getAttribute("data-tab"); render(); return; }
    if (e.target.closest("[data-travel-mode]")) {
      travelMode = e.target.closest("[data-travel-mode]").getAttribute("data-travel-mode");
      travelOpen = false;
      travelCopy = false;
      render();
      return;
    }
    if (e.target.closest("[data-stop-toggle]") && !e.target.closest("input,button,textarea")) {
      var toggle = e.target.closest("[data-stop-toggle]");
      var toggleBox = toggle.querySelector("[data-stop]");
      if (!toggleBox || toggleBox.disabled) return;
      toggleBox.checked = !toggleBox.checked;
      toggleBox.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }
    if (e.target.closest("[data-travel-open]")) {
      if (camp().closed) {
        window.LB.toast("本Q营已结营，不能再设置" + travelMode + "方式");
        return;
      }
      var saved = loadSurveys()[surveyId(camp().id)];
      travelForm = saved && saved.stations ? JSON.parse(JSON.stringify(saved)) : blankForm();
      travelOpen = true;
      travelCopy = false;
      render();
      return;
    }
    if (e.target.closest("[data-travel-confirm]")) {
      travelConfirm(travelPack(camp()).rows.filter(function (r) {
        return travelMode === "入营" ? r.status === "未到达" : r.status === "未离开";
      }).map(function (r) { return r.id; }));
      return;
    }
    if (e.target.closest("[data-travel-msg]")) { travelMessage(); return; }
    var travelOne = e.target.closest("[data-travel-one]");
    if (travelOne) { travelConfirm([travelOne.getAttribute("data-travel-one")]); return; }
    var travelDetail = e.target.closest("[data-travel-detail]");
    if (travelDetail) { travelCert(travelFind(travelDetail.getAttribute("data-travel-detail"))); return; }
    if (e.target.closest("[data-add-teacher]")) {
      syncForm();
      var addTeacher = e.target.closest("[data-add-teacher]").getAttribute("data-add-teacher").split(":");
      stopOf(addTeacher[0], Number(addTeacher[1])).teachers.push(emptyTeacher());
      render();
      return;
    }
    if (e.target.closest("[data-remove-teacher]")) {
      syncForm();
      var removeTeacher = e.target.closest("[data-remove-teacher]").getAttribute("data-remove-teacher").split(":");
      stopOf(removeTeacher[0], Number(removeTeacher[1])).teachers.splice(Number(removeTeacher[2]), 1);
      render();
      return;
    }
    if (e.target.closest("[data-add-contact]")) {
      syncForm();
      var addContact = e.target.closest("[data-add-contact]").getAttribute("data-add-contact").split(":");
      var contacts = stopOf(addContact[0], Number(addContact[1])).contacts;
      if (contacts.length < 3) contacts.push("");
      render();
      return;
    }
    if (e.target.closest("[data-remove-contact]")) {
      syncForm();
      var removeContact = e.target.closest("[data-remove-contact]").getAttribute("data-remove-contact").split(":");
      var contactList = stopOf(removeContact[0], Number(removeContact[1])).contacts;
      if (contactList.length > 1) contactList.splice(Number(removeContact[2]), 1);
      render();
      return;
    }
    if (e.target.closest("[data-img-del]")) {
      syncForm();
      var img = e.target.closest("[data-img-del]").getAttribute("data-img-del").split(":");
      travelForm[img[0]].splice(Number(img[1]), 1);
      render();
      return;
    }
    if (e.target.closest("[data-travel-send]")) {
      if (camp().closed) return;
      syncForm();
      var reason = formReady();
      if (reason) { window.LB.toast(reason); return; }
      travelPick = {};
      travelPick[camp().id] = true;
      travelCopy = true;
      render();
      return;
    }
    if (e.target.closest("[data-copy-cancel]")) { travelCopy = false; render(); return; }
    if (e.target.closest("[data-copy-ok]")) {
      syncForm();
      var map = loadSurveys();
      var sent = 0;
      sameBaseCamps().forEach(function (row) {
        if (row.id === camp().id || travelPick[row.id]) {
          map[row.id + "|" + travelMode] = JSON.parse(JSON.stringify(travelForm));
          sent += 1;
        }
      });
      saveSurveys(map);
      travelOpen = false;
      travelCopy = false;
      window.LB.toast(sent > 1 ? "已把" + travelMode + "问卷复制并发送到 " + sent + " 个Q营周营" : "已发送当前Q营的" + travelMode + "问卷");
      render();
      return;
    }
    if (e.target.closest("[data-travel-close]") && !e.target.closest(".tv-drawer")) {
      travelOpen = false;
      travelCopy = false;
      render();
      return;
    }
    if (e.target.closest("[data-travel-close]") && e.target.closest(".tv-drawer__head, .tv-drawer__foot")) {
      travelOpen = false;
      travelCopy = false;
      render();
      return;
    }
    var sub = e.target.closest("[data-enroll]");
    if (sub) { enrollTab = sub.getAttribute("data-enroll"); render(); return; }
    var drop = e.target.closest("[data-drop]");
    var move = e.target.closest("[data-move]");
    if (drop || move) { ask((drop || move).getAttribute(drop ? "data-drop" : "data-move"), drop ? "drop" : "move"); return; }
    var confirm = e.target.closest("[data-confirm]");
    if (confirm) {
      var rows = window.LB_JOIN.load();
      rows.forEach(function (item) { if (item.id === confirm.getAttribute("data-confirm")) item.status = "已确认"; });
      window.LB_JOIN.save(rows);
      render();
      return;
    }
    if (e.target.closest("[data-no]")) { dialog = null; render(); return; }
    if (e.target.closest("[data-yes]") && dialog) { dialog.yes(); dialog = null; render(); }
  });

  render();
})();
