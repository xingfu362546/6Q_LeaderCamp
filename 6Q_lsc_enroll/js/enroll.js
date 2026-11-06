/**
 * 第31条 报读（家长端独立 APP 演示，不在后台管理壳内）。四步：选择报读人 → 选择期数 → 支付金额 → 完成报读。
 *
 * 源码对照：报读流程不在 sixQEducation-platform / sixQEducation-lsc 现网源码内，
 * 本页按需求方提供的 4 张截图复刻，字段与步骤以截图为准。
 *
 * 过往（v3.4.0）：
 * - 第一步选报读人，卡片显示姓名、关系（儿子/女儿）、手机号；下方「+ 添加儿女」。
 * - 第二步选期数，按基地分卡片，每张列出地址与各周营起止日期。
 * - 第三步支付金额，卡片显示上课人信息、报读 Q营（含复训标签）、日期、地点、费用明细、优惠券，底部合计与确认报读。
 * - 第四步完成报读。
 * - 复训学员没有营服相关选项，营服随报读默认发放，也没有积分返还。
 *
 * 现在（v3.5.0，第31条；原型评审第二轮第7条调整）：
 * - 仅在第 3 步「支付金额」里、报读 Q营卡片下方、合计之前，增加一块「营服」判断。
 * - 触发条件改为：过往只要报读过一期就提示（不再只看本单是否带复训标识）。
 * - 文案改为三选一，选项直接带出积分返还：
 *     需要一件 → 返还 5800 积分
 *     需要两件 → 返还 0 积分
 *     不需要   → 返还 11600 积分
 * - 选中后，底部合计下方补一行对应返还积分；合计金额不变（积分不进金额）。
 * - 默认不预选，必须选择后才能确认报读。
 */
