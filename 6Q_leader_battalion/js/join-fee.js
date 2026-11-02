(function () {
  "use strict";

  var KEY = "lb-join-rows-v2";
  var week6 = "2026年暑假领袖营【华东基地-湖州】第六周";
  var week7 = "2026年暑假领袖营【华东基地-湖州】第七周";
  var seed = [
    { id: "zmx", camp: "eq-small", name: "张沐轩", sid: "33CWCC", joinTime: "2026-08-17~2026-08-18", startWeek: week6, endWeek: week7, orderStatus: "已支付", status: "已确认", remark: "", family: "82397381", mother: "何晓兰", motherPhone: "13824490911", father: "", fatherPhone: "", fee: 180, enroll: "已报读", updated: "2026-08-18 13:48:47" },
    { id: "hxb", camp: "eq-small", name: "何晓波", sid: "F29KZA", joinTime: "2026-08-17~2026-08-18", startWeek: week6, endWeek: week7, orderStatus: "已支付", status: "已确认", remark: "", family: "21695985", mother: "李陈", motherPhone: "13807722183", father: "何阳", fatherPhone: "13377203188", fee: 180, enroll: "已报读", updated: "2026-08-18 13:48:20" },
    { id: "ayj", camp: "eq-small", name: "安宇静卢", sid: "RLDUY9", joinTime: "2026-08-17~2026-08-18", startWeek: week6, endWeek: week7, orderStatus: "已支付", status: "已确认", remark: "", family: "71409483", mother: "詹霞", motherPhone: "13377225331", father: "农晨", fatherPhone: "13377228206", fee: 180, enroll: "已报读", updated: "2026-08-18 13:49:43" },
    { id: "w1", camp: "eq-small", name: "王小满", sid: "A10281", joinTime: "2026-08-17~2026-08-18", startWeek: week6, endWeek: week7, orderStatus: "已支付", status: "已确认", remark: "家长已确认继续连营", family: "F88021", mother: "王敏", motherPhone: "13800001101", father: "王强", fatherPhone: "13800002202", fee: 180, enroll: "已报读", updated: "2026-08-18 16:20:11" },
    { id: "l1", camp: "eq-small", name: "李可", sid: "A10282", joinTime: "2026-08-17~2026-08-18", startWeek: week6, endWeek: week7, orderStatus: "已支付", status: "待确认", remark: "", family: "F88022", mother: "", motherPhone: "", father: "李海", fatherPhone: "13900003303", fee: 180, enroll: "已报读", updated: "2026-08-18 11:02:06" },
    { id: "s1", camp: "eq-small", name: "孙悦", sid: "A10283", joinTime: "2026-08-10~2026-08-11", startWeek: week6, endWeek: week6, orderStatus: "已支付", status: "未开通", remark: "", family: "F88023", mother: "孙兰", motherPhone: "13600005505", father: "", fatherPhone: "", fee: 180, enroll: "已报读", updated: "2026-08-17 09:40:18" }
  ];

  function load() {
    try {
      var saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (saved && saved.length) return saved;
    } catch (e) {}
    return seed.map(function (row) { return Object.assign({}, row); });
  }

  function save(rows) {
    sessionStorage.setItem(KEY, JSON.stringify(rows));
  }

  window.LB_JOIN = { load: load, save: save };
})();
