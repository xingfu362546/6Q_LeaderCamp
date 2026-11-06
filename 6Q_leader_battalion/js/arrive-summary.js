/**
 * 迎接总表（后台）。菜单挂在 领袖营薪酬板块 → 领袖营数据 → 迎接总表。
 *
 * 能打开这个菜单就能改未到达学员的入营方式。页面不判断副负责人，
 * 菜单权限由系统角色决定。已到达不能改。不走助教提交，也没有审批。
 * 字段与后台入营抽屉、APP 迎接总表一致。改完写入 lb-arrive-summary-v1，
 * 和 APP 同一份名单。
 *
 * 数据源：conference/camps/member/travel/list，type=1。
 * travelWay：1 机场接送、2 火车站接送、3 大巴接送、4 自行入营、5 连营。
 * 列表首屏不给进度环。
 */
(function () {
  "use strict";

  /* 入营方式。第 4 项按源码是「自行入营」。 */
  var WAYS = [
    { way: 1, label: "机场接送", short: "机场", cls: "air" },
    { way: 2, label: "火车站接送", short: "车站", cls: "station" },
    { way: 3, label: "大巴接送", short: "大巴", cls: "bus" },
    { way: 4, label: "自行入营", short: "自行", cls: "self" },
    { way: 5, label: "连营", short: "连营", cls: "join" },
    { way: 0, label: "未填写", short: "未填", cls: "none" }
  ];

  var PLANS = [
    { id: "p1", plan: "2026年暑假领袖营【华东基地】", week: "第六周", base: "华东基地" },
    { id: "p2", plan: "2026年暑假领袖营【广东基地A】", week: "第一周", base: "广东基地A" },
    { id: "p3", plan: "2027年寒假领袖营【广东基地】", week: "第一周", base: "广东基地" },
    { id: "p4", plan: "2026年暑假领袖营【南宁基地】", week: "第三周", base: "南宁基地" }
  ];

  /* 名单与「迎接欢送 → 入营」同源。
     arrive 按问卷交通工具：机场=落地、火车=到站、大巴=到达。
     自行入营、连营不适用航班车次。 */
  var ROSTER = [
    { id: "A10281", plan: "p1", name: "王小满", klass: "A1班", team: "1组", age: 12, city: "广州天河", way: 1, place: "广州白云机场T1航站楼", flight: "CZ3101", arrive: "10-14 16:20", remark: "需提前 2 小时到机场", teacher: "林晓雯", status: "已到达", verify: 2 },
    { id: "A10282", plan: "p1", name: "李可", klass: "A1班", team: "2组", age: 11, city: "深圳南山", way: 2, place: "广州南站", flight: "G1002", arrive: "10-16 09:35", remark: "", teacher: "林晓雯", status: "已到达", verify: 2 },
    { id: "A10284", plan: "p1", name: "赵欣然", klass: "A2班", team: "1组", age: 13, city: "杭州临平", way: 3, place: "广州南站", flight: "南站大巴", arrive: "10-16 13:00", remark: "随大巴统一下车", teacher: "苏晚", status: "已到达", verify: 1 },
    { id: "A10283", plan: "p1", name: "孙悦", klass: "A2班", team: "2组", age: 10, city: "东莞南城", way: 4, place: "", flight: "—", arrive: "10-15 09:10", remark: "自行到营地", teacher: "", status: "未到达", verify: 1 },
    { id: "A10285", plan: "p1", name: "陈启航", klass: "A1班", team: "1组", age: 12, city: "佛山南海", way: 0, place: "未填写", flight: "—", arrive: "", remark: "", teacher: "", status: "未到达", verify: 1 },
    { id: "A10288", plan: "p1", name: "郑一诺", klass: "A1班", team: "1组", age: 11, city: "广州越秀", way: 5, place: "连营", flight: "—", arrive: "—", remark: "连营到第七周", teacher: "", status: "已到达", verify: 2 },
    { id: "B20101", plan: "p2", name: "林小满", klass: "B1班", team: "1组", age: 12, city: "深圳福田", way: 1, place: "深圳宝安机场T3航站楼", flight: "ZH9802", arrive: "10-18 15:10", remark: "", teacher: "林晓雯", status: "已到达", verify: 2 },
    { id: "B20102", plan: "p2", name: "何晓波", klass: "B1班", team: "2组", age: 10, city: "南宁青秀", way: 2, place: "广州南站", flight: "G6021", arrive: "10-18 16:40", remark: "", teacher: "林晓雯", status: "已到达", verify: 2 },
    { id: "B20103", plan: "p2", name: "安宇静", klass: "B2班", team: "1组", age: 10, city: "南宁兴宁", way: 3, place: "深圳北站", flight: "大巴1号", arrive: "10-19 09:22", remark: "晕车，安排前排", teacher: "苏晚", status: "未到达", verify: 1 },
    { id: "B20106", plan: "p2", name: "苏晚", klass: "B2班", team: "2组", age: 11, city: "东莞东城", way: 0, place: "未填写", flight: "—", arrive: "", remark: "", teacher: "", status: "未到达", verify: 1 },
    { id: "C30101", plan: "p3", name: "许宁", klass: "C1班", team: "1组", age: 11, city: "广州番禺", way: 1, place: "广州白云机场T2航站楼", flight: "CA1301", arrive: "10-18 10:02", remark: "", teacher: "林晓雯", status: "未到达", verify: 1 },
    { id: "C30102", plan: "p3", name: "何倩", klass: "C1班", team: "2组", age: 12, city: "中山石岐", way: 2, place: "广州南站", flight: "G1010", arrive: "10-19 11:31", remark: "", teacher: "苏晚", status: "未到达", verify: 1 },
    { id: "C30104", plan: "p3", name: "钱柏", klass: "C2班", team: "1组", age: 11, city: "珠海香洲", way: 5, place: "连营", flight: "—", arrive: "—", remark: "", teacher: "", status: "已到达", verify: 2 },
    { id: "D40101", plan: "p4", name: "韩朔", klass: "D1班", team: "1组", age: 12, city: "南宁西乡塘", way: 1, place: "南宁吴圩机场T2航站楼", flight: "CZ6301", arrive: "10-18 14:26", remark: "", teacher: "林晓雯", status: "未到达", verify: 1 },
    { id: "D40102", plan: "p4", name: "沈予", klass: "D1班", team: "2组", age: 11, city: "柳州城中", way: 2, place: "南宁东站", flight: "G4201", arrive: "10-19 17:03", remark: "", teacher: "苏晚", status: "已到达", verify: 2 },
    { id: "D40104", plan: "p4", name: "赵岚", klass: "D2班", team: "2组", age: 12, city: "桂林象山", way: 4, place: "", flight: "—", arrive: "10-20 08:30", remark: "自行到营地", teacher: "", status: "未到达", verify: 1 }
  ];

  var PLACES = {
    1: ["广州白云机场T1航站楼", "广州白云机场T2航站楼", "深圳宝安机场T3航站楼", "南宁吴圩机场T2航站楼"],
    2: ["广州南站", "广州东站", "深圳北站", "南宁东站"],
    3: ["广州总部大巴起点", "中山大巴起点"]
  };
  var TEACHERS = ["林晓雯", "苏晚"];
  var state = { plan: "", way: -1, kw: "", detail: "", edit: "", draft: null, revisions: "" };
  var REVKEY = "lb-arrive-revisions-v1";
  var REVSEED = {
    C30101: [
      { at: "2026-10-17 18:20", kind: "backend", operator: "余炜烽", action: "直接修改", text: "入营方式由「未填写」改为「机场接送」。航站楼：广州白云机场T2航站楼 · CA1301。数据已写入。" }
    ]
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function wayMeta(way) {
    return WAYS.filter(function (m) { return m.way === way; })[0] || WAYS[5];
  }

  function shortPlan(planId) {
    var p = PLANS.filter(function (x) { return x.id === planId; })[0];
    return p ? p.base : "—";
  }

  function countBy(rows, way) {
    return rows.filter(function (r) { return r.way === way; }).length;
  }

  /* APP 副负责人改过的行。后台只读合并进来，本页不提供修改按钮。 */
  function liveRows() {
    var rows = ROSTER.map(function (r) {
      return {
        id: r.id, plan: r.plan, name: r.name, klass: r.klass, team: r.team, age: r.age, city: r.city,
        way: r.way, place: r.place, flight: r.flight, depart: r.depart || "", arrive: r.arrive,
        remark: r.remark, teacher: r.teacher, unaccompanied: !!r.unaccompanied, status: r.status, verify: r.verify
      };
    });
    try {
      JSON.parse(sessionStorage.getItem("lb-arrive-summary-v1") || "[]").forEach(function (edit) {
        var hit = rows.filter(function (r) { return r.id === edit.id; })[0];
        if (!hit) return;
        hit.way = edit.way;
        hit.place = edit.place || "";
        hit.flight = edit.flight || "—";
        hit.depart = edit.depart || "";
        hit.arrive = edit.arrive || "";
        hit.teacher = edit.teacher || "";
        hit.unaccompanied = !!edit.unaccompanied;
        hit.beforeWay = edit.beforeWay;
        hit.isEdited = true;
        hit.editedAt = edit.editedAt || "";
        hit.editedBy = edit.editedBy || "";
        hit.updated = edit.updated || "";
      });
    } catch (e) {}
    return rows;
  }

  function filtered(rows) {
    return rows.filter(function (r) {
      if (state.plan && r.plan !== state.plan) return false;
      if (state.way >= 0 && r.way !== state.way) return false;
      if (state.kw) {
        var hay = r.name + r.id + r.place + r.flight + r.klass + r.team;
        if (hay.indexOf(state.kw) < 0) return false;
      }
      return true;
    });
  }

  /* 各方式分布条 */
  function bar(rows) {
    var total = rows.length || 1;
    var html = '<div class="as-bar">';
    WAYS.forEach(function (m) {
      var n = countBy(rows, m.way);
      if (!n) return;
      html += '<i class="as-bar__seg as-bar__seg--' + m.cls + '" style="flex:' + n + '" title="' + esc(m.label) + " " + n + ' 人"></i>';
    });
    return html + "</div>";
  }

  function chips(rows, withZero) {
    var html = '<div class="as-chips">';
    WAYS.forEach(function (m) {
      var n = countBy(rows, m.way);
      if (!n && !withZero) return;
      html += '<span class="as-chip as-chip--' + m.cls + '"><i></i>' + esc(m.short) + "<b>" + n + "</b></span>";
    });
    return html + "</div>";
  }

  /* 首屏头部：只给人数与分布，不给进度环（本页已确认不要环）。 */
  function hero(rows) {
    var arrived = rows.filter(function (r) { return r.status === "已到达"; }).length;
    var none = countBy(rows, 0);
    var html = '<section class="as-hero"><div class="as-hero__top"><div>';
    html += '<p class="as-hero__eye">' + (state.plan ? "单基地视图" : "全部基地") + "</p>";
    html += "<h2>" + esc(state.plan ? PLANS.filter(function (p) { return p.id === state.plan; })[0].base : "迎接总览") + "</h2>";
    html += '<p class="as-hero__sub">应到达 <b>' + rows.length + "</b> 人 · 已确认到达 <b>" + arrived + "</b> 人" +
      (none ? ' · <button type="button" class="as-inline-link" data-as="way" data-v="0">未填写入营方式 ' + none + " 人</button>" : "") +
      "</p></div>";
    html += '<span class="as-readonly">未到达可改</span></div>';
    html += bar(rows) + chips(rows, true) + "</section>";
    return html;
  }

  function planSwitch(rows) {
    var html = '<div class="as-planswitch">';
    html += '<button type="button" class="as-planswitch__item' + (state.plan === "" ? " is-on" : "") + '" data-as="plan" data-v=""><b>全部</b><em>' + rows.length + "</em></button>";
    PLANS.forEach(function (p) {
      var sub = rows.filter(function (r) { return r.plan === p.id; });
      html += '<button type="button" class="as-planswitch__item' + (state.plan === p.id ? " is-on" : "") + '" data-as="plan" data-v="' + p.id + '">';
      html += "<b>" + esc(p.base) + "</b><em>" + sub.length + "</em></button>";
    });
    html += "</div>";
    return html;
  }

  function table(rows) {
    var html = '<div class="as-tablewrap"><table class="as-table"><thead><tr>';
    html += "<th>学员</th><th>学员ID</th><th>班级 / 小组</th><th>年龄</th><th>居住城市</th><th>基地</th><th>入营方式</th><th>站点 / 班次</th><th>到达时间</th><th>带队老师</th><th>问卷备注</th><th>对接状态</th><th>操作</th>";
    html += "</tr></thead><tbody>";
    if (!rows.length) html += '<tr><td colspan="13" class="as-table__empty">没有符合条件的学员</td></tr>';
    rows.forEach(function (r) {
      var m = wayMeta(r.way);
      var arrived = r.status === "已到达";
      html += '<tr class="as-row as-row--' + m.cls + '">';
      html += '<td class="as-cell-name"><b>' + esc(r.name) + "</b>" + (r.isEdited ? '<span class="as-edited">已修改</span>' : "") + "</td>";
      html += "<td>" + esc(r.id) + "</td>";
      html += "<td>" + esc(r.klass) + (r.team ? " / " + esc(r.team) : "") + "</td>";
      html += "<td>" + esc(r.age || "-") + "</td>";
      html += "<td>" + esc(r.city || "-") + "</td>";
      html += "<td>" + esc(shortPlan(r.plan)) + "</td>";
      html += '<td><span class="as-waytag as-waytag--' + m.cls + '"><i></i>' + esc(m.short) + "</span></td>";
      html += "<td>" + (r.place && r.place !== "未填写" ? esc(r.place) : "-") + (r.flight && r.flight !== "—" ? ' <em class="as-flight">' + esc(r.flight) + "</em>" : "") + "</td>";
      html += "<td>" + (r.arrive && r.arrive !== "—" ? esc(r.arrive) : "-") + "</td>";
      html += "<td>" + (r.teacher ? esc(r.teacher) : "-") + "</td>";
      html += '<td class="as-cell-remark">' + (r.remark ? esc(r.remark) : "-") + "</td>";
      html += '<td><span class="as-state' + (arrived ? " is-done" : "") + '">' + esc(r.status) + "</span></td>";
      html += '<td class="as-cell-ops"><button type="button" class="as-mini" data-as="detail" data-id="' + esc(r.id) + '">详情</button>';
      html += '<button type="button" class="as-mini" data-as="revs" data-id="' + esc(r.id) + '">修正记录' + (revsOf(r.id).length ? "<em>" + revsOf(r.id).length + "</em>" : "") + "</button>";
      if (!arrived) html += '<button type="button" class="as-mini as-mini--primary" data-as="edit" data-id="' + esc(r.id) + '">修改</button>';
      html += "</td>";
      html += "</tr>";
    });
    html += "</tbody></table></div>";
    return html;
  }

  function detailSheet(r) {
    var m = wayMeta(r.way);
    var rows = [
      ["入营方式", m.label],
      ["站点 / 目的地", r.place || "-"],
      ["航班号 / 班次", r.flight || "-"],
      ["出发时间", r.depart || "-"],
      ["抵达时间", r.arrive || "-"],
      ["带队老师", r.teacher || "-"],
      ["是否无人陪伴", r.way === 1 ? (r.unaccompanied ? "是" : "否") : "-"],
      ["班级 / 小组", r.klass + " / " + r.team],
      ["年龄", String(r.age || "-")],
      ["居住城市", r.city || "-"],
      ["所属基地", shortPlan(r.plan)],
      ["问卷备注", r.remark || "-"],
      ["对接状态", r.status],
      ["核销状态", r.verify === 2 ? "已核销" : "未核销"]
    ];
    if (r.isEdited) rows.push(["本次调整", "由「" + wayMeta(r.beforeWay).label + "」改为「" + m.label + "」 · " + (r.editedAt || "-") + " · " + (r.editedBy || "-")]);
    var html = '<div class="as-mask" data-as="close"><div class="as-sheet"><h3>入营详情 · ' + esc(r.name) + "</h3>";
    html += '<div class="as-detail">';
    rows.forEach(function (pair) {
      html += '<div class="as-detail__row"><span>' + esc(pair[0]) + "</span><b>" + esc(pair[1]) + "</b></div>";
    });
    html += "</div>";
    html += '<p class="as-tip">已到达的学员不能改。未到达可以改，保存后立即生效，不走助教审批。</p>';
    html += '<div class="as-sheet__ops">';
    if (r.status !== "已到达") html += '<button type="button" class="as-btn" data-as="edit" data-id="' + esc(r.id) + '">修改入营方式</button>';
    html += '<button type="button" class="as-btn as-btn--primary" data-as="close">关闭</button></div>';
    html += "</div></div>";
    return html;
  }

  function loadRevs() {
    try {
      var saved = JSON.parse(sessionStorage.getItem(REVKEY) || "null");
      if (saved) return saved;
    } catch (e) {}
    return null;
  }

  function revsOf(sid) {
    var map = loadRevs() || REVSEED;
    return (map[sid] || []).slice();
  }

  function pushRev(sid, entry) {
    var map = loadRevs() || JSON.parse(JSON.stringify(REVSEED));
    map[sid] = map[sid] || [];
    map[sid].unshift(entry);
    try { sessionStorage.setItem(REVKEY, JSON.stringify(map)); } catch (e) {}
  }

  function nowText() {
    var d = new Date();
    var p = function (n) { return ("0" + n).slice(-2); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }

  function openDraft(r) {
    state.draft = {
      way: r.way || 1,
      place: r.place && r.place !== "未填写" && r.place !== "连营" ? r.place : "",
      flight: r.flight && r.flight !== "—" ? r.flight : "",
      depart: r.depart || "",
      arrive: r.arrive && r.arrive !== "—" ? r.arrive : "",
      teacher: r.teacher || "",
      unaccompanied: !!r.unaccompanied
    };
  }

  function readDraft() {
    var d = state.draft;
    if (!d) return null;
    var place = document.getElementById("as-place");
    var flight = document.getElementById("as-flight");
    var depart = document.getElementById("as-depart");
    var arrive = document.getElementById("as-arrive");
    var teacher = document.getElementById("as-teacher");
    if (place) d.place = place.value;
    if (flight) d.flight = flight.value.trim();
    if (depart) d.depart = depart.value.trim();
    if (arrive) d.arrive = arrive.value.trim();
    if (teacher) d.teacher = teacher.value;
    return d;
  }

  function clearDraftForWay(way) {
    var d = state.draft;
    if (!d) return;
    var places = PLACES[way] || [];
    if (places.indexOf(d.place) < 0) d.place = "";
    if (way !== 1 && way !== 2) {
      d.flight = "";
      d.depart = "";
      d.teacher = "";
    }
    if (way !== 1) d.unaccompanied = false;
    if (way === 4 || way === 5) d.place = "";
  }

  function fieldSelect(id, label, value, options, placeholder) {
    var html = '<div class="as-field"><label>' + esc(label) + '</label><select class="as-input" id="' + id + '">';
    html += '<option value="">' + esc(placeholder) + "</option>";
    options.forEach(function (opt) {
      html += '<option value="' + esc(opt) + '"' + (value === opt ? " selected" : "") + ">" + esc(opt) + "</option>";
    });
    return html + "</select></div>";
  }

  function editSheet(r) {
    var d = state.draft;
    if (!d) return "";
    var way = d.way;
    var html = '<div class="as-mask" data-as="mask"><div class="as-sheet as-sheet--form">';
    html += "<h3>修改入营方式 · " + esc(r.name) + "</h3>";
    html += '<p class="as-sheet__sub">' + esc(r.id) + " · " + esc(r.klass) + " · " + esc(r.status) + "</p>";
    html += '<div class="as-field"><label>入营方式</label><div class="as-ways">';
    WAYS.forEach(function (m) {
      if (!m.way) return;
      html += '<button type="button" class="as-way' + (way === m.way ? " is-on" : "") + '" data-as="pick-way" data-v="' + m.way + '">' + esc(m.label) + "</button>";
    });
    html += "</div></div>";
    if (way === 1 || way === 2 || way === 3) {
      var placeLabel = way === 1 ? "航站楼" : way === 2 ? "车站" : "入营大巴起点";
      html += fieldSelect("as-place", placeLabel, d.place, PLACES[way], "请选择" + placeLabel);
    }
    if ((way === 1 || way === 2) && d.place) {
      html += fieldSelect("as-teacher", "带队老师", d.teacher, TEACHERS, "该站点可选，不选也可以");
    }
    if (way === 1 || way === 2) {
      html += '<div class="as-field"><label>' + (way === 1 ? "航班号" : "班次") + '</label><input class="as-input" id="as-flight" value="' + esc(d.flight) + '" placeholder="' + (way === 1 ? "如：CZ3101" : "如：G1002") + '" /></div>';
      html += '<div class="as-field"><label>出发时间</label><input class="as-input" id="as-depart" value="' + esc(d.depart) + '" placeholder="如：10-18 08:10" /></div>';
    }
    html += '<div class="as-field"><label>抵达时间</label><input class="as-input" id="as-arrive" value="' + esc(d.arrive) + '" placeholder="如：10-18 10:02" /></div>';
    if (way === 1) {
      html += '<div class="as-field"><label>是否无人陪伴</label><div class="as-ways">';
      html += '<button type="button" class="as-way' + (d.unaccompanied ? " is-on" : "") + '" data-as="alone" data-v="1">是</button>';
      html += '<button type="button" class="as-way' + (!d.unaccompanied ? " is-on" : "") + '" data-as="alone" data-v="0">否</button>';
      html += "</div></div>";
      if (d.unaccompanied) html += '<p class="as-tip">陪伴人：林晓雯 · 女 · 13800008801</p>';
    }
    html += '<p class="as-tip">能打开本菜单的角色可以直接改。不走助教提交，也没有审批。已到达不能改。换方式后，不适用的站点、班次和出发时间会清掉。保存后 APP 迎接总表看到同一份结果。</p>';
    html += '<div class="as-sheet__ops"><button type="button" class="as-btn" data-as="edit-cancel">取消</button><button type="button" class="as-btn as-btn--primary" data-as="save" data-id="' + esc(r.id) + '">保存</button></div>';
    html += "</div></div>";
    return html;
  }

  function saveEdit(id) {
    var d = readDraft();
    var current = liveRows().filter(function (r) { return r.id === id; })[0];
    if (!d || !current || current.status === "已到达") {
      if (window.LB && window.LB.toast) window.LB.toast("已到达，不能修改");
      return;
    }
    if ((d.way === 1 || d.way === 2 || d.way === 3) && !d.place) {
      if (window.LB && window.LB.toast) window.LB.toast(d.way === 3 ? "请选择入营大巴起点" : "请选择站点");
      return;
    }
    if ((d.way === 1 || d.way === 2) && !d.flight) {
      if (window.LB && window.LB.toast) window.LB.toast(d.way === 1 ? "请填写航班号" : "请填写班次");
      return;
    }
    if ((d.way === 1 || d.way === 2) && !d.depart) {
      if (window.LB && window.LB.toast) window.LB.toast("请填写出发时间");
      return;
    }
    if (!d.arrive) {
      if (window.LB && window.LB.toast) window.LB.toast("请填写抵达时间");
      return;
    }
    var row = {
      id: id,
      way: d.way,
      place: d.place || "",
      flight: d.way === 1 || d.way === 2 ? d.flight : "—",
      depart: d.way === 1 || d.way === 2 ? d.depart : "",
      arrive: d.arrive,
      teacher: d.way === 1 || d.way === 2 ? d.teacher : "",
      unaccompanied: d.way === 1 ? !!d.unaccompanied : false,
      beforeWay: current.way,
      isEdited: true,
      editedAt: nowText(),
      editedBy: "余炜烽",
      updated: ""
    };
    row.updated = row.editedAt;
    try {
      var pack = JSON.parse(sessionStorage.getItem("lb-arrive-summary-v1") || "[]");
      var hit = pack.filter(function (x) { return x.id === id; })[0];
      if (hit) Object.keys(row).forEach(function (k) { hit[k] = row[k]; });
      else pack.unshift(row);
      sessionStorage.setItem("lb-arrive-summary-v1", JSON.stringify(pack));
    } catch (e) {}
    pushRev(id, {
      at: row.editedAt,
      kind: "backend",
      operator: "余炜烽",
      action: "直接修改",
      text: "入营方式由「" + wayMeta(current.way).label + "」改为「" + wayMeta(d.way).label + "」。" + (row.place ? "站点：" + row.place + "。" : "") + "数据已写入。"
    });
    state.edit = "";
    state.draft = null;
    if (window.LB && window.LB.toast) window.LB.toast("已保存，并写入修正记录");
  }

  function revWho(item) {
    if (item.kind === "member") return "前端用户 " + (item.memberName || "-") + "（会员ID " + (item.memberId || "-") + "）";
    if (item.via === "app") return "操作用户 " + (item.operator || "-") + "（APP 副负责人）";
    return "后台操作用户 " + (item.operator || "-");
  }

  function revSheet(r) {
    var list = revsOf(r.id);
    var html = '<div class="as-mask" data-as="mask"><div class="as-sheet as-sheet--form">';
    html += "<h3>修正记录 · " + esc(r.name) + "</h3>";
    html += '<p class="as-sheet__sub">' + esc(r.id) + " · 一次操作一条。后台直接修改写后台操作用户和姓名；APP 副负责人直接改写操作用户（APP 副负责人）。迎接不走助教申请，不记成前端用户和会员ID。</p>";
    if (!list.length) html += '<p class="as-tip">还没有修正记录。</p>';
    else {
      html += '<div class="as-revs">';
      list.forEach(function (item) {
        var tag = item.kind === "member" ? "前端申请" : (item.via === "app" ? "APP 副负责人" : "后台修改");
        html += '<article class="as-rev as-rev--' + (item.kind === "member" ? "member" : "admin") + '">';
        html += '<div class="as-rev__hd"><b>' + esc(item.at) + "</b><span>" + tag + "</span><em>" + esc(item.action || "") + "</em></div>";
        html += "<p>" + esc(revWho(item)) + "</p><p>" + esc(item.text || "") + "</p></article>";
      });
      html += "</div>";
    }
    html += '<div class="as-sheet__ops"><button type="button" class="as-btn as-btn--primary" data-as="rev-close">关闭</button></div></div></div>';
    return html;
  }

  function render(root) {
    var all = liveRows();
    var list = filtered(all);
    var scope = state.plan ? all.filter(function (r) { return r.plan === state.plan; }) : all;
    var html = '<div class="as-page">';
    html += hero(scope);
    html += planSwitch(all);
    html += '<div class="as-toolbar">';
    html += '<input class="as-input" id="as-kw" placeholder="搜索学员姓名 / 学员ID / 站点 / 班次" value="' + esc(state.kw) + '" />';
    html += '<button type="button" class="as-btn as-btn--primary" data-as="search">搜索</button>';
    html += '<button type="button" class="as-pill' + (state.way < 0 ? " is-on" : "") + '" data-as="way" data-v="-1">全部</button>';
    WAYS.forEach(function (m) {
      html += '<button type="button" class="as-pill as-pill--' + m.cls + (state.way === m.way ? " is-on" : "") + '" data-as="way" data-v="' + m.way + '">' + esc(m.short) + "</button>";
    });
    html += '<span class="as-count">' + list.length + " 人</span>";
    html += '<button type="button" class="as-btn" data-as="export">导出</button>';
    html += '<button type="button" class="lb-num-btn" data-note-key="arriveEdit" title="修改入营方式"></button>';
    html += '<button type="button" class="lb-num-btn" data-note-key="arriveRevs" title="修正记录"></button>';
    html += "</div>";
    html += table(list);
    html += '<p class="as-tip">能打开本菜单就可以改未到达学员的入营方式，页面不判断副负责人。已到达不能改。不走助教提交，也没有审批。保存后标「已修改」，APP 迎接总表看到同一份结果。</p>';
    html += "</div>";
    if (state.revisions) {
      var revRow = all.filter(function (r) { return r.id === state.revisions; })[0];
      if (revRow) html += revSheet(revRow);
    } else if (state.edit) {
      var editing = all.filter(function (r) { return r.id === state.edit; })[0];
      if (editing) html += editSheet(editing);
    } else if (state.detail) {
      var target = all.filter(function (r) { return r.id === state.detail; })[0];
      if (target) html += detailSheet(target);
    }
    root.innerHTML = html;
  }

  function mount(root) {
    if (!root) return;
    state.plan = "";
    state.way = -1;
    state.kw = "";
    state.detail = "";
    state.edit = "";
    state.draft = null;
    render(root);
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var page = document.getElementById("lb-replica");
    var host = page && page.querySelector(".as-page");
    if (!host) return;

    var btn = t.closest("[data-as]");
    if (!btn) return;
    var act = btn.getAttribute("data-as");
    var val = btn.getAttribute("data-v");
    if (act === "mask") {
      if (t.classList && t.classList.contains("as-mask")) {
        state.edit = "";
        state.draft = null;
        state.revisions = "";
        render(page);
      }
      return;
    }
    if (act === "revs") {
      state.detail = "";
      state.edit = "";
      state.draft = null;
      state.revisions = btn.getAttribute("data-id");
    } else if (act === "rev-close") {
      state.revisions = "";
    } else if (act === "plan") { state.plan = val || ""; state.revisions = ""; }
    else if (act === "way") { state.way = parseInt(val, 10); }
    else if (act === "search") {
      var kw = document.getElementById("as-kw");
      state.kw = kw ? String(kw.value || "").trim() : "";
    } else if (act === "detail") {
      state.revisions = "";
      state.edit = "";
      state.draft = null;
      state.detail = btn.getAttribute("data-id");
    } else if (act === "close") {
      state.detail = "";
    } else if (act === "edit") {
      var row = liveRows().filter(function (r) { return r.id === btn.getAttribute("data-id"); })[0];
      if (!row || row.status === "已到达") {
        if (window.LB && window.LB.toast) window.LB.toast("已到达，不能修改");
        return;
      }
      state.detail = "";
      state.edit = row.id;
      openDraft(row);
    } else if (act === "edit-cancel") {
      state.edit = "";
      state.draft = null;
    } else if (act === "pick-way") {
      readDraft();
      state.draft.way = parseInt(val, 10);
      clearDraftForWay(state.draft.way);
    } else if (act === "alone") {
      readDraft();
      state.draft.unaccompanied = val === "1";
    } else if (act === "save") {
      saveEdit(btn.getAttribute("data-id"));
    } else if (act === "export") {
      if (window.LB && window.LB.toast) window.LB.toast("导出当前筛选结果（原型不做真实文件）");
      return;
    } else return;
    render(page);
  });

  document.addEventListener("change", function (e) {
    if (!state.draft || !e.target || e.target.id !== "as-place") return;
    var page = document.getElementById("lb-replica");
    if (!page || !page.querySelector(".as-page")) return;
    readDraft();
    render(page);
  });

  window.LB_ARRIVE_SUMMARY = { mount: mount, rows: ROSTER, ways: WAYS };
})();
