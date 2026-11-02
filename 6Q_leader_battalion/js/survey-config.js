/**
 * 问卷配置复刻，并只改总结问卷的发放。
 *
 * 过往（v3.4.0）：
 * 左侧按团队筛选。类型五种：互评/他评、自评/总结、学员、家长、督评。
 * 家长和督评不填被调查人岗位。只有互评/他评填填写人岗位，范围是班级内或周营内，填写要求是全部必填或部分选填。
 * 学员问卷多一块共性题目，计分用换算公式，分数叫基础分。其他类型计分是多份得分取平均，分数叫输出换算总分。
 * 发放都是开营后第 N 天。除家长问卷外还有截止：开营后第 M 天。
 * 未填写判定那一组控件在源码里已注释，页面上没有。
 *
 * 现在（v3.5.0，只动自评/总结这一类的发放方式）：
 * 发放方式可以配置。
 * 每周发放：每个有入营的周营都按开营后第 N 天发一份，各周独立。本周提交了，下一周入营仍会再发。
 * 只发放一次：开营最后一天看还有没有后续入营。没有就发，有就顺延到后续周营。同一份只提交一次，提交后不再发相同待办。
 * 其他四类仍是开营后第 N 天。
 */
(function () {
  "use strict";

  var TEAMS = ["统筹办", "导师团", "助教团", "后勤团"];
  var TYPES = {
    1: "互评/他评问卷",
    2: "自评/总结问卷",
    3: "学员问卷",
    4: "家长问卷",
    5: "督评问卷"
  };
  var ORDER = ["第二周", "第三周"];
  var state = { team: "全部", q: "", target: "" };

  function row(extra) {
    return Object.assign({
      id: "",
      title: "",
      team: "导师团",
      type: 1,
      targetType: "全体人员",
      bePosts: [],
      fillers: [],
      remark: "",
      status: "启用",
      questions: [],
      common: [],
      totalScore: "100.00",
      sendDay: 1,
      endDay: 6,
      issueMode: "weekly",
      demoWeek: "第二周",
      people: [],
      updated: "2026-08-12 11:20:00",
      created: "2026-07-02 09:30:00"
    }, extra);
  }

  var papers = [
    row({
      id: "p1",
      title: "导师互评问卷",
      team: "导师团",
      type: 1,
      bePosts: ["导师"],
      fillers: [{ post: "导师", scope: "周营内", fill: "全部必填" }],
      remark: "同一周营内导师互评",
      questions: [
        { content: "本周协作是否到位", kind: "打分题", remark: "" },
        { content: "是否按时完成带班", kind: "单选题", remark: "" }
      ],
      sendDay: 2,
      endDay: 6
    }),
    row({
      id: "p2",
      title: "岗位自评问卷",
      team: "助教团",
      type: 2,
      issueMode: "weekly",
      bePosts: ["助教"],
      remark: "每个入营周营各发一份",
      questions: [{ content: "本周带班中做得最好的一件事", kind: "简答题", remark: "" }],
      sendDay: 1,
      endDay: 5,
      people: [
        { name: "林晓雯", entries: ["第二周", "第三周"], submittedWeeks: [] },
        { name: "陈启航", entries: ["第二周", "第三周"], submittedWeeks: ["第二周"] },
        { name: "王敏", entries: ["第二周"], submittedWeeks: [] }
      ]
    }),
    row({
      id: "p3",
      title: "工作人员总结问卷",
      team: "统筹办",
      type: 2,
      issueMode: "once",
      targetType: "全体人员",
      bePosts: ["工作人员"],
      remark: "一人一份，连营顺延到最后一个周营",
      questions: [
        { content: "本营期你承担的主要工作", kind: "简答题", remark: "" },
        { content: "结营后需要交接的事项", kind: "简答题", remark: "" }
      ],
      people: [
        { name: "林晓雯", entries: ["第二周"], submitted: false },
        { name: "陈启航", entries: ["第二周", "第三周"], submitted: false },
        { name: "王敏", entries: ["第二周"], submitted: true }
      ]
    }),
    row({
      id: "p4",
      title: "学员满意度问卷",
      team: "导师团",
      type: 3,
      bePosts: ["导师"],
      remark: "学员按班级填写",
      common: [{ content: "本周整体感受", kind: "打分题", alone: "否" }],
      questions: [
        { content: "课堂专注度", kind: "打分题", alone: "否" },
        { content: "突出事迹加减分", kind: "打分题", alone: "是" }
      ],
      totalScore: "100.00",
      sendDay: 3,
      endDay: 6
    }),
    row({
      id: "p5",
      title: "家长反馈问卷",
      team: "统筹办",
      type: 4,
      remark: "家长填写，不设被调查人岗位，也不设开营后截止天数",
      questions: [{ content: "您对本次营期的整体感受", kind: "简答题", remark: "" }],
      sendDay: 5
    }),
    row({
      id: "p6",
      title: "督导评价问卷",
      team: "导师团",
      type: 5,
      remark: "督评不填被调查人岗位",
      questions: [{ content: "课堂组织", kind: "打分题", remark: "" }],
      sendDay: 4,
      endDay: 6
    })
  ];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function find(id) {
    return papers.filter(function (item) { return item.id === id; })[0];
  }

  function ruleText(type) {
    if (type === 3) {
      return "（学员问卷绩效换算） = （（非单独计算题目1得分 + 非单独计算题目2得分 + 非单独计算题目n得分） / 非单独计算题目总分（最高分）） * 100% * 输出换算分 ± 单独计算题换算分；\n若非单独计算题目的总合计分为0，且用户获得的分数也为0时，用户输出换算所得分则拿满；";
    }
    return "（问卷得分1+问卷得分2+问卷得分3+问卷得分4+...+问卷得分n）/n";
  }

  /* 原型评审第二轮第27条：总结问卷改为「第一周就触发、每周判断」。
     - 从该人第一个入营的周营开始，每周都判断。
     - 判断依据：该用户在过往同团的入营经历中是否已经填写过这份总结问卷。
       · 已填写 → 不发放、不提醒。
       · 未填写 → 发放待办，并在发放时间点触发一条消息通知；点通知直接跳到问卷详情填写。
     - 提交一次后视为已填写，后续周营不再发放，也不再提醒。
     原来是「开营最后一天判断有没有后续入营」，第27条已废弃这套顺延逻辑。 */
  function judgeOnce(person, week) {
    var idx = ORDER.indexOf(week);
    if (person.entries.indexOf(week) < 0) return { tag: "不发放", text: "本周没有入营，不在本周判断" };
    /* 过往同团入营中是否已填写过 */
    if (person.submitted) return { tag: "不发放", text: "该用户在同团过往入营中已填写过这份总结问卷，不再发放，也不再提醒" };
    var earlier = (person.submittedWeeks || []).filter(function (w) { return ORDER.indexOf(w) < idx; });
    if (earlier.length) return { tag: "不发放", text: "此前周营（" + earlier.join("、") + "）已填写过，不再发放与提醒" };
    return { tag: "发放", text: "第一周起每周判断。该用户尚未填写过，发放待办并推送消息通知，点击跳转问卷详情填写" };
  }

  function judgeWeekly(person, week) {
    if (person.entries.indexOf(week) < 0) return { tag: "不发放", text: "本周没有入营，这一周不发" };
    var done = (person.submittedWeeks || []).indexOf(week) >= 0;
    if (done) return { tag: "本周已交", text: "本周已经提交。下一个入营周营仍会再发一份" };
    return { tag: "发放", text: "本周有入营，按开营后第 N 天发放。各周各一份" };
  }

  function judge(person, week, mode) {
    return mode === "weekly" ? judgeWeekly(person, week) : judgeOnce(person, week);
  }

  function visible() {
    return papers.filter(function (item) {
      if (state.team !== "全部" && item.team !== state.team) return false;
      if (state.q && item.title.indexOf(state.q) < 0) return false;
      if (state.target && item.bePosts.join("、").indexOf(state.target) < 0) return false;
      return true;
    });
  }

  function sendLabel(item) {
    if (item.type === 2 && item.issueMode === "once") return "每周判断：自第一周起，历史已填则不发不提醒";
    if (item.type === 2 && item.issueMode === "weekly") return "每周发放，开营后第" + item.sendDay + "天";
    var text = "开营后第" + item.sendDay + "天";
    if (item.type !== 4) text += "，截止第" + item.endDay + "天";
    return text;
  }

  function mount(root) {
    var list = visible();
    var body = list.map(function (item) {
      var posts = item.bePosts.length ? item.bePosts.join("、") : "—";
      var fillers = item.fillers.length ? item.fillers.map(function (f) { return f.post; }).join("、") : "—";
      return "<tr><td><button type=\"button\" class=\"lb-link-btn\" data-sv=\"open\" data-id=\"" + item.id + "\">" + esc(item.title) + "</button></td>" +
        "<td>" + esc(TYPES[item.type]) + "</td><td>" + esc(posts) + "</td><td>" + esc(fillers) + "</td>" +
        "<td>" + esc(item.remark) + "</td><td>" + (item.status === "启用" ? "<span class=\"lb-tag lb-tag--ok\">启用</span>" : "<span class=\"lb-tag\">禁用</span>") + "</td>" +
        "<td>" + esc(item.updated) + "</td><td>" + esc(item.created) + "</td>" +
        "<td class=\"lb-ops\">" +
        "<button type=\"button\" class=\"lb-link-btn\" data-sv=\"copy\" data-id=\"" + item.id + "\">复制并新增</button>" +
        "<button type=\"button\" class=\"lb-link-btn\" data-sv=\"edit\" data-id=\"" + item.id + "\">编辑规则</button>" +
        (item.status === "启用" ? "<button type=\"button\" class=\"lb-link-btn\" data-sv=\"push\" data-id=\"" + item.id + "\">推送问卷</button>" : "") +
        (item.status === "启用"
          ? "<button type=\"button\" class=\"lb-link-btn lb-link-btn--danger\" data-sv=\"toggle\" data-id=\"" + item.id + "\">禁用</button>"
          : "<button type=\"button\" class=\"lb-link-btn\" data-sv=\"toggle\" data-id=\"" + item.id + "\">启用</button>") +
        "</td></tr>";
    }).join("");
    if (!body) body = "<tr><td colspan=\"9\">没有问卷</td></tr>";
    var teams = ["全部"].concat(TEAMS).map(function (name) {
      return "<button type=\"button\" class=\"" + (state.team === name ? "is-on" : "") + "\" data-sv=\"team\" data-team=\"" + esc(name) + "\">" + esc(name) + "</button>";
    }).join("");
    root.innerHTML =
      "<div class=\"lb-page\"><div class=\"lb-split\">" +
      "<div class=\"lb-job-tree\">" + teams + "</div>" +
      "<div class=\"lb-split__main\">" +
      "<div class=\"lb-toolbar\" id=\"lb-filters\">" +
      "<div class=\"lb-field\"><label>问卷</label><input class=\"lb-input\" data-sv=\"q\" value=\"" + esc(state.q) + "\" placeholder=\"请输入问卷标题\" /></div>" +
      "<div class=\"lb-field\"><label>被调查对象</label><input class=\"lb-input\" data-sv=\"target\" value=\"" + esc(state.target) + "\" placeholder=\"请选择被调查对象\" /></div>" +
      "<div class=\"lb-field lb-field--range\"><label>创建时间</label><input class=\"lb-input\" placeholder=\"开始\" /><span class=\"lb-range-gap\">~</span><input class=\"lb-input\" placeholder=\"结束\" /></div>" +
      "<button type=\"button\" class=\"lb-btn lb-btn--primary\" data-sv=\"search\">查询</button>" +
      "<button type=\"button\" class=\"lb-btn\" data-sv=\"reset\">重置</button>" +
      "</div>" +
      "<div class=\"lb-actions\">" +
      (state.team === "全部" ? "" : "<button type=\"button\" class=\"lb-btn lb-btn--primary\" data-sv=\"add\">新增问卷</button>") +
      "</div>" +
      "<div class=\"lb-table-wrap\"><table class=\"lb-table\"><thead><tr>" +
      "<th>调查问卷</th><th>类型</th><th>被调查对象</th><th>调查对象</th><th>说明</th><th>状态</th><th>更新时间</th><th>创建时间</th><th>操作</th>" +
      "</tr></thead><tbody>" + body + "</tbody></table></div></div></div></div>";
  }

  function qTable(list, student, editing) {
    var head = "<tr><th>序号</th><th>题目</th><th>类型</th>" + (student ? "<th>单独计算</th>" : "") + "<th>备注</th>" + (editing ? "<th>操作</th>" : "") + "</tr>";
    var body = list.map(function (item, i) {
      return "<tr><td>" + (i + 1) + "</td><td>" + esc(item.content) + "</td><td>" + esc(item.kind) + "</td>" +
        (student ? "<td>" + esc(item.alone || "否") + "</td>" : "") + "<td>" + esc(item.remark || "") + "</td>" +
        (editing ? "<td><button type=\"button\" class=\"lb-link-btn\" data-sv=\"noop\">删除</button></td>" : "") + "</tr>";
    }).join("");
    if (!body) body = "<tr><td colspan=\"6\">未选题</td></tr>";
    return "<table class=\"lb-table\"><thead>" + head + "</thead><tbody>" + body + "</tbody></table>" +
      (editing ? "<button type=\"button\" class=\"lb-link-btn\" data-sv=\"addQuestion\">添加题目</button>" : "");
  }

  function formHtml(item, editing) {
    var dis = editing ? "" : " disabled";
    var typeOptions = Object.keys(TYPES).map(function (key) {
      return "<option value=\"" + key + "\"" + (String(item.type) === key ? " selected" : "") + ">" + TYPES[key] + "</option>";
    }).join("");
    var targetOptions = ["全体人员", "全职员工", "非全职员工"].map(function (name) {
      return "<option" + (item.targetType === name ? " selected" : "") + ">" + name + "</option>";
    }).join("");
    var be = item.type === 4 || item.type === 5 ? "" :
      "<div class=\"lb-field\"><label>" + (item.type === 1 ? "被评估人岗位" : "问卷被调查人岗位") + "</label><input class=\"lb-input\" disabled value=\"" + esc(item.bePosts.join("、") || "请选择岗位") + "\" /></div>";
    var fillers = "";
    if (item.type === 1) {
      fillers = "<div class=\"lb-sec\">填写人岗位</div><table class=\"lb-table\"><thead><tr><th>岗位</th><th>调查范围</th><th>填写要求</th></tr></thead><tbody>" +
        item.fillers.map(function (f) {
          return "<tr><td>" + esc(f.post) + "</td><td>" + esc(f.scope) + "</td><td>" + esc(f.fill) + "</td></tr>";
        }).join("") + "</tbody></table>";
    }
    var common = item.type === 3 ? "<div class=\"lb-sec\">共性题目（仅填写一次）</div>" + qTable(item.common, true, editing) : "";
    var scoreLabel = item.type === 3 ? "基础分" : "输出换算总分";
    var dayFields = "<div class=\"lb-field\"><label>发放时间</label><span>开营后第 <input class=\"lb-input\" style=\"width:72px\" data-sv=\"send\" data-id=\"" + item.id + "\" value=\"" + item.sendDay + "\"" + dis + " /> 天</span></div>";
    if (item.type !== 4 && !(item.type === 2 && item.issueMode === "once")) {
      dayFields += "<div class=\"lb-field\"><label>截止时间</label><span>开营后第 <input class=\"lb-input\" style=\"width:72px\" data-sv=\"end\" data-id=\"" + item.id + "\" value=\"" + item.endDay + "\"" + dis + " /> 天</span></div>";
    }
    var send = item.type === 2 && item.issueMode === "once" ? "" : dayFields;
    var use = "";
    if (item.type === 2) {
      use = "<div class=\"lb-field\"><label>发放方式<button type=\"button\" class=\"lb-num-btn\" data-note=\"1\" data-note-key=\"summaryIssue\"><span class=\"lb-num\">1</span></button></label><select class=\"lb-select\" data-sv=\"use\" data-id=\"" + item.id + "\"" + dis + ">" +
        "<option value=\"weekly\"" + (item.issueMode === "weekly" ? " selected" : "") + ">每周发放（每份都发）</option>" +
        "<option value=\"once\"" + (item.issueMode === "once" ? " selected" : "") + ">每周判断（历史已填则不发不提醒）</option></select></div>";
      send = use + dayFields;
    }
    var headActions = editing ? "" : (
      "<div class=\"lb-actions\" style=\"justify-content:flex-end\">" +
      "<button type=\"button\" class=\"lb-btn\" data-sv=\"copy\" data-id=\"" + item.id + "\">复制并新增</button>" +
      "<button type=\"button\" class=\"lb-btn\" data-sv=\"toggle\" data-id=\"" + item.id + "\">" + (item.status === "启用" ? "禁用" : "启用") + "</button>" +
      "<button type=\"button\" class=\"lb-btn lb-btn--primary\" data-sv=\"edit\" data-id=\"" + item.id + "\">编辑问卷</button></div>"
    );
    var systemInfo = editing ? "" : (
      "<div class=\"lb-sec\">系统信息</div>" +
      "<div class=\"lb-field\"><label>创建人</label><input class=\"lb-input\" disabled value=\"余炜烽\" /></div>" +
      "<div class=\"lb-field\"><label>创建时间</label><input class=\"lb-input\" disabled value=\"" + esc(item.created) + "\" /></div>" +
      "<div class=\"lb-field\"><label>更新人</label><input class=\"lb-input\" disabled value=\"余炜烽\" /></div>" +
      "<div class=\"lb-field\"><label>更新时间</label><input class=\"lb-input\" disabled value=\"" + esc(item.updated) + "\" /></div>"
    );
    return headActions + "<div class=\"lb-sec\">基本信息</div>" +
      "<div class=\"lb-field\"><label>问卷标题</label><input class=\"lb-input\" data-sv=\"title\" data-id=\"" + item.id + "\" value=\"" + esc(item.title) + "\"" + dis + " /></div>" +
      "<div class=\"lb-field\"><label>所属团队</label><input class=\"lb-input\" disabled value=\"" + esc(item.team) + "\" /></div>" +
      "<div class=\"lb-field\"><label>类型</label><select class=\"lb-select\" data-sv=\"type\" data-id=\"" + item.id + "\"" + dis + ">" + typeOptions + "</select></div>" +
      "<div class=\"lb-field\"><label>被调查人类型</label><select class=\"lb-select\" data-sv=\"targetType\" data-id=\"" + item.id + "\"" + dis + ">" + targetOptions + "</select></div>" +
      be + fillers +
      "<div class=\"lb-field\"><label>说明</label><textarea class=\"lb-textarea\" data-sv=\"remark\" data-id=\"" + item.id + "\"" + dis + ">" + esc(item.remark) + "</textarea></div>" +
      common +
      "<div class=\"lb-sec\">问卷题目</div>" + qTable(item.questions, item.type === 3, editing) +
      "<div class=\"lb-field\"><label>问卷分数</label><span>" + (item.type === 3 ? "100" : "10") + "分</span></div>" +
      "<div class=\"lb-sec\">计分规则</div>" +
      "<textarea class=\"lb-textarea\" disabled>" + esc(ruleText(item.type)) + "</textarea>" +
      (item.type === 2 ? wordScoreHtml(item) : "") +
      "<div class=\"lb-field\"><label>" + scoreLabel + "</label><input class=\"lb-input\" style=\"width:120px\" value=\"" + esc(item.totalScore) + "\"" + dis + " /> 分</div>" +
      "<div class=\"lb-sec\">发放规则</div>" + send +
      systemInfo +
      (editing ? "<div class=\"lb-drawer-foot\"><button type=\"button\" class=\"lb-btn\" data-close-drawer=\"1\">取消</button><button type=\"button\" class=\"lb-btn lb-btn--primary\" data-sv=\"save\" data-id=\"" + item.id + "\">确定</button></div>" : "");
  }

  /* 原型评审第二轮第26条：自评/总结问卷按提交字数给绩效基础分。
     规则（评审确认）：
       字数 < 200 → 0%
       200 ≤ 字数 < 300 → 20%
       300 ≤ 字数 < 700 → 50%
       700 ≤ 字数 ≤ 3000 → 70%
       字数 > 3000 → 100%
     注意：这里只是「绩效基础分」的换算比例，不改问卷本身的输出换算总分。 */
  var WORD_BANDS = [
    { min: 0, max: 199, pct: 0, label: "小于 200 字" },
    { min: 200, max: 299, pct: 20, label: "200 ~ 299 字" },
    { min: 300, max: 699, pct: 50, label: "300 ~ 699 字" },
    { min: 700, max: 3000, pct: 70, label: "700 ~ 3000 字" },
    { min: 3001, max: Infinity, pct: 100, label: "大于 3000 字" }
  ];

  function wordBand(words) {
    var n = Number(words) || 0;
    return WORD_BANDS.filter(function (b) { return n >= b.min && n <= b.max; })[0] || WORD_BANDS[0];
  }

  function wordScoreHtml(item) {
    var rows = WORD_BANDS.map(function (b) {
      return "<tr><td>" + b.label + "</td><td>" + b.pct + "%</td></tr>";
    }).join("");
    return "<div class=\"lb-sec\">绩效基础分（按字数）<button type=\"button\" class=\"lb-num-btn lb-num-btn--static\" data-note=\"2\" data-note-key=\"summaryWordScore\"></button></div>" +
      "<table class=\"lb-table lb-wordscore\"><thead><tr><th>提交字数</th><th>绩效基础分比例</th></tr></thead><tbody>" + rows + "</tbody></table>" +
      "<p class=\"lb-hint\">字数取该次提交的正文总字数（去空格）。比例乘问卷输出换算总分，得到本次绩效基础分。分数只算一次，重交不累加。</p>";
  }

  function openPaper(item, editing) {
    window.LB.openDrawer((editing ? "编辑问卷 · " : "问卷详情 · ") + item.title, formHtml(item, editing), { wide: true });
  }

  function onClick(event) {
    var target = event.target && event.target.closest ? event.target.closest("[data-sv]") : null;
    if (!target) return;
    if (new URLSearchParams(location.search).get("p") !== "survey-config") return;
    var act = target.getAttribute("data-sv");
    if (act === "q" || act === "target" || act === "title" || act === "remark" || act === "send" || act === "end" || act === "type" || act === "use" || act === "targetType") return;
    event.preventDefault();
    event.stopPropagation();
    if (act === "team") {
      state.team = target.getAttribute("data-team");
      mount(document.getElementById("lb-replica"));
      return;
    }
    if (act === "search") {
      var q = document.querySelector("[data-sv=\"q\"]");
      var tg = document.querySelector("[data-sv=\"target\"]");
      state.q = q ? q.value.trim() : "";
      state.target = tg ? tg.value.trim() : "";
      mount(document.getElementById("lb-replica"));
      return;
    }
    if (act === "reset") {
      state.q = "";
      state.target = "";
      mount(document.getElementById("lb-replica"));
      return;
    }
    if (act === "add") {
      var created = row({
        id: "p" + Date.now(),
        title: "未命名问卷",
        team: state.team,
        type: 1,
        bePosts: ["导师"],
        fillers: [{ post: "导师", scope: "周营内", fill: "全部必填" }],
        questions: [{ content: "请从题库选择题目", kind: "简答题", remark: "" }]
      });
      papers.unshift(created);
      openPaper(created, true);
      mount(document.getElementById("lb-replica"));
      return;
    }
    if (act === "pushOk") {
      window.LB.closeDrawer();
      if (window.LB.toast) window.LB.toast("已推送");
      return;
    }
    if (act === "addQuestion" || act === "noop") {
      if (window.LB.toast) window.LB.toast("按现网从题库选择题目");
      return;
    }
    var item = find(target.getAttribute("data-id"));
    if (!item && act !== "add") return;
    if (act === "open") openPaper(item, false);
    if (act === "edit") openPaper(item, true);
    if (act === "copy") {
      var copy = row(JSON.parse(JSON.stringify(item)));
      copy.id = "p" + Date.now();
      copy.title = item.title + "副本";
      papers.unshift(copy);
      mount(document.getElementById("lb-replica"));
      openPaper(copy, true);
    }
    if (act === "toggle") {
      item.status = item.status === "启用" ? "禁用" : "启用";
      mount(document.getElementById("lb-replica"));
    }
    if (act === "push") {
      window.LB.openDrawer("推送问卷", "<p class=\"lb-hint\">按现网选择周营后推送。这里只演示入口，不改发放规则。</p><div class=\"lb-field\"><label>周营</label><select class=\"lb-select\"><option>第二周</option><option>第三周</option></select></div><div class=\"lb-drawer-foot\"><button type=\"button\" class=\"lb-btn\" data-close-drawer=\"1\">取消</button><button type=\"button\" class=\"lb-btn lb-btn--primary\" data-sv=\"pushOk\">确定</button></div>", { wide: true });
    }
    if (act === "addQuestion" || act === "noop") {
      if (window.LB.toast) window.LB.toast("按现网从题库选择题目");
    }
    if (act === "save") {
      var title = document.querySelector("[data-sv=\"title\"]");
      var remark = document.querySelector("[data-sv=\"remark\"]");
      var send = document.querySelector("[data-sv=\"send\"]");
      var end = document.querySelector("[data-sv=\"end\"]");
      if (title) item.title = title.value.trim() || item.title;
      if (remark) item.remark = remark.value;
      if (send) item.sendDay = Number(send.value) || item.sendDay;
      if (end) item.endDay = Number(end.value) || item.endDay;
      window.LB.closeDrawer();
      mount(document.getElementById("lb-replica"));
      if (window.LB.toast) window.LB.toast("已保存");
    }
  }

  function onChange(event) {
    var target = event.target;
    if (!target || !target.getAttribute) return;
    var act = target.getAttribute("data-sv");
    if (act !== "type" && act !== "use" && act !== "targetType") return;
    if (new URLSearchParams(location.search).get("p") !== "survey-config") return;
    var item = find(target.getAttribute("data-id"));
    if (!item) return;
    if (act === "type") {
      item.type = Number(target.value);
      if (item.type !== 2) item.issueMode = "weekly";
      if (item.type === 1 && !item.fillers.length) item.fillers = [{ post: "导师", scope: "周营内", fill: "全部必填" }];
    }
    if (act === "use") item.issueMode = target.value === "once" ? "once" : "weekly";
    if (act === "targetType") item.targetType = target.value;
    openPaper(item, true);
  }

  if (typeof document !== "undefined") {
    document.addEventListener("click", onClick, true);
    document.addEventListener("change", onChange, true);
  }

  if (typeof window !== "undefined") {
    window.LB_SURVEY = { mount: mount, papers: papers, judge: judge };
  } else {
    var weekly = papers[1];
    var linW = weekly.people[0];
    var chenW = weekly.people[1];
    if (judge(linW, "第二周", "weekly").tag !== "发放") throw new Error("week2");
    if (judge(linW, "第三周", "weekly").tag !== "发放") throw new Error("week3");
    if (judge(chenW, "第二周", "weekly").tag !== "本周已交") throw new Error("chen week done");
    if (judge(chenW, "第三周", "weekly").tag !== "发放") throw new Error("chen next week");
    var once = papers[2];
    var lin = once.people[0];
    var chen = once.people[1];
    var wang = once.people[2];
    /* 第27条：第一周起每周判断，历史已填则不发不提醒 */
    if (judge(lin, "第二周", "once").tag !== "发放") throw new Error("lin");
    if (judge(chen, "第三周", "once").tag !== "发放") throw new Error("chen3");
    chen.submitted = true;
    if (judge(chen, "第三周", "once").tag !== "不发放") throw new Error("chen done");
    if (judge(wang, "第二周", "once").tag !== "不发放") throw new Error("wang");
    console.log("survey ok");
  }
})();
