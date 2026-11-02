(function () {
  "use strict";

  var KEY = "mentor-pc-demo";
  var state = load();

  function load() {
    try { return JSON.parse(sessionStorage.getItem(KEY) || "{}"); } catch (e) { return {}; }
  }
  function save() { sessionStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function route() {
    return (location.hash || "#/user/login").replace(/^#/, "") || "/user/login";
  }
  function go(path) { location.hash = path; }

  var MENUS = [
    ["首页", "/home"],
    ["工作台", "/dashboard"],
    ["我的课表", "/leadershipCamp"],
    ["磨课", "/grindingLessons"],
    ["学习", "/learning"],
    ["帮助", "/operate/help"],
    ["个人信息", "/security/user"]
  ];

  function shell(title, body, bare) {
    var path = route().split("?")[0];
    var nav = MENUS.map(function (item) {
      var on = path === item[1] || path.indexOf(item[1] + "/") === 0;
      return '<button type="button" class="portal-menu' + (on ? " is-on" : "") + '" data-go="' + item[1] + '">' + item[0] + "</button>";
    }).join("");
    var initial = esc((state.name || "导").slice(0, 1));
    var head = '<header class="portal-header"><div class="portal-bar"><div class="portal-brand"><a class="portal-logo" href="#/home">6Q导师</a><span class="portal-ver">v3.5.0</span><a class="portal-back" href="../6Q_leader_battalion/index.html">功能清单</a></div><div class="portal-right"><nav class="portal-menus">' + nav + '</nav><div class="portal-user"><span class="portal-avatar">' + initial + "</span><span>" + esc(state.name || "演示导师") + '</span><button type="button" class="portal-out" data-act="logout">退出</button></div></div></div></header>';
    if (bare) return '<div class="portal">' + head + body + "</div>";
    return '<div class="portal">' + head + '<div class="portal-sheet"><h2 class="page-title">' + title + "</h2>" + body + "</div></div>";
  }

  function login() {
    var phone = state.tab !== "mail";
    return '<div class="auth"><a class="portal-back auth-back" href="../6Q_leader_battalion/index.html">功能清单 · v3.5.0</a><div class="auth-card"><h1>欢迎登录</h1><div class="tabs"><button type="button" class="' + (phone ? "is-on" : "") + '" data-tab="phone">手机登录</button><button type="button" class="' + (!phone ? "is-on" : "") + '" data-tab="mail">邮箱登录</button></div><div class="field"><span>' + (phone ? "+86" : "邮") + '</span><input id="acc" placeholder="' + (phone ? "请输入手机号" : "请输入邮箱") + '" /></div><div class="field"><span>锁</span><input id="pwd" type="password" placeholder="请输入密码" /></div><button type="button" class="go" data-act="login">登录</button><div class="auth-links"><a href="#/user/register">注册</a><a href="#/user-agreement">用户协议</a><a href="#/privacy-policy">隐私协议</a></div></div></div>';
  }

  function home() {
    var teams = [
      ["授课导师一队", "聚焦授课表达与课堂节奏"],
      ["授课导师二队", "聚焦课程设计与磨课复盘"]
    ];
    var cards = teams.map(function (item, i) {
      return '<div class="card grow"><h3>' + item[0] + "</h3><p class=\"muted\">" + item[1] + '</p><button type="button" class="btn--link" data-go="/home/detail?id=' + (i + 1) + '">查看更多</button></div>';
    }).join("");
    return shell("首页", '<div class="hero-home"><h3>教育授课导师培养</h3><p>教育授课导师培养，聚焦于提升个人综合素质即三恰智慧，提高导师授课专业水平。</p></div><div class="row" style="justify-content:space-between;align-items:center"><h3>导师梯队</h3><button type="button" class="btn--link" data-go="/home/list">查看更多</button></div><div class="row">' + cards + "</div>");
  }

  function homeList() {
    var rows = ["授课导师一队", "授课导师二队", "新晋导师队"].map(function (name, i) {
      return "<tr><td>" + name + "</td><td>" + (12 + i) + '</td><td><button type="button" class="btn--link" data-go="/home/detail?id=' + (i + 1) + '">查看</button></td></tr>';
    }).join("");
    return shell("梯队列表", '<div class="card"><table class="table"><thead><tr><th>梯队</th><th>人数</th><th>操作</th></tr></thead><tbody>' + rows + "</tbody></table></div>");
  }

  function homeDetail() {
    return shell("梯队详情", '<div class="card"><h3>授课导师梯队</h3><p>教育授课导师培养，聚焦于提升个人综合素质即三恰智慧，提高导师授课专业水平。</p><p class="muted">成员：林晓雯、陈启航、王敏</p><button type="button" class="btn" data-act="join">加入</button></div>');
  }

  var COURSES = [
    { id: "c1", name: "口才表达：把话说清楚", type: "口才", typeColor: "#5DD574", cat: "基础", catColor: "#6AA8FF", minutes: 90, hour: 2, place: "A1教室", warn: true },
    { id: "c2", name: "情商课：识别情绪", type: "情商", typeColor: "#F5A24A", cat: "主题", catColor: "#A07CFF", minutes: 90, hour: 2, place: "情商教室", warn: false },
    { id: "c3", name: "思维训练：提问与拆解", type: "思维", typeColor: "#4DB6AC", cat: "进阶", catColor: "#FF7E9A", minutes: 90, hour: 2, place: "思维教室", warn: false }
  ];
  var TEACHERS = [
    { name: "林晓雯", role: "授课导师", count: 6 },
    { name: "陈启航", role: "授课导师", count: 4 },
    { name: "王敏", role: "助教导师", count: 2 }
  ];
  var TEMPLATES = ["A1班标准课表", "A1班情商加强版"];
  var SLOTS = [
    { type: 3, label: "晨练", start: "07:00", end: "07:40" },
    { type: 2, start: "08:00", end: "09:30" },
    { type: 2, start: "09:40", end: "11:10" },
    { type: 4, label: "午餐及休息", start: "11:20", end: "13:20" },
    { type: 2, start: "14:00", end: "15:30" },
    { type: 2, start: "15:40", end: "17:10" },
    { type: 5, label: "晚饭及休息", start: "17:20", end: "18:40" },
    { type: 2, start: "19:00", end: "20:30" }
  ];
  var DAYS = [
    ["第1天", "10月19日"], ["第2天", "10月20日"], ["第3天", "10月21日"], ["第4天", "10月22日"],
    ["第5天", "10月23日"], ["第6天", "10月24日"], ["第7天", "10月25日"]
  ];
  var WEEKS = [
    { id: "w1", base: "广州基地", plan: "2026暑假广州第二期", week: "第一周", klass: "A1班", camp: "待开营", campTone: "ok", table: "草稿", tableTone: "muted", review: "draft", edited: "2026-10-18 21:06" },
    { id: "w2", base: "广州基地", plan: "2026暑假广州第二期", week: "第二周", klass: "A1班", camp: "开营中", campTone: "bad", table: "草稿", tableTone: "muted", review: "draft", edited: "2026-10-20 09:18" },
    { id: "w3", base: "广州基地", plan: "2026暑假广州第二期", week: "第三周", klass: "A1班", camp: "已结营", campTone: "muted", table: "已确定", tableTone: "ok", review: "lock", edited: "2026-10-12 18:02" },
    { id: "w4", base: "华东基地", plan: "2026暑假华东基地", week: "第六周", klass: "B2班", camp: "待开营", campTone: "ok", table: "审核驳回", tableTone: "bad", review: "reject", edited: "2026-10-16 11:40" }
  ];
  var SEED = {
    lessons: [
      { slot: 1, day: 0, courseId: "c1", teachers: ["林晓雯"], cross: ["陈启航"], warn: true },
      { slot: 1, day: 2, courseId: "c2", teachers: ["王敏"], cross: [], warn: false },
      { slot: 4, day: 1, courseId: "c3", teachers: ["林晓雯", "王敏", "陈启航"], cross: ["王敏"], warn: false },
      { slot: 5, day: 3, courseId: "c1", teachers: ["陈启航"], cross: [], warn: true },
      { slot: 7, day: 5, courseId: "c2", teachers: ["林晓雯"], cross: ["陈启航"], warn: false }
    ],
    disabled: { "5-6": true, "4-4": true }
  };
  var TT_LOOK_KEY = "mentor-tt-look";
  function loadLook() {
    try {
      var saved = JSON.parse(localStorage.getItem(TT_LOOK_KEY) || "null");
      if (saved && (saved.font || saved.cell)) return { font: saved.font || "md", cell: saved.cell || "std" };
    } catch (e) {}
    return { font: "md", cell: "std" };
  }
  function saveLook() {
    try { localStorage.setItem(TT_LOOK_KEY, JSON.stringify({ font: tt.font, cell: tt.cell })); } catch (e) {}
  }
  var ttLook = loadLook();

  var tt = { week: "w2", template: 0, drop: false, history: false, reason: false, folded: {}, store: {}, drawer: null, confirm: "", font: ttLook.font, cell: ttLook.cell, lookOpen: false };

  function courseById(id) {
    for (var i = 0; i < COURSES.length; i++) if (COURSES[i].id === id) return COURSES[i];
    return null;
  }
  function currentWeek() {
    for (var i = 0; i < WEEKS.length; i++) if (WEEKS[i].id === tt.week) return WEEKS[i];
    return WEEKS[0];
  }
  function ensureStore(id) {
    if (!tt.store[id]) tt.store[id] = JSON.parse(JSON.stringify(SEED));
    return tt.store[id];
  }
  function findLesson(store, slot, day) {
    for (var i = 0; i < store.lessons.length; i++) {
      if (store.lessons[i].slot === slot && store.lessons[i].day === day) return store.lessons[i];
    }
    return null;
  }
  function dropLesson(store, slot, day) {
    store.lessons = store.lessons.filter(function (ls) { return !(ls.slot === slot && ls.day === day); });
  }
  function hexToRgba(hex, alpha) {
    var n = parseInt(String(hex).replace("#", ""), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + alpha + ")";
  }
  function tag(tone, name, large) {
    return '<span class="st st-' + tone + (large ? " st-lg" : "") + '">' + esc(name) + "</span>";
  }
  function periodOf(start) {
    var hour = parseInt(start, 10);
    if (hour < 12) return "上午";
    if (hour < 18) return "下午";
    return "晚上";
  }
  function teacherTags(list) {
    var shown = list.slice(0, 2).map(function (name) {
      return '<span class="tt-mname">' + esc(name) + "</span>";
    }).join("");
    if (list.length > 2) shown += '<span class="tt-mname" title="' + esc(list.join("、")) + '">+' + (list.length - 2) + "</span>";
    return shown;
  }
  function lessonCard(ls, key, preview) {
    var course = courseById(ls.courseId);
    if (!course) return "";
    var bg = hexToRgba(course.typeColor, 0.1);
    var bar = hexToRgba(course.typeColor, 0.3);
    var mentors = "";
    if (ls.teachers.length || ls.cross.length) {
      mentors = '<div class="tt-mentor" style="background:' + bar + '">';
      if (ls.teachers.length) mentors += '<div class="tt-mrow"><span class="tt-mtype">授</span>' + teacherTags(ls.teachers) + "</div>";
      if (ls.cross.length) mentors += '<div class="tt-mrow"><span class="tt-mtype">跨</span>' + teacherTags(ls.cross) + "</div>";
      mentors += "</div>";
    }
    var warn = ls.warn ? '<span class="tt-warn"><i></i>注意</span>' : "";
    var pop = preview ? "" : (tt.confirm === key
      ? '<div class="tt-pop">确认删除该课程？<button type="button" data-tt="del-yes" data-slot="' + ls.slot + '" data-day="' + ls.day + '">确定</button><button type="button" data-tt="del-no">取消</button></div>'
      : '<button type="button" class="tt-del" data-tt="del" data-slot="' + ls.slot + '" data-day="' + ls.day + '" title="删除">×</button>');
    return '<div class="tt-lesson" style="background:' + bg + '" data-tt="open" data-slot="' + ls.slot + '" data-day="' + ls.day + '"><div class="tt-badges"><span class="tt-badge" style="background:' + course.typeColor + '">' + esc(course.type.slice(0, 1)) + '</span><span class="tt-badge" style="background:' + course.catColor + '">' + esc(course.cat.slice(0, 1)) + "</span>" + warn + "</div><div class=\"tt-cname\">" + esc(course.name) + "</div>" + mentors + pop + "</div>";
  }
  function cellHtml(store, slotIndex, day, preview) {
    var slot = SLOTS[slotIndex];
    var key = slotIndex + "-" + day;
    if (slot.type !== 2) return '<div class="tt-rest">' + esc(slot.label) + "</div>";
    if (store.disabled[key]) {
      if (preview) return '<div class="tt-dis"><span class="tt-off">⊘</span></div>';
      return '<div class="tt-dis"><span class="tt-off">⊘</span><button type="button" class="tt-on" data-tt="enable" data-slot="' + slotIndex + '" data-day="' + day + '">启用</button></div>';
    }
    var lesson = findLesson(store, slotIndex, day);
    if (lesson) return lessonCard(lesson, key, preview);
    if (preview) return "";
    return '<div class="tt-add"><button type="button" class="tt-plus" data-tt="add" data-slot="' + slotIndex + '" data-day="' + day + '">+</button><div class="tt-hover-actions"><button type="button" class="tt-mini danger" data-tt="disable" data-slot="' + slotIndex + '" data-day="' + day + '">⊘ 设为禁用</button><button type="button" class="tt-mini" data-tt="add" data-slot="' + slotIndex + '" data-day="' + day + '">＋ 添加课程</button></div></div>';
  }
  function countRows(map) {
    return Object.keys(map).map(function (name) {
      var item = map[name];
      return '<div class="tt-count"><div class="tt-count-l"><span class="tt-badge" style="background:' + item.colour + '">' + esc(name.slice(0, 1)) + '</span><span>' + esc(name) + '</span></div><span>' + item.count + "</span></div>";
    }).join("");
  }
  function bump(map, name, colour) {
    if (!map[name]) map[name] = { colour: colour, count: 0 };
    map[name].count += 1;
  }
  function sidebar(store) {
    var types = {};
    var cats = {};
    var teachers = {};
    var crosses = {};
    store.lessons.forEach(function (ls) {
      var course = courseById(ls.courseId);
      if (!course) return;
      bump(types, course.type, course.typeColor);
      bump(cats, course.cat, course.catColor);
      ls.teachers.forEach(function (name) {
        if (!teachers[name]) teachers[name] = {};
        bump(teachers[name], course.type, course.typeColor);
      });
      ls.cross.forEach(function (name) {
        if (!crosses[name]) crosses[name] = {};
        bump(crosses[name], course.type, course.typeColor);
      });
    });
    function people(map) {
      var names = Object.keys(map);
      if (!names.length) return '<div class="tt-empty">暂无数据</div>';
      return names.map(function (name) {
        var person = null;
        for (var i = 0; i < TEACHERS.length; i++) if (TEACHERS[i].name === name) person = TEACHERS[i];
        var role = person ? person.role : "授课导师";
        return '<div class="tt-person"><div class="tt-who"><span class="tt-avatar">' + esc(name.slice(0, 1)) + '</span><span class="tt-who-name">' + esc(name) + '</span><span class="tt-who-role">' + esc(role) + "</span></div>" + countRows(map[name]) + "</div>";
      }).join("");
    }
    return '<div class="tt-card"><div class="tt-card-title">课程·' + store.lessons.length + "</div>" + (Object.keys(types).length ? '<div class="tt-block">' + countRows(types) + "</div>" : "") + (Object.keys(cats).length ? '<div class="tt-block">' + countRows(cats) + "</div>" : "") + '</div><div class="tt-card"><div class="tt-card-title">授课导师</div>' + people(teachers) + '</div><div class="tt-card"><div class="tt-card-title">跨班授课导师</div>' + people(crosses) + "</div>";
  }
  function reviewBox(week) {
    if (week.camp === "已结营") return "";
    if (week.review === "draft") return '<div class="tt-review"><button type="button" class="tt-link" data-tt="submit">完成并提交</button><span class="tt-arrow">›</span></div>';
    if (week.review === "reject") return '<div class="tt-review"><button type="button" class="tt-link" data-tt="reason">查看原因</button><span class="tt-split"></span><button type="button" class="tt-link" data-tt="submit">重新提交</button><span class="tt-arrow">›</span></div>';
    if (week.review === "review") return '<div class="tt-review"><button type="button" class="tt-link" data-tt="reason">查看原因</button><span class="tt-arrow">›</span></div>';
    return "";
  }
  function tipBox(store) {
    var tips = [];
    var seen = {};
    store.lessons.forEach(function (ls) {
      if (!ls.warn) return;
      var course = courseById(ls.courseId);
      if (!course || seen[course.id]) return;
      seen[course.id] = true;
      tips.push(course.name + "尚未完成磨课");
    });
    if (!tips.length) return "";
    var head = tips.slice(0, 2).map(function (text) { return esc(text) + "；"; }).join("");
    var more = tips.slice(2).map(function (text) { return "<div>" + esc(text) + "；</div>"; }).join("");
    return '<div class="tt-tip">' + head + (more ? '<div class="tt-tip-more">' + more + "</div>" : "") + "</div>";
  }
  function noteHost(key) {
    return '<span class="lb-note-host"><button type="button" class="lb-num-btn" data-note-key="' + key + '"></button></span>';
  }
  function leftPanel(active) {
    var bases = [];
    WEEKS.forEach(function (week) {
      var group = null;
      for (var i = 0; i < bases.length; i++) if (bases[i].base === week.base) group = bases[i];
      if (!group) { group = { base: week.base, weeks: [] }; bases.push(group); }
      group.weeks.push(week);
    });
    var html = bases.map(function (group) {
      var open = !tt.folded[group.base];
      var rows = open ? group.weeks.map(function (week) {
        return '<button type="button" class="tt-week' + (week.id === active.id ? " is-on" : "") + '" data-tt="week" data-id="' + week.id + '"><span class="tt-week-main"><b>' + esc(week.week) + "</b><i>" + esc(week.plan) + '</i></span><span class="tt-tags">' + tag(week.campTone, week.camp) + tag(week.tableTone, week.table) + "</span></button>";
      }).join("") : "";
      return '<div class="tt-plan"><button type="button" class="tt-plan-h" data-tt="fold" data-plan="' + esc(group.base) + '"><span class="tt-caret">' + (open ? "▼" : "▶") + "</span>" + esc(group.base) + "</button>" + rows + "</div>";
    }).join("");
    return '<div class="tt-side-label">基地 ' + noteHost("baseWeek") + '</div><div class="tt-collapse">' + html + '</div><button type="button" class="tt-more" data-tt="history">查看更多</button>';
  }
  function lookBar() {
    function pick(kind, value, label) {
      var on = (kind === "font" ? tt.font : tt.cell) === value;
      return '<button type="button" class="tt-look-btn' + (on ? " is-on" : "") + '" data-tt="' + kind + '" data-v="' + value + '">' + label + "</button>";
    }
    var pop = tt.lookOpen
      ? '<div class="tt-look-pop"><div class="tt-look-row"><span>字号</span>' + pick("font", "sm", "小") + pick("font", "md", "标准") + pick("font", "lg", "大") + '</div><div class="tt-look-row"><span>格子</span>' + pick("cell", "compact", "紧凑") + pick("cell", "std", "标准") + "</div></div>"
      : "";
    return '<div class="tt-look"><button type="button" class="tt-look-trigger" data-tt="look">显示</button>' + noteHost("timetableLook") + pop + "</div>";
  }
  function drawerHtml(week) {
    if (!tt.drawer) return "";
    var preview = week.camp === "已结营";
    var slot = SLOTS[tt.drawer.slot];
    var course = courseById(tt.drawer.courseId);
    var courseInner = course
      ? '<span class="tt-course-tag" style="color:' + course.typeColor + ";background:" + hexToRgba(course.typeColor, 0.1) + '">' + esc(course.type) + "</span><span class=\"tt-course-name\">" + esc(course.name) + "</span>"
      : '<span class="tt-course-name">请选择课程</span>';
    var picker = preview ? "" : '<div class="tt-picker">' + COURSES.map(function (item) {
      return '<button type="button" data-tt="pick-course" data-id="' + item.id + '">' + esc(item.type) + " · " + esc(item.name) + "</button>";
    }).join("") + "</div>";
    var timeBits = course ? '<div class="tt-meta"><span>' + course.minutes + "分钟</span><i></i><span>" + course.hour + "课时</span></div>" : "";
    var place = course ? '<div class="tt-sec"><div class="tt-sec-title">占用场地</div><div class="tt-meta">' + esc(course.place) + "</div></div>" : "";
    var teachers = "";
    var cross = "";
    if (course) {
      teachers = '<div class="tt-sec"><div class="tt-sec-title">授课导师</div>' + TEACHERS.map(function (person) {
        var on = tt.drawer.teachers.indexOf(person.name) >= 0;
        return '<button type="button" class="tt-mentor-row' + (on ? " is-on" : "") + '" data-tt="toggle-teacher" data-name="' + esc(person.name) + '"><span class="tt-avatar">' + esc(person.name.slice(0, 1)) + '</span><span class="tt-mentor-name">' + esc(person.name) + '</span><span class="tt-mentor-num">授课次数' + person.count + '</span><span class="tt-check">' + (on ? "✓" : "") + "</span></button>";
      }).join("") + (course.warn ? '<button type="button" class="tt-moke" data-go="/grindingLessons"><span>该课程尚未完成磨课</span><span>去磨课 ›</span></button>' : "") + "</div>";
      var crossRows = tt.drawer.cross.map(function (name, index) {
        return '<div class="tt-mentor-row"><span class="tt-avatar">' + esc(name.slice(0, 1)) + '</span><span class="tt-mentor-name">' + esc(name) + '</span><span class="tt-mentor-num">期望</span>' + (preview ? "" : '<button type="button" class="tt-x" data-tt="remove-cross" data-i="' + index + '">×</button>') + "</div>";
      }).join("");
      var pickCross = tt.drawer.picking ? '<div class="tt-picker">' + TEACHERS.map(function (person) {
        return '<button type="button" data-tt="pick-cross" data-name="' + esc(person.name) + '">' + esc(person.name) + " · " + esc(person.role) + "</button>";
      }).join("") + "</div>" : "";
      cross = '<div class="tt-sec"><div class="tt-sec-title">期望跨班导师</div>' + crossRows + (preview ? "" : '<button type="button" class="tt-change" data-tt="toggle-pick">＋ 更换导师</button>') + pickCross + "</div>";
    }
    var foot = preview
      ? '<button type="button" class="btn" data-tt="drawer-close">关闭</button>'
      : '<button type="button" class="btn" data-tt="drawer-close">取消</button><button type="button" class="btn btn--primary" data-tt="save">确定</button>';
    return '<div class="tt-mask" data-tt="drawer-close"></div><aside class="tt-drawer' + (preview ? " is-lock" : "") + '"><h3>第' + (tt.drawer.day + 1) + "天 " + periodOf(slot.start) + slot.start + "</h3><div class=\"tt-sec\"><div class=\"tt-sec-title\">课程</div><div class=\"tt-course" + (preview ? " is-lock" : "") + '" data-tt="toggle-course">' + courseInner + '<span class="tt-edit">✎</span></div>' + (tt.drawer.pickingCourse ? picker : "") + timeBits + '<div class="tt-meta">' + slot.start + "-" + slot.end + "</div></div>" + place + teachers + cross + '<div class="tt-foot">' + foot + "</div></aside>";
  }

  function timetable() {
    var week = currentWeek();
    var store = ensureStore(week.id);
    var preview = week.camp === "已结营";
    var head = '<th class="tt-cal">' + calendarIcon() + "</th>" + DAYS.map(function (day) {
      return '<th><div class="tt-day">' + day[0] + '</div><div class="tt-date">' + day[1] + "</div></th>";
    }).join("");
    var body = SLOTS.map(function (slot, slotIndex) {
      var rest = slot.type !== 2 ? " is-rest" : "";
      var cells = DAYS.map(function (_, day) {
        return "<td class=\"" + (rest ? "is-rest" : "") + "\">" + cellHtml(store, slotIndex, day, preview) + "</td>";
      }).join("");
      return "<tr class=\"" + (rest ? "is-rest" : "") + "\"><td class=\"tt-time" + rest + "\">" + slot.start + "-" + slot.end + "</td>" + cells + "</tr>";
    }).join("");
    var menu = tt.drop ? '<div class="tt-drop">' + TEMPLATES.map(function (name, index) {
      return '<button type="button" class="' + (index === tt.template ? "is-on" : "") + '" data-tt="tpl" data-i="' + index + '">' + esc(name) + "</button>";
    }).join("") + "</div>" : "";
    var history = tt.history ? '<div class="tt-modal"><div class="tt-dialog"><div class="tt-dialog-h"><span>历史课表</span><button type="button" data-tt="close-history">×</button></div><table class="table"><thead><tr><th>计划</th><th>周营</th><th>班级</th><th>开营</th><th>课表</th></tr></thead><tbody>' + WEEKS.map(function (item) {
      return '<tr data-tt="week" data-id="' + item.id + '"><td>' + esc(item.plan) + "</td><td>" + esc(item.week) + "</td><td>" + esc(item.klass) + "</td><td>" + tag(item.campTone, item.camp) + "</td><td>" + tag(item.tableTone, item.table) + "</td></tr>";
    }).join("") + "</tbody></table></div></div>" : "";
    var reason = tt.reason ? '<div class="tt-modal"><div class="tt-dialog tt-dialog--sm"><div class="tt-dialog-h"><span>查看原因</span><button type="button" data-tt="close-reason">×</button></div><p>审核驳回：周一第一节课程的授课导师尚未完成磨课，请完成后再提交。</p><div class="tt-foot"><button type="button" class="btn btn--primary" data-tt="close-reason">知道了</button></div></div></div>' : "";
    var html = '<div class="tt-page" data-font="' + tt.font + '" data-cell="' + tt.cell + '"><div class="tt"><aside class="tt-left">' + leftPanel(week) + '</aside><section class="tt-center"><div class="tt-head"><div class="tt-title"><span>' + esc(week.plan + " " + week.week + " " + week.klass) + "</span>" + tag(week.campTone, week.camp, true) + '</div><div class="tt-head-r"></div></div><div class="tt-ops"><div class="tt-tab"><button type="button" class="tt-tab-btn' + (preview ? " is-lock" : "") + '" data-tt="drop"><span class="tt-caret">' + (preview ? "" : "▼") + '</span><span class="tt-tab-name">' + esc(TEMPLATES[tt.template]) + "</span>" + tag(week.tableTone, week.table) + "</button>" + menu + '</div><button type="button" class="tt-export" data-tt="export">导出</button><button type="button" class="tt-export" data-tt="image">课表图片导出</button>' + reviewBox(week) + '<div class="tt-ops-r">' + lookBar() + "</div>" + tipBox(store) + '</div><div class="tt-table-wrap"><table class="tt-table"><thead><tr>' + head + "</tr></thead><tbody>" + body + "</tbody></table></div></section><aside class=\"tt-right\">" + sidebar(store) + "</aside></div></div>" + drawerHtml(week) + history + reason;
    return shell("", html, true);
  }
  function calendarIcon() {
    return '<svg class="tt-cal-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="#835f4a" stroke-width="1.6"/><path d="M3 10h18M8 3v4M16 3v4" fill="none" stroke="#835f4a" stroke-width="1.6" stroke-linecap="round"/></svg>';
  }
  function handleTt(act, el) {
    var week = currentWeek();
    var store = ensureStore(week.id);
    var preview = week.camp === "已结营";
    var slot = el.getAttribute("data-slot");
    var day = el.getAttribute("data-day");
    if (act === "fold") {
      tt.folded[el.getAttribute("data-plan")] = !tt.folded[el.getAttribute("data-plan")];
    } else if (act === "week") {
      tt.week = el.getAttribute("data-id");
      tt.history = false;
      tt.drawer = null;
      tt.confirm = "";
    } else if (act === "drop") {
      if (!preview) tt.drop = !tt.drop;
    } else if (act === "tpl") {
      tt.template = Number(el.getAttribute("data-i")) || 0;
      tt.drop = false;
    } else if (act === "history") {
      tt.history = true;
    } else if (act === "close-history") {
      tt.history = false;
    } else if (act === "reason") {
      tt.reason = true;
    } else if (act === "close-reason") {
      tt.reason = false;
    } else if (act === "submit") {
      if (!preview && (week.review === "draft" || week.review === "reject")) {
        week.review = "review";
        week.table = "审核中";
        week.tableTone = "muted";
      }
    } else if (act === "export") {
      alert("已导出课表");
    } else if (act === "image") {
      alert("已导出课表图片：" + week.plan + " " + week.week + " " + week.klass + ".png");
    } else if (act === "look") {
      tt.lookOpen = !tt.lookOpen;
    } else if (act === "font") {
      tt.font = el.getAttribute("data-v") || "md";
      saveLook();
      tt.lookOpen = true;
    } else if (act === "cell") {
      tt.cell = el.getAttribute("data-v") || "std";
      saveLook();
      tt.lookOpen = true;
    } else if (act === "add" || act === "open") {
      if (act === "add" && preview) return;
      var found = findLesson(store, Number(slot), Number(day));
      tt.confirm = "";
      tt.drawer = {
        slot: Number(slot),
        day: Number(day),
        courseId: found ? found.courseId : "",
        teachers: found ? found.teachers.slice() : [],
        cross: found ? found.cross.slice() : [],
        picking: false,
        pickingCourse: act === "add" && !found
      };
    } else if (act === "disable") {
      if (preview) return;
      store.disabled[slot + "-" + day] = true;
      dropLesson(store, Number(slot), Number(day));
    } else if (act === "enable") {
      if (preview) return;
      delete store.disabled[slot + "-" + day];
    } else if (act === "del") {
      if (preview) return;
      tt.confirm = slot + "-" + day;
    } else if (act === "del-no") {
      tt.confirm = "";
    } else if (act === "del-yes") {
      dropLesson(store, Number(slot), Number(day));
      tt.confirm = "";
    } else if (act === "drawer-close") {
      if (el.classList.contains("tt-mask") || el.getAttribute("data-tt") === "drawer-close") tt.drawer = null;
    } else if (act === "toggle-course") {
      if (preview || !tt.drawer) return;
      tt.drawer.pickingCourse = !tt.drawer.pickingCourse;
    } else if (act === "pick-course") {
      if (preview || !tt.drawer) return;
      var picked = courseById(el.getAttribute("data-id"));
      tt.drawer.courseId = picked ? picked.id : "";
      tt.drawer.pickingCourse = false;
    } else if (act === "toggle-teacher") {
      if (preview || !tt.drawer) return;
      var teacher = el.getAttribute("data-name");
      var at = tt.drawer.teachers.indexOf(teacher);
      if (at >= 0) tt.drawer.teachers.splice(at, 1);
      else tt.drawer.teachers.push(teacher);
    } else if (act === "toggle-pick") {
      if (tt.drawer) tt.drawer.picking = !tt.drawer.picking;
    } else if (act === "pick-cross") {
      if (preview || !tt.drawer) return;
      var crossName = el.getAttribute("data-name");
      if (tt.drawer.cross.indexOf(crossName) < 0) tt.drawer.cross.push(crossName);
      tt.drawer.picking = false;
    } else if (act === "remove-cross") {
      if (tt.drawer) tt.drawer.cross.splice(Number(el.getAttribute("data-i")), 1);
    } else if (act === "save") {
      if (!tt.drawer) return;
      if (preview) { tt.drawer = null; }
      else if (!tt.drawer.courseId) { alert("请选择课程"); return; }
      else {
        var chosen = courseById(tt.drawer.courseId);
        delete store.disabled[tt.drawer.slot + "-" + tt.drawer.day];
        dropLesson(store, tt.drawer.slot, tt.drawer.day);
        store.lessons.push({
          slot: tt.drawer.slot,
          day: tt.drawer.day,
          courseId: tt.drawer.courseId,
          teachers: tt.drawer.teachers.slice(),
          cross: tt.drawer.cross.slice(),
          warn: !!(chosen && chosen.warn)
        });
        week.edited = "2026-10-26 11:20";
        tt.drawer = null;
      }
    }
    if (act !== "drop" && act !== "tpl") tt.drop = false;
    if (act !== "look" && act !== "font" && act !== "cell") tt.lookOpen = false;
    render();
  }

  function queryOf() {
    var raw = route();
    var cut = raw.indexOf("?");
    var query = {};
    if (cut < 0) return query;
    raw.slice(cut + 1).split("&").forEach(function (pair) {
      if (!pair) return;
      var kv = pair.split("=");
      query[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
    });
    return query;
  }

  function help() {
    return shell("帮助", '<div class="card"><h3>常见问题</h3><p>磨课任务在「磨课 - 我的磨课」里查看。</p><p>课表在「我的课表」里编辑，编辑后需要完成并提交。</p><p>验收试讲要在验收开始前上传材料。</p></div>');
  }

  function user() {
    return shell("用户信息", '<div class="card"><p>姓名：' + esc(state.name || "演示导师") + '</p><p>性别：女</p><h3>磨课授课生涯</h3><p>共授课 18 课时　共磨课 6 次</p><h3>我加入的梯队</h3><p>授课导师一队 <button type="button" class="btn--link" data-act="toast" data-msg="已加入">加入</button></p></div>');
  }

  function dashboard() {
    return shell("工作台", '<div class="row"><div class="card grow"><h3>常用功能</h3><p><button type="button" class="btn" data-go="/leadershipCamp">我的课表</button> <button type="button" class="btn" data-go="/grindingLessons">磨课</button> <button type="button" class="btn" data-go="/learning">学习</button></p></div><div class="card grow"><h3>我的事项</h3><div class="pills"><button class="is-on">待办</button><button>已办</button><button>我发起的</button></div><p>课表待提交</p><p>验收试讲待上传材料</p></div></div>');
  }

  function article(title, text) {
    return '<div class="article"><h1>' + title + "</h1><p>" + text + '</p><p><a href="#/user/login">返回登录</a></p></div>';
  }

  function render() {
    if (!state.in && route() !== "/user/login" && route() !== "/user/register" && route() !== "/user/register-result" && route() !== "/user-agreement" && route() !== "/privacy-policy") {
      try { sessionStorage.setItem("mentor-next", route()); } catch (err) {}
      go("/user/login");
      return;
    }
    var path = route().split("?")[0];
    var html = "";
    if (path === "/user/login") html = login();
    else if (path === "/user/register") html = '<div class="auth"><div class="auth-card"><h1>注册</h1><div class="field"><span>+86</span><input placeholder="请输入手机号" /></div><div class="field"><input placeholder="请输入验证码" /></div><button type="button" class="go" data-go="/user/register-result">下一步</button></div></div>';
    else if (path === "/user/register-result") html = article("注册成功", "请到邮箱查看结果。");
    else if (path === "/user-agreement") html = article("用户协议", "使用导师工作台前，请阅读并同意用户协议。");
    else if (path === "/privacy-policy") html = article("隐私协议", "我们仅将账号信息用于导师磨课、排课和学习。");
    else if (path === "/home") html = home();
    else if (path === "/home/list") html = homeList();
    else if (path === "/home/detail") html = homeDetail();
    else if (path === "/leadershipCamp") html = timetable();
    else if (path.indexOf("/grindingLessons") === 0) html = window.MentorGrind.page(path, queryOf());
    else if (path.indexOf("/learning") === 0) html = window.MentorLearn.page();
    else if (path === "/operate/help") html = help();
    else if (path === "/security/user") html = user();
    else if (path === "/dashboard") html = dashboard();
    else html = article("页面不存在", "对不起，您访问的页面不存在。");
    document.getElementById("app").innerHTML = html;
    if (window.MentorNotes) MentorNotes.paint();
  }

  document.body.addEventListener("click", function (e) {
    var glBtn = e.target.closest("[data-gl]");
    if (glBtn && window.MentorGrind) { MentorGrind.act(glBtn.getAttribute("data-gl"), glBtn); return; }
    var lnBtn = e.target.closest("[data-ln]");
    if (lnBtn && window.MentorLearn) { MentorLearn.act(lnBtn.getAttribute("data-ln"), lnBtn); return; }
    var ttBtn = e.target.closest("[data-tt]");
    if (ttBtn) { handleTt(ttBtn.getAttribute("data-tt"), ttBtn); return; }
    if (tt.drop && !e.target.closest(".tt-tab")) { tt.drop = false; render(); return; }
    if (tt.lookOpen && !e.target.closest(".tt-look")) { tt.lookOpen = false; render(); return; }
    var goBtn = e.target.closest("[data-go]");
    if (goBtn) { go(goBtn.getAttribute("data-go")); return; }
    var tab = e.target.closest("[data-tab]");
    if (tab) { state.tab = tab.getAttribute("data-tab"); save(); render(); return; }
    var gtab = e.target.closest("[data-gtab]");
    if (gtab) { state.gtab = gtab.getAttribute("data-gtab"); save(); render(); return; }
    var act = e.target.closest("[data-act]");
    if (!act) return;
    var name = act.getAttribute("data-act");
    if (name === "login") {
      var acc = document.getElementById("acc");
      state.in = true;
      state.name = acc && acc.value ? acc.value : "演示导师";
      save();
      var next = "/home";
      try {
        next = sessionStorage.getItem("mentor-next") || "/home";
        sessionStorage.removeItem("mentor-next");
      } catch (err) {}
      if (next.indexOf("/user/") === 0) next = "/home";
      go(next);
      return;
    }
    if (name === "logout") { state.in = false; save(); go("/user/login"); return; }
    if (name === "edit") { state.edit = true; save(); render(); return; }
    if (name === "lesson") { state.edit = true; save(); render(); return; }
    if (name === "close") { state.edit = false; state.progress = false; state.exam = false; save(); render(); return; }
    if (name === "progress") { state.progress = true; save(); render(); return; }
    if (name === "signup") { state.signup = true; save(); render(); return; }
    if (name === "close-signup") { state.signup = false; save(); render(); return; }
    if (name === "exam") { state.exam = true; save(); render(); return; }
    if (name === "join") { alert("已加入梯队"); return; }
    if (name === "toast") alert(act.getAttribute("data-msg") || "已完成");
  });

  document.body.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target && e.target.id === "gl-key" && window.MentorGrind) {
      MentorGrind.setKeyword(e.target.value);
    }
  });

  window.MentorApp = { shell: shell, esc: esc, go: go, render: render };
  window.addEventListener("hashchange", render);
  if (!location.hash) location.hash = "/user/login";
  render();
})();
