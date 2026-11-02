(function () {
  "use strict";

  var ui = { keyword: "", modal: "", courseId: "", taskId: "", feel: false, feelText: "" };

  var plans = [
    {
      id: "p1",
      name: "口才表达磨课",
      type: "领袖营",
      typeClass: "style-green",
      productLabel: "磨课Q营",
      product: "EQ营《口才与情商》",
      time: "2026-07-08 19:00 至 2026-07-10 21:00",
      desc: "把开场和例子练清楚",
      status: "进行中",
      guideStatus: "指导中",
      guideName: "陈启航",
      guideRemark: "每周两次，先看课件再试讲",
      courses: [
        {
          id: "c1",
          name: "口才表达：把话说清楚",
          hour: 2,
          level: "一阶",
          kind: "口才",
          colour: "#5DD574",
          last: "2026-07-08",
          tasks: [
            {
              id: "t1",
              name: "课件打磨",
              status: "待反馈",
              due: "2026.07.10",
              records: [
                {
                  id: "r1",
                  study: "已提交",
                  status: "待反馈",
                  files: [{ name: "口才课件.pptx", saved: "export_20260708_190012.pptx", time: "2026.07.08 19:20" }],
                  score: "",
                  result: "",
                  text: "",
                  questionnaire: "口才磨课反馈",
                  feedbackTime: ""
                }
              ]
            },
            {
              id: "t2",
              name: "试讲彩排",
              status: "进行中",
              due: "2026.07.09",
              records: [
                { id: "r2", study: "进行中", status: "", files: [], score: "", result: "", text: "", questionnaire: "口才磨课反馈", feedbackTime: "" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "p2",
      name: "情商课磨课",
      type: "线下课",
      typeClass: "style-yellow",
      productLabel: "磨课课程",
      product: "情商工作坊",
      time: "2026-06-20 19:00 至 2026-06-22 21:00",
      desc: "用一个真实案例把情绪说具体",
      status: "已完成",
      guideStatus: "无指导",
      guideName: "",
      guideRemark: "",
      courses: [
        {
          id: "c2",
          name: "情商课：识别情绪",
          hour: 1,
          level: "一阶",
          kind: "情商",
          colour: "#F5A24A",
          last: "2026-06-21",
          tasks: [
            {
              id: "t3",
              name: "案例整理",
              status: "已完成",
              due: "2026.06.21",
              records: [
                {
                  id: "r3",
                  study: "已提交",
                  status: "已反馈",
                  files: [{ name: "情商案例.docx", saved: "export_20260621_101122.docx", time: "2026.06.21 10:11" }],
                  score: "8",
                  result: "合格",
                  text: "例子可以再具体一点，结构是清楚的。",
                  questionnaire: "情商磨课反馈",
                  feedbackTime: "2026-06-21 21:06"
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  var signups = [
    { id: "s1", name: "思维课公开磨课", time: "2026-07-12 19:00", desc: "开放名额 12 人", signed: false },
    { id: "s2", name: "口才加场", time: "2026-07-15 19:00", desc: "已满员前的加场", signed: true }
  ];

  var trials = [
    {
      id: "tl1",
      name: "EQ营验收试讲",
      type: "领袖营",
      typeClass: "style-green",
      time: "2026-07-12 14:00 至 16:00",
      way: "线下",
      address: "湖州营地A楼",
      phone: "13800001111",
      secretary: "周宁",
      product: "EQ营《口才与情商》",
      course: "口才表达：把话说清楚",
      desc: "验收开始前上传试讲材料",
      status: "待上传",
      score: "",
      result: "",
      remark: "",
      lead: "吴正",
      members: "孙衡",
      files: [],
      feel: "",
      feelOn: false
    },
    {
      id: "tl2",
      name: "情商验收试讲",
      type: "领袖营",
      typeClass: "style-green",
      time: "2026-06-28 14:00 至 16:00",
      way: "线上",
      address: "",
      phone: "13800002222",
      secretary: "周宁",
      product: "EQ营《口才与情商》",
      course: "情商课：识别情绪",
      desc: "线上验收，评委已出结果",
      status: "验收通过",
      score: "86",
      result: "合格",
      remark: "结构清楚，例子还可以再具体。",
      lead: "吴正",
      members: "孙衡",
      files: [{ name: "情商试讲.pdf", saved: "export_20260628_090011.pdf", time: "2026.06.28 09:00" }],
      feel: "",
      feelOn: false
    }
  ];

  var trialSignups = [
    { id: "ts1", name: "思维验收试讲", time: "2026-07-18 14:00", desc: "线下，湖州营地B楼", signed: false },
    { id: "ts2", name: "口才复验", time: "2026-07-20 14:00", desc: "线上", signed: true }
  ];

  var guides = [
    {
      id: "g1",
      user: "林晓雯",
      planId: "p1",
      status: "进行中",
      pending: 1,
      done: 0,
      apply: "指导中"
    },
    {
      id: "g2",
      user: "王敏",
      planId: "p2",
      status: "已完成",
      pending: 0,
      done: 1,
      apply: "指导中"
    }
  ];

  var applies = [
    { id: "a1", user: "赵衡", plan: "思维课公开磨课", product: "SQ营《思维与合作》", remark: "希望陈老师看第一周课件", status: "待处理" }
  ];

  function esc(s) { return window.MentorApp.esc(s); }
  function shell(title, body) { return window.MentorApp.shell(title, body, true); }
  function planById(id) {
    for (var i = 0; i < plans.length; i++) if (plans[i].id === id) return plans[i];
    return plans[0];
  }
  function trialById(id) {
    for (var i = 0; i < trials.length; i++) if (trials[i].id === id) return trials[i];
    return trials[0];
  }
  function findTask(id) {
    for (var i = 0; i < plans.length; i++) {
      var courses = plans[i].courses;
      for (var c = 0; c < courses.length; c++) {
        for (var t = 0; t < courses[c].tasks.length; t++) {
          if (courses[c].tasks[t].id === id) return { plan: plans[i], course: courses[c], task: courses[c].tasks[t] };
        }
      }
    }
    return null;
  }
  function statusClass(label) {
    if (label === "已完成" || label === "已反馈" || label === "验收通过" || label === "已磨课") return "style-green";
    if (label === "反馈不通过" || label === "未通过" || label === "待反馈") return label === "待反馈" ? "style-yellow" : "style-red";
    if (label === "进行中" || label === "待上传" || label === "待验收" || label === "待分配" || label === "未磨课") return "style-yellow";
    return "style-grey";
  }
  function tag(label) {
    return '<span class="gl-tag ' + statusClass(label) + '">' + esc(label) + "</span>";
  }
  function back(href, text) {
    return '<button type="button" class="gl-back" data-go="' + href + '">' + text + "</button>";
  }
  function mask(inner) {
    return '<div class="tt-modal"><div class="tt-dialog">' + inner + "</div></div>";
  }

  function lessonCard(item) {
    return '<article class="gl-card" data-go="/grindingLessons/myTask?id=' + item.id + '"><div class="gl-card-top">' + tag(item.type + "磨课") + "</div><h3>" + esc(item.name) + '</h3><div class="gl-kv"><span>计划时间</span>' + esc(item.time) + '</div><div class="gl-kv"><span>' + esc(item.productLabel) + "</span>" + esc(item.product) + '</div><p class="gl-desc">' + esc(item.desc) + '</p><div class="gl-card-foot">' + tag(item.status) + (item.guideStatus === "无指导" ? tag("无指导老师") : "") + "</div></article>";
  }
  function trialCard(item) {
    return '<article class="gl-card" data-go="/grindingLessons/trialLecture?id=' + item.id + '"><div class="gl-card-top">' + tag(item.type) + "</div><h3>" + esc(item.name) + '</h3><div class="gl-kv"><span>验收时间</span>' + esc(item.time) + '</div><div class="gl-kv"><span>验收方式</span>' + esc(item.way) + (item.address ? "｜" + esc(item.address) : "") + '</div><div class="gl-kv"><span>验收Q营</span>' + esc(item.product) + '</div><div class="gl-kv"><span>验收课程</span>' + esc(item.course) + '</div><div class="gl-card-foot">' + tag(item.status) + (item.result ? '<span class="gl-result">' + esc(item.result) + (item.feelOn ? "" : " · 待反馈") + "</span>" : "") + "</div></article>";
  }
  function guideCard(item) {
    var plan = planById(item.planId);
    return '<article class="gl-card" data-go="/grindingLessons/myGuide?id=' + item.id + '"><div class="gl-user"><span class="tt-avatar">' + esc(item.user.slice(0, 1)) + "</span>" + esc(item.user) + '</div><div class="gl-kv"><span>磨课计划</span>' + esc(plan.name) + '</div><div class="gl-kv"><span>计划时间</span>' + esc(plan.time) + '</div><div class="gl-kv"><span>' + esc(plan.productLabel) + "</span>" + esc(plan.product) + '</div><div class="gl-card-foot">' + tag(item.status) + '<span class="gl-result">已指导：' + item.done + (item.pending ? "　待指导：" + item.pending : "") + "</span></div></article>";
  }

  function sideLesson() {
    var rows = signups.map(function (item) {
      var btn = item.signed ? '<span class="gl-btn gl-btn--mute">已报名</span>' : '<button type="button" class="gl-btn" data-gl="sign-plan" data-id="' + item.id + '">立即报名</button>';
      return '<div class="gl-side-item"><b>' + esc(item.name) + "</b><div>" + esc(item.time) + "</div><p>" + esc(item.desc) + "</p>" + btn + "</div>";
    }).join("");
    var more = signups.length > 2 ? '<button type="button" class="gl-more" data-gl="more-plan">查看更多</button>' : "";
    return '<aside class="gl-side"><button type="button" class="gl-side-stat" data-go="/grindingLessons/myCourse">磨课课程·' + courseCount() + "</button>" + rows + more + "</aside>";
  }
  function sideTrial() {
    var rows = trialSignups.map(function (item) {
      var btn = item.signed ? '<span class="gl-btn gl-btn--mute">已报名</span>' : '<button type="button" class="gl-btn" data-gl="sign-trial" data-id="' + item.id + '">立即报名</button>';
      return '<div class="gl-side-item"><b>' + esc(item.name) + "</b><div>" + esc(item.time) + "</div><p>" + esc(item.desc) + "</p>" + btn + "</div>";
    }).join("");
    return '<aside class="gl-side">' + rows + '<button type="button" class="gl-more" data-gl="more-trial">查看更多</button></aside>';
  }
  function sideGuide() {
    var rows = applies.map(function (item) {
      var actions = item.status === "待处理"
        ? '<div class="gl-actions"><button type="button" class="gl-btn gl-btn--ghost" data-gl="refuse" data-id="' + item.id + '">拒绝指导</button><button type="button" class="gl-btn" data-gl="agree" data-id="' + item.id + '">同意指导</button></div>'
        : '<span class="gl-btn gl-btn--mute">' + esc(item.status) + "</span>";
      return '<div class="gl-side-item" data-go="/grindingLessons/guideApplication?id=' + item.id + '"><div class="gl-user"><span class="tt-avatar">' + esc(item.user.slice(0, 1)) + "</span>" + esc(item.user) + "</div><b>" + esc(item.plan) + "</b><div>" + esc(item.product) + "</div><p>" + esc(item.remark) + '</p><span class="gl-link">查看详情</span>' + actions + "</div>";
    }).join("");
    return '<aside class="gl-side">' + rows + "</aside>";
  }
  function courseCount() {
    var n = 0;
    plans.forEach(function (plan) { n += plan.courses.length; });
    return n;
  }
  function match(text) {
    var key = (ui.keyword || "").trim();
    return !key || text.indexOf(key) >= 0;
  }

  function index(tab) {
    var tabs = [
      ["MyGrindingLesson", "我的磨课"],
      ["TrialLecture", "验收试讲"],
      ["MyGuide", "我的指导"]
    ];
    var bar = tabs.map(function (item) {
      return '<button type="button" class="gl-tab' + (tab === item[0] ? " is-on" : "") + '" data-go="/grindingLessons/index/' + item[0] + '">' + item[1] + "</button>";
    }).join("");
    var stats = "";
    var main = "";
    var side = "";
    if (tab === "TrialLecture") {
      main = trials.filter(function (item) { return match(item.name); }).map(trialCard).join("") || '<div class="gl-empty">暂无验收试讲</div>';
      side = sideTrial();
    } else if (tab === "MyGuide") {
      var done = 0;
      var wait = 0;
      guides.forEach(function (item) { done += item.done; wait += item.pending; });
      stats = '<div class="gl-stats"><span>已指导 <b>' + done + "</b></span><span>待指导 <b>" + wait + "</b></span></div>";
      main = guides.filter(function (item) { return match(planById(item.planId).name); }).map(guideCard).join("") || '<div class="gl-empty">暂无指导</div>';
      side = sideGuide();
    } else {
      main = plans.filter(function (item) { return match(item.name); }).map(lessonCard).join("") || '<div class="gl-empty">暂无磨课计划</div>';
      side = sideLesson();
    }
    var modal = modalHtml();
    return shell("", '<div class="gl-page"><div class="gl-head"><div class="gl-tabs">' + bar + '</div><input class="gl-search" id="gl-key" placeholder="查询磨课计划，回车搜索" value="' + esc(ui.keyword) + '" /></div>' + stats + '<div class="gl-body"><div class="gl-list">' + main + "</div>" + side + "</div></div>" + modal);
  }

  function feedbackCard(record) {
    if (record.status !== "已反馈" && record.status !== "反馈不通过") return "";
    return '<div class="gl-box"><div>指导反馈 ' + tag(record.status) + '</div><button type="button" class="gl-link" data-gl="paper" data-id="' + record.id + '">' + esc(record.questionnaire) + ' ›</button><div>评价于 ' + esc(record.feedbackTime) + '</div><div class="gl-line">评分：' + esc(record.score) + "｜" + esc(record.result) + ' <span class="lb-note-host"><button type="button" class="lb-num-btn" data-note-key="guideScore"></button></span></div><div class="gl-text">文字反馈：' + esc(record.text || "未填写") + ' <span class="lb-note-host"><button type="button" class="lb-num-btn" data-note-key="guideText"></button></span></div></div>';
  }

  function taskPage(id) {
    var plan = planById(id || "p1");
    var courses = plan.courses.map(function (course) {
      var tasks = course.tasks.map(function (task) {
        var records = task.records.map(function (record, index) {
          var files = record.files.map(function (file, index) {
            return '<div class="gl-file"><span>' + esc(file.name) + "</span><span>上传于 " + esc(file.time) + '</span><button type="button" data-gl="down" data-name="' + esc(file.name) + '">下载</button>' + (index ? "" : '<span class="lb-note-host"><button type="button" class="lb-num-btn" data-note-key="fileName"></button></span>') + "</div>";
          }).join("");
          var feedback = feedbackCard(record);
          var title = task.records.length > 1 ? "<div>第" + (task.records.length - index) + "次" + esc(task.name) + "</div>" : "";
          return '<div class="gl-box">' + title + "<div>我的进度 " + tag(record.study || "进行中") + "</div>" + files + "</div>" + feedback;
        }).join("");
        var action = "";
        if (plan.status === "进行中") {
          if (task.status === "反馈不通过") action = '<button type="button" data-gl="restart" data-id="' + task.id + '">重新开始</button>';
          else if (task.status !== "已完成") action = '<button type="button" data-gl="progress" data-id="' + task.id + '">' + (task.status === "待反馈" ? "重新提交" : "登记进度") + "</button>";
        }
        return '<div class="gl-task"><div class="gl-task-h"><b>' + esc(task.name) + "</b>" + tag(task.status) + "<span>预计完成：" + esc(task.due) + "</span>" + action + "</div>" + records + "</div>";
      }).join("");
      var edit = plan.status === "进行中" ? '<span><button type="button" data-gl="edit-course" data-id="' + course.id + '">编辑</button> <button type="button" data-gl="del-course" data-id="' + course.id + '" data-plan="' + plan.id + '">删除</button></span>' : "";
      return '<section class="gl-course"><div class="gl-course-h"><b>' + esc(course.name) + "</b>" + edit + "</div>" + tasks + "</section>";
    }).join("");
    var guideBtn = { "无指导": "申请指导", "申请中": "撤销申请", "解除中": "中止解除", "指导中": "解除申请" }[plan.guideStatus] || "申请指导";
    var add = plan.status === "进行中" ? '<button type="button" data-gl="add-course" data-plan="' + plan.id + '">添加磨课</button>' : "";
    var quit = plan.status === "进行中" ? '<button type="button" data-gl="quit" data-id="' + plan.id + '">退出</button>' : "";
    return shell("", '<div class="gl-page gl-detail"><div>' + back("/grindingLessons/index/MyGrindingLesson", "返回我的磨课") + '<div class="gl-title">' + tag(plan.type + "磨课") + "<h2>" + esc(plan.name) + "</h2>" + tag(plan.status) + '<span class="gl-actions"><button type="button" data-gl="other">添加其他Q营磨课</button>' + quit + '</span></div><p>计划时间：' + esc(plan.time) + "</p><p>" + esc(plan.desc) + '</p><div class="gl-panel"><div class="gl-course-h"><b>' + esc(plan.product) + "</b>" + add + "</div>" + courses + '</div></div><aside class="gl-side"><div class="gl-side-item"><div class="gl-course-h"><b>指导老师</b>' + tag(plan.guideStatus) + "</div><div class=\"gl-user\">" + (plan.guideName ? '<span class="tt-avatar">' + esc(plan.guideName.slice(0, 1)) + "</span>" + esc(plan.guideName) : "暂无") + "</div><p>申请说明：" + esc(plan.guideRemark || "—") + '</p><button type="button" class="gl-btn" data-gl="guide-btn" data-id="' + plan.id + '">' + guideBtn + "</button></div></aside></div>" + modalHtml());
  }

  function coursePage() {
    var tab = ui.courseTab || "领袖营";
    var tabs = ["领袖营", "线下课"].map(function (name) {
      return '<button type="button" class="gl-tab' + (tab === name ? " is-on" : "") + '" data-gl="course-tab" data-name="' + name + '">' + name + "</button>";
    }).join("");
    var blocks = plans.filter(function (plan) { return plan.type === tab && match(plan.product + plan.name); }).map(function (plan) {
      var rows = plan.courses.map(function (course) {
        var ground = plan.status === "已完成" ? "已磨课" : "未磨课";
        var record = ground === "已磨课" ? '<button type="button" data-gl="record" data-id="' + plan.id + '">查看记录</button>' : "";
        return '<div class="gl-course-row"><b>' + esc(course.name) + "</b><span class=\"gl-tag\" style=\"background:" + course.colour + "\">" + esc(course.kind) + "</span><span>" + course.hour + "课时</span><span>" + esc(course.level) + "</span>" + tag(ground) + "<span>" + (course.last ? "最近磨课：" + esc(course.last) : "") + "</span>" + record + '<button type="button" data-go="/grindingLessons/myTask?id=' + plan.id + '">去磨课 ›</button></div>';
      }).join("");
      return '<section class="gl-panel"><h3>' + esc(plan.product) + "</h3>" + rows + "</section>";
    }).join("") || '<div class="gl-empty">暂无课程</div>';
    return shell("", '<div class="gl-page"><div class="gl-head"><div class="gl-tabs">' + tabs + '</div><input class="gl-search" id="gl-key" placeholder="查询课程，回车搜索" value="' + esc(ui.keyword) + '" /></div>' + back("/grindingLessons/index/MyGrindingLesson", "返回我的磨课") + blocks + modalHtml() + "</div>");
  }

  function trialPage(id) {
    var item = trialById(id || "tl1");
    var files = item.files.length
      ? item.files.map(function (file) {
        return '<div class="gl-file"><span>' + esc(file.name) + "</span><span>上传于 " + esc(file.time) + "</span>" + (item.status === "待上传" || item.status === "待验收" ? '<button type="button" data-gl="del-file" data-id="' + item.id + '" data-name="' + esc(file.saved) + '">删除</button>' : "") + "</div>";
      }).join("")
      : '<p class="gl-desc">请在验收开始前完成试讲材料上传</p>';
    var upload = (item.status === "待上传" || item.status === "待验收" || item.status === "待分配")
      ? '<button type="button" data-gl="add-file" data-id="' + item.id + '">上传材料</button><button type="button" data-gl="quit-trial" data-id="' + item.id + '">退出验收试讲</button>'
      : "";
    var result = "";
    if (item.status === "验收通过" || item.status === "未通过") {
      var feel = item.feelOn
        ? '<div class="gl-box"><b>我的感受</b><p>' + esc(item.feel) + "</p></div>"
        : (ui.feel
          ? '<textarea id="gl-feel" placeholder="请填写您的感受...">' + esc(ui.feelText) + '</textarea><div class="gl-actions"><button type="button" data-gl="feel-cancel">取消</button><button type="button" data-gl="feel-ok" data-id="' + item.id + '">发布</button></div>'
          : '<button type="button" data-gl="feel">填写我的感受</button>');
      result = '<section class="gl-panel"><h3>试讲结果</h3><p>验收评委组长：' + esc(item.lead) + "　评委组员：" + esc(item.members) + "　跟进秘书：" + esc(item.secretary) + "</p><p>评分：" + esc(item.score) + "｜" + esc(item.result) + "</p><p>" + esc(item.remark) + "</p>" + feel + "</section>";
    } else if (item.status === "未参加") {
      result = '<section class="gl-panel"><h3>试讲结果</h3><p>您未参加验收试讲</p></section>';
    }
    return shell("", '<div class="gl-page">' + back("/grindingLessons/index/TrialLecture", "返回验收试讲") + '<div class="gl-title">' + tag(item.type) + "<h2>" + esc(item.name) + "</h2>" + tag(item.status) + "<span>" + upload + '</span></div><p>' + esc(item.desc) + '</p><div class="gl-kv"><span>验收时间</span>' + esc(item.time) + '</div><div class="gl-kv"><span>验收形式</span>' + esc(item.way) + '</div>' + (item.address ? '<div class="gl-kv"><span>验收地址</span>' + esc(item.address) + "</div>" : "") + '<div class="gl-kv"><span>联系方式</span>' + esc(item.phone) + '</div><div class="gl-kv"><span>跟进秘书</span>' + esc(item.secretary) + '</div><div class="gl-kv"><span>验收Q营</span>' + esc(item.product) + '</div><section class="gl-panel"><h3>验收试讲「' + esc(item.course) + '」</h3><h4>试讲材料</h4>' + files + "</section>" + result + modalHtml() + "</div>");
  }

  function guidePage(id, isGuide) {
    if (!isGuide) {
      var apply = applies[0];
      applies.forEach(function (item) { if (item.id === id) apply = item; });
      var actions = apply.status === "待处理"
        ? '<div class="gl-actions"><button type="button" class="gl-btn gl-btn--ghost" data-gl="refuse" data-id="' + apply.id + '">拒绝指导</button><button type="button" class="gl-btn" data-gl="agree" data-id="' + apply.id + '">同意指导</button></div>'
        : tag(apply.status);
      return shell("", '<div class="gl-page">' + back("/grindingLessons/index/MyGuide", "返回我的指导") + "<h2>" + esc(apply.user) + "的指导申请</h2><p>" + esc(apply.plan) + " · " + esc(apply.product) + "</p><section class=\"gl-panel\"><h3>申请说明</h3><p>" + esc(apply.remark) + "</p>" + actions + "</section></div>");
    }
    var guide = guides[0];
    guides.forEach(function (item) { if (item.id === id) guide = item; });
    var plan = planById(guide.planId);
    var courses = plan.courses.map(function (course) {
      var tasks = course.tasks.map(function (task) {
        var records = task.records.map(function (record) {
          var files = record.files.map(function (file, index) {
            return '<div class="gl-file"><span>' + esc(file.name) + "</span><span>上传于 " + esc(file.time) + '</span><button type="button" data-gl="down" data-name="' + esc(file.name) + '">下载</button>' + (index ? "" : '<span class="lb-note-host"><button type="button" class="lb-num-btn" data-note-key="fileName"></button></span>') + "</div>";
          }).join("");
          var feedback = feedbackCard(record);
          return '<div class="gl-box"><div>导师进度 ' + tag(record.study || "进行中") + "</div>" + files + "</div>" + feedback;
        }).join("");
        var fill = task.status === "待反馈" ? '<button type="button" data-gl="fill" data-id="' + task.id + '">填写反馈</button>' : "";
        return '<div class="gl-task"><div class="gl-task-h"><b>' + esc(task.name) + "</b>" + tag(task.status) + "<span>预计完成：" + esc(task.due) + "</span>" + fill + "</div>" + records + "</div>";
      }).join("");
      return '<section class="gl-course"><b>' + esc(course.name) + "</b>" + tasks + "</section>";
    }).join("");
    var lift = plan.status === "进行中" ? '<button type="button" data-gl="lift" data-id="' + plan.id + '">' + (plan.guideStatus === "指导中" ? "解除指导关系" : "中止解除") + "</button>" : "";
    return shell("", '<div class="gl-page">' + back("/grindingLessons/index/MyGuide", "返回我的指导") + '<div class="gl-title"><span class="tt-avatar">' + esc(guide.user.slice(0, 1)) + "</span><h2>" + esc(guide.user) + "</h2>" + tag(guide.status) + lift + '</div><div class="gl-kv"><span>磨课计划</span>' + esc(plan.name) + '</div><div class="gl-kv"><span>计划时间</span>' + esc(plan.time) + '</div><div class="gl-kv"><span>' + esc(plan.productLabel) + "</span>" + esc(plan.product) + '</div><div class="gl-panel"><h3>' + esc(plan.product) + "</h3>" + courses + "</div>" + modalHtml() + "</div>");
  }

  function modalHtml() {
    if (ui.modal === "paper") {
      var found = null;
      plans.forEach(function (plan) {
        plan.courses.forEach(function (course) {
          course.tasks.forEach(function (task) {
            task.records.forEach(function (record) { if (record.id === ui.recordId) found = record; });
          });
        });
      });
      var body = found && found.text ? esc(found.text) : "问卷在现网会跳到外部链接。这一份还没有文字反馈。";
      return mask('<div class="tt-dialog-h"><span>' + esc(found ? found.questionnaire : "问卷") + '</span><button type="button" data-gl="close">×</button></div><p>' + body + "</p>");
    }
    if (ui.modal === "fill") {
      return mask('<div class="tt-dialog-h"><span>填写反馈</span><button type="button" data-gl="close">×</button></div><label class="line"><span>文字反馈</span><textarea id="gl-text" placeholder="填写反馈"></textarea></label><label class="line"><span>评分</span><input id="gl-score" placeholder="请输入评分" /></label><label class="line"><span>结果</span><select id="gl-result"><option>合格</option><option>不合格</option></select></label><div class="tt-foot"><button type="button" class="btn" data-gl="close">取消</button><button type="button" class="btn btn--primary" data-gl="fill-ok">提交</button></div>');
    }
    if (ui.modal === "progress") {
      return mask('<div class="tt-dialog-h"><span>登记进度</span><button type="button" data-gl="close">×</button></div><div class="gl-actions"><button type="button" data-gl="study" data-name="进行中">进行中</button><button type="button" data-gl="study" data-name="已提交">已提交</button><button type="button" data-gl="study" data-name="未完成">未完成</button><button type="button" data-gl="study" data-name="已取消">已取消</button></div><p>上传物料会记一份额外文件名，下载时用这份名字。</p><div class="tt-foot"><button type="button" class="btn" data-gl="close">取消</button><button type="button" class="btn btn--primary" data-gl="progress-ok">上传物料</button></div>');
    }
    if (ui.modal === "add-course") {
      return mask('<div class="tt-dialog-h"><span>磨课</span><button type="button" data-gl="close">×</button></div><label class="line"><span>课程</span><select id="gl-course"><option>口才表达：把话说清楚</option><option>情商课：识别情绪</option><option>思维训练：提问与拆解</option></select></label><label class="line"><span>磨课任务</span><select id="gl-task-type"><option>课件打磨</option><option>试讲彩排</option><option>案例整理</option></select></label><label class="line"><span>预期完成</span><input id="gl-due" value="2026-07-11" /></label><div class="tt-foot"><button type="button" class="btn" data-gl="close">取消</button><button type="button" class="btn btn--primary" data-gl="add-ok">确定</button></div>');
    }
    if (ui.modal === "join") {
      return mask('<div class="tt-dialog-h"><span>加入磨课计划</span><button type="button" data-gl="close">×</button></div><p>思维课公开磨课</p><label class="line"><span>磨课Q营</span><select id="gl-join"><option>SQ营《思维与合作》</option><option>EQ营《口才与情商》</option></select></label><div class="tt-foot"><button type="button" class="btn" data-gl="close">取消</button><button type="button" class="btn btn--primary" data-gl="join-ok">确定</button></div>');
    }
    if (ui.modal === "trial-sign") {
      var item = null;
      trialSignups.forEach(function (row) { if (row.id === ui.signId) item = row; });
      return mask('<div class="tt-dialog-h"><span>报名验收试讲</span><button type="button" data-gl="close">×</button></div><h3>' + esc(item ? item.name : "") + '</h3><label class="line"><span>验收Q营</span><select id="gl-q"><option>EQ营《口才与情商》</option><option>SQ营《思维与合作》</option></select></label><label class="line"><span>预约时段</span><select id="gl-slot"><option>' + esc(item ? item.time : "") + '</option></select></label><label class="line"><span>预约方式</span><select id="gl-way"><option>线下</option><option>线上</option></select></label><p>详细地址: 湖州营地B楼</p><p>联系方式: 13800001111</p><p>跟进秘书: 周宁</p><div class="tt-foot"><button type="button" class="btn" data-gl="close">取消</button><button type="button" class="btn btn--primary" data-gl="trial-ok">确认</button></div>');
    }
    if (ui.modal === "more-plan" || ui.modal === "record") {
      var rows = plans.map(function (plan) {
        return "<tr><td>" + esc(plan.name) + "</td><td>" + esc(plan.time) + "</td><td>" + esc(plan.status) + '</td><td><button type="button" data-go="/grindingLessons/myTask?id=' + plan.id + '">查看</button></td></tr>';
      }).join("");
      return mask('<div class="tt-dialog-h"><span>磨课计划</span><button type="button" data-gl="close">×</button></div><table class="table"><thead><tr><th>计划</th><th>时间</th><th>状态</th><th></th></tr></thead><tbody>' + rows + "</tbody></table>");
    }
    if (ui.modal === "more-trial") {
      var list = trialSignups.map(function (item) {
        return "<tr><td>" + esc(item.name) + "</td><td>" + esc(item.time) + "</td><td>" + (item.signed ? "已报名" : "可报名") + "</td></tr>";
      }).join("");
      return mask('<div class="tt-dialog-h"><span>验收试讲</span><button type="button" data-gl="close">×</button></div><table class="table"><thead><tr><th>试讲</th><th>时间</th><th>状态</th></tr></thead><tbody>' + list + "</tbody></table>");
    }
    return "";
  }

  function page(path) {
    if (path.indexOf("/grindingLessons/myTask") === 0) return taskPage(ui.queryId);
    if (path === "/grindingLessons/myCourse") return coursePage();
    if (path.indexOf("/grindingLessons/trialLecture") === 0) return trialPage(ui.queryId);
    if (path.indexOf("/grindingLessons/guideApplication") === 0) return guidePage(ui.queryId, false);
    if (path.indexOf("/grindingLessons/myGuide") === 0) return guidePage(ui.queryId, true);
    var tab = "MyGrindingLesson";
    if (path.indexOf("TrialLecture") >= 0) tab = "TrialLecture";
    if (path.indexOf("MyGuide") >= 0) tab = "MyGuide";
    return index(tab);
  }

  function refreshGuideCounts(plan) {
    var pending = 0;
    var done = 0;
    plan.courses.forEach(function (course) {
      course.tasks.forEach(function (task) {
        if (task.status === "待反馈") pending += 1;
        task.records.forEach(function (record) { if (record.status === "已反馈" || record.status === "反馈不通过") done += 1; });
      });
    });
    guides.forEach(function (guide) {
      if (guide.planId === plan.id) { guide.pending = pending; guide.done = done; }
    });
  }

  function act(name, el) {
    var id = el.getAttribute("data-id");
    if (name === "close" || name === "feel-cancel") { ui.modal = ""; ui.feel = false; }
    else if (name === "sign-plan") signups.forEach(function (item) { if (item.id === id) item.signed = true; });
    else if (name === "sign-trial") { ui.modal = "trial-sign"; ui.signId = id; }
    else if (name === "trial-ok") {
      trialSignups.forEach(function (item) { if (item.id === ui.signId) item.signed = true; });
      ui.modal = "";
    } else if (name === "agree" || name === "refuse") {
      applies.forEach(function (item) { if (item.id === id) item.status = name === "agree" ? "已同意" : "已拒绝"; });
    } else if (name === "more-plan" || name === "record") ui.modal = name === "record" ? "record" : "more-plan";
    else if (name === "more-trial") ui.modal = "more-trial";
    else if (name === "course-tab") { ui.courseTab = el.getAttribute("data-name"); ui.keyword = ""; }
    else if (name === "progress" || name === "restart") { ui.modal = "progress"; ui.taskId = id; ui.study = name === "restart" ? "进行中" : "已提交"; }
    else if (name === "study") ui.study = el.getAttribute("data-name");
    else if (name === "progress-ok") {
      var hit = findTask(ui.taskId);
      if (hit) {
        var record = hit.task.records[0];
        record.study = ui.study || "已提交";
        record.files.push({ name: "补充物料.pptx", saved: "export_" + Date.now() + ".pptx", time: "2026.07.11 11:20" });
        if (record.study === "已提交") hit.task.status = "待反馈";
        if (record.study === "已取消" || record.study === "未完成") hit.task.status = record.study;
        refreshGuideCounts(hit.plan);
      }
      ui.modal = "";
    } else if (name === "fill") { ui.modal = "fill"; ui.taskId = id; }
    else if (name === "fill-ok") {
      var taskHit = findTask(ui.taskId);
      var score = document.getElementById("gl-score");
      var text = document.getElementById("gl-text");
      var result = document.getElementById("gl-result");
      if (taskHit) {
        var rec = taskHit.task.records[0];
        rec.score = score && score.value ? score.value : "8";
        rec.result = result ? result.value : "合格";
        rec.text = text ? text.value : "";
        rec.status = rec.result === "不合格" ? "反馈不通过" : "已反馈";
        rec.feedbackTime = "2026-10-26 13:40";
        taskHit.task.status = rec.status === "反馈不通过" ? "反馈不通过" : "已完成";
        refreshGuideCounts(taskHit.plan);
      }
      ui.modal = "";
    } else if (name === "paper") { ui.modal = "paper"; ui.recordId = id; }
    else if (name === "down") alert("开始下载：" + (el.getAttribute("data-name") || ""));
    else if (name === "add-course") { ui.modal = "add-course"; ui.planId = el.getAttribute("data-plan"); }
    else if (name === "add-ok") {
      var plan = planById(ui.planId);
      var courseName = document.getElementById("gl-course");
      var taskType = document.getElementById("gl-task-type");
      var due = document.getElementById("gl-due");
      plan.courses.push({
        id: "c" + Date.now(),
        name: courseName ? courseName.value : "新课程",
        hour: 1,
        level: "一阶",
        kind: "课程",
        colour: "#6AA8FF",
        last: "",
        tasks: [{ id: "t" + Date.now(), name: taskType ? taskType.value : "课件打磨", status: "进行中", due: due ? due.value : "", records: [{ id: "r" + Date.now(), study: "进行中", status: "", files: [], score: "", result: "", text: "", questionnaire: "磨课反馈", feedbackTime: "" }] }]
      });
      ui.modal = "";
    } else if (name === "del-course") {
      var owner = planById(el.getAttribute("data-plan"));
      owner.courses = owner.courses.filter(function (course) { return course.id !== id; });
    } else if (name === "edit-course") { ui.modal = "add-course"; ui.planId = ui.queryId || "p1"; }
    else if (name === "other" || name === "join") ui.modal = "join";
    else if (name === "join-ok") {
      var chosen = document.getElementById("gl-join");
      plans.push({
        id: "p" + Date.now(),
        name: "思维课公开磨课",
        type: "领袖营",
        typeClass: "style-green",
        productLabel: "磨课Q营",
        product: chosen ? chosen.value : "SQ营《思维与合作》",
        time: "2026-07-12 19:00 至 2026-07-14 21:00",
        desc: "新加入的磨课计划",
        status: "进行中",
        guideStatus: "无指导",
        guideName: "",
        guideRemark: "",
        courses: []
      });
      ui.modal = "";
      window.MentorApp.go("/grindingLessons/index/MyGrindingLesson");
      return;
    } else if (name === "quit") {
      if (window.confirm("确认退出该磨课计划？")) planById(id).status = "已取消";
    } else if (name === "guide-btn") {
      var current = planById(id);
      var next = { "无指导": "申请中", "申请中": "无指导", "指导中": "解除中", "解除中": "指导中" };
      current.guideStatus = next[current.guideStatus] || "申请中";
      if (current.guideStatus === "申请中") current.guideRemark = current.guideRemark || "申请陈启航指导";
    } else if (name === "lift") {
      var lifted = planById(id);
      lifted.guideStatus = lifted.guideStatus === "指导中" ? "解除中" : "指导中";
    } else if (name === "add-file") {
      trialById(id).files.push({ name: "试讲材料.pdf", saved: "export_" + Date.now() + ".pdf", time: "2026.07.11 15:00" });
      if (trialById(id).status === "待上传") trialById(id).status = "待验收";
    } else if (name === "del-file") {
      var trial = trialById(id);
      trial.files = trial.files.filter(function (file) { return file.saved !== el.getAttribute("data-name"); });
    } else if (name === "quit-trial") {
      if (window.confirm("确认退出验收试讲？")) trialById(id).status = "已取消";
    } else if (name === "feel") ui.feel = true;
    else if (name === "feel-ok") {
      var box = document.getElementById("gl-feel");
      var target = trialById(id);
      target.feel = box ? box.value : "";
      target.feelOn = true;
      ui.feel = false;
    }
    var input = document.getElementById("gl-key");
    if (input && name !== "course-tab") ui.keyword = input.value;
    window.MentorApp.render();
  }

  window.MentorGrind = {
    page: function (path, query) { ui.queryId = query && query.id ? query.id : ui.queryId; return page(path); },
    act: act,
    setKeyword: function (value) { ui.keyword = value || ""; window.MentorApp.render(); }
  };
})();
