(function () {
  "use strict";
  var jobs = [
    { id: "a1", title: "2026暑假助教团招募", team: "助教团", teamId: 3, region: "广东", begin: "2026-06-01", end: "2026-07-15", year: "2026", status: 1, joined: 18, cover: "a", intro: "面向助教团暑期入营人员。报名后由助教团统一调配入营基地。" },
    { id: "a2", title: "2026暑假导师团招募", team: "导师团", teamId: 1, region: "华东", begin: "2026-06-01", end: "2026-07-10", year: "2026", status: 1, joined: 9, cover: "b", intro: "面向导师团。报名步骤里最后一步是期望Q营。" },
    { id: "a3", title: "2026暑假后勤团招募", team: "后勤团", teamId: 4, region: "广东", begin: "2026-05-01", end: "2026-05-20", year: "2026", status: 2, joined: 6, cover: "c", intro: "招募已截止。" },
    { id: "a4", title: "2027寒假助教团招募", team: "助教团", teamId: 3, region: "广东", begin: "2026-12-01", end: "2027-01-10", year: "2027", status: 4, joined: 0, cover: "a", intro: "招募尚未开始。" }
  ];
  var QUESTIONS = [
    { id: "q1", type: 2, content: "是否有领袖营带班经验？", options: ["有", "没有"] },
    { id: "q2", type: 2, content: "本次可连续参营多久？", options: ["一周", "两周及以上", "时间待定"] },
    { id: "q3", type: 4, content: "可承担的工作内容？", options: ["带班", "生活照顾", "活动组织", "后勤协助"] },
    { id: "q4", type: 3, content: "请简述相关经历" }
  ];
  var talentCards = {
    "m-hired": {
      certType: "大陆居民身份证",
      certNo: "440106199801011226",
      account: 1,
      cardNo: "6222023602012345678",
      bankName: "中国工商银行",
      branch: "广州天河支行",
      city: "广东省广州市",
      holder: "林晓雯",
      unionNo: "102581000013",
      company: "",
      code: ""
    }
  };
  var camps = [
    { name: "广东基地A", weeks: [
      { id: "w1", name: "第一周", time: "07/06-07/12" },
      { id: "w2", name: "第二周", time: "07/13-07/19" }
    ] }
  ];
  var mine = [
    { id: "m-hired", jobId: "a1", who: "林晓雯", title: "2026暑假助教团招募", region: "广东", time: "2026-06-02 09:00", status: 6 },
    { id: "m-empty", jobId: "a1", who: "陈启航", title: "2026暑假助教团招募", region: "广东", time: "2026-06-18 11:20", status: 6 }
  ];
  var state = {
    route: "list", year: "全部时间", filter: "全部状态", drop: "", mineTab: "全部",
    jobId: "a1", step: 0, weekWarn: false, openCamp: { "广东基地A": true },
    form: { name: "林晓雯", sex: 2, wechat: "lxw8821", area: "广东省广州市", phone: "13800001101", mail: "", birth: "1998-01-01", health: "健康", height: "165", weight: "50", urgent: "王敏", relation: "母亲", urgentPhone: "13800002202", edu: "本科", school: "示例大学", eduTime: "", major: "教育" },
    pickedWeeks: [], pickedPosts: [], account: 1, focusId: "m-hired", q1: "有", shade: "黑", answers: {}, bank: {}
  };
  try {
    var savedShade = sessionStorage.getItem("recruit-shade");
    if (savedShade === "白" || savedShade === "灰" || savedShade === "黑") state.shade = savedShade;
  } catch (e) {}

  function toast(msg) {
    var old = document.getElementById("recruit-toast");
    if (old) old.remove();
    var el = document.createElement("div");
    el.id = "recruit-toast";
    el.textContent = msg;
    el.style.cssText = "position:fixed;left:50%;top:42%;transform:translate(-50%,-50%);background:rgba(0,0,0,.69);color:#fff;padding:12px;border-radius:8px;z-index:60;font-size:12px;width:170px;text-align:center;line-height:17px;";
    document.body.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.remove(); }, 1600);
  }
  function job() { return jobs.filter(function (j) { return j.id === state.jobId; })[0] || jobs[0]; }
  function statusText(status) { return status === 1 ? "招募中" : status === 2 ? "已截止" : status === 4 ? "待开始" : "招募中"; }
  function joined(id) { return mine.some(function (item) { return item.jobId === id && item.status !== 1 && item.status !== 2; }); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function go(route, extra) {
    Object.assign(state, extra || {});
    if (route === "apply" && state.shade === "黑") route = "detail";
    state.route = route;
    state.drop = "";
    location.hash = "#/" + route;
    render();
  }
  function has(list, id) { return list.indexOf(id) >= 0; }
  function toggle(list, id) {
    var i = list.indexOf(id);
    if (i < 0) list.push(id);
    else list.splice(i, 1);
  }

  function nav(title, back) {
    return '<header class="nav">' + (back ? '<button type="button" class="nav-back" data-go="' + back + '" aria-label="返回"></button>' : '<span class="nav-back nav-back--ghost"></span>') + "<h1>" + esc(title) + "</h1></header>";
  }
  function row(label, inner, req, wide) {
    return '<div class="frow"><div class="flab' + (req ? " star" : "") + (wide ? " wide" : "") + '">' + label + '</div><div class="fval">' + inner + "</div></div>";
  }
  function text(key, placeholder) {
    return '<input data-k="' + key + '" value="' + esc(state.form[key] || "") + '" placeholder="' + esc(placeholder || "") + '" />';
  }
  function pick(textValue, placeholder) {
    var empty = !textValue;
    return '<div class="chev' + (empty ? " ph" : "") + '">' + esc(empty ? placeholder : textValue) + "</div>";
  }
  function dot(name, value, current, label) {
    return '<button type="button" class="dot' + (current === value ? " on" : "") + '" data-' + name + '="' + value + '">' + label + "</button>";
  }
  function loadBank(id) {
    state.focusId = id || "m-hired";
    var src = talentCards[state.focusId];
    state.bank = {
      certType: src ? src.certType : "",
      certNo: src ? src.certNo : "",
      cardNo: src ? src.cardNo : "",
      bankName: src ? src.bankName : "",
      branch: src ? src.branch : "",
      city: src ? src.city : "",
      holder: src ? src.holder : "",
      unionNo: src ? src.unionNo : "",
      company: src ? src.company : "",
      code: src ? src.code : ""
    };
    state.account = src ? src.account : 1;
    state.bankFromTalent = !!src;
  }
  function bankInput(key, placeholder) {
    return '<input data-bank="' + key + '" value="' + esc(state.bank[key] || "") + '" placeholder="' + esc(placeholder) + '" />';
  }
  function answerReady() {
    return QUESTIONS.every(function (q) {
      var value = state.answers[q.id];
      if (q.type === 4) return value && value.length;
      return value && String(value).trim();
    });
  }
  function mark(on) { return '<i class="mark' + (on ? " on" : "") + '"></i>'; }

  function list() {
    var years = ["全部时间", "2026", "2027"];
    var statuses = ["全部状态", "招募中", "已截止", "待开始"];
    var menu = "";
    if (state.drop === "year") {
      menu = '<div class="drop">' + years.map(function (name) {
        return '<button type="button" data-year="' + name + '" class="' + (state.year === name ? "on" : "") + '">' + name + "</button>";
      }).join("") + "</div>";
    } else if (state.drop === "status") {
      menu = '<div class="drop">' + statuses.map(function (name) {
        return '<button type="button" data-filter="' + name + '" class="' + (state.filter === name ? "on" : "") + '">' + name + "</button>";
      }).join("") + "</div>";
    }
    var rows = jobs.filter(function (item) {
      if (state.year !== "全部时间" && item.year !== state.year) return false;
      if (state.filter === "招募中") return item.status === 1;
      if (state.filter === "已截止") return item.status === 2;
      if (state.filter === "待开始") return item.status === 4;
      return true;
    }).map(function (item) {
      var avas = "";
      var n = Math.min(3, item.joined);
      for (var i = 0; i < n; i++) avas += "<i></i>";
      return '<article class="item" data-open="' + item.id + '"><div class="cover cover--' + item.cover + '"><span class="' + (item.status === 1 ? "" : "off") + '">' + statusText(item.status) + '</span></div><h2>' + esc(item.title) + '</h2><p class="meta"><b class="pin"></b>地区：' + esc(item.region) + '</p><p class="meta"><b class="clock"></b>招募时间：' + item.begin + "-" + item.end + '</p><div class="item-foot"><div class="avas">' + avas + '</div><span class="joined">' + (item.joined > 99 ? "99+" : item.joined) + "人已报名</span></div></article>";
    }).join("");
    return nav("领袖营招募") +
      '<div class="choose"><button type="button" data-drop="year" class="' + (state.drop === "year" ? "on" : "") + '">' + esc(state.year) + '<i></i></button><button type="button" data-drop="status" class="' + (state.drop === "status" ? "on" : "") + '">' + esc(state.filter) + "<i></i></button></div>" +
      menu + '<div class="list">' + (rows || '<div class="empty"><i></i>找不到相关的招募信息哦～</div>') + (rows ? '<div class="more">—————— 没有更多了 ——————</div>' : "") + "</div>";
  }

  function signupAction(item) {
    var label = "立即报名";
    var canGo = true;
    if (item.status === 4) { label = "待开始"; canGo = false; }
    else if (item.status !== 1) { label = "已结束"; canGo = false; }
    else if (joined(item.id)) { label = "已报名"; canGo = false; }
    else if (state.shade === "黑") { label = "暂不符合报名条件"; canGo = false; }
    return '<div class="dock-main"><button type="button" class="dock-go' + (canGo ? "" : " off") + (label.length > 6 ? " long" : "") + '"' + (canGo ? ' data-go="apply"' : " disabled") + ">" + label + '</button><button type="button" class="lb-num-btn" data-note-key="shadeBlock"></button></div>';
  }

  function detail() {
    var item = job();
    var action = signupAction(item);
    return nav("领袖营招募", "list") +
      '<div class="banner"></div><section class="sheet"><h2>' + esc(item.title) + '</h2><p class="meta"><b class="clock"></b>招募时间：' + item.begin + "-" + item.end + '</p><p class="meta"><b class="pin"></b>地区：' + esc(item.region) + '</p></section>' +
      '<section class="about"><h3>详细介绍</h3><p>' + esc(item.intro) + "</p></section>" +
      '<footer class="dock"><div class="dock-side"><button type="button"><i class="ico-chat"></i>客服</button><button type="button"><i class="ico-share"></i>分享</button><button type="button" data-go="mine"><i class="ico-mine"></i>已报</button></div>' + action + "</footer>";
  }

  function steps() {
    var names = job().teamId === 1 ? ["基础信息", "详细信息", "选择周营", "期望Q营"] : ["基础信息", "详细信息", "选择周营", "选择岗位"];
    return '<div class="steps">' + names.map(function (name, i) {
      var on = i === state.step;
      return '<div class="step' + (on ? " on" : "") + '"><b>' + (on ? "<em>" + (i + 1) + "</em>" : i + 1) + "</b>" + name + "</div>";
    }).join("") + "</div>";
  }

  function apply() {
    var body = "";
    if (state.step === 0) {
      body = '<section class="card"><h3>基础信息</h3><div class="photo"></div>' +
        row("真实姓名", text("name", "请输入真实姓名"), 1) +
        '<div class="frow"><div class="flab"></div><div class="fval" style="color:#dd5653;font-size:10px;margin-top:-16px">身份证姓名</div></div>' +
        row("性别", '<div class="dots">' + dot("sex", "1", String(state.form.sex), "男") + dot("sex", "2", String(state.form.sex), "女") + "</div>", 1) +
        row("微信号", text("wechat", "请输入微信号"), 1) +
        row("常住地区", pick(state.form.area, "请选择常住地区"), 1) +
        row("联系电话", text("phone", "请输入联系电话"), 1) +
        row("个人邮箱", text("mail", "请输入个人邮箱")) +
        row("出生日期", pick(state.form.birth, "请选择出生日期"), 1) +
        row("健康状态", '<div class="dots">' + dot("health", "健康", state.form.health, "健康") + dot("health", "其他", state.form.health, "其他") + "</div>", 1) +
        row("身高", text("height", "请输入身高"), 1) +
        row("体重", text("weight", "请输入体重"), 1) +
        "</section>" +
        '<section class="card"><h3>紧急联系人</h3>' +
        row("姓名", text("urgent", "请输入姓名"), 1) +
        row("关系", pick(state.form.relation, "请选择关系"), 1) +
        row("联系电话", text("urgentPhone", "请输入联系电话"), 1) +
        "</section>" +
        '<section class="card"><h3>教育信息</h3>' +
        row("学历", pick(state.form.edu, "请选择学历"), 1) +
        row("学校", text("school", "请输入学校"), 1) +
        row("教育时间", pick(state.form.eduTime, "请选择开始日期"), 0, 1) +
        row("专业名称", text("major", "请输入专业名称")) +
        "</section>";
    } else if (state.step === 1) {
      body = '<section class="card">' + QUESTIONS.map(function (q) {
        var picked = state.answers[q.id];
        var inner = "";
        if (q.type === 3) {
          inner = '<div class="short-answer"><textarea data-answer="' + q.id + '" placeholder="请填写">' + esc(picked || "") + "</textarea></div>";
        } else if (q.type === 4) {
          var chosen = picked || [];
          inner = q.options.map(function (name) {
            return '<button type="button" class="dot' + (chosen.indexOf(name) >= 0 ? " on" : "") + '" data-qm="' + q.id + '" data-name="' + esc(name) + '">' + esc(name) + "</button>";
          }).join("");
        } else {
          inner = q.options.map(function (name) {
            return '<button type="button" class="dot' + (picked === name ? " on" : "") + '" data-q="' + q.id + '" data-name="' + esc(name) + '">' + esc(name) + "</button>";
          }).join("");
        }
        return '<div class="q"><b>' + esc(q.content) + "</b>" + inner + "</div>";
      }).join("") + "</section>";
    } else if (state.step === 2) {
      var tip = job().teamId === 3 ? '<div class="tip">注意：人员报名地区的具体入营地基地由助教团统一调配</div>' : "";
      body = tip + camps.map(function (camp) {
        var ids = camp.weeks.map(function (w) { return w.id; });
        var count = ids.filter(function (id) { return has(state.pickedWeeks, id); }).length;
        var all = count === ids.length && ids.length;
        var open = state.openCamp[camp.name] !== false;
        var weeks = open ? camp.weeks.map(function (week) {
          return '<button type="button" class="week" data-week="' + week.id + '"><div><span class="tag">招募中</span><span class="name">' + esc(week.name) + '</span><span class="when">' + week.time + "</span></div>" + mark(has(state.pickedWeeks, week.id)) + "</button>";
        }).join("") : "";
        var warn = state.weekWarn && !count ? '<div class="need">请至少选择一个周营</div>' : "";
        return '<section class="camp"><div class="camp-hd"><button type="button" class="mark' + (all ? " on" : "") + '" data-base="' + esc(camp.name) + '"></button><strong>' + esc(camp.name) + '</strong><em>已选中' + count + "/" + ids.length + '</em><button type="button" class="fold' + (open ? " open" : "") + '" data-fold="' + esc(camp.name) + '"></button></div>' + warn + weeks + "</section>";
      }).join("");
    } else {
      var posts = job().teamId === 1
        ? [{ id: "EQ营", name: "EQ营", remark: "期望带班营期" }, { id: "SQ营", name: "SQ营", remark: "期望带班营期" }]
        : [{ id: "带队助教", name: "带队助教", remark: "班级日常带队" }, { id: "见习副团", name: "见习副团", remark: "协助团务" }];
      body = '<section class="station">' + posts.map(function (post) {
        return '<button type="button" class="post" data-post="' + esc(post.id) + '">' + mark(has(state.pickedPosts, post.id)) + "<div><b>" + esc(post.name) + "</b><span>" + esc(post.remark) + "</span></div></button>";
      }).join("") + "</section>";
    }
    var foot = state.step === 0
      ? '<button type="button" class="btn-next" data-next="1">下一步</button>'
      : '<button type="button" class="btn-prev" data-prev="1">上一步</button><button type="button" class="btn-go" data-next="1">' + (state.step < 3 ? "下一步" : "提交") + "</button>";
    return nav("领袖营招募", "detail") + '<div class="apply"><div class="apply-sky"></div>' + steps() + '<div class="apply-scroll">' + body + '</div><div class="apply-foot">' + foot + "</div></div>";
  }

  function success() {
    return nav("领袖营招募") + '<div class="ok"><div class="ok-img"></div><p>恭喜您报名成功</p><div class="sub">请务必添加工作人员<br>微信号：lsc-recruit<br>手机号：13800008888</div><button type="button" class="pill" data-go="mine">查看报名结果</button><button type="button" class="pill line" data-go="list">返回</button></div>';
  }

  function minePage() {
    var tabs = ["全部", "已录用", "不通过", "已取消"];
    var index = Math.max(0, tabs.indexOf(state.mineTab));
    var rows = mine.filter(function (item) {
      if (state.mineTab === "已录用") return item.status === 6;
      if (state.mineTab === "不通过") return item.status === 1;
      if (state.mineTab === "已取消") return item.status === 2;
      return true;
    }).map(function (item) {
      var text = item.status === 6 ? "已录用" : item.status === 2 ? "已取消" : item.status === 1 ? "已淘汰" : "审核中";
      var badge = item.status === 6 ? "badge ok" : item.status === 1 || item.status === 2 ? "badge off" : "badge";
      var actions = "";
      if (item.status === 0 || item.status === 4) actions += '<button type="button" data-go="apply" data-job="' + item.jobId + '">修改信息</button>';
      if (item.status === 6) actions += '<button type="button" data-go="perfect" data-id="' + item.id + '">完善信息</button>';
      if (item.status === 6) actions += '<button type="button" class="fill" data-hired="1">取消报名</button>';
      else if (item.status === 0 || item.status === 4 || item.status === 5) actions += '<button type="button" class="fill" data-go="cancel" data-id="' + item.id + '">取消报名</button>';
      if (item.status === 2) actions += '<button type="button" data-go="detail" data-job="' + item.jobId + '">重新报名</button>';
      actions += '<button type="button" data-go="result" data-id="' + item.id + '">详情</button>';
      return '<article class="join"><div class="join-hd"><span class="' + badge + '">' + text + "</span><strong>" + esc(item.who || item.title) + '</strong><i class="go"></i></div><p>' + esc(item.title) + "</p><p>地区：" + esc(item.region) + "</p><p>提交时间：" + item.time + '</p><div class="join-ops">' + actions + "</div></article>";
    }).join("");
    return nav("我的报名", "list") +
      '<div class="tabs">' + tabs.map(function (name) {
        return '<button type="button" data-tab="' + name + '" class="' + (state.mineTab === name ? "on" : "") + '">' + name + "</button>";
      }).join("") + '<i style="transform:translateX(' + index * 65 + 'px)"></i></div>' +
      (rows || '<div class="empty"><i></i>找不到相关的报名信息哦～</div>') +
      (rows ? '<div class="more">—————— 没有更多了 ——————</div>' : "");
  }

  function cancel() {
    return nav("取消报名", "mine") + '<div class="page"><section class="card">' +
      row("取消原因", pick(state.form.reason || "时间冲突", "请选择原因")) +
      row("备注", '<textarea data-k="note" placeholder="请输入取消原因备注"></textarea>') +
      '</section><button type="button" class="pill" data-cancel="1">确认无误，取消报名</button></div>';
  }

  function perfect() {
    if (!state.bank || state.bank.cardNo === undefined) loadBank(state.focusId || "m-hired");
    var extra = state.account === 2
      ? row("公司名称", bankInput("company", "请输入公司名称"), 0, 1) + row("统一社会信用代码", bankInput("code", "请输入信用代码"), 0, 1)
      : row("开户人姓名", bankInput("holder", "请输入姓名"));
    return nav("完善信息", "mine") + '<div class="page"><section class="card"><h3>基础信息（必填）</h3>' +
      row("证件类型", pick(state.bank.certType, "请选择")) +
      row("证件号", bankInput("certNo", "请输入证件号")) +
      '</section><section class="card"><h3>工资卡信息（必填）<button type="button" class="lb-num-btn" data-note-key="talentBank"></button></h3>' +
      row("账户类型", '<div class="dots">' + dot("acct", "1", String(state.account), "个人账户") + dot("acct", "2", String(state.account), "公司账户") + "</div>") +
      row("银行卡号", bankInput("cardNo", "请输入银行卡号")) +
      row("开户行", pick(state.bank.bankName, "请输入/选择开户行")) +
      row("开户支行", bankInput("branch", "请输入开户支行")) +
      row("开户行所在城市", pick(state.bank.city, "请选择"), 0, 1) +
      row("账户联行号", bankInput("unionNo", "请输入联行号"), 0, 1) +
      extra + '</section><button type="button" class="pill" data-perfect="1">提交</button></div>';
  }

  function result() {
    var item = mine.filter(function (rowItem) { return rowItem.id === state.focusId; })[0] || mine[0];
    var banner = item.status === 6 ? "ok" : item.status === 1 || item.status === 2 ? "off" : "wait";
    var text = item.status === 6 ? "恭喜您，您已被录用！" : item.status === 1 ? "很遗憾，您没有通过报名，期待下次与您相遇" : item.status === 2 ? "已取消报名" : "已提交报名";
    return nav("报名详情", "mine") + '<div class="banner-note ' + banner + '">' + text + '</div><div class="page"><section class="card"><div class="flow on"><i></i><b>已提交报名</b></div><div class="flow' + (item.status === 6 ? " on" : "") + '"><i></i><b>审核</b></div><div class="flow' + (item.status === 6 ? " on" : "") + '"><i></i><b>录用</b></div></section><section class="card"><h3>报名信息</h3><div class="kv"><span>姓名</span><b>林晓雯</b></div><div class="kv"><span>电话</span><b>13800001101</b></div><div class="kv"><span>所属团队</span><b>' + esc(job().team) + '</b></div></section><section class="card"><h3>报读信息</h3><div class="kv"><span>周营</span><b>广东基地A · 第一周</b></div><div class="kv"><span>岗位</span><b>带队助教</b></div></section></div>';
  }

  function render() {
    var html = { list: list, detail: detail, apply: apply, success: success, mine: minePage, cancel: cancel, perfect: perfect, result: result }[state.route] || list;
    document.getElementById("app").innerHTML = html();
    if (window.RecruitNotes) window.RecruitNotes.paint();
  }

  document.addEventListener("click", function (event) {
    var t = event.target.closest("[data-go],[data-open],[data-drop],[data-year],[data-filter],[data-tab],[data-next],[data-prev],[data-cancel],[data-perfect],[data-hired],[data-week],[data-post],[data-base],[data-fold],[data-sex],[data-health],[data-q],[data-qm],[data-acct]");
    if (!t) return;
    if (t.getAttribute("data-drop")) {
      var key = t.getAttribute("data-drop");
      state.drop = state.drop === key ? "" : key;
      render();
      return;
    }
    if (t.getAttribute("data-year")) { state.year = t.getAttribute("data-year"); state.drop = ""; render(); return; }
    if (t.getAttribute("data-filter")) { state.filter = t.getAttribute("data-filter"); state.drop = ""; render(); return; }
    if (t.getAttribute("data-tab")) { state.mineTab = t.getAttribute("data-tab"); render(); return; }
    if (t.getAttribute("data-open")) { state.jobId = t.getAttribute("data-open"); go("detail"); return; }
    if (t.getAttribute("data-sex")) { state.form.sex = t.getAttribute("data-sex"); render(); return; }
    if (t.getAttribute("data-health")) { state.form.health = t.getAttribute("data-health"); render(); return; }
    if (t.getAttribute("data-q")) {
      state.answers[t.getAttribute("data-q")] = t.getAttribute("data-name");
      render();
      return;
    }
    if (t.getAttribute("data-qm")) {
      var qid = t.getAttribute("data-qm");
      var name = t.getAttribute("data-name");
      var list = state.answers[qid] ? state.answers[qid].slice() : [];
      var at = list.indexOf(name);
      if (at >= 0) list.splice(at, 1);
      else list.push(name);
      state.answers[qid] = list;
      render();
      return;
    }
    if (t.getAttribute("data-acct")) { state.account = Number(t.getAttribute("data-acct")); render(); return; }
    if (t.getAttribute("data-week")) { toggle(state.pickedWeeks, t.getAttribute("data-week")); state.weekWarn = false; render(); return; }
    if (t.getAttribute("data-post")) { toggle(state.pickedPosts, t.getAttribute("data-post")); render(); return; }
    if (t.getAttribute("data-fold")) {
      var base = t.getAttribute("data-fold");
      state.openCamp[base] = state.openCamp[base] === false;
      render();
      return;
    }
    if (t.getAttribute("data-base")) {
      var name = t.getAttribute("data-base");
      var camp = camps.filter(function (item) { return item.name === name; })[0];
      if (!camp) return;
      var ids = camp.weeks.map(function (week) { return week.id; });
      var allOn = ids.every(function (id) { return has(state.pickedWeeks, id); });
      ids.forEach(function (id) {
        var at = state.pickedWeeks.indexOf(id);
        if (allOn && at >= 0) state.pickedWeeks.splice(at, 1);
        if (!allOn && at < 0) state.pickedWeeks.push(id);
      });
      state.weekWarn = false;
      render();
      return;
    }
    if (t.getAttribute("data-job")) state.jobId = t.getAttribute("data-job");
    if (t.getAttribute("data-hired")) { toast("已录用后无法取消报名，请联系团队负责人"); return; }
    if (t.getAttribute("data-go")) {
      if (t.getAttribute("data-id")) state.focusId = t.getAttribute("data-id");
      if (t.getAttribute("data-go") === "perfect") loadBank(t.getAttribute("data-id") || state.focusId || "m-hired");
      if (t.getAttribute("data-go") === "apply") { state.step = 0; state.weekWarn = false; }
      go(t.getAttribute("data-go"));
      return;
    }
    if (t.getAttribute("data-prev")) { state.step = Math.max(0, state.step - 1); render(); return; }
    if (t.getAttribute("data-next")) {
      if (state.step === 1 && !answerReady()) { toast("请填写"); return; }
      if (state.step === 2 && !state.pickedWeeks.length) { state.weekWarn = true; render(); return; }
      if (state.step === 3 && !state.pickedPosts.length) { toast(job().teamId === 1 ? "请选择期望Q营" : "未选择岗位"); return; }
      if (state.step < 3) { state.step += 1; render(); return; }
      mine.unshift({ id: "m" + Date.now(), jobId: state.jobId, title: job().title, region: job().region, time: "2026-10-27 14:10", status: 0 });
      state.step = 0;
      go("success");
      return;
    }
    if (t.getAttribute("data-cancel")) {
      mine.forEach(function (item) { if (item.id === state.focusId) item.status = 2; });
      toast("已取消报名，期待下次与您相遇～");
      go("mine");
      return;
    }
    if (t.getAttribute("data-perfect")) { toast("提交成功"); go("mine"); }
  });
  document.addEventListener("input", function (event) {
    var field = event.target;
    if (field.getAttribute("data-k")) state.form[field.getAttribute("data-k")] = field.value;
    if (field.getAttribute("data-answer")) state.answers[field.getAttribute("data-answer")] = field.value;
    if (field.getAttribute("data-bank")) state.bank[field.getAttribute("data-bank")] = field.value;
  });

  function readRoute() {
    var route = (location.hash || "#/list").replace("#/", "") || "list";
    if (route === "apply" && state.shade === "黑") return "detail";
    return route;
  }
  window.addEventListener("hashchange", function () {
    state.route = readRoute();
    if (state.shade === "黑" && (location.hash || "").indexOf("#/apply") === 0) location.hash = "#/detail";
    render();
  });
  window.RecruitApp = {
    shade: function () { return state.shade; },
    setShade: function (value) {
      if (value !== "白" && value !== "灰" && value !== "黑") return;
      state.shade = value;
      try { sessionStorage.setItem("recruit-shade", value); } catch (e) {}
      if (value === "黑" && state.route === "apply") {
        state.route = "detail";
        location.hash = "#/detail";
      }
      render();
    }
  };
  state.route = readRoute();
  if (state.route === "perfect") loadBank("m-hired");
  render();
})();
