(function () {
  "use strict";

  var state = {
    tab: "join",
    dialog: null,
    rows: [
      { id: "w1", name: "王小满", sid: "A10281", joinTime: "07-20~07-26", startWeek: "第六周", endWeek: "第七周", orderStatus: "已支付", status: "已确认", remark: "家长已确认继续连营", family: "F8801", mother: "王敏 13800001101", father: "王强 13800002202", fee: 180, enroll: "已报读", updated: "2026-10-18 16:20" },
      { id: "l1", name: "李可", sid: "A10282", joinTime: "07-20~07-26", startWeek: "第六周", endWeek: "第七周", orderStatus: "已支付", status: "待确认", remark: "", family: "F8802", mother: "- ", father: "李海 13900003303", fee: 180, enroll: "已报读", updated: "2026-10-18 11:02" },
      { id: "s1", name: "孙悦", sid: "A10283", joinTime: "07-13~07-19", startWeek: "第五周", endWeek: "第六周", orderStatus: "已支付", status: "未开通", remark: "", family: "F8803", mother: "孙兰 13600005505", father: "-", fee: 180, enroll: "已报读", updated: "2026-10-17 09:40" },
      { id: "z1", name: "赵欣然", sid: "A10284", joinTime: "07-06~07-12", startWeek: "第四周", endWeek: "第五周", orderStatus: "已退费", status: "已取消", remark: "未确认连营后退费", family: "F8804", mother: "赵丽 13700004404", father: "-", fee: 180, enroll: "已取消", updated: "2026-10-16 18:11" }
    ]
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function byId(id) {
    return state.rows.filter(function (row) { return row.id === id; })[0];
  }

  function ops(row) {
    var html = "";
    if (row.orderStatus !== "已退费" && row.status === "待确认") {
      html += '<button type="button" class="lb-btn" data-cc-act="confirm" data-id="' + row.id + '">确认连营</button>';
      html += '<button type="button" class="lb-btn" data-cc-act="cancelJoin" data-id="' + row.id + '">取消连营</button>';
    }
    if (row.status === "未开通" || row.status === "已取消") {
      html += '<button type="button" class="lb-btn" data-cc-act="openJoin" data-id="' + row.id + '">开通连营</button>';
    }
    return html || "-";
  }

  function joinTable() {
    var html = '<div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>学员姓名</th><th>学员ID</th><th>连营时间</th><th>连营开始周营</th><th>连营结束周营</th><th>订单状态</th><th>状态</th><th>连营情况备注</th><th>家庭ID</th><th>母亲姓名/电话</th><th>父亲姓名/电话</th><th>更新时间</th><th>操作</th></tr></thead><tbody>';
    state.rows.forEach(function (row) {
      html += "<tr><td>" + esc(row.name) + "</td><td>" + esc(row.sid) + "</td><td>" + esc(row.joinTime) + "</td><td>" + esc(row.startWeek) + "</td><td>" + esc(row.endWeek) + "</td><td>" + esc(row.orderStatus) + "</td><td>" + esc(row.status) + "</td><td>" + esc(row.remark || "-") + "</td><td>" + esc(row.family) + "</td><td>" + esc(row.mother) + "</td><td>" + esc(row.father) + "</td><td>" + esc(row.updated) + "</td><td>" + ops(row) + "</td></tr>";
    });
    return html + "</tbody></table></div>";
  }

  function enrollTable() {
    var html = '<div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>学员姓名</th><th>学员ID</th><th>报读状态</th><th>连营状态</th><th>订单状态</th><th>连营费</th><th>操作</th></tr></thead><tbody>';
    state.rows.forEach(function (row) {
      var locked = row.enroll === "已取消" || row.enroll === "已改期";
      html += "<tr><td>" + esc(row.name) + "</td><td>" + esc(row.sid) + "</td><td>" + esc(row.enroll) + "</td><td>" + esc(row.status) + "</td><td>" + esc(row.orderStatus) + "</td><td>￥" + row.fee + "</td><td>";
      if (!locked) {
        html += '<button type="button" class="lb-btn" data-cc-act="drop" data-id="' + row.id + '">取消报读</button>';
        html += '<button type="button" class="lb-btn" data-cc-act="move" data-id="' + row.id + '">改期</button>';
      } else html += "-";
      html += "</td></tr>";
    });
    return html + "</tbody></table></div>";
  }

  function dialogHtml() {
    var d = state.dialog;
    if (!d) return "";
    return '<div class="aw-dialog"><div class="aw-dialog__box"><h3>' + esc(d.title) + "</h3><p>" + esc(d.text) + '</p><div class="aw-actions"><button type="button" class="lb-btn" data-cc-act="dialog-no">取消</button><button type="button" class="lb-btn lb-btn--primary" data-cc-act="dialog-yes">确定</button></div></div></div>';
  }

  function render() {
    var root = document.getElementById("connect-app");
    if (!root) return;
    var html = '<div class="aw-tabs" style="margin-bottom:12px">';
    html += '<button type="button" class="' + (state.tab === "join" ? "is-on" : "") + '" data-cc-tab="join">连营管理</button>';
    html += '<button type="button" class="' + (state.tab === "enroll" ? "is-on" : "") + '" data-cc-tab="enroll">报读记录</button></div>';
    html += '<div class="cc-toolbar"><button type="button" class="lb-btn lb-btn--primary" data-cc-act="extraOpen">额外住宿费用收款码</button><span class="lb-act"><button type="button" class="lb-btn">导出</button><button type="button" class="lb-num-btn" data-note-key="extraStay"></button></span></div>';
    html += '<p class="lb-hint">现网位置：领袖营 → 实施管理 → 连营管理。取消报读、改期在周营详情的报读记录。考勤里的提前入营/连营管理不参与连营费。额外住宿费用收款码为本期新增，生成后可在 6Q业务 → 订单中心 → 销售订单按渠道「领袖营-额外住宿费用」查到。</p>';
    html += state.tab === "join" ? joinTable() : enrollTable();
    html += dialogHtml() + extraSheet();
    root.innerHTML = html;
  }

  /* 第1条：额外住宿费用收款码
     流程：选学员（该计划周营内已报读）→ 填费用 → 生成二维码 → 家长扫码支付。
     支付成功后写入 6Q业务 → 订单中心 → 销售订单，渠道固定为「领袖营-额外住宿费用」。
     金额由后台填写，不走薪资或退款口径。 */
  var extra = {
    open: false,
    step: 1,
    plan: "",
    kid: "",
    amount: "",
    note: "",
    code: "",
    orders: []
  };

  var EXTRA_STUDENTS = [
    { id: "w1", name: "王小满", sid: "A10281", klass: "A1班", plan: "2026年暑假广州第二期", week: "第六周", status: "已报读" },
    { id: "l1", name: "李可", sid: "A10282", klass: "A1班", plan: "2026年暑假广州第二期", week: "第六周", status: "已报读" },
    { id: "s1", name: "孙悦", sid: "A10283", klass: "A2班", plan: "2026年暑假广州第二期", week: "第五周", status: "已报读" },
    { id: "z1", name: "赵欣然", sid: "A10284", klass: "A2班", plan: "2026年暑假广州第二期", week: "第四周", status: "已报读" }
  ];

  function extraPlan() {
    return extra.plan || (EXTRA_STUDENTS[0] && EXTRA_STUDENTS[0].plan) || "";
  }

  function extraKids() {
    return EXTRA_STUDENTS.filter(function (s) { return s.plan === extraPlan(); });
  }

  function extraStudent() {
    return extraKids().filter(function (s) { return s.id === extra.kid; })[0] || null;
  }

  function extraSheet() {
    if (!extra.open) return "";
    var html = '<div class="aw-dialog ex-stay"><div class="aw-dialog__box ex-stay__box">';
    html += '<h3>额外住宿费用收款码</h3>';
    html += '<div class="ex-stay__steps"><span class="' + (extra.step === 1 ? "is-on" : extra.step > 1 ? "is-done" : "") + '">1 选学员</span><span class="' + (extra.step === 2 ? "is-on" : extra.step > 2 ? "is-done" : "") + '">2 填费用</span><span class="' + (extra.step === 3 ? "is-on" : "") + '">3 出二维码</span></div>';

    if (extra.step === 1) {
      html += '<p class="ex-stay__tip">只列该计划周营内已报读的学员。学员实际只来一周但提前入营进入连营的，在这里单独收额外住宿费。</p>';
      html += '<div class="ex-stay__list">';
      extraKids().forEach(function (s) {
        html += '<button type="button" class="ex-stay__kid' + (extra.kid === s.id ? " is-on" : "") + '" data-cc-act="extraPick" data-id="' + s.id + '">';
        html += '<span class="ex-stay__radio' + (extra.kid === s.id ? " is-on" : "") + '"></span>';
        html += "<b>" + esc(s.name) + "</b><em>" + esc(s.sid) + " · " + esc(s.klass) + " · " + esc(s.week) + "</em>";
        html += '<i class="ex-stay__st">' + esc(s.status) + "</i></button>";
      });
      html += "</div>";
    }

    if (extra.step === 2) {
      var s = extraStudent();
      html += '<div class="ex-stay__who">学员：<b>' + esc(s ? s.name : "-") + "</b>　" + esc(s ? s.sid : "") + "　" + esc(s ? s.klass : "") + "</div>";
      html += '<label class="ex-stay__field"><span>费用名称</span><input class="lb-input" value="额外住宿费用" disabled /></label>';
      html += '<label class="ex-stay__field"><span><i>*</i>收款金额</span><input class="lb-input" id="ex-amount" type="number" min="0" step="0.01" placeholder="请输入金额，如 200" value="' + esc(extra.amount) + '" /></label>';
      html += '<label class="ex-stay__field"><span>备注</span><input class="lb-input" id="ex-note" placeholder="选填，如：提前 1 天入营" value="' + esc(extra.note) + '" /></label>';
      html += '<p class="ex-stay__tip">付款成功后自动写入 6Q业务 → 订单中心 → 销售订单，渠道为「领袖营-额外住宿费用」，金额按这里填写的收取。</p>';
    }

    if (extra.step === 3) {
      var kid = extraStudent();
      html += '<div class="ex-stay__qr">';
      html += '<div class="ex-stay__code">' + qrSvg(extra.code) + "</div>";
      html += '<p class="ex-stay__amt">￥' + esc(extra.amount) + "</p>";
      html += '<p class="ex-stay__sub">' + esc(kid ? kid.name : "") + " · 额外住宿费用</p>";
      html += '<p class="ex-stay__hint">请家长扫码支付，或截图发给家长。支付完成后在 6Q业务 → 订单中心 → 销售订单按渠道「领袖营-额外住宿费用」查看。</p>';
      html += "</div>";
    }

    html += '<div class="aw-actions">';
    if (extra.step === 1) {
      html += '<button type="button" class="lb-btn" data-cc-act="extraClose">取消</button>';
      html += '<button type="button" class="lb-btn lb-btn--primary" data-cc-act="extraNext">下一步</button>';
    } else if (extra.step === 2) {
      html += '<button type="button" class="lb-btn" data-cc-act="extraBack">上一步</button>';
      html += '<button type="button" class="lb-btn lb-btn--primary" data-cc-act="extraMake">生成收款码</button>';
    } else {
      html += '<button type="button" class="lb-btn" data-cc-act="extraDone">完成</button>';
    }
    html += "</div></div></div>";
    return html;
  }

  /* 伪二维码：按内容生成稳定的方块图案，只用于演示。 */
  function qrSvg(seed) {
    var text = String(seed || "extra-stay");
    var hash = 0;
    for (var i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) % 2147483647;
    var cells = 21;
    var unit = 8;
    var out = '<svg viewBox="0 0 ' + cells * unit + " " + cells * unit + '" xmlns="http://www.w3.org/2000/svg" role="img">';
    out += '<rect width="100%" height="100%" fill="#fff"/>';
    var on = function (x, y) {
      var v = (hash + x * 7919 + y * 104729 + (x * y) * 31) % 97;
      return v % 3 !== 0;
    };
    var finder = function (fx, fy) {
      out += '<rect x="' + fx * unit + '" y="' + fy * unit + '" width="' + 7 * unit + '" height="' + 7 * unit + '" fill="#1f2430"/>';
      out += '<rect x="' + (fx + 1) * unit + '" y="' + (fy + 1) * unit + '" width="' + 5 * unit + '" height="' + 5 * unit + '" fill="#fff"/>';
      out += '<rect x="' + (fx + 2) * unit + '" y="' + (fy + 2) * unit + '" width="' + 3 * unit + '" height="' + 3 * unit + '" fill="#1f2430"/>';
    };
    for (var y = 0; y < cells; y++) {
      for (var x = 0; x < cells; x++) {
        if ((x < 8 && y < 8) || (x > cells - 9 && y < 8) || (x < 8 && y > cells - 9)) continue;
        if (on(x, y)) out += '<rect x="' + x * unit + '" y="' + y * unit + '" width="' + unit + '" height="' + unit + '" fill="#1f2430"/>';
      }
    }
    finder(0, 0);
    finder(cells - 7, 0);
    finder(0, cells - 7);
    return out + "</svg>";
  }

  function readExtraForm() {
    var amount = document.getElementById("ex-amount");
    var note = document.getElementById("ex-note");
    if (amount) extra.amount = amount.value.trim();
    if (note) extra.note = note.value.trim();
  }

  function askEnroll(row, kind) {
    var action = kind === "drop" ? "取消报读" : "改期";
    if (row.status === "已确认") {
      state.dialog = {
        title: action,
        text: "【" + row.name + "】在连营管理中已确认连营。本次" + action + "不退连营费，订单保持已支付。",
        yes: function () {
          row.enroll = kind === "drop" ? "已取消" : "已改期";
        }
      };
      return;
    }
    state.dialog = {
      title: action,
      text: "【" + row.name + "】尚未确认连营。本次" + action + "将原路退回连营费 ￥" + row.fee + "。",
      yes: function () {
        row.enroll = kind === "drop" ? "已取消" : "已改期";
        row.orderStatus = "已退费";
        if (row.status === "待确认") row.status = "已取消";
      }
    };
  }

  document.addEventListener("click", function (e) {
    var tab = e.target.closest("[data-cc-tab]");
    if (tab) { state.tab = tab.getAttribute("data-cc-tab"); render(); return; }
    var btn = e.target.closest("[data-cc-act]");
    if (!btn) return;
    var act = btn.getAttribute("data-cc-act");
    var row = byId(btn.getAttribute("data-id"));
    if (act === "confirm" && row) { row.status = "已确认"; row.remark = row.remark || "已确认连营"; render(); return; }
    if (act === "cancelJoin" && row) { row.status = "已取消"; row.remark = "已取消连营"; render(); return; }
    if (act === "openJoin" && row) { row.status = "待确认"; row.orderStatus = row.orderStatus === "已退费" ? "已支付" : row.orderStatus; render(); return; }
    if ((act === "drop" || act === "move") && row) { askEnroll(row, act); render(); return; }
    if (act === "dialog-no") { state.dialog = null; render(); return; }
    if (act === "dialog-yes" && state.dialog) { state.dialog.yes(); state.dialog = null; render(); return; }

    if (act === "extraOpen") {
      extra.open = true;
      extra.step = 1;
      extra.kid = "";
      extra.amount = "";
      extra.note = "";
      extra.code = "";
      render();
      return;
    }
    if (act === "extraClose") { extra.open = false; render(); return; }
    if (act === "extraPick") { extra.kid = btn.getAttribute("data-id"); render(); return; }
    if (act === "extraNext") {
      if (!extra.kid) { window.LB.toast("请选择学员"); return; }
      extra.step = 2;
      render();
      return;
    }
    if (act === "extraBack") { extra.step = 1; render(); return; }
    if (act === "extraMake") {
      readExtraForm();
      var amt = Number(extra.amount);
      if (!extra.amount || isNaN(amt) || amt <= 0) { window.LB.toast("请输入正确的收款金额"); return; }
      /* 生成收款码。演示里用固定串做种子，真实实现要带商户号、金额、学员ID 与订单预编号。 */
      extra.code = "LSCX-" + extra.kid + "-" + Math.round(amt * 100) + "-20261028";
      extra.step = 3;
      render();
      return;
    }
    if (act === "extraDone") {
      extra.open = false;
      window.LB.toast("已生成订单，渠道：领袖营-额外住宿费用");
      render();
    }
  });

  render();
})();
