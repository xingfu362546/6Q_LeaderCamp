(function () {
  "use strict";

  function page(id, note) {
    return "replica.html?p=" + id + (note ? "&note=" + note : "");
  }

  function camp(tab, note) {
    var url = "camp-detail.html?camp=eq-small";
    if (tab) url += "&tab=" + encodeURIComponent(tab);
    if (note) url += "&note=" + note;
    return url;
  }

  function app(path, note) {
    return "../6Q_leader_app/index.html" + (note ? "?note=" + note : "") + "#/" + path;
  }

  function mentor(hash, note) {
    return "../6Q_mentor_pc/index.html" + (note ? "?note=" + note : "") + hash;
  }

  function hold(id, label) {
    return "placeholder.html?m=" + id + "&label=" + encodeURIComponent(label);
  }

  /* 家长端（小程序）：课程详情 / 入营问卷 / 离营问卷 */
  function parent(page, note) {
    var q = [];
    if (page) q.push("page=" + page);
    if (note) q.push("note=" + note);
    return "../6Q_lsc_parent/index.html" + (q.length ? "?" + q.join("&") : "");
  }

  var ROUTES = {
    1: camp("基础信息", 1),
    2: "connect-camp.html?note=2",
    3: "connect-camp.html?note=2",
    4: camp("学员信息", 4),
    5: "connect-camp.html?note=2",
    6: page("student-archive", 6),
    7: app("pages/work/categoryClass/growthImprint/entrance"),
    8: page("camp-staff", 8),
    9: page("student-archive"),
    10: page("leave-summary", 10),
    11: page("attendance-summary", 11),
    12: page("class-assess", 12),
    13: page("survey-collect", 13),
    14: mentor("#/leadershipCamp", 14),
    15: mentor("#/grindingLessons/myGuide?id=g1", 15),
    16: mentor("#/grindingLessons/myTask?id=p1", 16),
    17: mentor("#/learning", 17),
    18: mentor("#/grindingLessons/myTask?id=p1", 18),
    19: mentor("#/leadershipCamp", 19),
    20: parent("enter", 20),
    21: hold("biz-travel-task", "迎接欢送任务管理"),
    22: app("pages/work/signInTask/detail"),
    23: hold("biz-album", "品宣相册归档"),
    24: camp("迎接欢送"),
    25: page("attendance-summary"),
    26: page("student-archive", 26),
    27: page("salary-ledger", 27),
    28: page("talent-pool", 28),
    29: page("class-schedule", 29),
    30: camp("迎接欢送"),
    31: "../6Q_lsc_enroll/index.html?note=31",
    32: page("salary-pay"),
    33: page("salary-ledger", 33),
    34: page("compare-setting"),
    35: "student-award.html?note=35",
    36: app("pages/work/excellent/index", 36),
    37: "../6Q_lsc_recruit/index.html?note=37#/perfect",
    38: page("talent-pool"),
    39: page("talent-pool"),
    40: page("attendance-summary", 40),
    41: app("pages/work/studentSignIn/index", 41),
    42: app("pages/work/categoryClass/growthImprint/entrance", 42),
    43: app("pages/tabBar/work"),
    44: "../6Q_leader_app/index.html?note=44&role=chief#/pages/message/mallNotice",
    45: "promotion-path.html?note=45",
    46: page("perf-pre", 46),
    47: page("benchmark"),
    48: parent("leave", 48),
    49: page("student-archive"),
    50: camp("迎接欢送"),
    51: camp("迎接欢送"),
    52: camp("学员信息", 52),
    53: camp("报读记录"),
    54: page("emotion-reg", 54),
    55: page("medical-reg"),
    56: page("survey-config", 56),
    57: app("pages/work/signInTask/detail"),
    58: app("pages/work/signInTask/detail", 58),
    59: parent("leave", 59),
    60: page("benchmark", 60),
    61: page("mentor-lesson-archive", 61),
    62: "index.html#req-62",
    63: page("camp-staff"),
    64: hold("biz-product", "领袖营产品")
  };

  document.querySelectorAll("tr[id^='req-']").forEach(function (tr) {
    var id = tr.id.replace("req-", "");
    var href = ROUTES[id];
    if (!href) return;
    var titled = href.indexOf("note=") >= 0 ? "打开页面并展开这条注释" : "打开对应页面";
    ["col-no", "col-mod"].forEach(function (cls) {
      var cell = tr.querySelector("." + cls);
      if (!cell) return;
      var link = document.createElement("a");
      link.className = "req-jump";
      link.href = href;
      link.title = titled;
      link.textContent = cell.textContent;
      cell.textContent = "";
      cell.appendChild(link);
    });
  });
})();
