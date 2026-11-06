(function () {
  "use strict";

  var SIGN = "pages/work/studentSignIn/index";
  var CONFIRM = "pages/work/studentConfirm/index";
  var TRAVEL = "pages/work/signInTask/detail";
  var SUCCESS = "pages/work/success/index";
  var CAMP = "2026年暑假领袖营【华东基地-湖州】第6周";
  var REASONS = ["学员临时离开", "签到信息有误", "重复签到"];
  var SIGN_TEXT = { 1: "未签到", 2: "已签到", 3: "撤销签到" };
  var CONFIRM_TEXT = { 1: "未确认", 2: "已确认" };

  var students = [
    { id: "c1", letter: "C", name: "陈启航", sex: "男", age: 12, city: "佛山禅城", type: "新训", sign: 3, confirm: 1, health: "良好", dress: "140", mother: "-", mm: "-", father: "-", fm: "-", logs: [{ sign: 3, remark: "学员临时离开", time: "09-18 16:02" }, { sign: 2, user: "林晓雯", time: "09-18 14:10", photos: 1, remark: "" }] },
    { id: "l1", letter: "L", name: "李可", sex: "男", age: 11, city: "深圳南山", type: "复训", sign: 2, confirm: 1, health: "花粉过敏", dress: "140", mother: "-", mm: "-", father: "李海", fm: "13900003303", logs: [{ sign: 2, user: "林晓雯", mobile: "13800008801", time: "10-16 09:05", photos: 2, remark: "已到达大堂", journalId: "j-lobby-l" }] },
    { id: "s1", letter: "S", name: "孙悦", sex: "女", age: 10, city: "东莞南城", type: "复训", sign: 1, confirm: 1, health: "良好", dress: "120", mother: "孙兰", mm: "13600005505", father: "-", fm: "-", logs: [{ sign: 1 }] },
    { id: "w1", letter: "W", name: "王小满", sex: "女", age: 12, city: "广州天河", type: "新训", sign: 1, confirm: 1, health: "良好", dress: "130", mother: "王敏", mm: "13800001101", father: "王强", fm: "13800002202", logs: [{ sign: 1 }] },
    { id: "z1", letter: "Z", name: "赵欣然", sex: "女", age: 13, city: "杭州西湖", type: "新训", sign: 2, confirm: 2, health: "良好", dress: "150", mother: "赵丽", mm: "13700004404", father: "-", fm: "-", logs: [{ sign: 2, user: "林晓雯", mobile: "13800008801", time: "10-16 09:05", photos: 1, remark: "", journalId: "j-lobby-z" }] },
    { id: "z2", letter: "Z", name: "周宁", sex: "男", age: 12, city: "广州番禺", type: "新训", sign: 2, confirm: 1, health: "良好", dress: "140", mother: "周兰", mm: "13500006606", father: "-", fm: "-", logs: [{ sign: 2, user: "林晓雯", time: "09-18 15:40", photos: 0, remark: "" }] }
  ];

  var sc = {
    kw: "",
    batchSign: false,
    batchConfirm: false,
    selected: [],
    sheet: "",
    filterSign: { lobby: 0, sex: 0, type: 0 },
    filterConfirm: { lobby: 0, klass: 0 },
    draft: 0,
    targetId: "",
    photos: 0,
    remark: "",
    reason: "",
    reasonOpen: false,
    success: 0,
    err: ""
  };

  /* 原型评审第二轮第21条：APP 欢送总表也能改离营方式，权限只开放给「副负责人」。
   规则与后台离营总表保持一致：未核销 + 未签离才可改；改完标「已修改」并逐条发送通知。
   tv.summaryEdit = 正在修改的学员 sid；tv.deputy = 是否副负责人（演示用开关）。 */
  var tv = { type: 1, kw: "", batch: false, selected: [], sheet: "", photos: 0, remark: "", reason: "", reasonOpen: false, targetId: "", wayOpen: "", summary: false, summaryBase: -1, summaryWay: -1, summaryKw: "", summaryEdit: "", deputy: true };
  /* 与后台一致的修改权限：未签离 */
  function appSummaryCanEdit(r) { return r.status !== "已签离"; }

  /* 现网 work.vue：迎接学员 ?type=1，欢送学员 ?type=2，同一页按 type 分支。
     学员的离营方式来自助教分组（categoryClass/detail.vue 卡片），这里按同名只读同步。 */
  var LEAVE_WAYS = { 1: "机场接离", 2: "火车/高铁接离", 3: "大巴接离", 4: "营地自离", 5: "连营" };
  var SUBSTITUTE = { 1: "父母站点自接", 2: "他人站点代接", 3: "学员站点自离", 4: "工作人员送进安检" };

  var travelers = [
    { id: "tw", name: "王小满", sid: "A10281", sex: "女", age: 12, code: "A10281", flight: "CZ3101", place: "广州白云机场T1航站楼", arrive: "10-14 16:00", signStatus: { 1: 1, 2: 2 }, leaveWay: 1, leavePlace: "广州白云机场T1航站楼", substitute: 1, leaveUpdated: "2026-10-18 16:20", welcome: { on: true, journalId: "j-welcome-w", photos: 2, remark: "已在机场接到", time: "10-14 16:20", user: "林晓雯", mobile: "13800008801" }, farewell: { on: true, journalId: "j-leave-w", photos: 1, remark: "已送到航站楼", time: "10-23 11:05", user: "林晓雯", mobile: "13800008801" } },
    { id: "tl", name: "李可", sid: "A10282", sex: "男", age: 11, code: "A10282", flight: "ZH9802", place: "广州白云机场T2航站楼", arrive: "10-16 09:30", signStatus: { 1: 2, 2: 1 }, leaveWay: 2, leavePlace: "广州南站", substitute: 1, leaveUpdated: "2026-10-19 10:02", welcome: { on: true, journalId: "j-welcome-l", photos: 1, remark: "", time: "10-16 09:35", user: "林晓雯", mobile: "13800008801" }, farewell: { on: false } },
    { id: "tz", name: "赵欣然", sid: "A10284", sex: "女", age: 13, code: "A10284", flight: "南站大巴", place: "广州南站", arrive: "10-16 13:00", signStatus: { 1: 2, 2: 1 }, leaveWay: 3, leavePlace: "广州南站", substitute: 2, leaveUpdated: "2026-10-20 09:41", welcome: { on: true, journalId: "j-welcome-z", photos: 1, remark: "", time: "10-16 13:10", user: "林晓雯", mobile: "13800008801" }, farewell: { on: false } },
    { id: "ts", name: "孙悦", sid: "A10283", sex: "女", age: 10, code: "A10283", flight: "—", place: "营地自离", arrive: "10-22 09:00", signStatus: { 1: 2, 2: 1 }, leaveWay: 4, leavePlace: "营地", substitute: 3, leaveUpdated: "2026-10-21 18:30", welcome: { on: true, journalId: "j-welcome-s", photos: 1, remark: "", time: "10-15 09:10", user: "林晓雯", mobile: "13800008801" }, farewell: { on: false } },
    { id: "tc", name: "陈启航", sid: "A10285", sex: "男", age: 12, code: "A10285", flight: "—", place: "未填写", arrive: "", signStatus: { 1: 1, 2: 1 }, leaveWay: 0, leavePlace: "", substitute: 0, leaveUpdated: "", welcome: { on: false }, farewell: { on: false } }
  ];

  /* 欢送总表：基地即计划。汇总数和下面的学员名单同源，都从 ROSTER 算。 */
  var BASES = [
    { plan: "2026年暑假领袖营【华东基地】", week: "第六周" },
    { plan: "2026年暑假领袖营【广东基地A】", week: "第一周" },
    { plan: "2027年寒假领袖营【广东基地】", week: "第一周" },
    { plan: "2026年暑假领袖营【南宁基地】", week: "第三周" }
  ];

  var ROSTER = [
    { base: 0, name: "王小满", sid: "A10281", klass: "A1班", way: 1, place: "广州白云机场T1航站楼", flight: "CZ3101", status: "已签离", updated: "2026-10-18 16:20" },
    { base: 0, name: "李可", sid: "A10282", klass: "A1班", way: 2, place: "广州南站", flight: "G1002", status: "未签离", updated: "2026-10-19 10:02" },
    { base: 0, name: "赵欣然", sid: "A10284", klass: "A2班", way: 3, place: "广州南站", flight: "南站大巴", status: "未签离", updated: "2026-10-20 09:41" },
    { base: 0, name: "孙悦", sid: "A10283", klass: "A2班", way: 4, place: "营地", flight: "—", status: "未签离", updated: "2026-10-21 18:30" },
    { base: 0, name: "陈启航", sid: "A10285", klass: "A1班", way: 0, place: "未填写", flight: "—", status: "未签离", updated: "" },
    { base: 0, name: "周宁", sid: "A10286", klass: "A1班", way: 1, place: "广州白云机场T2航站楼", flight: "MU5301", status: "未签离", updated: "2026-10-22 08:12" },
    { base: 0, name: "吴彤", sid: "A10287", klass: "A2班", way: 2, place: "广州东站", flight: "D7201", status: "未签离", updated: "2026-10-22 09:30" },
    { base: 0, name: "郑一诺", sid: "A10288", klass: "A1班", way: 5, place: "连营", flight: "—", status: "未签离", updated: "2026-10-22 11:05" },
    { base: 1, name: "林小满", sid: "B20101", klass: "B1班", way: 1, place: "深圳宝安机场T3航站楼", flight: "ZH9802", status: "未签离", updated: "2026-10-18 15:10" },
    { base: 1, name: "何晓波", sid: "B20102", klass: "B1班", way: 2, place: "广州南站", flight: "G6021", status: "已签离", updated: "2026-10-18 16:40" },
    { base: 1, name: "安宇静", sid: "B20103", klass: "B2班", way: 3, place: "深圳北站", flight: "大巴1号", status: "未签离", updated: "2026-10-19 09:22" },
    { base: 1, name: "张沐轩", sid: "B20104", klass: "B2班", way: 4, place: "营地", flight: "—", status: "未签离", updated: "2026-10-20 20:15" },
    { base: 1, name: "黄志远", sid: "B20105", klass: "B1班", way: 1, place: "广州白云机场T1航站楼", flight: "CZ3101", status: "未签离", updated: "2026-10-21 13:44" },
    { base: 1, name: "苏晚", sid: "B20106", klass: "B2班", way: 0, place: "未填写", flight: "—", status: "未签离", updated: "" },
    { base: 2, name: "许宁", sid: "C30101", klass: "C1班", way: 1, place: "广州白云机场T2航站楼", flight: "CA1301", status: "未签离", updated: "2026-10-18 10:02" },
    { base: 2, name: "何倩", sid: "C30102", klass: "C1班", way: 2, place: "广州南站", flight: "G1010", status: "未签离", updated: "2026-10-19 11:31" },
    { base: 2, name: "江澄", sid: "C30103", klass: "C2班", way: 3, place: "广州南站", flight: "南站大巴", status: "未签离", updated: "2026-10-20 12:08" },
    { base: 2, name: "钱柏", sid: "C30104", klass: "C2班", way: 5, place: "连营", flight: "—", status: "未签离", updated: "2026-10-21 09:19" },
    { base: 3, name: "韩朔", sid: "D40101", klass: "D1班", way: 1, place: "南宁吴圩机场T2航站楼", flight: "CZ6301", status: "未签离", updated: "2026-10-18 14:26" },
    { base: 3, name: "沈予", sid: "D40102", klass: "D1班", way: 2, place: "南宁东站", flight: "G4201", status: "已签离", updated: "2026-10-19 17:03" },
    { base: 3, name: "李正", sid: "D40103", klass: "D2班", way: 3, place: "南宁东站", flight: "大巴2号", status: "未签离", updated: "2026-10-20 08:55" },
    { base: 3, name: "赵岚", sid: "D40104", klass: "D2班", way: 4, place: "营地", flight: "—", status: "未签离", updated: "2026-10-21 19:40" }
  ];

  function baseCount(baseIndex) {
    var rows = ROSTER.filter(function (r) { return r.base === baseIndex; });
    var count = function (way) { return rows.filter(function (r) { return r.way === way; }).length; };
    return { total: rows.length, airport: count(1), station: count(2), bus: count(3), self: count(4), joinNum: count(5), none: count(0), signed: rows.filter(function (r) { return r.status === "已签离"; }).length };
  }

  function summaryList() {
    return ROSTER.filter(function (r) {
      if (tv.summaryBase >= 0 && r.base !== tv.summaryBase) return false;
      if (tv.summaryWay >= 0 && r.way !== tv.summaryWay) return false;
      if (tv.summaryKw && (r.name + r.sid + r.place).indexOf(tv.summaryKw) < 0) return false;
      return true;
    });
  }

  var WAY_META = [
    { way: 1, label: "机场", long: "机场接离", cls: "air" },
    { way: 2, label: "车站", long: "火车/高铁接离", cls: "station" },
    { way: 3, label: "大巴", long: "大巴接离", cls: "bus" },
    { way: 4, label: "自离", long: "营地自离", cls: "self" },
    { way: 5, label: "连营", long: "连营", cls: "join" },
    { way: 0, label: "未填", long: "未填写", cls: "none" }
  ];

  function wayCount(rows, way) {
    return rows.filter(function (r) { return r.way === way; }).length;
  }

  function shortBase(plan) {
    return String(plan).replace("2026年暑假领袖营", "26暑假").replace("2027年寒假领袖营", "27寒假").replace(/^26暑假/, "26暑假").replace(/【|】/g, "");
  }

  function wayBar(rows, meta) {
    meta = meta || WAY_META;
    var html = '<div class="sm-bar">';
    meta.forEach(function (m) {
      var n = wayCount(rows, m.way);
      if (!n) return;
      html += '<i class="sm-bar__seg sm-bar__seg--' + m.cls + '" style="flex:' + n + '" title="' + esc(m.long) + " " + n + '"></i>';
    });
    html += "</div>";
    return html;
  }

  function wayChips(rows, withZero, meta) {
    meta = meta || WAY_META;
    var html = '<div class="sm-chips">';
    meta.forEach(function (m) {
      var n = wayCount(rows, m.way);
      if (!n && !withZero) return;
      html += '<span class="sm-chip sm-chip--' + m.cls + '"><i></i>' + esc(m.label) + "<b>" + n + "</b></span>";
    });
    html += "</div>";
    return html;
  }

  /* 入营方式与后台迎接欢送抽屉一致。第 4 项是自行入营。 */
  var ARRIVE_WAYS = { 1: "机场接送", 2: "火车站接送", 3: "大巴接送", 4: "自行入营", 5: "连营" };
  var ARRIVE_META = [
    { way: 1, label: "机场", long: "机场接送", cls: "air" },
    { way: 2, label: "车站", long: "火车站接送", cls: "station" },
    { way: 3, label: "大巴", long: "大巴接送", cls: "bus" },
    { way: 4, label: "自行", long: "自行入营", cls: "self" },
    { way: 5, label: "连营", long: "连营", cls: "join" },
    { way: 0, label: "未填", long: "未填写", cls: "none" }
  ];
  var ARRIVE_PLACES = {
    1: ["广州白云机场T1航站楼", "广州白云机场T2航站楼", "深圳宝安机场T3航站楼", "南宁吴圩机场T2航站楼"],
    2: ["广州南站", "广州东站", "深圳北站", "南宁东站"],
    3: ["广州总部大巴起点", "中山大巴起点"]
  };
  var ARRIVE_TEACHERS = ["林晓雯", "苏晚"];
  var ARRIVE = [
    { base: 0, name: "王小满", sid: "A10281", klass: "A1班", way: 1, place: "广州白云机场T1航站楼", flight: "CZ3101", depart: "10-14 14:10", arrive: "10-14 16:00", teacher: "林晓雯", unaccompanied: false, status: "未到达", updated: "2026-10-14 09:20" },
    { base: 0, name: "李可", sid: "A10282", klass: "A1班", way: 2, place: "广州南站", flight: "G1002", depart: "10-16 08:00", arrive: "10-16 09:30", teacher: "林晓雯", unaccompanied: false, status: "已到达", updated: "2026-10-16 09:35" },
    { base: 0, name: "赵欣然", sid: "A10284", klass: "A2班", way: 3, place: "广州总部大巴起点", flight: "", depart: "", arrive: "10-16 13:00", teacher: "", unaccompanied: false, status: "已到达", updated: "2026-10-16 13:10" },
    { base: 0, name: "孙悦", sid: "A10283", klass: "A2班", way: 4, place: "", flight: "", depart: "", arrive: "10-15 09:10", teacher: "", unaccompanied: false, status: "已到达", updated: "2026-10-15 09:10" },
    { base: 0, name: "陈启航", sid: "A10285", klass: "A1班", way: 0, place: "", flight: "", depart: "", arrive: "", teacher: "", unaccompanied: false, status: "未到达", updated: "" },
    { base: 0, name: "郑一诺", sid: "A10288", klass: "A1班", way: 5, place: "", flight: "", depart: "", arrive: "10-14 08:00", teacher: "", unaccompanied: false, status: "未到达", updated: "2026-10-13 18:02" },
    { base: 1, name: "林小满", sid: "B20101", klass: "B1班", way: 1, place: "深圳宝安机场T3航站楼", flight: "ZH9802", depart: "10-18 13:20", arrive: "10-18 15:10", teacher: "林晓雯", unaccompanied: true, status: "未到达", updated: "2026-10-17 11:40" },
    { base: 1, name: "何晓波", sid: "B20102", klass: "B1班", way: 2, place: "广州南站", flight: "G6021", depart: "10-18 14:10", arrive: "10-18 16:40", teacher: "苏晚", unaccompanied: false, status: "已到达", updated: "2026-10-18 16:40" },
    { base: 1, name: "安宇静", sid: "B20103", klass: "B2班", way: 3, place: "中山大巴起点", flight: "", depart: "", arrive: "10-19 09:22", teacher: "", unaccompanied: false, status: "未到达", updated: "2026-10-18 20:11" },
    { base: 1, name: "苏晚", sid: "B20106", klass: "B2班", way: 0, place: "", flight: "", depart: "", arrive: "", teacher: "", unaccompanied: false, status: "未到达", updated: "" },
    { base: 2, name: "许宁", sid: "C30101", klass: "C1班", way: 1, place: "广州白云机场T2航站楼", flight: "CA1301", depart: "10-18 08:10", arrive: "10-18 10:02", teacher: "林晓雯", unaccompanied: false, status: "未到达", updated: "2026-10-17 09:18" },
    { base: 2, name: "何倩", sid: "C30102", klass: "C1班", way: 2, place: "广州南站", flight: "G1010", depart: "10-19 09:40", arrive: "10-19 11:31", teacher: "苏晚", unaccompanied: false, status: "未到达", updated: "2026-10-18 16:02" },
    { base: 2, name: "钱柏", sid: "C30104", klass: "C2班", way: 5, place: "", flight: "", depart: "", arrive: "10-18 08:00", teacher: "", unaccompanied: false, status: "已到达", updated: "2026-10-18 08:20" },
    { base: 3, name: "韩朔", sid: "D40101", klass: "D1班", way: 1, place: "南宁吴圩机场T2航站楼", flight: "CZ6301", depart: "10-18 12:40", arrive: "10-18 14:26", teacher: "林晓雯", unaccompanied: false, status: "未到达", updated: "2026-10-17 15:33" },
    { base: 3, name: "沈予", sid: "D40102", klass: "D1班", way: 2, place: "南宁东站", flight: "G4201", depart: "10-19 14:20", arrive: "10-19 17:03", teacher: "苏晚", unaccompanied: false, status: "已到达", updated: "2026-10-19 17:03" },
    { base: 3, name: "赵岚", sid: "D40104", klass: "D2班", way: 4, place: "", flight: "", depart: "", arrive: "10-20 08:30", teacher: "", unaccompanied: false, status: "未到达", updated: "2026-10-19 21:15" }
  ];

  function arriveRows() {
    if (tv.summaryBase < 0) return ARRIVE.slice();
    return ARRIVE.filter(function (r) { return r.base === tv.summaryBase; });
  }

  function arriveList() {
    return arriveRows().filter(function (r) {
      if (tv.summaryWay >= 0 && r.way !== tv.summaryWay) return false;
      if (tv.summaryKw && (r.name + r.sid + r.place + r.flight).indexOf(tv.summaryKw) < 0) return false;
      return true;
    });
  }

  function arriveCanEdit(r) {
    return r.status !== "已到达";
  }

  function arriveLine(r) {
    if (!r.way) return "未填写入营方式";
    if (r.way === 1 || r.way === 2) {
      return (r.place || "未选站点") + (r.flight ? " · " + r.flight : "") + (r.arrive ? " · 抵达 " + r.arrive : "");
    }
    if (r.way === 3) return (r.place || "未选起点") + (r.arrive ? " · 抵达 " + r.arrive : "");
    return r.arrive ? "抵达 " + r.arrive : "未填抵达时间";
  }

  function arriveSummaryPage() {
    var scoped = arriveRows();
    var arrived = scoped.filter(function (r) { return r.status === "已到达"; }).length;
    var html = '<header class="nav nav--sc"><div><button type="button" data-sc="summary-back">返回</button></div><h1>迎接总表</h1><div class="side"></div></header>';
    html += '<div class="body sc sm">';
    html += '<div class="ex-anchor"><button type="button" class="ex-dot" data-note="arrive" title="迎接总表"><span class="ex-num">3</span></button></div>';
    html += '<section class="sm-hero">';
    html += '<div class="sm-hero__top"><div><p class="sm-hero__eye">' + (tv.summaryBase >= 0 ? "单基地视图" : "全部基地") + '</p><h2>' + esc(tv.summaryBase >= 0 ? shortBase(BASES[tv.summaryBase].plan) : "迎接总览") + "</h2>";
    html += '<p class="sm-hero__sub">' + (tv.summaryBase >= 0 ? esc(BASES[tv.summaryBase].week) + " · " : "") + "应迎接 " + scoped.length + " 人 · 已到达 " + arrived + " 人</p></div></div>";
    html += wayBar(scoped, ARRIVE_META);
    html += wayChips(scoped, true, ARRIVE_META);
    html += "</section>";
    html += '<div class="sm-sec"><h3>选择基地</h3><p>基地即计划。点一个基地，下面的名单跟着收窄。</p></div>';
    html += '<div class="sm-bases">';
    html += '<button type="button" class="sm-base' + (tv.summaryBase < 0 ? " is-on" : "") + '" data-sc="summary-all"><div class="sm-base__hd"><b>全部基地</b><em>' + ARRIVE.length + "</em></div>" + wayChips(ARRIVE, false, ARRIVE_META) + "</button>";
    BASES.forEach(function (b, i) {
      var rows = ARRIVE.filter(function (r) { return r.base === i; });
      html += '<button type="button" class="sm-base' + (tv.summaryBase === i ? " is-on" : "") + '" data-sc="summary-base" data-idx="' + i + '"><div class="sm-base__hd"><b>' + esc(shortBase(b.plan)) + "</b><em>" + rows.length + "</em></div>";
      html += '<p class="sm-base__wk">' + esc(b.week) + " · 已到达 " + rows.filter(function (r) { return r.status === "已到达"; }).length + "</p>";
      html += wayChips(rows, false, ARRIVE_META) + "</button>";
    });
    html += "</div>";
    html += '<div class="sm-sec"><h3>学员名单</h3><p>' + arriveList().length + " 人，按入营方式筛。</p></div>";
    html += '<div class="sm-search"><input id="tv-sum-kw" placeholder="搜索学员姓名 / 学员ID / 站点" value="' + esc(tv.summaryKw) + '" /><button type="button" data-sc="summary-search">搜索</button></div>';
    html += '<div class="sm-filter">';
    html += '<button type="button" class="sm-pill' + (tv.summaryWay < 0 ? " is-on" : "") + '" data-sc="summary-way" data-idx="-1">全部</button>';
    ARRIVE_META.forEach(function (m) {
      html += '<button type="button" class="sm-pill sm-pill--' + m.cls + (tv.summaryWay === m.way ? " is-on" : "") + '" data-sc="summary-way" data-idx="' + m.way + '">' + esc(m.label) + "</button>";
    });
    html += "</div>";
    var list = arriveList();
    if (!list.length) html += '<div class="sm-empty">没有符合条件的学员</div>';
    else {
      html += '<div class="sm-list">';
      list.forEach(function (r) {
        var meta = ARRIVE_META.filter(function (m) { return m.way === r.way; })[0] || ARRIVE_META[5];
        var done = r.status === "已到达";
        html += '<article class="sm-card sm-card--' + meta.cls + '">';
        html += '<div class="sm-card__hd"><b class="sm-card__name">' + esc(r.name) + "</b>";
        html += '<span class="sm-card__st' + (done ? " is-done" : "") + '">' + esc(r.status) + "</span></div>";
        html += '<p class="sm-card__meta">' + esc(r.sid) + " · " + esc(r.klass) + " · " + esc(shortBase(BASES[r.base].plan)) + "</p>";
        html += '<div class="sm-card__way"><span class="sm-chip sm-chip--' + meta.cls + '"><i></i>' + esc(meta.long) + "</span>";
        html += '<em class="sm-card__place">' + esc(arriveLine(r)) + "</em></div>";
        html += '<p class="sm-card__time">' + (r.updated ? "更新于 " + esc(r.updated) : "未填写入营方式") + (r.isEdited ? ' <em class="sm-card__edited">已修改</em>' : "") + "</p>";
        if (tv.deputy && arriveCanEdit(r)) html += '<button type="button" class="sm-card__edit" data-sc="summary-edit" data-sid="' + esc(r.sid) + '">修改入营方式</button>';
        html += "</article>";
      });
      html += "</div>";
    }
    html += '<p class="sc-way__tip">汇总数与下方名单同源。入营方式取自入营问卷。迎接不走助教提交，也没有审批。' +
      (tv.deputy ? "当前身份是副负责人，未到达的学员可以直接改。已到达不能改。保存后标「已修改」，并在后台该学员的修正记录里记成操作用户（APP 副负责人）。后台能打开迎接总表的人也可以改未到达学员。" : "当前身份不是副负责人，只能查看。") +
      "</p>";
    if (tv.summaryEdit) html += arriveEditSheet();
    html += "</div>";
    return html;
  }

  function arriveBySid(sid) {
    return ARRIVE.filter(function (r) { return r.sid === sid; })[0] || null;
  }

  function openArriveDraft(r) {
    tv.arriveDraft = {
      way: r.way || 1,
      place: r.place || "",
      flight: r.flight || "",
      depart: r.depart || "",
      arrive: r.arrive && r.arrive !== "—" ? r.arrive : "",
      teacher: r.teacher || "",
      unaccompanied: !!r.unaccompanied
    };
  }

  function readArriveDraft() {
    var d = tv.arriveDraft;
    if (!d) return null;
    var place = document.getElementById("sm-place");
    var flight = document.getElementById("sm-flight");
    var depart = document.getElementById("sm-depart");
    var arrive = document.getElementById("sm-arrive");
    var teacher = document.getElementById("sm-teacher");
    if (place) d.place = place.value;
    if (flight) d.flight = flight.value.trim();
    if (depart) d.depart = depart.value.trim();
    if (arrive) d.arrive = arrive.value.trim();
    if (teacher) d.teacher = teacher.value;
    return d;
  }

  function clearArriveDraftForWay(way) {
    var d = tv.arriveDraft;
    if (!d) return;
    var places = ARRIVE_PLACES[way] || [];
    if (places.indexOf(d.place) < 0) d.place = "";
    if (way !== 1 && way !== 2) {
      d.flight = "";
      d.depart = "";
      d.teacher = "";
    }
    if (way !== 1) d.unaccompanied = false;
    if (way === 4 || way === 5) d.place = "";
  }

  function arriveSelect(id, label, value, options, placeholder) {
    var html = '<div class="sm-sheet__field"><label>' + esc(label) + '</label><select id="' + id + '">';
    html += '<option value="">' + esc(placeholder) + "</option>";
    options.forEach(function (opt) {
      html += '<option value="' + esc(opt) + '"' + (value === opt ? " selected" : "") + ">" + esc(opt) + "</option>";
    });
    html += "</select></div>";
    return html;
  }

  function arriveEditSheet() {
    var r = arriveBySid(tv.summaryEdit);
    var d = tv.arriveDraft;
    if (!r || !d) return "";
    var way = d.way;
    var html = '<div class="sm-sheet-mask"><div class="sm-sheet" data-sc="summary-sheet">';
    html += '<h3>修改入营方式 · ' + esc(r.name) + "</h3>";
    html += '<p class="sm-sheet__sub">' + esc(r.sid) + " · " + esc(r.klass) + " · " + esc(r.status) + "</p>";
    html += '<div class="sm-sheet__field"><label>入营方式</label><div class="sm-ways">';
    [1, 2, 3, 4, 5].forEach(function (w) {
      html += '<button type="button" class="sm-way' + (way === w ? " is-on" : "") + '" data-sc="summary-pick-way" data-v="' + w + '">' + esc(ARRIVE_WAYS[w]) + "</button>";
    });
    html += "</div></div>";
    if (way === 1 || way === 2 || way === 3) {
      var placeLabel = way === 1 ? "航站楼" : way === 2 ? "车站" : "入营大巴起点";
      html += arriveSelect("sm-place", placeLabel, d.place, ARRIVE_PLACES[way], "请选择" + placeLabel);
    }
    if ((way === 1 || way === 2) && d.place) {
      html += arriveSelect("sm-teacher", "带队老师", d.teacher, ARRIVE_TEACHERS, "该站点可选，不选也可以");
    }
    if (way === 1 || way === 2) {
      html += '<div class="sm-sheet__field"><label>' + (way === 1 ? "航班号" : "班次") + '</label><input id="sm-flight" value="' + esc(d.flight) + '" placeholder="' + (way === 1 ? "如：CZ3101" : "如：G1002") + '" /></div>';
      html += '<div class="sm-sheet__field"><label>出发时间</label><input id="sm-depart" value="' + esc(d.depart) + '" placeholder="如：10-14 14:10" /></div>';
    }
    html += '<div class="sm-sheet__field"><label>抵达时间</label><input id="sm-arrive" value="' + esc(d.arrive) + '" placeholder="如：10-14 16:00" /></div>';
    if (way === 1) {
      html += '<div class="sm-sheet__field"><label>是否无人陪伴</label><div class="sm-ways">';
      html += '<button type="button" class="sm-way' + (d.unaccompanied ? " is-on" : "") + '" data-sc="summary-alone" data-v="1">是</button>';
      html += '<button type="button" class="sm-way' + (!d.unaccompanied ? " is-on" : "") + '" data-sc="summary-alone" data-v="0">否</button>';
      html += "</div></div>";
      if (d.unaccompanied) html += '<p class="sm-sheet__tip">陪伴人：林晓雯 · 女 · 13800008801</p>';
    }
    html += '<p class="sm-sheet__tip">副负责人保存后立即生效，不走助教提交，也没有审批。已到达的学员不能改。换方式后，不适用的站点、班次和出发时间会清掉。修正记录记成操作用户（APP 副负责人），不记成会员申请。</p>';
    html += '<div class="sm-sheet__ops"><button type="button" data-sc="summary-edit-cancel">取消</button><button type="button" data-sc="summary-save" data-sid="' + esc(r.sid) + '">保存</button></div>';
    html += "</div></div>";
    return html;
  }

  function saveArriveEdit(sid) {
    var r = arriveBySid(sid);
    var d = readArriveDraft();
    if (!r || !d || !tv.deputy || !arriveCanEdit(r)) {
      if (window.APP && window.APP.toast) window.APP.toast("已到达，或当前身份不能修改");
      return;
    }
    if (!d.way) {
      if (window.APP && window.APP.toast) window.APP.toast("请选择入营方式");
      return;
    }
    if ((d.way === 1 || d.way === 2 || d.way === 3) && !d.place) {
      if (window.APP && window.APP.toast) window.APP.toast(d.way === 3 ? "请选择入营大巴起点" : "请选择站点");
      return;
    }
    if ((d.way === 1 || d.way === 2) && !d.flight) {
      if (window.APP && window.APP.toast) window.APP.toast(d.way === 1 ? "请填写航班号" : "请填写班次");
      return;
    }
    if ((d.way === 1 || d.way === 2) && !d.depart) {
      if (window.APP && window.APP.toast) window.APP.toast("请填写出发时间");
      return;
    }
    if (!d.arrive) {
      if (window.APP && window.APP.toast) window.APP.toast("请填写抵达时间");
      return;
    }
    var beforeWay = r.way;
    r.beforeWay = beforeWay;
    r.way = d.way;
    r.place = d.place || "";
    r.flight = d.way === 1 || d.way === 2 ? d.flight : "";
    r.depart = d.way === 1 || d.way === 2 ? d.depart : "";
    r.arrive = d.arrive;
    r.teacher = d.way === 1 || d.way === 2 ? d.teacher : "";
    r.unaccompanied = d.way === 1 ? !!d.unaccompanied : false;
    r.isEdited = true;
    r.editedAt = appNow();
    r.editedBy = "副负责人（APP）";
    r.updated = r.editedAt;
    var person = travelers.filter(function (p) { return p.sid === r.sid; })[0];
    if (person) {
      person.place = r.place || (r.way === 4 ? "自行入营" : r.way === 5 ? "连营" : "未填写");
      person.flight = r.flight || "—";
      person.arrive = r.arrive;
      person.arriveWay = r.way;
      person.arriveEdited = true;
    }
    try {
      var pack = JSON.parse(sessionStorage.getItem("lb-arrive-summary-v1") || "[]");
      var hit = pack.filter(function (x) { return x.id === r.sid; })[0];
      var row = {
        id: r.sid, way: r.way, place: r.place, flight: r.flight || "—", depart: r.depart || "",
        arrive: r.arrive, teacher: r.teacher || "", unaccompanied: r.unaccompanied,
        beforeWay: beforeWay, isEdited: true, editedAt: r.editedAt, editedBy: r.editedBy, updated: r.updated
      };
      if (hit) Object.keys(row).forEach(function (k) { hit[k] = row[k]; });
      else pack.unshift(row);
      sessionStorage.setItem("lb-arrive-summary-v1", JSON.stringify(pack));
      var revMap = JSON.parse(sessionStorage.getItem("lb-arrive-revisions-v1") || "null") || {};
      revMap[r.sid] = revMap[r.sid] || [];
      revMap[r.sid].unshift({
        at: r.editedAt,
        kind: "backend",
        via: "app",
        operator: "林晓雯",
        action: "直接修改",
        text: "APP 迎接总表直接修改。入营方式由「" + (ARRIVE_WAYS[beforeWay] || "未填写") + "」改为「" + (ARRIVE_WAYS[r.way] || "未填写") + "」。" + (r.place ? "站点：" + r.place + "。" : "") + "数据已写入。"
      });
      sessionStorage.setItem("lb-arrive-revisions-v1", JSON.stringify(revMap));
    } catch (e) {}
    tv.summaryEdit = "";
    tv.arriveDraft = null;
    if (window.APP && window.APP.toast) window.APP.toast("已保存，并写入修正记录");
    if (window.APP) window.APP.render();
  }

  function summaryPage() {
    if (tv.type === 1) return arriveSummaryPage();
    var scoped = tv.summaryBase >= 0 ? ROSTER.filter(function (r) { return r.base === tv.summaryBase; }) : ROSTER;
    var signed = scoped.filter(function (r) { return r.status === "已签离"; }).length;
    var pct = scoped.length ? Math.round(signed / scoped.length * 100) : 0;
    var html = '<header class="nav nav--sc"><div><button type="button" data-sc="summary-back">返回</button></div><h1>欢送总表</h1><div class="side"></div></header>';
    html += '<div class="body sc sm">';
    html += '<div class="ex-anchor"><button type="button" class="ex-dot" data-note="10" title="离营方式与修正记录"><span class="ex-num">3</span></button></div>';

    html += '<section class="sm-hero">';
    html += '<div class="sm-hero__top"><div><p class="sm-hero__eye">' + (tv.summaryBase >= 0 ? "单基地视图" : "全部基地") + '</p><h2>' + esc(tv.summaryBase >= 0 ? shortBase(BASES[tv.summaryBase].plan) : "欢送总览") + "</h2>";
    html += '<p class="sm-hero__sub">' + (tv.summaryBase >= 0 ? esc(BASES[tv.summaryBase].week) + " · " : "") + "应欢送 " + scoped.length + " 人</p></div>";
    html += '<div class="sm-ring" style="--p:' + pct + '"><b>' + pct + '%</b><span>已签离</span></div></div>';
    html += wayBar(scoped);
    html += wayChips(scoped, true);
    html += "</section>";

    html += '<div class="sm-sec"><h3>选择基地</h3><p>基地即计划。点一个基地，下面的名单跟着收窄。</p></div>';
    html += '<div class="sm-bases">';
    html += '<button type="button" class="sm-base' + (tv.summaryBase < 0 ? " is-on" : "") + '" data-sc="summary-all"><div class="sm-base__hd"><b>全部基地</b><em>' + ROSTER.length + "</em></div>" + wayChips(ROSTER, false) + "</button>";
    BASES.forEach(function (b, i) {
      var rows = ROSTER.filter(function (r) { return r.base === i; });
      html += '<button type="button" class="sm-base' + (tv.summaryBase === i ? " is-on" : "") + '" data-sc="summary-base" data-idx="' + i + '"><div class="sm-base__hd"><b>' + esc(shortBase(b.plan)) + "</b><em>" + rows.length + "</em></div>";
      html += '<p class="sm-base__wk">' + esc(b.week) + " · 已签离 " + rows.filter(function (r) { return r.status === "已签离"; }).length + "</p>";
      html += wayChips(rows, false) + "</button>";
    });
    html += "</div>";

    html += '<div class="sm-sec"><h3>学员名单</h3><p>' + summaryList().length + " 人，按离营方式筛。</p></div>";
    html += '<div class="sm-search"><input id="tv-sum-kw" placeholder="搜索学员姓名 / 学员ID / 站点" value="' + esc(tv.summaryKw) + '" /><button type="button" data-sc="summary-search">搜索</button></div>';
    html += '<div class="sm-filter">';
    html += '<button type="button" class="sm-pill' + (tv.summaryWay === 0 ? " is-on" : "") + '" data-sc="summary-way" data-idx="0">全部</button>';
    WAY_META.forEach(function (m) {
      html += '<button type="button" class="sm-pill sm-pill--' + m.cls + (tv.summaryWay === m.way ? " is-on" : "") + '" data-sc="summary-way" data-idx="' + m.way + '">' + esc(m.label) + "</button>";
    });
    html += "</div>";

    var list = summaryList();
    if (!list.length) html += '<div class="sm-empty">没有符合条件的学员</div>';
    else {
      html += '<div class="sm-list">';
      list.forEach(function (r) {
        var meta = WAY_META.filter(function (m) { return m.way === r.way; })[0] || WAY_META[5];
        var done = r.status === "已签离";
        html += '<article class="sm-card sm-card--' + meta.cls + '">';
        html += '<div class="sm-card__hd"><b class="sm-card__name">' + esc(r.name) + "</b>";
        html += '<span class="sm-card__st' + (done ? " is-done" : "") + '">' + esc(r.status) + "</span></div>";
        html += '<p class="sm-card__meta">' + esc(r.sid) + " · " + esc(r.klass) + " · " + esc(shortBase(BASES[r.base].plan)) + "</p>";
        html += '<div class="sm-card__way"><span class="sm-chip sm-chip--' + meta.cls + '"><i></i>' + esc(meta.long) + "</span>";
        if (r.place && r.place !== "未填写") html += '<em class="sm-card__place">' + esc(r.place) + (r.flight && r.flight !== "—" ? " · " + esc(r.flight) : "") + "</em>";
        html += "</div>";
        html += '<p class="sm-card__time">' + (r.updated ? "修改于 " + esc(r.updated) : "未填写离营方式") + (r.isEdited ? ' <em class="sm-card__edited">已修改</em>' : "") + "</p>";
        if (tv.deputy && appSummaryCanEdit(r)) {
          html += '<button type="button" class="sm-card__edit" data-sc="summary-edit" data-sid="' + esc(r.sid) + '">修改离营方式</button>';
        }
        html += "</article>";
      });
      html += "</div>";
    }
    html += '<p class="sc-way__tip">汇总数与下方名单同源。离营方式取自学员在离营问卷里的填写。' +
      (tv.deputy ? "当前身份为副负责人，可直接在总表修改；改完标「已修改」并逐条发送通知。修正记录记成操作用户（APP 副负责人），不记成会员申请。" : "当前身份不是副负责人，只能查看，不能修改。") +
      "</p>";
    if (tv.summaryEdit) html += appEditSheet();
    html += "</div>";
    return html;
  }


  /* 原型评审第二轮第21条：APP 总表的修改抽屉。
     字段与后台离营总表一致：离营方式、站点、航班/班次、出发时间、抵达时间。
     保存后：该行标「已修改」，同步写 lb-leave-summary-v1（与后台同源），并逐条发送通知。 */
  function appNow() {
    var d = new Date();
    var p = function (n) { return ("0" + n).slice(-2); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }

  function appEditRow() {
    return ROSTER.filter(function (r) { return r.sid === tv.summaryEdit; })[0] || null;
  }

  function appEditSheet() {
    var r = appEditRow();
    if (!r) return "";
    var html = '<div class="sm-sheet-mask"><div class="sm-sheet" data-sc="summary-sheet">';
    html += '<h3>修改离营方式 · ' + esc(r.name) + "</h3>";
    html += '<p class="sm-sheet__sub">' + esc(r.sid) + " · " + esc(r.klass) + " · " + esc(r.status) + "</p>";
    html += '<div class="sm-sheet__field"><label>离营方式</label><div class="sm-ways">';
    [1, 2, 3, 4, 5].forEach(function (w) {
      html += '<button type="button" class="sm-way' + (r.way === w ? " is-on" : "") + '" data-sc="summary-pick-way" data-v="' + w + '">' + esc(LEAVE_WAYS[w]) + "</button>";
    });
    html += "</div></div>";
    html += '<div class="sm-sheet__field"><label>站点 / 目的地</label><input id="sm-place" value="' + esc(r.place === "未填写" ? "" : r.place) + '" placeholder="如：广州白云机场T1航站楼" /></div>';
    html += '<div class="sm-sheet__field"><label>航班号 / 班次</label><input id="sm-flight" value="' + esc(r.flight === "—" ? "" : r.flight) + '" placeholder="如：CZ3101" /></div>';
    html += '<div class="sm-sheet__field"><label>出发时间</label><input id="sm-depart" value="' + esc(r.depart || "") + '" placeholder="如：10-23 08:20" /></div>';
    html += '<div class="sm-sheet__field"><label>抵达时间</label><input id="sm-arrive" value="' + esc(r.arrive || "") + '" placeholder="如：10-23 11:05" /></div>';
    html += '<p class="sm-sheet__tip">保存后立即生效，与后台离营总表保持同一份数据：该行标「已修改」，并逐条发送通知到家营 / 欢送负责人 / 助教团。修正记录记成操作用户（APP 副负责人），不记成会员申请。</p>';
    html += '<div class="sm-sheet__ops"><button type="button" data-sc="summary-edit-cancel">取消</button><button type="button" data-sc="summary-save" data-sid="' + esc(r.sid) + '">保存</button></div>';
    html += "</div></div>";
    return html;
  }

  function appSaveSummaryEdit(sid) {
    if (tv.type === 1) return saveArriveEdit(sid);
    var r = ROSTER.filter(function (x) { return x.sid === sid; })[0];
    if (!r || !appSummaryCanEdit(r)) {
      if (window.APP && window.APP.toast) window.APP.toast("已签离，不可修改");
      return;
    }
    var picked = document.querySelector(".sm-way.is-on");
    var way = picked ? Number(picked.getAttribute("data-v")) : r.way;
    var place = (document.getElementById("sm-place") || {}).value || "";
    var flight = (document.getElementById("sm-flight") || {}).value || "";
    var depart = (document.getElementById("sm-depart") || {}).value || "";
    var arrive = (document.getElementById("sm-arrive") || {}).value || "";
    var beforeWay = r.way;
    r.beforeWay = beforeWay;
    r.way = way;
    r.place = place || "未填写";
    r.flight = flight || "—";
    r.depart = depart || "—";
    r.arrive = arrive || "—";
    r.isEdited = true;
    r.editedAt = appNow();
    r.editedBy = "副负责人（APP）";
    r.updated = r.editedAt;
    /* 同步写后台同源数据 */
    try {
      var rows = JSON.parse(sessionStorage.getItem("lb-leave-summary-v1") || "[]");
      var hit = rows.filter(function (x) { return x.id === sid; })[0];
      if (hit) {
        hit.beforeWay = beforeWay;
        hit.way = way;
        hit.place = r.place;
        hit.flight = r.flight;
        hit.depart = r.depart;
        hit.arrive = r.arrive;
        hit.isEdited = true;
        hit.editedAt = r.editedAt;
        hit.editedBy = r.editedBy;
        hit.updated = r.editedAt;
        hit.updater = r.editedBy;
        sessionStorage.setItem("lb-leave-summary-v1", JSON.stringify(rows));
      }
      /* 逐条通知，与后台共用同一个 key */
      var msgs = JSON.parse(sessionStorage.getItem("lb-leave-msgs-v1") || "[]");
      msgs.unshift({
        at: r.editedAt,
        name: r.name,
        sid: r.sid,
        text: "【" + r.name + "】离营方式由「" + (LEAVE_WAYS[beforeWay] || "未填写") + "」改为「" + (LEAVE_WAYS[way] || "未填写") + "」，APP 总表修改",
        to: "家营 / 欢送负责人 / 助教团"
      });
      sessionStorage.setItem("lb-leave-msgs-v1", JSON.stringify(msgs));
      var leaveRevs = JSON.parse(sessionStorage.getItem("lb-leave-revisions-v1") || "null") || {};
      leaveRevs[r.sid] = leaveRevs[r.sid] || [];
      leaveRevs[r.sid].unshift({
        at: r.editedAt,
        kind: "backend",
        via: "app",
        operator: "林晓雯",
        action: "直接修改",
        text: "APP 欢送总表直接修改。离营方式由「" + (LEAVE_WAYS[beforeWay] || "未填写") + "」改为「" + (LEAVE_WAYS[way] || "未填写") + "」。数据已写入。"
      });
      sessionStorage.setItem("lb-leave-revisions-v1", JSON.stringify(leaveRevs));
    } catch (e) {}
    tv.summaryEdit = "";
    if (window.APP && window.APP.toast) window.APP.toast("已保存并发送通知");
    if (window.APP) window.APP.render();
  }

  function leaveWayOf(person) {
    var sync = syncedLeave(person);
    if (sync) return sync.way ? LEAVE_WAYS[sync.way] : "未填写";
    return person.leaveWay ? LEAVE_WAYS[person.leaveWay] : "未填写";
  }

  /* 后台「离营总表」人工改过的记录，同步到欢送端。
     真实实现由服务端下发同一条记录（leave/modify 追加人工调整），
     本演示跨端口无法共享 sessionStorage，故：
     1) 同源时读 lb-leave-summary-v1；
     2) 否则用内置示例（默认开启，可在注释面板切换）还原「已修改」态。 */
  function demoEditedOn() {
    try { return sessionStorage.getItem("sc-demo-edited") !== "0"; } catch (e) { return true; }
  }

  var DEMO_EDITED = {
    A10284: { id: "A10284", name: "赵欣然", isEdited: true, beforeWay: 3, way: 1, place: "广州白云机场T1航站楼", flight: "CZ3101", arrive: "10-23 11:05", editedAt: "2026-10-28 02:40", editedBy: "余炜烽" }
  };

  function syncedLeave(person) {
    var rows = [];
    try { rows = JSON.parse(sessionStorage.getItem("lb-leave-summary-v1") || "[]"); } catch (e) { rows = []; }
    var hit = (rows || []).filter(function (r) {
      return r.isEdited && (r.id === person.sid || r.name === person.name);
    })[0];
    if (hit) return hit;
    if (!demoEditedOn()) return null;
    return DEMO_EDITED[person.sid] || null;
  }

  function leavePopup(person) {
    var sync = syncedLeave(person);
    var way = sync ? sync.way : person.leaveWay;
    var place = sync ? sync.place : person.leavePlace;
    var flight = sync ? sync.flight : person.flight;
    var updated = sync ? sync.editedAt : person.leaveUpdated;
    var rows = [
      ["离营方式", way ? LEAVE_WAYS[way] : "未填写"],
      ["接离方式", person.substitute ? SUBSTITUTE[person.substitute] : "-"],
      ["凭证", "-"],
      ["接待", way === 1 ? "航班楼：" + (place || "-") + "　航班号：" + (flight || "-") : way === 2 ? "火车站：" + (place || "-") + "　班次：" + (flight || "-") : way === 3 ? (place || "-") : "-"],
      ["陪伴员", way === 1 || way === 2 ? "带队人：林晓雯" : "-"],
      ["其他需求", "-"],
      ["最后修改时间", updated || "未修改"]
    ];
    if (sync) rows.push(["本次人工调整", "由「" + LEAVE_WAYS[sync.beforeWay] + "」改为「" + LEAVE_WAYS[sync.way] + "」"]);
    var html = '<div class="sc-mask" data-sc="way-close"><div class="sc-sheet sc-way"><h3>离营详情' + (sync ? '<span class="sc-way__badge">已修改</span>' : "") + "</h3><div class=\"sc-way__list\">";
    rows.forEach(function (pair) {
      html += '<div class="sc-way__row"><span>' + esc(pair[0]) + "</span><b>" + esc(pair[1]) + "</b></div>";
    });
    html += '</div><p class="sc-way__tip">离营方式来自助教分组里家长填写的离营问卷，这里只读同步。更新于 ' + esc(updated || "-") + "。" + (sync ? "该条由后台离营总表人工调整，并已流转到本页。" : "") + "</p>";
    html += '<div class="sc-sheet__btns"><button type="button" class="is-ok" data-sc="way-close">关闭</button></div></div></div>';
    return html;
  }

  function travelSlot(person) {
    return tv.type === 1 ? person.welcome : person.farewell;
  }

  function travelById(id) {
    return travelers.filter(function (item) { return item.id === id; })[0];
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function has(path) {
    return path === SIGN || path === CONFIRM || path === TRAVEL || path === SUCCESS;
  }

  function feedDot() {
    return '<div class="ex-anchor"><button type="button" class="ex-dot" data-note="58" title="需求 58"><span class="ex-num">1</span></button></div>';
  }

  function bar(title, right) {
    return '<header class="nav nav--sc"><div><button type="button" data-back="1">返回</button></div><h1>' + esc(title) + '</h1><div class="side">' + (right || "") + "</div></header>";
  }

  function byId(id) {
    return students.filter(function (s) { return s.id === id; })[0];
  }

  function counts() {
    return {
      total: students.length,
      signed: students.filter(function (s) { return s.sign === 2; }).length,
      unsigned: students.filter(function (s) { return s.sign !== 2; }).length,
      fresh: students.filter(function (s) { return s.type === "新训"; }).length,
      again: students.filter(function (s) { return s.type === "复训"; }).length,
      confirmed: students.filter(function (s) { return s.confirm === 2; }).length,
      unconfirmed: students.filter(function (s) { return s.confirm !== 2; }).length
    };
  }

  function matchSign(s) {
    var f = sc.filterSign;
    if (sc.kw && s.name.indexOf(sc.kw) < 0) return false;
    if (f.lobby && s.sign !== f.lobby) return false;
    if (f.sex && ((f.sex === 1 && s.sex !== "男") || (f.sex === 2 && s.sex !== "女"))) return false;
    if (f.type && ((f.type === 1 && s.type !== "新训") || (f.type === 2 && s.type !== "复训"))) return false;
    return true;
  }

  function matchConfirm(s) {
    var f = sc.filterConfirm;
    if (f.lobby && s.sign !== f.lobby) return false;
    if (f.klass && s.confirm !== f.klass) return false;
    return true;
  }

  function groups(list) {
    var map = {};
    var order = [];
    list.forEach(function (s) {
      if (!map[s.letter]) { map[s.letter] = []; order.push(s.letter); }
      map[s.letter].push(s);
    });
    order.sort();
    return order.map(function (letter) { return { letter: letter, items: map[letter] }; });
  }

  function photos(n) {
    var html = '<span class="sc-photos">';
    for (var i = 0; i < n; i++) html += '<i class="sc-ph n' + ((i % 3) + 1) + '"></i>';
    html += "</span>";
    return html;
  }

  function check(on, off) {
    return '<i class="sc-check' + (off ? " is-off" : on ? " is-on" : "") + '"></i>';
  }

  function signCard(s) {
    var on = sc.selected.indexOf(s.id) >= 0;
    var html = '<div class="sc-card" data-sc="student" data-id="' + s.id + '"><div class="sc-top">';
    if (sc.batchSign) html += check(on, s.sign === 2);
    html += '<b class="sc-avatar">' + esc(s.name.slice(0, 1)) + "</b><div><div class=\"sc-name\">" + esc(s.name);
    html += '<em class="sc-tag is-on">' + esc(s.type) + "</em>";
    html += '<em class="sc-tag' + (s.sign === 2 ? " is-on" : "") + '">' + SIGN_TEXT[s.sign] + "</em></div>";
    html += '<div class="sc-sub">' + esc(s.sex) + "｜" + s.age + "岁｜" + esc(s.city) + "</div>";
    html += '<div class="sc-meta"><span>健康状况：' + esc(s.health) + "</span><span>营服尺码：" + esc(s.dress) + "</span></div></div></div>";
    if (!sc.batchSign && s.sign !== 2) html += '<button type="button" class="sc-go" data-sc="sign" data-id="' + s.id + '">去签到</button>';
    if (!sc.batchSign && s.sign === 2 && s.confirm !== 2) html += '<button type="button" class="sc-undo" data-sc="revoke" data-id="' + s.id + '">撤销</button>';
    html += '<div class="sc-family"><div><b>母亲</b><span>' + esc(s.mother) + " " + esc(s.mm) + "</span></div><div><b>父亲</b><span>" + esc(s.father) + " " + esc(s.fm) + "</span></div></div>";
    if (s.sign === 2) {
      var log = s.logs[0];
      html += '<div class="sc-signed"><p>签到时间：' + esc(log.time) + "</p><p>签到人：" + esc(log.user) + "</p><p>签到照片：" + (log.photos ? photos(log.photos) : "-") + "</p></div>";
    }
    html += "</div>";
    return html;
  }

  function confirmCard(s) {
    var can = s.sign === 2 && s.confirm === 1;
    var on = sc.selected.indexOf(s.id) >= 0;
    var html = '<div class="sc-card" data-sc="student" data-id="' + s.id + '"><div class="sc-top">';
    if (sc.batchConfirm) html += check(on, !can);
    html += '<b class="sc-avatar">' + esc(s.name.slice(0, 1)) + '</b><div><div class="sc-name">' + esc(s.name) + '<em class="sc-tag is-on">' + esc(s.type) + "</em></div>";
    html += '<div class="sc-sub">' + esc(s.sex) + "｜" + s.age + "岁｜" + esc(s.city) + "</div></div></div>";
    html += '<div class="sc-status"><em>' + SIGN_TEXT[s.sign] + "</em><em>" + CONFIRM_TEXT[s.confirm] + "</em></div>";
    if (s.sign === 2) {
      var log = s.logs[0];
      html += '<div class="sc-signed"><p>签到时间：' + esc(log.time || "-") + "</p><p>签到人：" + esc(log.user || "-") + "</p><p>签到照片：" + (log.photos ? photos(log.photos) : "-") + "</p></div>";
    }
    html += "</div>";
    return html;
  }

  function foot(allOn, n) {
    return '<div class="sc-foot"><button type="button" class="sc-all" data-sc="all">' + check(allOn, false) + "全选</button><button type=\"button\" class=\"sc-submit\" data-sc=\"batch-open\">已选" + n + "名，确认签到</button></div>";
  }

  function signPage() {
    var c = counts();
    var list = students.filter(matchSign);
    var grouped = groups(list);
    var eligible = list.filter(function (s) { return s.sign !== 2; });
    var right = '<button type="button" class="sc-op" data-sc="batch"><i></i>' + (sc.batchSign ? "取消批量" : "批量处理") + "</button>";
    var html = bar("学员签到", right) + '<div class="body sc">' + feedDot();
    html += '<div class="sc-notice"><b>通知</b><span>请于今晚18:00前完成营地大堂签到</span></div>';
    html += '<div class="sc-info"><h2>' + CAMP + '</h2><div class="sc-class">A1班</div><div class="sc-stats">';
    html += '<div class="item"><strong>' + c.total + '</strong><span>学员总人数</span></div>';
    html += '<div class="item"><strong>' + c.signed + '</strong><span>已签到人数</span></div>';
    html += '<div class="item"><strong>' + c.unsigned + '</strong><span>未签到人数</span></div></div></div>';
    html += '<div class="sc-search"><input id="sc-kw" placeholder="搜索学员姓名" value="' + esc(sc.kw) + '" /></div>';
    html += '<div class="sc-filters">';
    html += filterBtn("lobby", sc.filterSign.lobby, { 1: "未签到", 2: "已签到", 3: "撤销签到" }, "营地签到");
    html += filterBtn("sex", sc.filterSign.sex, { 1: "男", 2: "女" }, "性别");
    html += filterBtn("type", sc.filterSign.type, { 1: "新训", 2: "复训" }, "学习资格");
    html += "</div>";
    if (!grouped.length) html += '<div class="sc-empty">暂无学员</div>';
    else {
      html += '<div class="sc-wrap"><div class="sc-groups">';
      grouped.forEach(function (g) {
        html += '<div class="sc-anchor" id="sc-' + g.letter + '">' + g.letter + "</div>";
        g.items.forEach(function (s) { html += signCard(s); });
      });
      html += '</div><div class="sc-letters">';
      grouped.forEach(function (g) {
        html += '<button type="button" data-sc="letter" data-letter="' + g.letter + '">' + g.letter + "</button>";
      });
      html += "</div></div>";
    }
    html += "</div>";
    if (sc.batchSign) {
      var allOn = eligible.length > 0 && eligible.every(function (s) { return sc.selected.indexOf(s.id) >= 0; });
      html += foot(allOn, sc.selected.length);
    }
    html += overlays("sign");
    return html;
  }

  function filterBtn(key, val, map, fallback) {
    var on = !!val;
    return '<button type="button" class="' + (on ? "is-on" : "") + '" data-sc="filter" data-key="' + key + '">' + (on ? map[val] : fallback) + "</button>";
  }

  function confirmPage() {
    var c = counts();
    var list = students.filter(matchConfirm);
    var eligible = list.filter(function (s) { return s.sign === 2 && s.confirm === 1; });
    var right = '<button type="button" class="sc-op" data-sc="batch"><i></i>' + (sc.batchConfirm ? "取消确认" : "确认人数") + "</button>";
    var html = bar("确认班级人数", right) + '<div class="body sc">' + feedDot();
    html += '<div class="sc-info"><h2>' + CAMP + '</h2><div class="sc-class">A1班</div></div>';
    html += '<div class="sc-cards"><h3>学员新复训情况</h3><div class="sc-pair"><div><span>新训学员</span><b>' + c.fresh + '人</b></div><div><span>复训学员</span><b>' + c.again + "人</b></div></div></div>";
    html += '<div class="sc-cards"><h3>学员酒店大堂签到</h3><div class="sc-pair"><div><span>已签到人数</span><b>' + c.signed + '人</b></div><div><span>未签到人数</span><b>' + c.unsigned + "人</b></div></div></div>";
    html += '<div class="sc-cards"><h3>学员班级确认情况</h3><div class="sc-pair"><div><span>已确认人数</span><b>' + c.confirmed + '人</b></div><div><span>未确认人数</span><b>' + c.unconfirmed + "人</b></div></div></div>";
    html += '<div class="sc-sec">学员签到情况（' + c.signed + "/" + c.total + "）</div>";
    html += '<div class="sc-filters">';
    html += filterBtn("lobby", sc.filterConfirm.lobby, { 1: "未签到", 2: "已签到", 3: "撤销签到" }, "大堂签到状况");
    html += filterBtn("klass", sc.filterConfirm.klass, { 1: "未确认", 2: "已确认" }, "班级确认情况");
    html += "</div>";
    if (!list.length) html += '<div class="sc-empty">暂无学员</div>';
    else {
      html += '<div class="sc-confirm-list">';
      list.forEach(function (s) { html += confirmCard(s); });
      html += "</div>";
    }
    html += "</div>";
    if (sc.batchConfirm) {
      var allOn = eligible.length > 0 && eligible.every(function (s) { return sc.selected.indexOf(s.id) >= 0; });
      html += foot(allOn, sc.selected.length);
    }
    html += overlays("confirm");
    return html;
  }

  function successPage() {
    var signOk = sc.success === 8;
    var title = signOk ? "签到成功" : "确认成功";
    var big = signOk ? "签到成功" : "班级人数确认成功";
    return bar(title) + '<div class="body"><div class="sc-success"><i>✓</i><b>' + big + '</b><button type="button" class="sc-home" data-go="pages/tabBar/work">返回首页</button></div></div>';
  }

  function sheetBtns(ok) {
    return '<div class="sc-sheet__btns"><button type="button" data-sc="sheet-no">重新检查</button><button type="button" class="is-ok" data-sc="' + ok + '">确认提交</button></div>';
  }

  function overlays(mode) {
    var html = "";
    if (sc.sheet === "filter") html += filterSheet(mode);
    if (sc.sheet === "camera") html += cameraSheet();
    if (sc.sheet === "batch") html += mode === "sign" ? batchSignSheet() : batchConfirmSheet();
    if (sc.sheet === "revoke") html += revokeSheet();
    if (sc.sheet === "detail") html += detailSheet();
    if (sc.err) html += '<div class="sc-mask is-center"><div class="sc-dialog"><p>' + esc(sc.err) + '</p><div class="sc-sheet__btns"><button type="button" class="is-ok" data-sc="err-ok">知道了</button></div></div></div>';
    return html;
  }

  function filterSheet(mode) {
    var key = sc.draftKey;
    var options = [];
    var title = "";
    if (key === "lobby") { title = mode === "sign" ? "选择营地签到" : "选择大堂签到状况"; options = [["全部", 0], ["未签到", 1], ["已签到", 2], ["撤销签到", 3]]; }
    if (key === "sex") { title = "选择性别"; options = [["全部", 0], ["男", 1], ["女", 2]]; }
    if (key === "type") { title = "选择学习资格"; options = [["全部", 0], ["新训", 1], ["复训", 2]]; }
    if (key === "klass") { title = "选择班级确认情况"; options = [["全部", 0], ["未确认", 1], ["已确认", 2]]; }
    var html = '<div class="sc-mask"><div class="sc-sheet"><h3>' + title + '</h3><div class="sc-picks">';
    options.forEach(function (opt) {
      html += '<button type="button" class="' + (sc.draft === opt[1] ? "is-on" : "") + '" data-sc="draft" data-val="' + opt[1] + '">' + opt[0] + "</button>";
    });
    html += '</div><div class="sc-sheet__btns"><button type="button" data-sc="sheet-no">取消</button><button type="button" class="is-ok" data-sc="filter-ok">确认</button></div></div></div>';
    return html;
  }

  function cameraSheet() {
    var s = byId(sc.targetId);
    return '<div class="sc-mask"><div class="sc-sheet"><h3>拍摄签到照片</h3><p>请为“' + esc(s ? s.name : "") + '”拍摄 1 张到达照片</p><div class="sc-photos">' + (sc.photos ? photos(1) : '<button type="button" class="sc-addph" data-sc="add-photo">+</button>') + '</div>' + sheetBtns("camera-ok") + "</div></div>";
  }

  function namesOf(ids) {
    var names = ids.map(function (id) { var s = byId(id); return s ? s.name : ""; }).filter(Boolean);
    var text = names.slice(0, 14).join("、");
    if (names.length > 20) text += "...";
    return text;
  }

  function batchSignSheet() {
    var html = '<div class="sc-mask"><div class="sc-sheet"><h3>确认签到</h3>';
    html += "<p>请确认“" + esc(namesOf(sc.selected)) + "”共<em>" + sc.selected.length + "</em>个学员是否已到达</p>";
    html += '<div class="sc-field"><label>反馈信息</label><textarea id="sc-remark" placeholder="选填">' + esc(sc.remark) + "</textarea></div>";
    html += '<div class="sc-field"><label>签到照片（最多3张）</label><div class="sc-photos">';
    html += photos(sc.photos);
    if (sc.photos < 3) html += '<button type="button" class="sc-addph" data-sc="add-photo">+</button>';
    html += "</div></div>" + sheetBtns("batch-ok") + "</div></div>";
    return html;
  }

  function batchConfirmSheet() {
    var html = '<div class="sc-mask"><div class="sc-sheet"><h3>确认签到</h3>';
    html += "<p>请确认“" + esc(namesOf(sc.selected)) + "”共<em>" + sc.selected.length + "</em>个学员是否已到达</p>";
    sc.selected.forEach(function (id) {
      var s = byId(id);
      if (!s) return;
      var log = s.logs[0] || {};
      html += '<div class="sc-person"><div class="who"><b class="sc-avatar">' + esc(s.name.slice(0, 1)) + "</b>" + esc(s.name) + '</div><div class="who"><span>签到照片</span>' + (log.photos ? photos(log.photos) : "<span>-</span>") + "</div></div>";
    });
    html += sheetBtns("confirm-ok") + "</div></div>";
    return html;
  }

  function revokeSheet() {
    var s = byId(sc.targetId);
    var html = '<div class="sc-mask is-center"><div class="sc-dialog"><div class="sc-reason"><button type="button" class="' + (sc.reason ? "is-on" : "") + '" data-sc="reason-toggle">' + esc(sc.reason || "选择撤销原因") + "</button>";
    if (sc.reasonOpen) {
      html += "<ul>";
      REASONS.forEach(function (name) {
        html += '<li><button type="button" class="' + (sc.reason === name ? "is-on" : "") + '" data-sc="reason" data-reason="' + esc(name) + '">' + esc(name) + "</button></li>";
      });
      html += "</ul>";
    }
    html += '</div><p style="margin-top:16px">确认撤销“' + esc(s ? s.name : "") + '”的已签到状态？</p>' + sheetBtns("revoke-ok") + "</div></div>";
    return html;
  }

  function detailSheet() {
    var s = byId(sc.targetId);
    if (!s) return "";
    var canUpload = s.logs[0] && s.logs[0].sign === 2 && s.confirm !== 2;
    var html = '<div class="sc-mask"><div class="sc-sheet sc-detail"><h3>签到情况</h3>';
    html += '<div class="who"><b class="sc-avatar">' + esc(s.name.slice(0, 1)) + "</b><div><b>" + esc(s.name) + "</b><div class=\"sc-sub\">" + esc(s.sex) + "｜" + s.age + "岁｜" + esc(s.city) + "</div></div></div>";
    s.logs.forEach(function (log) {
      html += '<div class="sc-log">签到情况：' + SIGN_TEXT[log.sign];
      if (log.sign === 3) html += "<br>撤销原因：" + esc(log.remark || "-");
      else html += "<br>签到人：" + esc(log.user || "-");
      html += "<br>" + (log.sign === 3 ? "操作时间" : "签到时间") + "：" + esc(log.time || "-");
      html += "<br>签到照片（最多3张）：" + (log.sign === 2 && log.photos ? "" : "-");
      if (log.sign === 2 && log.photos) html += photos(log.photos);
      if (log.sign === 2) html += "<br>反馈信息：" + esc(log.remark || "-");
      html += "</div>";
    });
    html += '<div class="sc-sheet__btns"><button type="button" data-sc="sheet-no">关闭</button>';
    if (canUpload) html += '<button type="button" class="is-ok" data-sc="upload-ok" style="flex:none;width:180px">确认上传</button>';
    html += "</div></div></div>";
    return html;
  }

  function travelNotes() {
    var html = '<div class="ex-anchor"><button type="button" class="ex-dot" data-note="41" title="需求 41"><span class="ex-num">1</span></button></div>' +
      '<div class="ex-anchor"><button type="button" class="ex-dot ex-dot--shift" data-note="58" title="需求 58"><span class="ex-num">2</span></button></div>';
    if (tv.type === 2) {
      html += '<div class="ex-anchor"><button type="button" class="ex-dot" data-note="10" title="需求 10"><span class="ex-num">3</span></button></div>';
    } else {
      html += '<div class="ex-anchor"><button type="button" class="ex-dot" data-note="arrive" title="迎接总表"><span class="ex-num">3</span></button></div>';
    }
    return html;
  }

  function travelList() {
    return travelers.filter(function (item) {
      if (!tv.kw) return true;
      return item.name.indexOf(tv.kw) >= 0 || item.flight.indexOf(tv.kw) >= 0;
    });
  }

  function writeTravel(person) {
    var signer = signerInfo();
    var slot = travelSlot(person);
    var rec = window.CC && window.CC.addCampRecord ? window.CC.addCampRecord({
      studentName: person.name,
      type: tv.type === 1 ? "sign" : "leave",
      subtype: tv.type === 1 ? "迎接" : "",
      remark: tv.remark || "",
      photos: tv.photos,
      signer: signer.name,
      mobile: signer.mobile,
      date: "2026-10-15",
      time: "15:04"
    }) : null;
    person[tv.type === 1 ? "welcome" : "farewell"] = {
      on: true,
      journalId: rec ? rec.id : "",
      photos: tv.photos,
      remark: tv.remark || "",
      time: "10-15 15:04",
      user: signer.name,
      mobile: signer.mobile
    };
    if (person.signStatus) person.signStatus[tv.type] = 2;
    return slot;
  }

  function travelCard(person) {
    var slot = travelSlot(person);
    var status = person.signStatus ? person.signStatus[tv.type] : (slot.on ? 2 : 1);
    var statusText = tv.type === 1 ? (status === 2 ? "已到达" : "未到达") : (status === 2 ? "已离开" : "未离开");
    var html = '<div class="sc-card"><div class="sc-top"><b class="sc-avatar">' + esc(person.name.slice(0, 1)) + '</b><div><div class="sc-name">' + esc(person.name);
    if (person.code) html += '<em class="sc-tag">' + esc(person.code) + "</em>";
    html += '<em class="sc-tag' + (status === 2 ? " is-on" : "") + '">' + statusText + "</em></div>";
    html += '<div class="sc-sub">' + (person.sex ? esc(person.sex) + "｜" + person.age + "岁" : "") + "</div>";
    if (tv.type === 1) {
      var arriveRow = arriveBySid(person.sid);
      var arriveName = arriveRow ? (ARRIVE_WAYS[arriveRow.way] || "未填写") : "未填写";
      html += '<div class="sc-meta"><span>入营方式：' + esc(arriveName) + "</span>";
      if (arriveRow && arriveRow.isEdited) html += '<span class="sc-edited">已修改</span>';
      html += "</div>";
      html += '<div class="sc-meta"><span>' + esc(person.place || "-") + "</span><span>到达时间：" + esc(person.arrive || "-") + "</span></div>";
      html += '<div class="sc-meta"><span>' + esc(person.flight || "-") + "</span></div>";
    } else {
      html += '<div class="sc-meta"><span>离营方式：<button type="button" class="sc-waylink" data-sc="way-open" data-id="' + person.id + '">' + esc(leaveWayOf(person)) + "</button></span>";
      if (syncedLeave(person)) html += '<span class="sc-edited">已修改</span>';
      html += "</div>";
      html += '<div class="sc-meta"><span>接离方式：' + esc(person.substitute ? SUBSTITUTE[person.substitute] : "-") + "</span></div>";
      html += '<div class="sc-meta"><span>' + esc(person.leavePlace || "-") + "</span><span>预计离营：" + esc(person.arrive || "-") + "</span></div>";
    }
    html += "</div></div>";
    if (!tv.batch && status !== 2) html += '<button type="button" class="sc-go" data-sc="travel-sign" data-id="' + person.id + '">' + (tv.type === 1 ? "去签到" : "去签离") + "</button>";
    if (!tv.batch && status === 2) html += '<button type="button" class="sc-undo" data-sc="travel-revoke" data-id="' + person.id + '">撤销</button>';
    if (tv.batch && status !== 2) html += '<button type="button" class="sc-all" data-sc="travel-pick" data-id="' + person.id + '">' + check(tv.selected.indexOf(person.id) >= 0, false) + "选择</button>";
    if (slot.on) html += '<div class="sc-signed"><p>' + (tv.type === 1 ? "签到时间" : "签离时间") + "：" + esc(slot.time || "-") + "</p><p>操作人：" + esc(slot.user || "林晓雯") + "</p><p>联系电话：" + esc(slot.mobile || "13800008801") + "</p><p>反馈信息：" + esc(slot.remark || "-") + "</p><p>签到照片：" + (slot.photos ? photos(slot.photos) : "-") + "</p></div>";
    html += "</div>";
    return html;
  }

  function travelForm() {
    var ids = tv.selected.length ? tv.selected : [tv.targetId];
    var names = ids.map(function (id) { var row = travelById(id); return row ? row.name : ""; }).filter(Boolean);
    var verb = tv.type === 1 ? "已到达" : "已离开";
    var html = '<div class="sc-mask"><div class="sc-sheet"><h3>确认' + (tv.type === 1 ? "签到" : "签离") + "</h3>";
    html += "<p>请确认“" + esc(names.slice(0, 20).join("、")) + "”共<em>" + names.length + "</em>个学员是否" + verb + "</p>";
    html += '<div class="sc-field"><label>反馈信息</label><textarea id="tv-remark" placeholder="选填">' + esc(tv.remark) + "</textarea></div>";
    html += '<div class="sc-field"><label>签到照片（最多3张）</label><div class="sc-photos">';
    html += photos(tv.photos);
    if (tv.photos < 3) html += '<button type="button" class="sc-addph" data-sc="travel-photo">+</button>';
    html += "</div></div>" + sheetBtns("travel-ok") + "</div></div>";
    return html;
  }

  function travelRevoke() {
    var person = travelById(tv.targetId);
    var place = person ? person.place : "";
    var verb = tv.type === 1 ? "已到达" : "已离开";
    var html = '<div class="sc-mask is-center"><div class="sc-dialog"><p>请确认是否需要撤销“' + esc(person ? person.name : "") + "”在“" + esc(place) + "”的“" + verb + "”状态</p>";
    html += sheetBtns("travel-revoke-ok") + "</div></div>";
    return html;
  }

  function travelPage() {
    if (tv.summary) return summaryPage();
    var list = travelList();
    var signed = travelers.filter(function (item) {
      var st = item.signStatus ? item.signStatus[tv.type] : (travelSlot(item).on ? 2 : 1);
      return st === 2;
    }).length;
    var right = '<button type="button" class="sc-op" data-sc="travel-summary"><i></i>总表</button><button type="button" class="sc-op" data-sc="travel-batch"><i></i>' + (tv.batch ? "取消批量" : "批量处理") + "</button>";    var html = bar("签到管理", right) + '<div class="body sc">' + travelNotes();
    var wayTitle = tv.type === 1 ? "迎接方式：机场接送 广州白云机场T1航站楼" : "欢送方式：机场接离 广州白云机场T1航站楼";
    html += '<div class="sc-info"><h2>' + esc(wayTitle) + '</h2><div class="sc-class">' + CAMP + "</div>";
    html += '<div class="sc-stats"><div class="item"><strong>' + travelers.length + '</strong><span>人数</span></div>';
    html += '<div class="item"><strong>' + signed + '</strong><span>' + (tv.type === 1 ? "已签到人数" : "已签离人数") + '</span></div>';
    html += '<div class="item"><strong>' + (travelers.length - signed) + "</strong><span>" + (tv.type === 1 ? "未签到人数" : "未签离人数") + "</span></div></div></div>";
    html += '<div class="sc-search"><input id="tv-kw" placeholder="搜索学员姓名/航班号/班次" value="' + esc(tv.kw) + '" /></div>';
    html += '<div class="sc-sec">' + (tv.type === 1 ? "签到情况" : "签离情况") + "（" + signed + "/" + travelers.length + "）</div>";
    if (!list.length) html += '<div class="sc-empty">暂无学员</div>';
    else list.forEach(function (item) { html += travelCard(item); });
    html += "</div>";
    if (tv.batch) {
      var waiting = list.filter(function (item) {
        var st = item.signStatus ? item.signStatus[tv.type] : (travelSlot(item).on ? 2 : 1);
        return st !== 2;
      });
      var allOn = waiting.length > 0 && waiting.every(function (item) { return tv.selected.indexOf(item.id) >= 0; });
      html += '<div class="sc-foot"><button type="button" class="sc-all" data-sc="travel-all">' + check(allOn, false) + '全选</button><button type="button" class="sc-submit" data-sc="travel-open">已选' + tv.selected.length + "名，确认" + (tv.type === 1 ? "签到" : "签离") + "</button></div>";
    }
    if (tv.sheet === "form") html += travelForm();
    if (tv.sheet === "revoke") html += travelRevoke();
    if (tv.wayOpen) {
      var picked = travelById(tv.wayOpen);
      if (picked) html += leavePopup(picked);
    }
    return html;
  }

  function render(path) {
    if (path === SIGN) return signPage();
    if (path === CONFIRM) return confirmPage();
    if (path === TRAVEL) return travelPage();
    return successPage();
  }

  function readKw() {
    var el = document.getElementById("sc-kw");
    if (el) sc.kw = el.value.trim();
    var remark = document.getElementById("sc-remark");
    if (remark) sc.remark = remark.value;
    var travelKw = document.getElementById("tv-kw");
    if (travelKw) tv.kw = travelKw.value.trim();
    var sumKw = document.getElementById("tv-sum-kw");
    if (sumKw) tv.summaryKw = sumKw.value.trim();
    var travelRemark = document.getElementById("tv-remark");
    if (travelRemark) tv.remark = travelRemark.value;
  }

  function eligibleIds(mode) {
    var list = students.filter(mode === "sign" ? matchSign : matchConfirm);
    return list.filter(function (s) {
      return mode === "sign" ? s.sign !== 2 : s.sign === 2 && s.confirm === 1;
    }).map(function (s) { return s.id; });
  }

  function signerInfo() {
    return window.CC && window.CC.signer ? window.CC.signer() : { name: "林晓雯", mobile: "13800008801" };
  }

  function markSigned(s, photoCount, remark) {
    var signer = signerInfo();
    var rec = window.CC && window.CC.addCampRecord ? window.CC.addCampRecord({
      studentName: s.name,
      type: "sign",
      subtype: "大堂签到",
      remark: remark || "",
      photos: photoCount,
      signer: signer.name,
      mobile: signer.mobile,
      date: "2026-10-15",
      time: "15:04"
    }) : null;
    s.sign = 2;
    s.logs.unshift({ sign: 2, user: signer.name, mobile: signer.mobile, time: "10-15 15:04", photos: photoCount, remark: remark || "", journalId: rec ? rec.id : "" });
  }

  function handle(el, api) {
    var act = el.getAttribute("data-sc");
    if (!act) return false;
    readKw();
    var mode = api.path() === CONFIRM ? "confirm" : api.path() === TRAVEL ? "travel" : "sign";
    var id = el.getAttribute("data-id");

    if (act === "travel-batch") { tv.batch = !tv.batch; tv.selected = []; tv.sheet = ""; api.render(); return true; }
    if (act === "travel-summary") { tv.summary = true; tv.summaryBase = -1; tv.summaryWay = -1; tv.summaryKw = ""; api.render(); return true; }
    if (act === "summary-back") { tv.summary = false; api.render(); return true; }
    if (act === "summary-base") {
      var idx = Number(el.getAttribute("data-idx"));
      tv.summaryBase = tv.summaryBase === idx ? -1 : idx;
      api.render();
      return true;
    }
    if (act === "summary-all") { tv.summaryBase = -1; api.render(); return true; }
    if (act === "summary-way") {
      var wayIdx = Number(el.getAttribute("data-idx"));
      tv.summaryWay = tv.summaryWay === wayIdx ? -1 : wayIdx;
      api.render();
      return true;
    }
    if (act === "summary-search") {
      var sumInput = document.getElementById("tv-sum-kw");
      tv.summaryKw = sumInput ? sumInput.value.trim() : "";
      api.render();
      return true;
    }
    if (act === "summary-edit") {
      tv.summaryEdit = el.getAttribute("data-sid");
      if (tv.type === 1) {
        var arriveRow = arriveBySid(tv.summaryEdit);
        if (arriveRow) openArriveDraft(arriveRow);
      }
      api.render();
      return true;
    }
    if (act === "summary-edit-cancel") { tv.summaryEdit = ""; tv.arriveDraft = null; api.render(); return true; }
    if (act === "summary-pick-way") {
      if (tv.type === 1 && tv.arriveDraft) {
        readArriveDraft();
        tv.arriveDraft.way = Number(el.getAttribute("data-v"));
        clearArriveDraftForWay(tv.arriveDraft.way);
        api.render();
        return true;
      }
      var sheet = el.closest(".sm-sheet");
      if (sheet) sheet.querySelectorAll(".sm-way").forEach(function (b) { b.classList.remove("is-on"); });
      el.classList.add("is-on");
      return true;
    }
    if (act === "summary-alone" && tv.arriveDraft) {
      readArriveDraft();
      tv.arriveDraft.unaccompanied = el.getAttribute("data-v") === "1";
      api.render();
      return true;
    }
    if (act === "summary-save") { appSaveSummaryEdit(el.getAttribute("data-sid")); return true; }
    if (act === "way-open") { tv.wayOpen = id; api.render(); return true; }
    if (act === "way-close") { tv.wayOpen = ""; api.render(); return true; }
    if (act === "travel-pick") {
      var picked = tv.selected.indexOf(id);
      if (picked >= 0) tv.selected.splice(picked, 1);
      else tv.selected.push(id);
      api.render();
      return true;
    }
    if (act === "travel-all") {
      var waiting = travelList().filter(function (item) {
        var st = item.signStatus ? item.signStatus[tv.type] : (travelSlot(item).on ? 2 : 1);
        return st !== 2;
      }).map(function (item) { return item.id; });
      var allOn = waiting.length > 0 && waiting.every(function (sid) { return tv.selected.indexOf(sid) >= 0; });
      tv.selected = allOn ? [] : waiting.slice();
      api.render();
      return true;
    }
    if (act === "travel-sign") {
      tv.targetId = id;
      tv.selected = [id];
      tv.photos = 0;
      tv.remark = "";
      tv.sheet = "form";
      api.render();
      return true;
    }
    if (act === "travel-open") {
      if (!tv.selected.length) { api.toast("请选择学员"); return true; }
      tv.photos = 0;
      tv.remark = "";
      tv.sheet = "form";
      api.render();
      return true;
    }
    if (act === "travel-photo") {
      if (tv.photos < 3) tv.photos += 1;
      api.render();
      return true;
    }
    if (act === "travel-ok") {
      var ids = tv.selected.length ? tv.selected.slice() : [tv.targetId];
      ids.forEach(function (sid) {
        var person = travelById(sid);
        if (person && !travelSlot(person).on) writeTravel(person);
      });
      tv.sheet = "";
      tv.batch = false;
      tv.selected = [];
      sc.success = 8;
      api.go(SUCCESS);
      return true;
    }    if (act === "travel-revoke") {
      tv.targetId = id;
      tv.reason = "";
      tv.reasonOpen = false;
      tv.sheet = "revoke";
      api.render();
      return true;
    }
    if (act === "tv-reason-toggle") { tv.reasonOpen = !tv.reasonOpen; api.render(); return true; }
    if (act === "tv-reason") { tv.reason = el.getAttribute("data-reason"); tv.reasonOpen = false; api.render(); return true; }
    if (act === "travel-revoke-ok") {
      var target = travelById(tv.targetId);
      var slot = target ? travelSlot(target) : null;
      if (slot && slot.journalId && window.CC && window.CC.removeCampRecord) window.CC.removeCampRecord(slot.journalId);
      if (target) {
        target[tv.type === 1 ? "welcome" : "farewell"] = { on: false };
        if (target.signStatus) target.signStatus[tv.type] = 1;
      }
      tv.sheet = "";
      api.toast("撤销成功");
      return true;
    }
    if (mode === "travel" && act === "sheet-no") { tv.sheet = ""; tv.reasonOpen = false; api.render(); return true; }

    if (act === "batch") {
      sc.selected = [];
      sc.sheet = "";
      if (mode === "sign") sc.batchSign = !sc.batchSign;
      else sc.batchConfirm = !sc.batchConfirm;
      api.render();
      return true;
    }
    if (act === "filter") {
      sc.draftKey = el.getAttribute("data-key");
      sc.draft = mode === "sign" ? sc.filterSign[sc.draftKey] : sc.filterConfirm[sc.draftKey];
      sc.sheet = "filter";
      api.render();
      return true;
    }
    if (act === "draft") { sc.draft = Number(el.getAttribute("data-val")); api.render(); return true; }
    if (act === "filter-ok") {
      if (mode === "sign") sc.filterSign[sc.draftKey] = sc.draft;
      else sc.filterConfirm[sc.draftKey] = sc.draft;
      sc.selected = [];
      sc.sheet = "";
      api.render();
      return true;
    }
    if (act === "sheet-no") { sc.sheet = ""; sc.reasonOpen = false; api.render(); return true; }
    if (act === "letter") {
      api.render();
      var node = document.getElementById("sc-" + el.getAttribute("data-letter"));
      if (node) node.scrollIntoView({ block: "start" });
      return true;
    }
    if (act === "student") {
      var stu = byId(id);
      if (!stu) return true;
      if (mode === "sign" && sc.batchSign) {
        if (stu.sign === 2) return true;
        var at = sc.selected.indexOf(id);
        if (at >= 0) sc.selected.splice(at, 1);
        else sc.selected.push(id);
        api.render();
        return true;
      }
      if (mode === "confirm" && sc.batchConfirm) {
        if (!(stu.sign === 2 && stu.confirm === 1)) return true;
        var pos = sc.selected.indexOf(id);
        if (pos >= 0) sc.selected.splice(pos, 1);
        else sc.selected.push(id);
        api.render();
        return true;
      }
      if (mode === "sign") {
        sc.targetId = id;
        sc.sheet = "detail";
        api.render();
      }
      return true;
    }
    if (act === "sign") {
      sc.targetId = id;
      sc.photos = 0;
      sc.sheet = "camera";
      api.render();
      return true;
    }
    if (act === "add-photo") {
      if (sc.sheet === "camera") sc.photos = 1;
      else if (sc.photos < 3) sc.photos += 1;
      api.render();
      return true;
    }
    if (act === "camera-ok") {
      if (!sc.photos) { api.toast("请上传签到图片"); return true; }
      markSigned(byId(sc.targetId), 1, "");
      sc.sheet = "";
      sc.batchSign = false;
      sc.selected = [];
      sc.success = 8;
      api.go(SUCCESS);
      return true;
    }
    if (act === "revoke") {
      sc.targetId = id;
      sc.reason = "";
      sc.reasonOpen = false;
      sc.sheet = "revoke";
      api.render();
      return true;
    }
    if (act === "reason-toggle") { sc.reasonOpen = !sc.reasonOpen; api.render(); return true; }
    if (act === "reason") { sc.reason = el.getAttribute("data-reason"); sc.reasonOpen = false; api.render(); return true; }
    if (act === "revoke-ok") {
      if (!sc.reason) { api.toast("请选择撤销原因"); return true; }
      var person = byId(sc.targetId);
      var signed = person.logs.filter(function (log) { return log.sign === 2 && log.journalId; })[0];
      if (signed && window.CC && window.CC.removeCampRecord) window.CC.removeCampRecord(signed.journalId);
      person.sign = 3;
      person.logs.unshift({ sign: 3, remark: sc.reason, time: "刚刚" });
      sc.sheet = "";
      api.toast("撤销成功");
      return true;
    }
    if (act === "all") {
      var ids = eligibleIds(mode);
      var allOn = ids.length > 0 && ids.every(function (sid) { return sc.selected.indexOf(sid) >= 0; });
      sc.selected = allOn ? [] : ids.slice();
      api.render();
      return true;
    }
    if (act === "batch-open") {
      if (!sc.selected.length) { api.toast("请选择学员"); return true; }
      sc.photos = 0;
      sc.remark = "";
      sc.sheet = "batch";
      api.render();
      return true;
    }
    if (act === "batch-ok") {
      if (!sc.photos) { api.toast("请上传签到图片"); return true; }
      sc.selected.forEach(function (sid) { markSigned(byId(sid), sc.photos, sc.remark); });
      sc.sheet = "";
      sc.batchSign = false;
      sc.selected = [];
      sc.success = 8;
      api.go(SUCCESS);
      return true;
    }
    if (act === "confirm-ok") {
      var blocked = sc.selected.filter(function (sid) {
        var row = byId(sid);
        return row && row.name === "周宁";
      });
      if (blocked.length) {
        sc.err = "周宁缺少签到照片，无法确认班级人数";
        api.render();
        return true;
      }
      sc.selected.forEach(function (sid) {
        var row = byId(sid);
        row.confirm = 2;
        var lobby = row.logs.filter(function (log) { return log.sign === 2; })[0] || {};
        if (window.CC && window.CC.addCampRecord) {
          window.CC.addCampRecord({
            studentName: row.name,
            type: "sign",
            subtype: "班级确认",
            remark: "",
            photos: lobby.photos || 0,
            signer: lobby.user || signerInfo().name,
            mobile: lobby.mobile || signerInfo().mobile,
            date: "2026-10-15",
            time: "15:04"
          });
        }
      });
      sc.sheet = "";
      sc.batchConfirm = false;
      sc.selected = [];
      sc.success = 6;
      api.go(SUCCESS);
      return true;
    }
    if (act === "upload-ok") {
      var current = byId(sc.targetId);
      if (!current.logs[0].photos) { api.toast("请上传签到图片"); return true; }
      sc.sheet = "";
      api.toast("修改成功");
      return true;
    }
    if (act === "err-ok") { sc.err = ""; api.render(); return true; }
    return false;
  }

  window.SC = {
    has: has,
    render: render,
    handle: handle,
    setTravel: function (type) {
      tv.type = Number(type) === 2 ? 2 : 1;
      tv.batch = false;
      tv.selected = [];
      tv.sheet = "";
      tv.kw = "";
      tv.summary = false;
      tv.wayOpen = "";
      tv.summaryEdit = "";
      tv.arriveDraft = null;
    }
  };

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" || !e.target || !window.APP) return;
    if (e.target.id === "sc-kw") {
      sc.kw = e.target.value.trim();
      sc.selected = [];
      window.APP.render();
      return;
    }
    if (e.target.id === "tv-sum-kw") {
      tv.summaryKw = e.target.value.trim();
      window.APP.render();
    }
  });

  document.addEventListener("change", function (e) {
    if (!tv.arriveDraft || !e.target || e.target.id !== "sm-place" || !window.APP) return;
    readArriveDraft();
    window.APP.render();
  });

  document.addEventListener("click", function (e) {
    if (!e.target || !e.target.classList || !e.target.classList.contains("sm-sheet-mask") || !window.APP) return;
    tv.summaryEdit = "";
    tv.arriveDraft = null;
    window.APP.render();
  });
})();
