(function () {
  "use strict";

  var P = "pages/work/categoryClass/";

  var cc = {
    leader: true,
    canEdit: true,
    mentor: true,
    /* 原型评审第二轮第28条：情绪档案权限。演示默认「导师」，可在注释面板切到「助教团」看隐藏效果。 */
    emotionRole: "导师",
    keyword: "",
    batch: false,
    selected: [],
    filter: { sign: "", team: "" },
    filterOpen: "",
    teamId: "t1",
    studentId: "s1",
    acceptType: 1,
    pickIds: [],
    sheet: null,
    dialog: null,
    statTab: "log",
    statFilter: "",
    campEnded: false,
    journalId: "j1",
    pickAward: "",
    imprintFilled: false,
    imprintStep: 1,
    imprint: { attend: "6", feature: "勇敢", life: "适应良好", appreciate: "会主动帮助同学" },
    form: { day: "1", text: "", kind: "log" },
    preview: null,
    logs: [
      { id: "j1", day: 5, type: "log", title: "每日反馈", text: "今天是初一，带宝贝看电影《小猪佩奇过大年》，之后去迪卡侬，本来是要去给她买轮滑鞋的，但她过去尝试打球，踢球，之后去打兵乓，打羽毛球，我们都试了，我感觉费了好大劲教她，她都学不会。最后我们决定…", photos: 3, audios: [], likes: 100, comments: 100, time: "21:06", more: true },
      { id: "j2", day: 4, type: "log", title: "每日反馈", text: "", photos: 0, audios: ["00:26", "20:26"], likes: 0, comments: 0, time: "14:09", more: false },
      { id: "j3", day: 3, type: "brief", title: "领袖营的第三天", text: "兰兰小朋友今天参加了定向越野的活动，他担任的是队里的磨子，非常用心地体验活动，全程都和组员齐心协力，最终4组赢得冠军！", photos: 0, audios: [], likes: 0, comments: 0, time: "23:20", more: false },
      { id: "j4", day: 3, type: "note", title: "", text: "兰兰因为组员的误会，起了一点小矛盾，好在队长及时出现现解决啦！", photos: 0, audios: [], likes: 0, comments: 0, time: "14:34", more: false },
      { id: "j-welcome-w", studentId: "s1", studentName: "王小满", date: "2026-10-14", time: "16:20", type: "sign", subtype: "迎接", text: "已在机场接到", photos: 2, signer: "林晓雯", mobile: "13800008801", audios: [], likes: 0, comments: 0 },
      { id: "j-lobby-l", studentId: "s2", studentName: "李可", date: "2026-10-16", time: "09:05", type: "sign", subtype: "大堂签到", text: "已到达大堂", photos: 2, signer: "林晓雯", mobile: "13800008801", audios: [], likes: 0, comments: 0 },
      { id: "j-lobby-z", studentId: "s3", studentName: "赵欣然", date: "2026-10-16", time: "09:05", type: "sign", subtype: "大堂签到", text: "", photos: 1, signer: "林晓雯", mobile: "13800008801", audios: [], likes: 0, comments: 0 },
      { id: "j-class-z", studentId: "s3", studentName: "赵欣然", date: "2026-10-16", time: "10:20", type: "sign", subtype: "班级确认", text: "", photos: 1, signer: "林晓雯", mobile: "13800008801", audios: [], likes: 0, comments: 0 },
      { id: "j-leave-w", studentId: "s1", studentName: "王小满", date: "2026-10-23", time: "11:05", type: "leave", subtype: "", text: "已送到航站楼", photos: 1, signer: "林晓雯", mobile: "13800008801", audios: [], likes: 0, comments: 0 }
    ]
  };

  /* 原型评审第一轮第5条：助教分组呈现入营次数。
     count 取该人员已结束的领袖营周营总数（含本营），与人才库/档案里的次数同源；
     只列助教团（corps = 助教团）的人员，导师团、统筹办、后勤团不参与分组。 */
  var assistants = [
    { id: "a1", name: "林晓雯", corps: "助教团", post: "带队助教", count: 6 },
    { id: "a2", name: "黄志远", corps: "助教团", post: "带队助教", count: 3 },
    { id: "a3", name: "苏晚", corps: "助教团", post: "带队助教", count: 4 },
    { id: "a4", name: "许宁", corps: "助教团", post: "见习副团", count: 2 },
    { id: "a5", name: "陈可", corps: "助教团", post: "助教副团", count: 5 },
    { id: "a6", name: "周宁", corps: "助教团", post: "见习副团", count: 1 },
    { id: "m1", name: "赵岚", corps: "导师团", post: "见习导师", count: 3 },
    { id: "m2", name: "孙衡", corps: "导师团", post: "导师副团", count: 4 },
    { id: "o1", name: "郑主任", corps: "统筹办", post: "统筹办主任", count: 8 },
    { id: "l1", name: "何倩", corps: "后勤团", post: "后勤专员", count: 2 }
  ];

  /* 第5条：只筛助教团。 */
  function aidePool() {
    return assistants.filter(function (a) { return a.corps === "助教团"; });
  }

  var students = [
    { id: "s1", name: "王小满", sex: "女", age: 12, city: "广州", type: "新训", health: "良好", dress: "130", travel: "家长接送", paper: "已填写", mother: "王敏", mm: "13800001101", father: "王强", fm: "13800002202", team: "t1", status: "已报读", eval: 2, same: true, award: "VV之星" },
    { id: "s2", name: "李可", sex: "男", age: 11, city: "深圳", type: "复训", health: "花粉过敏", dress: "140", travel: "", paper: "未填写", mother: "-", mm: "-", father: "李海", fm: "13900003303", team: "t1", status: "已报读", eval: 1, same: true, award: "" },
    { id: "s3", name: "赵欣然", sex: "女", age: 13, city: "杭州", type: "新训", health: "良好", dress: "150", travel: "南站大巴", paper: "已填写", mother: "赵丽", mm: "13700004404", father: "-", fm: "-", team: "", status: "已报读", eval: 2, same: false },
    { id: "s4", name: "陈启航", sex: "男", age: 12, city: "佛山", type: "新训", health: "良好", dress: "140", travel: "", paper: "未填写", mother: "-", mm: "-", father: "-", fm: "-", team: "", status: "取消", eval: 0, same: false },
    { id: "s5", name: "孙悦", sex: "女", age: 10, city: "东莞", type: "复训", health: "良好", dress: "120", travel: "", paper: "未填写", mother: "孙兰", mm: "13600005505", father: "-", fm: "-", team: "t2", status: "改期", eval: 2, same: true, award: "VV之星" }
  ];

  var teams = [
    { id: "t1", name: "1组", assistant: "林晓雯" },
    { id: "t2", name: "2组", assistant: "" }
  ];

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function student(id) {
    return students.filter(function (s) { return s.id === (id || cc.studentId); })[0] || students[0];
  }

  function team(id) {
    return teams.filter(function (t) { return t.id === (id || cc.teamId); })[0] || teams[0];
  }

  function countTeam(id) {
    return students.filter(function (s) { return s.team === id && s.status === "已报读"; }).length;
  }

  function has(path) {
    return path.indexOf(P) === 0;
  }

  function bar(title, right) {
    return '<header class="nav"><div><button type="button" data-back="1">返回</button></div><h1>' + esc(title) + '</h1><div class="side">' + (right || "") + "</div></header>";
  }

  var CAMP_START = "2026-10-16";
  var CAMP_END = "2026-10-22";
  var SIGNER = { name: "林晓雯", mobile: "13800008801" };

  function noteDot() {
    return '<div class="ex-anchor"><button type="button" class="ex-dot" data-note="42" title="需求 42"><span class="ex-num">1</span></button></div>';
  }

  /* 原型评审第一轮第1条：奖项不再设名额，去掉 quota。 */
  var AWARD_OPTIONS = [
    { name: "VV之星" },
    { name: "进步之星" }
  ];

  function awardUsed(name) {
    return students.filter(function (s) { return s.award === name && s.status !== "取消"; }).length;
  }

  function feedDot(num) {
    return '<div class="ex-anchor"><button type="button" class="ex-dot' + (num > 1 ? " ex-dot--shift" : "") + '" data-note="58" title="需求 58"><span class="ex-num">' + num + "</span></button></div>";
  }

  function idByName(name) {
    var row = students.filter(function (s) { return s.name === name; })[0];
    return row ? row.id : "";
  }

  function logDate(log) {
    if (log.date) return log.date;
    var parts = CAMP_START.split("-");
    var dt = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    dt.setDate(dt.getDate() + (log.day || 1) - 1);
    var m = dt.getMonth() + 1;
    var d = dt.getDate();
    return dt.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }

  function phaseOf(date) {
    var start = Date.parse(CAMP_START);
    var end = Date.parse(CAMP_END);
    var cur = Date.parse(date);
    var dayMs = 86400000;
    var before = Math.round((start - cur) / dayMs);
    var after = Math.round((cur - end) / dayMs);
    if (before > 0) return { sort: -before, html: "距离开营还有<em>" + before + "</em>天" };
    if (after > 0) return { sort: 100 + after, html: "结营已过<em>" + after + "</em>天" };
    return { sort: Math.round((cur - start) / dayMs) + 1, html: "第<em>" + (Math.round((cur - start) / dayMs) + 1) + "</em>天" };
  }

  function timeRank(log) {
    var matched = /^(\d{2}):(\d{2})$/.exec(log.time || "");
    if (!matched) return 9999;
    return Number(matched[1]) * 60 + Number(matched[2]);
  }

  function addCampRecord(input) {
    var rec = {
      id: input.id || ("j" + Date.now()),
      studentId: input.studentId || idByName(input.studentName),
      studentName: input.studentName || "",
      date: input.date || "2026-10-15",
      time: input.time || "15:04",
      type: input.type,
      subtype: input.subtype || "",
      text: input.remark || "",
      photos: input.photos || 0,
      signer: input.signer || SIGNER.name,
      mobile: input.mobile || SIGNER.mobile,
      audios: [],
      likes: 0,
      comments: 0
    };
    cc.logs.push(rec);
    return rec;
  }

  function removeCampRecord(id) {
    cc.logs = cc.logs.filter(function (log) { return log.id !== id; });
  }

  function indexPage() {
    var total = students.filter(function (s) { return s.status === "已报读"; }).length;
    var unassigned = students.filter(function (s) { return !s.team && s.status === "已报读"; }).length;
    var changed = students.filter(function (s) { return s.status !== "已报读"; }).length;
    var qDone = students.filter(function (s) { return s.paper === "已填写" && s.travel; }).length;
    var pDone = students.filter(function (s) { return s.paper === "已填写"; }).length;
    var html = bar("助教分组", '<button type="button" data-cc="role">' + (cc.leader ? "团长" : "助教") + "</button>");
    html += '<div class="body cc">' + noteDot();
    if (cc.leader) {
      html += '<div class="cc-stat"><div class="cc-class">A1班</div>';
      html += '<div class="cc-box"><div class="cc-box-title">学员数据</div><div class="cc-metrics">';
      [["学员总数（人）", total, "all"], ["未分配组（人）", unassigned, "free"], ["取消/改期（人）", changed, "changed"]].forEach(function (item) {
        html += '<button type="button" data-cc="students" data-filter="' + item[2] + '"><b>' + item[0] + '</b><strong>' + item[1] + ' ›</strong></button>';
      });
      html += '</div></div>';
      html += '<div class="cc-box cc-box--soft"><div class="cc-box-title">收集情况</div><div class="cc-metrics">';
      html += "<div><b>离营问卷收集</b><strong>" + qDone + "/" + total + "</strong></div>";
      html += "<div><b>家长问卷收集</b><strong>" + pDone + "/" + total + "</strong></div>";
      html += "</div></div></div>";
      html += '<div class="cc-entries">';
      html += '<button type="button" data-go="' + P + 'growthJournal/statistics" style="color:#CF893D">日志/印记统计 ›</button>';
      html += '<button type="button" data-cc="emotion" style="color:#E84E73">情绪档案 ›</button>';
      html += "</div>";
    }
    html += '<h2 class="cc-h">班级小组</h2>';
    teams.forEach(function (item) {
      var n = countTeam(item.id);
      var q = students.filter(function (s) { return s.team === item.id && s.travel; }).length;
      var p = students.filter(function (s) { return s.team === item.id && s.paper === "已填写"; }).length;
      html += '<button type="button" class="cc-group" data-cc="team" data-id="' + item.id + '">';
      html += '<div class="cc-group__top"><b>' + esc(item.name) + " （共" + n + "人）</b><span>" + (item.assistant ? "助教：" + esc(item.assistant) : "未安排助教 ›") + "</span></div>";
      html += '<div class="cc-group__nums"><span>离营问卷<em>（' + q + "/" + n + "）</em></span><span>家长问卷<em>（" + p + "/" + n + "）</em></span></div></button>";
    });
    html += "</div>";
    return html;
  }

  function filteredStudents() {
    return students.filter(function (s) {
      var key = cc.keyword.trim();
      if (key && (s.name + s.mm + s.id).indexOf(key) < 0) return false;
      if (cc.filter.sign === "已报读" && s.status !== "已报读") return false;
      if (cc.filter.sign === "取消/改期" && s.status === "已报读") return false;
      if (cc.filter.team === "未分配" && s.team) return false;
      if (cc.filter.team && cc.filter.team !== "未分配" && team(s.team).name !== cc.filter.team) return false;
      if (cc.listType === "free" && s.team) return false;
      if (cc.listType === "changed" && s.status === "已报读") return false;
      return true;
    });
  }

  function studentList() {
    var html = bar("学员列表", cc.canEdit ? '<button type="button" data-cc="batch">' + (cc.batch ? "完成" : "批量") + "</button>" : "");
    html += '<div class="body cc">';
    html += '<div class="cc-search"><input id="cc-kw" placeholder="搜索学员ID/电话号码" value="' + esc(cc.keyword) + '" /><button type="button" data-cc="search">搜索</button></div>';
    html += '<div class="cc-filters">';
    html += '<button type="button" data-cc="clear-filter">全部</button>';
    html += '<button type="button" data-cc="open-filter" data-key="sign">' + esc(cc.filter.sign || "报读情况") + " ▾</button>";
    html += '<button type="button" data-cc="open-filter" data-key="team">' + esc(cc.filter.team || "分配情况") + " ▾</button>";
    html += "</div>";
    if (cc.filterOpen) {
      var opts = cc.filterOpen === "sign" ? ["已报读", "取消/改期"] : ["未分配", "1组", "2组"];
      html += '<div class="menu">';
      opts.forEach(function (name) {
        html += '<button type="button" data-cc="set-filter" data-val="' + esc(name) + '">' + esc(name) + "</button>";
      });
      html += "</div>";
    }
    html += '<div class="cc-people">';
    filteredStudents().forEach(function (s) {
      var on = cc.selected.indexOf(s.id) >= 0;
      html += '<button type="button" class="cc-person" data-cc="pick" data-id="' + s.id + '">';
      if (cc.batch) html += '<i class="cc-check' + (on ? " is-on" : "") + '"></i>';
      html += '<b class="avatar">' + esc(s.name.slice(0, 1)) + "</b><div><div class=\"cc-person__name\">" + esc(s.name);
      if (s.status === "取消") html += '<em class="pill">取消</em>';
      if (s.status === "改期") html += '<em class="pill pill--orange">改期</em>';
      html += '<em class="pill ' + (s.type === "复训" ? "pill--yellow" : "pill--green") + '">' + s.type + "</em></div>";
      html += "<div>" + esc(s.sex) + "｜" + s.age + "岁｜" + esc(s.city) + "</div>";
      html += "<div>A1班 / " + (s.team ? esc(team(s.team).name) : '<span class="red">未分配</span>') + "</div></div></button>";
    });
    if (!filteredStudents().length) html += '<div class="empty">暂无学员</div>';
    html += "</div></div>";
    if (cc.batch) html += '<div class="foot"><button type="button" class="btn ghost" data-cc="batch-cancel">取消</button><button type="button" class="btn" data-cc="move-to">移动至</button></div>';
    return html;
  }

  function movePage() {
    var names = students.filter(function (s) { return cc.selected.indexOf(s.id) >= 0; }).map(function (s) { return s.name; });
    var html = bar("移动分组") + '<div class="body cc"><h2 class="cc-h">班级小组</h2>';
    teams.forEach(function (item, i) {
      html += '<button type="button" class="cc-move" data-cc="move-pick" data-id="' + item.id + '"><b>' + (i + 1) + "</b><span>" + esc(item.name) + "（共" + countTeam(item.id) + '人）</span><em>' + (item.assistant ? "助教：" + esc(item.assistant) : "未安排助教") + "</em></button>";
    });
    html += "</div>";
    if (cc.dialog) {
      html += '<div class="cc-mask"><div class="cc-dialog"><p>' + esc(cc.dialog) + '</p><div><button type="button" data-cc="dialog-no">取消</button><button type="button" data-cc="dialog-yes">确认</button></div></div></div>';
    }
    return html;
  }

  function detailPage() {
    var g = team(cc.teamId);
    var list = students.filter(function (s) { return s.team === g.id; });
    var html = bar("助教分组") + '<div class="body cc"><div class="ex-anchor"><button type="button" class="ex-dot" data-note="35" title="需求 35"><span class="ex-num">1</span></button></div>';
    html += '<div class="cc-team-name"><em>小组</em>' + esc(g.name) + "</div>";
    html += '<div class="cc-line"><b>本组助教</b>' + (cc.canEdit ? '<button type="button" data-cc="edit" data-type="1">调整助教 ›</button>' : "") + "</div>";
    html += '<div class="cc-avatars">';
    assistants.filter(function (a) { return a.corps === "助教团" && (!g.assistant || a.name === g.assistant || g.id === "t1"); }).forEach(function (a) {
      if (g.id === "t2" && a.name !== g.assistant && g.assistant) return;
      if (g.id === "t2" && !g.assistant) return;
      html += '<div><b>' + esc(a.name.slice(0, 1)) + "</b><span>" + esc(a.name) + '</span><em class="cc-cnt">入营 ' + a.count + " 次</em></div>";
    });
    if (g.id === "t2" && !g.assistant) html += '<div class="empty">未安排助教</div>';
    html += "</div>";
    html += '<div class="cc-line"><b>学员（共' + list.length + "人）</b>" + (cc.canEdit ? '<button type="button" data-cc="edit" data-type="2">调整学员 ›</button>' : "") + "</div>";
    html += '<div class="cc-stu-card">';
    if (!list.length) html += '<div class="empty">暂无学员</div>';
    list.forEach(function (s) {
      html += '<div class="cc-stu">';
      html += '<button type="button" class="cc-stu__main" data-cc="growth" data-id="' + s.id + '">';
      html += '<b>' + esc(s.name.slice(0, 1)) + '</b><div><div class="cc-person__name">' + esc(s.name);
      if (s.eval === 1) html += '<em class="pill pill--green">标杆</em>';
      if (s.award) html += '<em class="pill pill--award">' + esc(s.award) + "</em>";
      html += "</div><div>" + esc(s.sex) + "｜" + s.age + "岁｜" + esc(s.city) + "｜<em>" + s.type + "</em></div>";
      html += "<div>健康状况：" + esc(s.health) + "　营服尺码：" + esc(s.dress) + "</div>";
      html += "<div>离营方式：" + (s.travel ? esc(s.travel) : "未填写") + "　家长问卷：" + esc(s.paper) + "</div></div></button>";
      if (cc.canEdit) html += '<button type="button" class="cc-more" data-cc="more" data-id="' + s.id + '">···</button>';
      if (s.eval === 2 && cc.mentor) html += '<button type="button" class="cc-bench" data-cc="bench" data-id="' + s.id + '">评为标杆</button>';
      html += '<div class="cc-parents"><div><b>母亲</b><span>' + esc(s.mother) + "</span><span>" + esc(s.mm) + '</span></div><div><b>父亲</b><span>' + esc(s.father) + "</span><span>" + esc(s.fm) + "</span></div></div></div>";
    });
    html += "</div></div>";
    if (cc.sheet) {
      html += '<div class="cc-mask" data-cc="close-sheet"><div class="cc-sheet">';
      if (student(cc.sheet).eval === 2) html += '<button type="button" data-cc="bench" data-id="' + cc.sheet + '">评为标杆学员</button>';
      if (!student(cc.sheet).award) html += '<button type="button" data-cc="award" data-id="' + cc.sheet + '">学员评优</button>';
      else html += '<button type="button" data-cc="award" data-id="' + cc.sheet + '">重新提交评优</button>';
      html += '<button type="button" data-cc="move-one" data-id="' + cc.sheet + '">移至其他小组</button>';
      html += '<button type="button" data-cc="close-sheet">取消</button></div></div>';
    }
    return html;
  }

  function editPage() {
    var g = team(cc.teamId);
    var aide = cc.acceptType === 1;
    var pool = aide ? aidePool() : students.filter(function (s) { return s.status === "已报读"; });
    var key = cc.keyword.trim();
    var html = bar(g.name) + '<div class="body cc">';
    html += '<div class="cc-search"><input id="cc-kw" placeholder="' + (aide ? "搜索助教" : "搜索学员") + '" value="' + esc(cc.keyword) + '" /><button type="button" data-cc="search">搜索</button></div>';
    if (aide) html += '<div class="cc-line"><b>只列助教团</b><em class="cc-hint">导师团、统筹办、后勤团不参与分组</em></div>';
    html += '<div class="cc-line"><b>' + (aide ? "本组助教" : "本组学员") + "</b></div><div class=\"cc-avatars\">";
    pool.filter(function (p) { return cc.pickIds.indexOf(p.id) >= 0; }).forEach(function (p) {
      html += "<div><b>" + esc(p.name.slice(0, 1)) + "</b><span>" + esc(p.name) + "</span></div>";
    });
    html += '</div><div class="cc-people">';
    pool.forEach(function (p) {
      if (key && p.name.indexOf(key) < 0) return;
      var on = cc.pickIds.indexOf(p.id) >= 0;
      var sub = aide ? esc(p.post) + " · 入营 " + p.count + " 次" : "";
      html += '<button type="button" class="cc-person" data-cc="toggle-pick" data-id="' + p.id + '"><i class="cc-check' + (on ? " is-on" : "") + '"></i><b class="avatar">' + esc(p.name.slice(0, 1)) + "</b><div>" + esc(p.name) + (sub ? '<em class="cc-cnt">' + sub + "</em>" : "") + "</div></button>";
    });
    html += "</div></div>";
    html += '<div class="foot"><button type="button" class="btn ghost" data-back="1">取消</button><button type="button" class="btn" data-cc="edit-ok">确认</button></div>';
    return html;
  }

  function awardPage() {
    var s = student();
    var html = bar("学员评优") + '<div class="body cc"><div class="detail">';
    html += '<div class="row"><b>学员</b><span>' + esc(s.name) + "</span></div>";
    html += '<div class="row"><b>班级</b><span>A1班 / ' + esc(team(s.team).name || "-") + "</span></div></div>";
    if (s.award) html += '<div class="cc-line"><b>当前评优</b>' + esc(s.award) + '，重新提交后原记录变为已失效</div>';
    html += '<div class="aw-list">';
    AWARD_OPTIONS.forEach(function (item) {
      html += '<button type="button" class="aw-opt' + (cc.pickAward === item.name ? " is-on" : "") + '" data-cc="award-pick" data-name="' + esc(item.name) + '">' + esc(item.name) + "</button>";
    });
    html += "</div></div>";
    html += '<div class="foot"><button type="button" class="btn" data-cc="award-ok">提交</button></div>';
    return html;
  }

  function benchPage() {
    var s = student();
    var html = bar("标杆学员评比") + '<div class="body cc"><div class="detail">';
    [["学员姓名", s.name], ["班级名称", "A1班"], ["组数", team(s.team).name || "-"], ["Q营", "华东基地-湖州"]].forEach(function (row) {
      html += '<div class="row"><b>' + row[0] + "</b><span>" + esc(row[1]) + "</span></div>";
    });
    html += '</div><div class="form"><div class="field"><label>主要事迹</label><textarea id="cc-deed" maxlength="500" placeholder="请输入评选标杆学员主要事迹"></textarea></div>';
    html += '<div class="field"><label>学员照片（最多3张）</label><input placeholder="上传照片" /></div></div></div>';
    html += '<div class="foot"><button type="button" class="btn" data-cc="bench-ok">确认提交</button></div>';
    return html;
  }

  function statPage() {
    var html = bar("日志/印记统计") + '<div class="body cc">' + noteDot() + feedDot(2) + '<div class="cc-filters">';
    html += '<button type="button" class="' + (cc.statTab === "log" ? "is-on" : "") + '" data-cc="stat" data-val="log">日志统计</button>';
    html += '<button type="button" class="' + (cc.statTab === "imprint" ? "is-on" : "") + '" data-cc="stat" data-val="imprint">印记统计</button></div>';
    html += '<div class="cc-filters">';
    if (cc.statTab === "log") html += '<button type="button" data-cc="stat-filter">第几天 / 反馈状态 ▾</button>';
    else html += '<button type="button" data-cc="stat-filter">是否完善 ▾</button>';
    html += "</div>";
    students.filter(function (s) { return s.team; }).forEach(function (s) {
      var ok = cc.statTab === "log" ? s.paper === "已填写" : cc.imprintFilled && s.id === "s1";
      html += '<button type="button" class="cc-person" data-cc="growth" data-id="' + s.id + '"><b class="avatar">' + esc(s.name.slice(0, 1)) + '</b><div><div class="cc-person__name">' + esc(s.name) + '<em class="pill ' + (ok ? "pill--green" : "") + '">' + (cc.statTab === "log" ? (ok ? "已反馈" : "未反馈") : (ok ? "已完善" : "未完善")) + "</em></div><div>A1班 / " + esc(team(s.team).name) + "</div></div>";
      if (cc.statTab === "log") html += "<span>2天</span>";
      else if (ok) html += '<button type="button" data-go="' + P + 'growthImprint/report">预览</button>';
      html += "</button>";
    });
    html += "</div>";
    return html;
  }

  function autoCard(log) {
    var leave = log.type === "leave";
    var html = '<div class="gj-card gj-card--auto">';
    if (log.photos) {
      html += '<div class="gj-photos">';
      for (var n = 0; n < log.photos; n++) {
        html += '<button type="button" class="ph ph-' + ((n % 3) + 1) + '" data-cc="preview" data-index="' + n + '"></button>';
      }
      html += "</div>";
    }
    if (log.text) html += "<p>" + esc(log.text) + "</p>";
    html += '<div class="gj-card__foot"><span class="gj-tag ' + (leave ? "gj-tag--leave" : "gj-tag--sign") + '">' + (leave ? "签离" : "签到") + "</span>";
    if (!leave && log.subtype) html += '<span class="gj-sub">' + esc(log.subtype) + "</span>";
    html += '<span class="gj-time">' + esc(log.time) + "</span></div>";
    html += '<div class="gj-sign-meta"><span>签到人：' + esc(log.signer || "-") + "</span><span>联系电话：" + esc(log.mobile || "-") + "</span></div></div>";
    return html;
  }

  /* 原型评审第二轮第28条：情绪档案只开放给导师团与统筹办。
     岗位取当前演示身份；cc.emotionRole 可在注释面板里切换，便于演示权限差异。 */
  function emotionPost() {
    if (cc.emotionRole) return cc.emotionRole;
    var post = "";
    if (window.EX && window.EX.actor) post = window.EX.actor().post || "";
    else if (window.APP && window.APP.aideChief && window.APP.aideChief()) post = "助教团长";
    /* 演示默认身份是「演示导师」，没有取到岗位时按导师团处理。 */
    return post || "导师";
  }

  function canViewEmotion() {
    /* 情绪档案仅导师团与统筹办可查看。演示用 cc.emotionRole 控制。 */
    return cc.emotionRole === "导师" || cc.emotionRole === "统筹办";
  }

  function growthPage() {
    var s = student();
    var buckets = [];
    cc.logs.filter(function (log) {
      if (log.type === "sign" || log.type === "leave") return log.studentId === s.id;
      return true;
    }).forEach(function (log) {
      var phase = phaseOf(logDate(log));
      var bucket = null;
      buckets.forEach(function (item) { if (item.sort === phase.sort) bucket = item; });
      if (!bucket) {
        bucket = { sort: phase.sort, title: phase.html, items: [] };
        buckets.push(bucket);
      }
      bucket.items.push(log);
    });
    buckets.sort(function (a, b) { return b.sort - a.sort; });
    buckets.forEach(function (bucket) {
      bucket.items.sort(function (a, b) { return timeRank(b) - timeRank(a); });
    });
    var html = bar("学员成长", '<button type="button" class="gj-switch" data-cc="switch-camp">切换周营</button>');
    html += '<div class="body gj-page">' + noteDot() + feedDot(2);
    html += '<div class="gj-head">';
    html += '<div class="gj-banner"><div class="gj-banner__title">我的6Q成长日记</div><div class="gj-mascot"></div></div>';
    var again = s.type === "复训";
    html += '<div class="gj-user"><b>' + esc(s.name.slice(0, 1)) + '</b><div class="gj-user__body">';
    html += '<div class="gj-user__name"><span class="gj-user__n">6Q' + esc(s.name) + '</span><i class="' + (s.sex === "女" ? "sex-f" : "sex-m") + '"></i>';
    html += '<span class="gj-user__loc">' + esc(s.city) + '｜<em' + (again ? ' class="is-again"' : "") + ">" + esc(s.type) + "</em></span></div>";
    html += '<div class="gj-user__tags"><em>' + s.age + "岁</em><em>EQ大1班</em><em>" + esc(team(s.team).name || "1组") + "</em></div></div></div>";
    html += '<div class="gj-nav">';
    html += '<button type="button" data-cc="refresh"><i class="nav-1"></i>每日反馈</button>';
    html += '<button type="button" data-go="' + P + 'growthImprint/entrance"><i class="nav-2"></i>成长印记</button>';
    html += '<button type="button" data-go="' + P + 'growthJournal/leaveCamp"><i class="nav-3"></i>离营方式</button>';
    /* 原型评审第二轮第28条：学员成长里增加「情绪档案」入口。
       仅导师团、统筹办可见可进；其他岗位不显示该入口。 */
    if (canViewEmotion()) html += '<button type="button" data-cc="emotion" class="gj-nav__emotion"><i class="nav-4"></i>情绪档案</button>';
    html += "</div></div>";
    html += '<div class="gj-steps">';
    buckets.forEach(function (day, index) {
      html += '<div class="gj-step' + (index === 0 ? " is-first" : "") + (index === buckets.length - 1 ? " is-last" : "") + '"><div class="gj-step__title">' + day.title + "</div>";
      day.items.forEach(function (log) {
        if (log.type === "sign" || log.type === "leave") {
          html += autoCard(log);
          return;
        }
        html += '<div class="gj-card" data-cc="journal" data-id="' + log.id + '">';
        if (log.photos) {
          var tones = [
            "linear-gradient(165deg,#1b2430 0 36%,#4d6078 36% 58%,#e4b56a 58% 78%,#2a3340 78%)",
            "linear-gradient(160deg,#f6f0e4 0 28%,#e7c39a 28% 48%,#c17a45 48% 70%,#f3eadc 70%)",
            "linear-gradient(180deg,#d5e3ee 0 42%,#8ea6bb 42% 68%,#f7f8f9 68%)"
          ];
          html += '<div class="gj-photos">';
          for (var n = 0; n < log.photos; n++) html += '<span class="ph" style="background:' + tones[n % 3] + '"></span>';
          html += "</div>";
        }
        if (log.audios && log.audios.length) {
          log.audios.forEach(function (dur) {
            var wide = String(dur).indexOf("20:") === 0;
            html += '<div class="gj-audio' + (wide ? " is-wide" : "") + '"><i></i><span>' + esc(dur) + "</span></div>";
          });
        }
        if (log.title && log.type === "brief") html += '<div class="gj-card__h">' + esc(log.title) + "</div>";
        if (log.text) html += '<p class="' + (log.more ? "is-clamp" : "") + '">' + esc(log.text) + (log.more ? '<em><i>…</i>全文</em>' : "") + "</p>";
        html += '<div class="gj-card__foot">';
        if (log.type === "log" || log.type === "brief") {
          html += '<span class="gj-tag' + (log.type === "brief" ? " gj-tag--brief" : "") + '">' + (log.type === "brief" ? "班级简报" : "每日反馈") + "</span>";
        }
        if (log.type === "log" && (log.likes || log.comments)) {
          html += '<button type="button" data-cc="like-list" data-id="' + log.id + '">赞 ' + log.likes + "</button>";
          html += '<button type="button" data-cc="comment">评 ' + log.comments + "</button>";
        }
        html += '<span class="gj-time">' + esc(log.time) + "</span></div></div>";
      });
      html += "</div>";
    });
    html += "</div></div>";
    if (!cc.campEnded) html += '<button type="button" class="cc-add gj-add" data-cc="add-log">+</button>';
    if (cc.dialog) html += '<div class="cc-mask"><div class="cc-dialog"><p>' + esc(cc.dialog) + '</p><div><button type="button" data-cc="dialog-no">我知道了</button></div></div></div>';
    if (cc.preview != null) html += '<div class="cc-mask" data-cc="preview-close"><div class="gj-preview"><span class="ph ph-' + ((cc.preview % 3) + 1) + '"></span><button type="button" data-cc="preview-close">关闭</button></div></div>';
    return html;
  }

  function journalPage() {
    var log = cc.logs.filter(function (item) { return item.id === cc.journalId; })[0] || cc.logs[0];
    var html = bar(log.title, '<button type="button" data-cc="journal-more">更多</button>');
    html += '<div class="body cc"><div class="cc-post"><b>林</b><div>助教林晓雯</div><p>' + esc(log.text || log.title) + "</p>";
    html += '<div class="cc-post__ops"><span>09-18 21:06</span><button type="button" data-cc="like">' + (log.liked ? "已赞" : "点赞") + " " + log.likes + '</button><button type="button" data-cc="comment">评论 ' + log.comments + "</button></div></div></div>";
    if (cc.sheet === "journal") {
      html += '<div class="cc-mask" data-cc="close-sheet"><div class="cc-sheet"><button type="button" data-cc="journal-edit">编辑</button><button type="button" data-cc="journal-del">删除</button><button type="button" data-cc="close-sheet">取消</button></div></div>';
    }
    if (cc.dialog) html += '<div class="cc-mask"><div class="cc-dialog"><p>' + esc(cc.dialog) + '</p><div><button type="button" data-cc="dialog-no">取消</button><button type="button" data-cc="dialog-yes">确定</button></div></div></div>';
    return html;
  }

  function formPage() {
    var title = cc.form.kind === "brief" ? "班级简报" : "发布反馈";
    var html = '<header class="nav nav--light"><div><button type="button" data-back="1">返回</button></div><h1>' + title + "</h1><div></div></header>";
    html += '<div class="body cc"><div class="form">';
    html += '<div class="field"><label>记录时间</label><select id="cc-day"><option>第1天</option><option>第2天</option><option>第3天</option></select></div>';
    if (cc.form.kind === "brief") html += '<div class="field"><label>发布班级</label><input value="A1班" /></div>';
    html += '<div class="field"><label>内容</label><textarea id="cc-text" maxlength="1500" placeholder="写下这一刻的想法吧～">' + esc(cc.form.text) + "</textarea></div>";
    html += '<div class="field"><label>语音 / 图片</label><input placeholder="可添加语音和图片" /></div></div></div>';
    html += '<div class="foot"><button type="button" class="btn" data-cc="publish">发布</button></div>';
    return html;
  }

  function leavePage() {
    var s = student();
    var html = bar("离营详情") + '<div class="body cc"><div class="detail">';
    [["离营方式", s.travel || "未填写"], ["接离方式", s.travel ? "家长亲自接" : "-"], ["凭证", "-"], ["接待", s.travel === "南站大巴" ? "站点：广州南站" : "航班楼：-"]].forEach(function (row) {
      html += '<div class="row"><b>' + row[0] + "</b><span>" + esc(row[1]) + "</span></div>";
    });
    html += "</div></div>";
    return html;
  }

  function imprintEntrance() {
    var html = bar("成长印记") + noteDot();
    html += '<div class="gi-page"><div class="gi-bg"></div><div class="gi-actions">';
    if (!cc.imprintFilled) html += '<button type="button" class="gi-btn" data-cc="imprint-start" data-mode="1">完型成长印记</button>';
    else {
      html += '<button type="button" class="gi-btn gi-btn--soft" data-go="' + P + 'growthImprint/report">立即查看</button>';
      if (cc.campEnded && !cc.canEdit) html += '<button type="button" class="gi-btn gi-btn--gray" disabled>已结营，无法编辑</button>';
      else html += '<button type="button" class="gi-btn" data-cc="imprint-start" data-mode="2">继续编辑</button>';
    }
    html += "</div></div>";
    return html;
  }

  function imprintForm() {
    var steps = ["学员考勤", "Q营特征", "生活情况", "欣赏和变化"];
    var html = bar("成长印记填写") + '<div class="body cc">' + noteDot() + '<div class="cc-steps">';
    steps.forEach(function (name, i) {
      html += '<span class="' + (cc.imprintStep >= i + 1 ? "is-on" : "") + '">' + (i + 1) + " " + name + "</span>";
    });
    html += "</div><div class=\"form\">";
    if (cc.imprintStep === 1) html += '<div class="field"><label>出勤天数</label><input id="cc-step" value="' + esc(cc.imprint.attend) + '" /></div><div class="field"><label>请假天数</label><input value="0" /></div>';
    if (cc.imprintStep === 2) html += '<div class="field"><label>Q营特征</label><input id="cc-step" value="' + esc(cc.imprint.feature) + '" placeholder="请描述学员特征" /></div>';
    if (cc.imprintStep === 3) html += '<div class="field"><label>生活情况</label><textarea id="cc-step">' + esc(cc.imprint.life) + "</textarea></div>";
    if (cc.imprintStep === 4) html += '<div class="field"><label>欣赏和变化</label><textarea id="cc-step">' + esc(cc.imprint.appreciate) + "</textarea></div>";
    html += "</div></div><div class=\"foot\">";
    if (cc.imprintStep > 1) html += '<button type="button" class="btn ghost" data-cc="step-prev">上一步</button>';
    if (cc.imprintStep < 4) html += '<button type="button" class="btn" data-cc="step-next">下一步</button>';
    else html += '<button type="button" class="btn" data-cc="step-done">完成</button>';
    html += "</div>";
    if (cc.dialog) html += '<div class="cc-mask"><div class="cc-dialog"><p>' + esc(cc.dialog) + '</p><div><button type="button" data-cc="dialog-no">不保存</button><button type="button" data-cc="dialog-yes">保存</button></div></div></div>';
    return html;
  }

  function reportPage() {
    var s = student();
    return bar("成长印记") + '<div class="body cc"><div class="cc-report"><b class="avatar">' + esc(s.name.slice(0, 1)) + "</b><h3>亲爱的" + esc(s.name) + "学员</h3><p>结营不是终点，而是带着成长印记奔赴新旅程的起点。</p><div class=\"cc-rate\"><span>出勤率</span><strong>100%</strong></div><p>特征：" + esc(cc.imprint.feature) + "</p><p>生活：" + esc(cc.imprint.life) + "</p><p>欣赏：" + esc(cc.imprint.appreciate) + "</p></div></div>";
  }

  function successPage() {
    return bar("成长印记") + '<div class="body"><div class="ok"><i>✓</i><div>已完成成长印记填写</div><button type="button" class="btn" data-go="' + P + 'growthImprint/entrance" style="margin-top:24px">返回</button></div></div>';
  }

  function render(path) {
    if (path === P + "index") return indexPage();
    if (path === P + "studentList") return studentList();
    if (path === P + "moveGroupList") return movePage();
    if (path === P + "detail") return detailPage();
    if (path === P + "edit") return editPage();
    if (path === P + "benchmarkStudents") return benchPage();
    if (path === P + "studentAward") return awardPage();
    if (path === P + "growthJournal/statistics") return statPage();
    if (path === P + "growthJournal/index") return growthPage();
    if (path === P + "growthJournal/detail") return journalPage();
    if (path === P + "growthJournal/form") return formPage();
    if (path === P + "growthJournal/leaveCamp") return leavePage();
    if (path === P + "growthImprint/entrance") return imprintEntrance();
    if (path === P + "growthImprint/form") return imprintForm();
    if (path === P + "growthImprint/report") return reportPage();
    if (path === P + "growthImprint/success") return successPage();
    return "";
  }

  function saveStep() {
    var input = document.getElementById("cc-step");
    if (!input) return;
    var val = input.value;
    if (cc.imprintStep === 1) cc.imprint.attend = val;
    if (cc.imprintStep === 2) cc.imprint.feature = val;
    if (cc.imprintStep === 3) cc.imprint.life = val;
    if (cc.imprintStep === 4) cc.imprint.appreciate = val;
  }

  function handle(el, api) {
    var act = el.getAttribute("data-cc");
    if (!act) return false;
    if (act === "role") { cc.leader = !cc.leader; cc.canEdit = cc.leader; api.render(); return true; }
    if (act === "emotion") { api.go("pages/work/emotion/archive"); return true; }
    if (act === "students") { cc.listType = el.getAttribute("data-filter"); cc.keyword = ""; api.go(P + "studentList"); return true; }
    if (act === "team") { cc.teamId = el.getAttribute("data-id"); api.go(P + "detail"); return true; }
    if (act === "search") { var input = document.getElementById("cc-kw"); cc.keyword = input ? input.value : ""; api.render(); return true; }
    if (act === "batch") { cc.batch = !cc.batch; if (!cc.batch) cc.selected = []; api.render(); return true; }
    if (act === "batch-cancel") { cc.batch = false; cc.selected = []; api.render(); return true; }
    if (act === "clear-filter") { cc.filter = { sign: "", team: "" }; cc.listType = ""; api.render(); return true; }
    if (act === "open-filter") { cc.filterOpen = el.getAttribute("data-key"); api.render(); return true; }
    if (act === "set-filter") {
      cc.filter[cc.filterOpen] = el.getAttribute("data-val");
      cc.filterOpen = "";
      api.render();
      return true;
    }
    if (act === "pick") {
      var id = el.getAttribute("data-id");
      if (!cc.batch) return true;
      var i = cc.selected.indexOf(id);
      if (i >= 0) cc.selected.splice(i, 1); else cc.selected.push(id);
      api.render();
      return true;
    }
    if (act === "move-to") {
      if (!cc.selected.length) { api.toast("请选择需要移动的学员"); return true; }
      api.go(P + "moveGroupList");
      return true;
    }
    if (act === "move-pick") {
      var names = students.filter(function (s) { return cc.selected.indexOf(s.id) >= 0; }).map(function (s) { return s.name; });
      cc.moveTeam = el.getAttribute("data-id");
      cc.dialog = "确认将学员【" + names.join("、") + "】移动至【" + team(cc.moveTeam).name + "】吗？";
      cc.dialogYes = "move";
      api.render();
      return true;
    }
    if (act === "dialog-no") {
      var backForm = cc.dialogYes === "leave-form";
      cc.dialog = null;
      cc.dialogYes = "";
      api.render();
      if (backForm) api.back();
      return true;
    }
    if (act === "dialog-yes") {
      if (cc.dialogYes === "move") {
        students.forEach(function (s) { if (cc.selected.indexOf(s.id) >= 0) s.team = cc.moveTeam; });
        cc.selected = [];
        cc.batch = false;
        api.toast("修改成功！");
        cc.dialog = null;
        api.back();
        return true;
      }
      if (cc.dialogYes === "delete-log") {
        cc.logs = cc.logs.filter(function (log) { return log.id !== cc.journalId; });
        cc.dialog = null;
        api.toast("已删除");
        api.back();
        return true;
      }
      if (cc.dialogYes === "leave-form") {
        saveStep();
        cc.dialog = null;
        api.toast("已保存");
        api.back();
        return true;
      }
      cc.dialog = null;
      api.render();
      return true;
    }
    if (act === "growth") {
      var person = student(el.getAttribute("data-id"));
      if (!person.same) { api.toast("该学员和您不在一个小组哦~"); return true; }
      cc.studentId = person.id;
      api.go(P + "growthJournal/index");
      return true;
    }
    if (act === "more") { cc.sheet = el.getAttribute("data-id"); cc.studentId = cc.sheet; api.render(); return true; }
    if (act === "close-sheet") { cc.sheet = null; api.render(); return true; }
    if (act === "move-one") {
      cc.selected = [el.getAttribute("data-id")];
      cc.sheet = null;
      api.go(P + "moveGroupList");
      return true;
    }
    if (act === "bench") { cc.studentId = el.getAttribute("data-id") || cc.studentId; cc.sheet = null; api.go(P + "benchmarkStudents"); return true; }
    if (act === "award") {
      var person = student(el.getAttribute("data-id") || cc.studentId);
      cc.studentId = person.id;
      cc.pickAward = person.award || "";
      cc.sheet = null;
      api.go(P + "studentAward");
      return true;
    }
    if (act === "award-pick") { cc.pickAward = el.getAttribute("data-name"); api.render(); return true; }
    if (act === "award-ok") {
      var current = student();
      if (!cc.pickAward) { api.toast("请选择评优奖项"); return true; }
      current.award = cc.pickAward;
      api.toast(current.award ? "已重新提交，原记录变为已失效" : "提交成功");
      api.back();
      return true;
    }
    if (act === "bench-ok") {
      var deed = document.getElementById("cc-deed");
      if (!deed || !deed.value.trim()) { api.toast("请输入评选标杆学员主要事迹"); return true; }
      student().eval = 1;
      api.toast("提交成功");
      api.back();
      return true;
    }
    if (act === "edit") {
      cc.acceptType = Number(el.getAttribute("data-type"));
      cc.pickIds = cc.acceptType === 1 ? aidePool().filter(function (a) { return a.name === team().assistant; }).map(function (a) { return a.id; }) : students.filter(function (s) { return s.team === cc.teamId; }).map(function (s) { return s.id; });
      cc.keyword = "";
      api.go(P + "edit");
      return true;
    }
    if (act === "toggle-pick") {
      var pid = el.getAttribute("data-id");
      var idx = cc.pickIds.indexOf(pid);
      if (idx >= 0) cc.pickIds.splice(idx, 1); else cc.pickIds.push(pid);
      api.render();
      return true;
    }
    if (act === "edit-ok") {
      if (cc.acceptType === 1) {
        var chosen = aidePool().filter(function (a) { return cc.pickIds.indexOf(a.id) >= 0; });
        team().assistant = chosen.length ? chosen[0].name : "";
      } else {
        students.forEach(function (s) {
          var on = cc.pickIds.indexOf(s.id) >= 0;
          if (on) s.team = cc.teamId;
          else if (s.team === cc.teamId) s.team = "";
        });
      }
      api.toast("已保存");
      api.back();
      return true;
    }
    if (act === "stat") { cc.statTab = el.getAttribute("data-val"); api.render(); return true; }
    if (act === "stat-filter") { api.toast(cc.statTab === "log" ? "可按小组、第几天、反馈状态筛选" : "可按小组、是否完善筛选"); return true; }
    if (act === "refresh") { api.toast("已经是最新的数据啦~"); return true; }
    if (act === "switch-camp") { api.toast("已切换到当前周营"); return true; }
    if (act === "add-log") {
      if (cc.campEnded) { cc.dialog = "当前已结营，无法发布日志噢"; cc.dialogYes = "know"; api.render(); return true; }
      cc.form.kind = "log";
      api.go(P + "growthJournal/form");
      return true;
    }
    if (act === "preview") { cc.preview = Number(el.getAttribute("data-index") || 0); api.render(); return true; }
    if (act === "preview-close") { cc.preview = null; api.render(); return true; }
    if (act === "journal") { cc.journalId = el.getAttribute("data-id"); api.go(P + "growthJournal/detail"); return true; }
    if (act === "like-list") {
      var row = cc.logs.filter(function (item) { return item.id === el.getAttribute("data-id"); })[0];
      if (row) { row.liked = !row.liked; row.likes += row.liked ? 1 : -1; }
      api.render();
      return true;
    }
    if (act === "like") {
      var log = cc.logs.filter(function (item) { return item.id === cc.journalId; })[0];
      if (log) { log.liked = !log.liked; log.likes += log.liked ? 1 : -1; }
      api.render();
      return true;
    }
    if (act === "comment") { api.toast("评论已打开"); return true; }
    if (act === "journal-more") { cc.sheet = "journal"; api.render(); return true; }
    if (act === "journal-edit") { cc.sheet = null; cc.form.kind = "log"; api.go(P + "growthJournal/form"); return true; }
    if (act === "journal-del") {
      var current = cc.logs.filter(function (item) { return item.id === cc.journalId; })[0];
      cc.sheet = null;
      cc.dialog = "确定删除该" + (current ? current.title : "记录") + "吗？";
      cc.dialogYes = "delete-log";
      api.render();
      return true;
    }
    if (act === "publish") {
      var text = document.getElementById("cc-text");
      cc.logs.unshift({
        id: "j" + Date.now(),
        day: 3,
        type: cc.form.kind === "brief" ? "brief" : "log",
        title: cc.form.kind === "brief" ? "新的班级简报" : "每日反馈",
        text: text && text.value ? text.value : "新的记录",
        photos: 0,
        audios: [],
        likes: 0,
        liked: false,
        comments: 0,
        time: "刚刚",
        more: false
      });
      api.toast("发布成功");
      api.back();
      return true;
    }
    if (act === "imprint-start") { cc.imprintStep = 1; api.go(P + "growthImprint/form"); return true; }
    if (act === "step-prev") { saveStep(); cc.imprintStep -= 1; api.render(); return true; }
    if (act === "step-next") { saveStep(); cc.imprintStep += 1; api.render(); return true; }
    if (act === "step-done") {
      saveStep();
      cc.imprintFilled = true;
      api.go(P + "growthImprint/success");
      return true;
    }
    return false;
  }

  window.CC = {
    has: has,
    render: render,
    handle: handle,
    setKind: function (kind) { cc.form.kind = kind; },
    signer: function () { return SIGNER; },
    addCampRecord: addCampRecord,
    removeCampRecord: removeCampRecord,
    leaveForm: function () {
      if (window.APP && window.APP.path && window.APP.path() === P + "growthImprint/form" && !cc.dialog) {
        cc.dialog = "您还没提交，是否保存后续填写呢？";
        cc.dialogYes = "leave-form";
        return true;
      }
      return false;
    }
  };
})();