(function () {
  "use strict";

  var STEPS = ["选择报读人", "选择期数", "支付金额", "完成报读"];

  var CHILDREN = [
    { id: "k1", name: "王语晨", relation: "女儿", phone: "", avatar: "晨", health: "健康", dress: "150（M码）", height: "148cm", weight: "41kg", area: "广州市", retrain: true },
    { id: "k2", name: "王语晞", relation: "女儿", phone: "15989041831", avatar: "晞", health: "健康", dress: "140（S码）", height: "136cm", weight: "32kg", area: "广州市", retrain: false }
  ];

  var BASES = [
    {
      id: "b1", title: "2027年寒假领袖营【广东基地A】", addr: "广东省惠州市惠城区沥林镇碧桂园潼湖科技小镇 惠州盈富兴酒店",
      weeks: [
        { id: "w1", label: "第一周：2027-01-21 至 2027-01-27", price: 1980, fee: 2000, retrain: true },
        { id: "w2", label: "第二周：2027-01-28 至 2027-02-03", price: 1980, fee: 2000, retrain: true }
      ]
    },
    {
      id: "b2", title: "2027年寒假领袖营【广东基地B】", addr: "广东省江门市开平市长沙街道开平大道268号碧桂园·翡翠湾一街1幢",
      weeks: [
        { id: "w3", label: "第一周：2027-01-21 至 2027-01-27", price: 1980, fee: 2000, retrain: true },
        { id: "w4", label: "第二周：2027-01-28 至 2027-02-03", price: 1980, fee: 2000, retrain: true }
      ]
    },
    {
      id: "b3", title: "2027年寒假领袖营【华东基地】", addr: "浙江省湖州市安吉县灵峰街道香溢路1号 安吉维笙香溢大酒店",
      weeks: [
        { id: "w5", label: "第一周：2027-01-21 至 2027-01-27", price: 1980, fee: 2000, retrain: true },
        { id: "w6", label: "第二周：2027-01-28 至 2027-02-03", price: 1980, fee: 2000, retrain: true }
      ]
    }
  ];

  var state = {
    step: 0,
    kid: "k1",
    week: "",
    uniform: "",
    coupon: "",
    done: false
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function kid() {
    return CHILDREN.filter(function (c) { return c.id === state.kid; })[0] || CHILDREN[0];
  }

  function week() {
    var hit = null;
    BASES.forEach(function (b) {
      b.weeks.forEach(function (w) { if (w.id === state.week) hit = { base: b, week: w }; });
    });
    return hit;
  }

  function steps() {
    return '<ol class="rg-steps">' + STEPS.map(function (name, i) {
      var cls = i === state.step ? " is-on" : i < state.step ? " is-done" : "";
      return '<li class="' + cls.trim() + '"><b>' + (i + 1) + "</b><span>" + esc(name) + "</span></li>";
    }).join("") + "</ol>";
  }

  function nav() {
    return '<header class="rg-nav"><button type="button" class="rg-back" data-rg="back" aria-label="返回"></button><h1>报读</h1></header>';
  }

  function stepWho() {
    var html = '<div class="rg-body">';
    CHILDREN.forEach(function (c) {
      var on = state.kid === c.id;
      html += '<button type="button" class="rg-kid' + (on ? " is-on" : "") + '" data-rg="kid" data-id="' + c.id + '">';
      html += '<span class="rg-avatar">' + esc(c.avatar) + "</span>";
      html += '<span class="rg-kid__main"><b>' + esc(c.name) + '</b><em class="rg-rel">' + esc(c.relation) + "</em>";
      if (c.phone) html += '<i class="rg-phone">' + esc(c.phone) + "</i>";
      html += "</span>";
      html += '<span class="rg-radio' + (on ? " is-on" : "") + '"></span></button>';
      if (on) {
        html += '<div class="rg-profile">';
        html += '<div class="rg-profile__row"><span>照片</span><b class="rg-thumb"></b></div>';
        html += '<div class="rg-profile__row"><span>健康情况</span><b>' + esc(c.health) + "</b></div>";
        html += '<div class="rg-profile__row"><span>衣服尺码</span><b>' + esc(c.dress) + "</b></div>";
        html += '<div class="rg-profile__row"><span>身高</span><b>' + esc(c.height) + "</b></div>";
        html += '<div class="rg-profile__row"><span>体重</span><b>' + esc(c.weight) + "</b></div>";
        html += '<div class="rg-profile__row"><span>所在地区</span><b>' + esc(c.area) + "</b></div>";
        html += "</div>";
      }
    });
    html += '<button type="button" class="rg-addkid">＋ 添加儿女</button>';
    html += "</div>";
    return html + '<footer class="rg-foot"><button type="button" class="rg-next" data-rg="next">下一步</button></footer>';
  }

  function stepTerm() {
    var html = '<div class="rg-body">';
    BASES.forEach(function (b) {
      html += '<section class="rg-base"><h2>' + esc(b.title) + "</h2><p class=\"rg-addr\">" + esc(b.addr) + "</p>";
      b.weeks.forEach(function (w) {
        var on = state.week === w.id;
        html += '<button type="button" class="rg-week' + (on ? " is-on" : "") + '" data-rg="week" data-id="' + w.id + '">';
        html += '<span class="rg-check' + (on ? " is-on" : "") + '"></span><span>' + esc(w.label) + "</span></button>";
      });
      html += "</section>";
    });
    html += "</div>";
    html += '<footer class="rg-foot"><div class="rg-qual"><span>报读资格：2</span><span>已报读Q营：0</span></div><button type="button" class="rg-next" data-rg="next">下一步</button></footer>';
    return html;
  }

  function stepPay() {
    var hit = week();
    var c = kid();
    var weekData = hit ? hit.week : null;
    var baseData = hit ? hit.base : null;
    var total = weekData ? weekData.price + weekData.fee : 0;
    var html = '<div class="rg-body">';
    html += '<section class="rg-card"><h2 class="rg-card__t">上课人信息</h2>';
    html += '<div class="rg-person"><span class="rg-avatar">' + esc(c.avatar) + "</span><span><b>" + esc(c.name) + '</b><em class="rg-rel">' + esc(c.relation) + "</em></span></div>";
    html += '<div class="rg-kv"><span>健康情况</span><b>' + esc(c.health) + "</b></div>";
    html += '<div class="rg-kv"><span>衣服尺码</span><b>' + esc(c.dress) + "</b></div>";
    html += '<div class="rg-kv"><span>身高</span><b>' + esc(c.height) + "</b></div>";
    html += '<div class="rg-kv"><span>体重</span><b>' + esc(c.weight) + "</b></div>";
    html += "</section>";

    html += '<section class="rg-card"><h2 class="rg-card__t">报读Q营</h2>';
    if (weekData) {
      html += '<div class="rg-qcamp"><b>AQ营《愿景与意志》</b>' + (weekData.retrain ? '<em class="rg-retrain">复训</em>' : "") + "</div>";
      html += '<div class="rg-kv"><span>日期</span><b>2027-01-21 至 2027-01-27</b></div>';
      html += '<div class="rg-kv"><span>地点</span><b>' + esc(baseData.addr) + "</b></div>";
      html += '<div class="rg-fee"><div><span>复训费</span><b>¥' + weekData.price.toFixed(2) + "</b></div>";
      html += "<div><span>行政生活费</span><b>¥" + weekData.fee.toFixed(2) + "</b></div>";
      html += '<div><span>优惠券</span><b class="rg-coupon">请选择优惠券 ›</b></div></div>';
      if (weekData.retrain) {
        /* 原型评审第二轮第7条：触发条件改为「过往只要报读过一期」。
           选项改为三选一，并给出对应积分返还：
             需要一件 → 返还 5800 积分
             需要两件 → 返还 0 积分
             不需要   → 返还 11600 积分 */
        html += '<div class="rg-uniform"><div class="rg-uniform__txt">检测到您过往报读过领袖营，本次是否需要新的营服？</div>';
        html += '<div class="rg-uniform__ops rg-uniform__ops--three">';
        html += '<button type="button" class="rg-uni' + (state.uniform === "one" ? " is-on" : "") + '" data-rg="uniform" data-v="one"><b>需要一件</b><em>返还 5800 积分</em></button>';
        html += '<button type="button" class="rg-uni' + (state.uniform === "two" ? " is-on" : "") + '" data-rg="uniform" data-v="two"><b>需要两件</b><em>返还 0 积分</em></button>';
        html += '<button type="button" class="rg-uni' + (state.uniform === "none" ? " is-on" : "") + '" data-rg="uniform" data-v="none"><b>不需要</b><em>返还 11600 积分</em></button>';
        html += "</div>";
        html += '<button type="button" class="rg-num" data-note="31" aria-label="需求 31"></button>';
        html += "</div>";
      }
    } else {
      html += '<p class="rg-hint">请先选择期数</p>';
    }
    html += "</section></div>";

    html += '<footer class="rg-foot rg-foot--pay"><div class="rg-total"><span>合计</span><b>¥' + total.toFixed(2) + "</b>";
    if (state.uniform === "one") html += '<em class="rg-points">返还 5800 积分</em>';
    if (state.uniform === "two") html += '<em class="rg-points">返还 0 积分</em>';
    if (state.uniform === "none") html += '<em class="rg-points">返还 11600 积分</em>';
    html += '</div><button type="button" class="rg-next" data-rg="confirm">确认报读</button></footer>';
    return html;
  }

  function stepDone() {
    var c = kid();
    return '<div class="rg-done"><i class="rg-done__ic">✓</i><h2>报读成功</h2>' +
      '<p>' + esc(c.name) + " · AQ营《愿景与意志》 · 2027-01-21 至 2027-01-27</p>" +
      (state.uniform === "one" ? '<p class="rg-done__points">已登记 1 件新营服，返还 5800 积分</p>'
        : state.uniform === "two" ? '<p class="rg-done__points">已登记 2 件新营服，返还 0 积分</p>'
        : '<p class="rg-done__points">不需要新营服，返还 11600 积分</p>') +
      '<button type="button" class="rg-next" data-rg="home">返回首页</button></div>';
  }

  function render(root) {
    var body = state.step === 0 ? stepWho() : state.step === 1 ? stepTerm() : state.step === 2 ? stepPay() : stepDone();
    root.innerHTML = "" + nav() + (state.step < 3 ? steps() : "") + body;
    if (window.EnrollNotes) window.EnrollNotes.mount(root);
  }

  function onClick(event) {
    var t = event.target.closest ? event.target.closest("[data-rg]") : null;
    if (!t) return;
    var root = document.getElementById("rg-app");
    if (!root) return;
    var act = t.getAttribute("data-rg");
    if (act === "kid") { state.kid = t.getAttribute("data-id"); render(root); return; }
    if (act === "week") { state.week = t.getAttribute("data-id"); render(root); return; }
    if (act === "uniform") { state.uniform = t.getAttribute("data-v"); render(root); return; }
    if (act === "back") { state.step = Math.max(0, state.step - 1); render(root); return; }
    if (act === "next") {
      if (state.step === 0 && !state.kid) return;
      if (state.step === 1 && !state.week) { toast("请选择期数"); return; }
      state.step = Math.min(3, state.step + 1);
      render(root);
      return;
    }
    if (act === "confirm") {
      if (!state.uniform) { toast("请选择是否需要新的营服"); return; }
      var chosen = kid();
      var qty = state.uniform === "one" ? 1 : state.uniform === "two" ? 2 : 0;
      var choice = state.uniform === "one" ? "需要一件" : state.uniform === "two" ? "需要两件" : "不需要";
      try {
        var pack = JSON.parse(sessionStorage.getItem("lb-uniform-qty-v1") || "{}") || {};
        var record = { qty: qty, choice: choice, name: chosen.name };
        pack[chosen.name] = record;
        if (chosen.id) pack[chosen.id] = record;
        sessionStorage.setItem("lb-uniform-qty-v1", JSON.stringify(pack));
      } catch (e) {}
      state.step = 3;
      render(root);
      return;
    }
    if (act === "home") { state.step = 0; render(root); }
  }

  document.addEventListener("click", onClick, true);

  var toastTimer = null;
  function toast(text) {
    var old = document.querySelector(".toast");
    if (old) old.remove();
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = text;
    document.getElementById("rg-app").appendChild(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { if (el.parentNode) el.remove(); }, 1600);
  }

  window.LB_REGISTER = {
    mount: function (root) { if (root) render(root); },
    state: state
  };

  var boot = document.getElementById("rg-app");
  if (boot) render(boot);
  if (window.EnrollNotes && window.EnrollNotes.mount && boot) window.EnrollNotes.mount(boot);
})();
