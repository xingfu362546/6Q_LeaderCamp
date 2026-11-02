/**
 * 第27条基地台账。以后改口径先对照这里，再改页面。
 *
 * 过往（v3.4.0，源码现网，前端不计算）：
 * - 薪酬管理只有薪酬核算、薪酬账单、薪酬发放。
 * - 核算批次分基本薪酬、绩效薪酬（二轮结算单）、汇总薪酬。
 * - 人员明细上的日标准、出勤、基本工资、绩效奖金、导师学费、工资项、发放比例、应发、个税、实发都是接口字段。
 * - 可手改的是导师学费、工资项金额、发放比例。工资项类型为增加或减少，并单独标是否扣税。保存后服务端重算。
 * - 发放比例库存小数，页面乘 100 显示。
 * - 薪酬账单分生效、作废。字段：payPrice 应发，tax 预期个税，waitPayPrice 预期实发，actualTax 实际个税，actualPayPrice 实际实发。
 * - 个税由服务端按开关 leaderCamp/salary/settle/tax/switch 计算。页面没有税率、速算扣除。
 * - 发放时，同一人还有未完成发放的账单，会提示可能影响个税。个税不能按单张账单重算。
 * - 状态：4待发放（审批通过），5发放中，6已发放，7已完成（全职审批通过），8已取消，9已作废，10发放失败。另有核算中、审批中、已驳回。
 * - 用工类型用账单 type：1 全职员工，2 非全职员工。
 * - 账单类型 billType：1 基本薪酬，2 绩效薪酬，3 汇总薪酬。
 * - 是否参与结算 issueStatus：1 不参与，2 参与。冻结不单独扣金额。
 * - 调整记录类型：1调整 2暂不发放 3继续发放 4退回 5取消核算 6作废。
 *
 * 现在（v3.5.0）：
 * - 按计划开始年 + 计划类型（寒假/暑假）一张台账，其下按开营营地、再按全职/非全职分行。
 * - 不按周营日期切寒暑。跨年的寒假整场归计划开始年。
 * - 只加生效账单里的基本薪酬、绩效薪酬。汇总薪酬不加。
 * - 应发放 = 待发放/发放中/已发放/已完成/发放失败，且参与结算的 payPrice。
 * - 实际发放 = 其中已发放、已完成的 actualPayPrice。全职「已完成」算实际发放。
 * - 预期个税、实际个税只展示，不参与退回。预期个税加应发放那批账单的 tax；实际个税加实际发放那批账单的 actualTax。
 * - 退回 = 调整记录「退回」当时的应发 + 发放失败账单的应发。同一张账单只计一次。
 * - 作废列表、已取消、核算中、审批中、已驳回、不参与结算，不进应发放。
 *
 * 第33条（v3.5.0，做在这张台账上）：
 * - 全职核算按当前年度、计划类型，再按基地或周营筛选后导出。
 * - 发放金额用核算上的应发金额 payPrice，不另起一列。
 * - 导出列覆盖薪酬核算详情，并带上薪酬账单、薪酬发放里已有的身份和账户字段。
 * - 往期当周评级差异用账单上的原值，本页不计算。个税、实发也不重算。
 */
(function () {
  "use strict";

  var PAYABLE = { "待发放": 1, "发放中": 1, "已发放": 1, "已完成": 1, "发放失败": 1 };
  var ACTUAL = { "已发放": 1, "已完成": 1 };
  var COUNT_TYPE = { "基本薪酬": 1, "绩效薪酬": 1 };

  var BILLS = [
    bill("ZD2607-001", 2026, "暑假", "广东基地A", "2026-07青少年6Q领袖营暑假(广东基地A)", "第一周", "林晓雯", "LXW8821", "全职", "基本薪酬", "已完成", "参与结算", false, 10000, 800, 9200, 800, 9200, false, 0),
    bill("ZD2607-002", 2026, "暑假", "广东基地A", "2026-07青少年6Q领袖营暑假(广东基地A)", "第二周", "陈启航", "CQH7601", "全职", "绩效薪酬", "已发放", "参与结算", false, 2000, 200, 1800, 180, 1820, false, 0),
    bill("ZD2607-003", 2026, "暑假", "广东基地A", "2026-07青少年6Q领袖营暑假(广东基地A)", "第一周", "王敏", "WM8EELU", "全职", "汇总薪酬", "已完成", "参与结算", false, 12000, 980, 11020, 980, 11020, false, 0),
    bill("ZD2607-004", 2026, "暑假", "广东基地A", "2026-07青少年6Q领袖营暑假(广东基地A)", "第三周", "赵欣然", "S6MULM1", "全职", "基本薪酬", "已发放", "参与结算", true, 1000, 100, 900, 100, 900, false, 0),
    bill("ZD2607-005", 2026, "暑假", "广东基地A", "2026-07青少年6Q领袖营暑假(广东基地A)", "第一周", "刘洋", "LY20414", "非全职", "基本薪酬", "待发放", "参与结算", false, 3000, 300, 2700, 0, 0, false, 0),
    bill("ZD2607-006", 2026, "暑假", "广东基地A", "2026-07青少年6Q领袖营暑假(广东基地A)", "第二周", "黄志远", "V1MHF63", "非全职", "基本薪酬", "发放失败", "参与结算", false, 500, 50, 450, 0, 0, false, 0),
    bill("ZD2607-007", 2026, "暑假", "广东基地A", "2026-07青少年6Q领袖营暑假(广东基地A)", "第三周", "吴彤", "3N2006", "非全职", "绩效薪酬", "已发放", "参与结算", false, 800, 80, 720, 80, 720, false, 0),
    bill("ZD2607-008", 2026, "暑假", "广东基地A", "2026-07青少年6Q领袖营暑假(广东基地A)", "第一周", "郑海", "ZH4800", "非全职", "基本薪酬", "已取消", "参与结算", false, 999, 0, 999, 0, 0, false, 0),
    bill("ZD2607-009", 2026, "暑假", "广东基地A", "2026-07青少年6Q领袖营暑假(广东基地A)", "第二周", "孙悦", "GF32KT7", "非全职", "绩效薪酬", "审批中", "参与结算", false, 700, 0, 700, 0, 0, false, 0),
    bill("ZD2607-010", 2026, "暑假", "华东基地", "2026-07青少年6Q领袖营暑假(华东基地)", "第一周", "马丽", "GDZE232", "全职", "基本薪酬", "已作废", "参与结算", false, 4000, 0, 4000, 0, 0, false, 0),
    bill("ZD2607-011", 2026, "暑假", "华东基地", "2026-07青少年6Q领袖营暑假(华东基地)", "第一周", "何俊", "HJ2988", "全职", "基本薪酬", "已完成", "不参与结算", false, 2500, 200, 2300, 200, 2300, false, 0),
    bill("ZD2607-012", 2026, "暑假", "华东基地", "2026-07青少年6Q领袖营暑假(华东基地)", "第二周", "李薇", "LW6610", "全职", "基本薪酬", "已完成", "参与结算", false, 6000, 500, 5500, 500, 5500, false, 0),
    bill("ZD2607-013", 2026, "暑假", "华东基地", "2026-07青少年6Q领袖营暑假(华东基地)", "第三周", "周宁", "ZN7712", "非全职", "绩效薪酬", "待发放", "参与结算", false, 1500, 120, 1380, 0, 0, true, 1500),
    bill("ZD2607-014", 2026, "暑假", "华东基地", "2026-07青少年6Q领袖营暑假(华东基地)", "第三周", "钱进", "QJ4408", "非全职", "基本薪酬", "发放失败", "参与结算", false, 1500, 100, 1400, 0, 0, true, 1500),
    bill("ZD2601-001", 2026, "寒假", "广东基地A", "2026-01青少年6Q领袖营寒假(广东基地A)", "第一周", "林晓雯", "LXW8821", "全职", "基本薪酬", "已完成", "参与结算", false, 4000, 300, 3700, 300, 3700, false, 0),
    bill("ZD2601-002", 2026, "寒假", "广东基地A", "2026-12青少年6Q领袖营寒假(广东基地A)", "跨至2027-02", "陈启航", "CQH7601", "全职", "绩效薪酬", "已发放", "参与结算", false, 800, 60, 740, 60, 740, false, 0),
    bill("ZD2701-001", 2027, "寒假", "广东基地B", "2027-01青少年6Q领袖营寒假(广东基地B)", "第一周", "王敏", "WM8EELU", "非全职", "基本薪酬", "已发放", "参与结算", false, 2200, 200, 2000, 200, 2000, false, 0)
  ];

  var PEOPLE = {
    LXW8821: { phone: "13800001101", idNo: "440106199801011226", live: "境内", acctType: "个人", acctName: "林晓雯", company: "", credit: "", bank: "中国工商银行", branch: "广州天河支行", city: "广州", personalLine: "102581000018", companyLine: "", card: "6222023602081234567" },
    CQH7601: { phone: "13500009840", idNo: "320106198601151234", live: "境内", acctType: "个人", acctName: "陈启航", company: "", credit: "", bank: "中国建设银行", branch: "杭州西湖支行", city: "杭州", personalLine: "105331000012", companyLine: "", card: "6217001210001234567" },
    WM8EELU: { phone: "13328491201", idNo: "440104199405062468", live: "境内", acctType: "个人", acctName: "王敏", company: "", credit: "", bank: "中国农业银行", branch: "广州珠江支行", city: "广州", personalLine: "103581000013", companyLine: "", card: "6228480090123456789" },
    S6MULM1: { phone: "13411782552", idNo: "441900200703184422", live: "境内", acctType: "个人", acctName: "赵欣然", company: "", credit: "", bank: "招商银行", branch: "东莞南城支行", city: "东莞", personalLine: "308602000014", companyLine: "", card: "6214830200123456789" },
    LY20414: { phone: "18664520414", idNo: "330106199103083317", live: "境内", acctType: "个人", acctName: "刘洋", company: "", credit: "", bank: "中国银行", branch: "湖州吴兴支行", city: "湖州", personalLine: "104336000015", companyLine: "", card: "6216612000123456789" },
    V1MHF63: { phone: "17710135773", idNo: "440105199808124026", live: "境内", acctType: "个人", acctName: "黄志远", company: "", credit: "", bank: "中国工商银行", branch: "广州越秀支行", city: "广州", personalLine: "102581000016", companyLine: "", card: "6222023602091234567" },
    "3N2006": { phone: "13249806762", idNo: "450102198905213245", live: "境内", acctType: "个人", acctName: "吴彤", company: "", credit: "", bank: "广西农村商业银行", branch: "南宁青秀支行", city: "南宁", personalLine: "402611000017", companyLine: "", card: "6223690000123456789" },
    ZH4800: { phone: "13768001011", idNo: "440301198112067819", live: "境内", acctType: "个人", acctName: "郑海", company: "", credit: "", bank: "平安银行", branch: "深圳福田支行", city: "深圳", personalLine: "307584000018", companyLine: "", card: "6230580000123456789" },
    GF32KT7: { phone: "13428256979", idNo: "810000200401015555", live: "境外", acctType: "个人", acctName: "孙悦", company: "", credit: "", bank: "中国银行", branch: "广州海珠支行", city: "广州", personalLine: "104581000019", companyLine: "", card: "6217562000123456789" },
    GDZE232: { phone: "18800092924", idNo: "330106199506182846", live: "境内", acctType: "公司", acctName: "马丽", company: "杭州示例咨询有限公司", credit: "91330100MA2EXAMPLE", bank: "中国工商银行", branch: "杭州滨江支行", city: "杭州", personalLine: "", companyLine: "102331000099", card: "1202021209001234567" },
    HJ2988: { phone: "15900029888", idNo: "420106199707093315", live: "境内", acctType: "个人", acctName: "何俊", company: "", credit: "", bank: "招商银行", branch: "武汉洪山支行", city: "武汉", personalLine: "308521000020", companyLine: "", card: "6214850210001234567" },
    LW6610: { phone: "13600006610", idNo: "440106199309154028", live: "境内", acctType: "个人", acctName: "李薇", company: "", credit: "", bank: "中国建设银行", branch: "广州体育西支行", city: "广州", personalLine: "105581000021", companyLine: "", card: "6217003320001234567" },
    ZN7712: { phone: "13600007712", idNo: "320102199611223346", live: "境内", acctType: "个人", acctName: "周宁", company: "", credit: "", bank: "交通银行", branch: "南京鼓楼支行", city: "南京", personalLine: "301301000022", companyLine: "", card: "6222620110001234567" },
    QJ4408: { phone: "13700004408", idNo: "370102199202084219", live: "境内", acctType: "个人", acctName: "钱进", company: "", credit: "", bank: "中国农业银行", branch: "青岛市南支行", city: "青岛", personalLine: "103452000023", companyLine: "", card: "6228480250001234567" }
  };

  var CALC = {
    "ZD2607-001": calc("助教团", "助教团长", "92分", "6+", "6", "550.00", "580.00", "6", "3300.00", "3480.00", "180.00", "2000.00", "0.00", "餐补 +200.00", "12000.00", "2000.00", "100%", "是", "已调整", "2026暑假广东基地A-基本薪酬", "2026暑假发放第1批", "", "已推送", "800.00", "2026-08-20 10:12:00", "", "2026-08-20 10:12:00"),
    "ZD2607-002": calc("导师团", "导师", "88分", "6", "6+", "480.00", "520.00", "5", "2400.00", "2600.00", "200.00", "2000.00", "0.00", "", "4600.00", "2600.00", "100%", "否", "继承评级", "2026暑假广东基地A-绩效薪酬", "2026暑假发放第1批", "", "已推送", "180.00", "2026-08-21 15:03:00", "", "2026-08-21 15:03:00"),
    "ZD2607-003": calc("统筹办", "统筹办成员", "90分", "6", "6", "500.00", "500.00", "6", "3000.00", "3000.00", "0.00", "1500.00", "0.00", "交通 +300.00", "12000.00", "0.00", "100%", "否", "未调整", "2026暑假广东基地A-汇总薪酬", "2026暑假发放第1批", "汇总账单", "已推送", "980.00", "2026-08-22 09:00:00", "", "2026-08-22 09:00:00"),
    "ZD2607-004": calc("助教团", "助教", "86分", "5", "5", "300.00", "300.00", "4", "1200.00", "1200.00", "0.00", "0.00", "0.00", "", "1200.00", "200.00", "100%", "否", "未调整", "2026暑假广东基地A-基本薪酬", "2026暑假发放第2批", "冻结后仍发放", "已推送", "100.00", "2026-08-25 11:20:00", "", "2026-08-25 11:20:00"),
    "ZD2607-005": calc("导师团", "导师团长", "91分", "7", "7", "600.00", "600.00", "6", "3600.00", "3600.00", "0.00", "0.00", "0.00", "", "3600.00", "600.00", "100%", "否", "未调整", "2026暑假广东基地A-基本薪酬", "", "", "待推送", "0.00", "", "", "2026-08-18 16:40:00"),
    "ZD2607-006": calc("后勤团", "后勤团长", "80分", "5", "5", "280.00", "280.00", "3", "840.00", "840.00", "0.00", "0.00", "0.00", "", "840.00", "340.00", "100%", "否", "未调整", "2026暑假广东基地A-基本薪酬", "2026暑假发放第1批", "银行卡校验失败", "已推送", "0.00", "", "发放失败", "2026-08-21 18:02:00"),
    "ZD2607-007": calc("助教团", "助教副团", "87分", "6", "6", "400.00", "400.00", "5", "2000.00", "2000.00", "0.00", "800.00", "0.00", "", "2800.00", "2000.00", "100%", "否", "未调整", "2026暑假广东基地A-绩效薪酬", "2026暑假发放第2批", "", "已推送", "80.00", "2026-08-26 09:30:00", "", "2026-08-26 09:30:00"),
    "ZD2607-008": calc("统筹办", "统筹办副主任", "70分", "6", "6", "450.00", "450.00", "2", "900.00", "900.00", "0.00", "99.00", "0.00", "", "999.00", "0.00", "100%", "否", "未调整", "2026暑假广东基地A-基本薪酬", "", "审批前取消", "待推送", "0.00", "", "", "2026-08-10 12:00:00"),
    "ZD2607-009": calc("助教团", "助教", "84分", "4", "5", "260.00", "300.00", "5", "1300.00", "1500.00", "200.00", "0.00", "0.00", "", "1500.00", "800.00", "100%", "是", "已调整", "2026暑假广东基地A-绩效薪酬", "", "", "待推送", "0.00", "", "", "2026-08-19 14:18:00"),
    "ZD2607-010": calc("导师团", "导师", "89分", "6", "6", "480.00", "480.00", "6", "2880.00", "2880.00", "0.00", "1120.00", "0.00", "", "4000.00", "0.00", "100%", "否", "未调整", "2026暑假华东基地-基本薪酬", "", "审批通过后作废", "待推送", "0.00", "", "", "2026-08-12 17:45:00"),
    "ZD2607-011": calc("统筹办", "统筹办成员", "85分", "5", "5", "320.00", "320.00", "6", "1920.00", "1920.00", "0.00", "580.00", "0.00", "", "2500.00", "0.00", "100%", "否", "未调整", "2026暑假华东基地-基本薪酬", "", "不参与结算", "待推送", "0.00", "", "", "2026-08-16 10:05:00"),
    "ZD2607-012": calc("助教团", "助教团长", "93分", "6", "6+", "420.00", "460.00", "6", "2520.00", "2760.00", "240.00", "3240.00", "0.00", "", "6000.00", "0.00", "100%", "是", "已调整", "2026暑假华东基地-基本薪酬", "2026暑假发放第1批", "", "已推送", "500.00", "2026-08-23 13:16:00", "", "2026-08-23 13:16:00"),
    "ZD2607-013": calc("助教团", "助教", "82分", "5", "5", "300.00", "300.00", "4", "1200.00", "1200.00", "0.00", "300.00", "0.00", "", "1500.00", "0.00", "100%", "否", "未调整", "2026暑假华东基地-绩效薪酬", "", "退回后回到待发放", "待推送", "0.00", "", "退回", "2026-08-24 19:11:00"),
    "ZD2607-014": calc("后勤团", "后勤", "78分", "4", "4", "250.00", "250.00", "5", "1250.00", "1250.00", "0.00", "250.00", "0.00", "", "1500.00", "0.00", "100%", "否", "未调整", "2026暑假华东基地-基本薪酬", "2026暑假发放第2批", "发放失败并退回", "已推送", "0.00", "", "发放失败", "2026-08-27 08:40:00"),
    "ZD2601-001": calc("助教团", "助教团长", "90分", "6", "6", "520.00", "520.00", "6", "3120.00", "3120.00", "0.00", "880.00", "0.00", "", "4000.00", "0.00", "100%", "否", "未调整", "2026寒假广东基地A-基本薪酬", "2026寒假发放第1批", "", "已推送", "300.00", "2026-02-18 10:00:00", "", "2026-02-18 10:00:00"),
    "ZD2601-002": calc("导师团", "导师", "86分", "6", "6+", "480.00", "520.00", "2", "960.00", "1040.00", "80.00", "800.00", "0.00", "", "1840.00", "1040.00", "100%", "否", "继承评级", "2026寒假广东基地A-绩效薪酬", "2026寒假发放第1批", "周营跨到2027-02，仍归2026寒假", "已推送", "60.00", "2027-02-20 11:30:00", "", "2027-02-20 11:30:00"),
    "ZD2701-001": calc("统筹办", "统筹办成员", "88分", "6", "6", "400.00", "400.00", "5", "2000.00", "2000.00", "0.00", "200.00", "0.00", "", "2200.00", "0.00", "100%", "否", "未调整", "2027寒假广东基地B-基本薪酬", "2027寒假发放第1批", "", "已推送", "200.00", "2027-02-12 09:20:00", "", "2027-02-12 09:20:00")
  };

  function calc(team, post, score, pastLevel, curLevel, pastPay, curPay, days, pastBase, curBase, diff, bonus, tuition, other, weekDue, weekPaid, ratio, changed, levelStatus, batch, issueBatch, issueRemark, push, deduct, payTime, payNote, updated) {
    return {
      team: team, post: post, score: score, pastLevel: pastLevel, curLevel: curLevel,
      pastPay: pastPay, curPay: curPay, days: days, pastBase: pastBase, curBase: curBase, diff: diff,
      bonus: bonus, tuition: tuition, other: other, weekDue: weekDue, weekPaid: weekPaid, ratio: ratio,
      changed: changed, levelStatus: levelStatus, batch: batch, issueBatch: issueBatch,
      issueRemark: issueRemark, push: push, deduct: deduct, payTime: payTime, payNote: payNote, updated: updated
    };
  }

  function bill(code, year, season, base, plan, week, name, memberId, employ, billType, payStatus, issueStatus, freeze, payPrice, tax, waitPayPrice, actualTax, actualPayPrice, returned, returnPayPrice) {
    return {
      code: code,
      year: year,
      season: season,
      base: base,
      plan: plan,
      week: week,
      name: name,
      memberId: memberId,
      employ: employ,
      billType: billType,
      payStatus: payStatus,
      issueStatus: issueStatus,
      freeze: freeze,
      payPrice: payPrice,
      tax: tax,
      waitPayPrice: waitPayPrice,
      actualTax: actualTax,
      actualPayPrice: actualPayPrice,
      returned: returned,
      returnPayPrice: returnPayPrice
    };
  }

  BILLS.forEach(function (row) {
    var person = PEOPLE[row.memberId] || {};
    var extra = CALC[row.code] || {};
    Object.keys(person).forEach(function (key) { row[key] = person[key]; });
    Object.keys(extra).forEach(function (key) { row[key] = extra[key]; });
  });

  function inScope(row) {
    return row.issueStatus === "参与结算" && COUNT_TYPE[row.billType];
  }

  function payable(row) {
    return inScope(row) && PAYABLE[row.payStatus];
  }

  function actual(row) {
    return payable(row) && ACTUAL[row.payStatus];
  }

  function returnAmount(row) {
    if (!inScope(row)) return 0;
    var fromReturn = row.returned ? row.returnPayPrice : 0;
    var fromFail = row.payStatus === "发放失败" ? row.payPrice : 0;
    if (fromReturn && fromFail) return fromReturn;
    return fromReturn || fromFail;
  }

  function explain(row) {
    if (row.billType === "汇总薪酬") return "汇总薪酬，不计入台账";
    if (row.issueStatus !== "参与结算") return "不参与结算，不计入台账";
    if (!COUNT_TYPE[row.billType]) return "不计入台账";
    if (!PAYABLE[row.payStatus]) return "状态为" + row.payStatus + "，不计入应发放";
    var parts = ["计入应发放"];
    if (row.freeze) parts.push("已冻结，仍按状态计入");
    if (actual(row)) parts.push("计入实际发放");
    var back = returnAmount(row);
    if (back) {
      if (row.returned && row.payStatus === "发放失败") parts.push("退回记录与发放失败为同一张账单，退回只计一次");
      else if (row.returned) parts.push("退回记录计入退回");
      else parts.push("发放失败计入退回");
    }
    return parts.join("；");
  }

  function round2(n) {
    return Math.round(n * 100) / 100;
  }

  function money(n) {
    var v = round2(Number(n) || 0);
    var parts = v.toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "￥" + parts.join(".");
  }

  function sum(list, pick) {
    return round2(list.reduce(function (acc, row) { return acc + pick(row); }, 0));
  }

  function aggregate(year, season, base, week) {
    var map = {};
    var order = [];
    BILLS.forEach(function (row) {
      if (row.year !== year || row.season !== season) return;
      if (base && row.base !== base) return;
      if (week && row.week !== week) return;
      var key = row.base + "\0" + row.employ;
      if (!map[key]) {
        map[key] = {
          base: row.base,
          season: row.season,
          employ: row.employ,
          num: 0,
          payable: 0,
          tax: 0,
          actualTax: 0,
          actual: 0,
          returned: 0
        };
        order.push(key);
      }
      var g = map[key];
      if (payable(row)) {
        /* 基地人数与应发放同口径：参与结算、生效状态、基本薪酬与绩效薪酬各一条算一人次 */
        g.num += 1;
        g.payable = round2(g.payable + row.payPrice);
        g.tax = round2(g.tax + row.tax);
      }
      if (actual(row)) {
        g.actual = round2(g.actual + row.actualPayPrice);
        g.actualTax = round2(g.actualTax + row.actualTax);
      }
      g.returned = round2(g.returned + returnAmount(row));
    });
    order.sort(function (a, b) {
      var ga = map[a];
      var gb = map[b];
      if (ga.base !== gb.base) return ga.base < gb.base ? -1 : 1;
      if (ga.employ === gb.employ) return 0;
      return ga.employ === "全职" ? -1 : 1;
    });
    return order.map(function (key) { return map[key]; });
  }

  function billsOf(year, season, base, employ, week) {
    return BILLS.filter(function (row) {
      return row.year === year && row.season === season && (!base || row.base === base) && (!employ || row.employ === employ) && (!week || row.week === week);
    });
  }

  function choices(year, season, base, key) {
    var set = {};
    BILLS.forEach(function (row) {
      if (row.year !== year || row.season !== season) return;
      if (base && key === "week" && row.base !== base) return;
      set[row[key]] = 1;
    });
    return Object.keys(set).sort();
  }

  var COLS = [
    ["年度", "台账", "计划开始年", "year"],
    ["计划类型", "计划", "计划上的寒假或暑假", "season"],
    ["基地", "计划", "开营营地", "base"],
    ["计划", "薪酬账单", "所属计划", "plan"],
    ["周营", "薪酬账单", "所属周营", "week"],
    ["账单ID", "薪酬核算详情", "code", "code"],
    ["姓名", "薪酬核算详情", "name", "name"],
    ["会员ID", "薪酬核算详情", "serialNo", "memberId"],
    ["类型", "薪酬核算详情", "全职员工或非全职员工", "employ"],
    ["是否参与结算", "薪酬核算详情", "issueStatus", "issueStatus"],
    ["担任岗位", "薪酬核算详情", "campPositionName", "post"],
    ["所属团队", "薪酬账单", "campTeamName", "team"],
    ["绩效总分", "薪酬核算详情", "performanceScore", "score"],
    ["过往评级", "薪酬核算详情", "oldPositionSalaryLevel", "pastLevel"],
    ["当周评级", "薪酬核算详情", "campPositionSalaryLevel", "curLevel"],
    ["往期评级薪酬标准(元/天)", "薪酬核算详情", "oldSalary", "pastPay"],
    ["当周评级薪酬标准(元/天)", "薪酬核算详情", "salary", "curPay"],
    ["出勤天数", "薪酬核算详情", "actualAttendanceDay", "days"],
    ["往期评级基本工资", "薪酬核算详情", "oldBaseSalary", "pastBase"],
    ["当周评级基本工资", "薪酬核算详情", "baseSalary", "curBase"],
    ["往期当周评级差异", "薪酬核算详情", "接口字段 difference，原值导出，本页不计算", "diff"],
    ["绩效奖金", "薪酬核算详情", "performanceSalary", "bonus"],
    ["导师学费", "薪酬核算详情", "teacherLearnSalary", "tuition"],
    ["其他工资项", "薪酬核算详情", "增加为加、减少为减", "other"],
    ["本周营待付", "薪酬核算详情", "totalSalary", "weekDue"],
    ["本周营已付", "薪酬核算详情", "oldPayPrice", "weekPaid"],
    ["发放比例", "薪酬核算详情", "页面按百分比，库存是小数", "ratio"],
    ["应发金额", "薪酬核算详情", "payPrice。第33条的发放金额用这一列", "payPrice"],
    ["个税", "薪酬核算详情", "tax，服务端计算", "tax"],
    ["实发金额", "薪酬核算详情", "waitPayPrice，核算详情上的实发", "waitPayPrice"],
    ["是否修改", "薪酬核算详情", "isModify", "changed"],
    ["级别状态", "薪酬核算详情", "未调整、已调整、继承评级", "levelStatus"],
    ["账单状态", "薪酬核算详情", "payStatus", "payStatus"],
    ["是否冻结", "薪酬核算详情", "freezeStatus。冻结不单独扣台账金额", "freeze"],
    ["更新时间", "薪酬核算详情", "modifyTime", "updated"],
    ["居住地类型", "薪酬账单", "dwellType", "live"],
    ["核算批次", "薪酬账单", "batchName", "batch"],
    ["账单类型", "薪酬账单", "基本薪酬、绩效薪酬、汇总薪酬", "billType"],
    ["发放批次", "薪酬账单", "issueBatchName", "issueBatch"],
    ["发放说明", "薪酬账单", "issueRemark", "issueRemark"],
    ["推送状态", "薪酬账单", "appPushStatus", "push"],
    ["预期个税", "薪酬账单", "tax，与核算详情的个税同一字段", "tax"],
    ["预期实发金额", "薪酬账单", "waitPayPrice，与核算详情的实发金额同一字段", "waitPayPrice"],
    ["实际个税", "薪酬账单", "actualTax", "actualTax"],
    ["实际实发金额", "薪酬账单", "actualPayPrice", "actualPayPrice"],
    ["手机号码", "薪酬发放详情", "mobile。第33条点名", "phone"],
    ["身份证号", "薪酬发放详情", "certificateNo。第33条点名", "idNo"],
    ["账户类型", "薪酬发放详情", "个人或公司", "acctType"],
    ["用户姓名", "薪酬发放详情", "账户户名", "acctName"],
    ["公司名称", "薪酬发放详情", "挂靠公司时填写", "company"],
    ["信用代码", "薪酬发放详情", "挂靠公司时填写", "credit"],
    ["开户银行名称", "薪酬发放详情", "bankName", "bank"],
    ["开户行支行", "薪酬发放详情", "cardBankName", "branch"],
    ["开户行所在城市", "薪酬发放详情", "bankAddress", "city"],
    ["个人帐户联行号", "薪酬发放详情", "个人账户使用", "personalLine"],
    ["公司帐户联行号", "薪酬发放详情", "公司账户使用", "companyLine"],
    ["卡号", "薪酬发放详情", "cardNo", "card"],
    ["扣除小计", "薪酬发放详情", "takeOutSalary", "deduct"],
    ["发放时间", "薪酬发放详情", "issueTime", "payTime"],
    ["发放备注", "薪酬发放详情", "remark", "payNote"],
    ["关联薪酬账单", "薪酬发放详情", "本张账单ID", "code"],
    ["退回", "台账", "退回记录的应发；发放失败再加应发；同一张账单只计一次", "back"],
    ["台账计入", "台账", "这张账单进了应发放、实际发放、退回，或为什么不进", "explain"]
  ];

  function years() {
    var set = {};
    BILLS.forEach(function (row) { set[row.year] = 1; });
    return Object.keys(set).map(Number).sort();
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function query() {
    var q = new URLSearchParams(location.search);
    var year = Number(q.get("year")) || 2026;
    var season = q.get("season") === "寒假" ? "寒假" : "暑假";
    if (years().indexOf(year) < 0) year = 2026;
    var base = q.get("base") || "";
    var week = q.get("week") || "";
    if (base && choices(year, season, "", "base").indexOf(base) < 0) base = "";
    if (week && choices(year, season, base, "week").indexOf(week) < 0) week = "";
    return {
      year: year,
      season: season,
      base: base,
      week: week,
      employ: q.get("employ") || ""
    };
  }

  function href(page, extra) {
    var params = new URLSearchParams();
    params.set("p", page);
    Object.keys(extra || {}).forEach(function (key) {
      if (extra[key] !== "" && extra[key] != null) params.set(key, extra[key]);
    });
    return "replica.html?" + params.toString();
  }

  function xml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function sheetXml(name, rows) {
    var body = rows.map(function (line) {
      return "<Row>" + line.map(function (cell) {
        return '<Cell><Data ss:Type="String">' + xml(cell) + "</Data></Cell>";
      }).join("") + "</Row>";
    }).join("");
    return '<Worksheet ss:Name="' + xml(name) + '"><Table>' + body + "</Table></Worksheet>";
  }

  function downloadXls(name, sheets) {
    var xmlBook = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<?mso-application progid="Excel.Sheet"?>' +
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
      sheets.map(function (item) { return sheetXml(item[0], item[1]); }).join("") +
      "</Workbook>";
    var blob = new Blob([xmlBook], { type: "application/vnd.ms-excel" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
  }

  function moneyCell(row, key) {
    if (key === "freeze") return row.freeze ? "是" : "否";
    if (key === "back") return returnAmount(row).toFixed(2);
    if (key === "explain") return explain(row);
    if (key === "payPrice" || key === "tax" || key === "waitPayPrice" || key === "actualTax" || key === "actualPayPrice") {
      return round2(row[key]).toFixed(2);
    }
    return row[key] == null ? "" : row[key];
  }

  function detailLines(q) {
    return billsOf(q.year, q.season, q.base, q.employ, q.week).map(function (row) {
      return COLS.map(function (col) { return moneyCell(row, col[3]); });
    });
  }

  function guideRows() {
    return [["列名", "来源页面", "说明"]].concat(COLS.map(function (col) {
      return [col[0], col[1], col[2]];
    }));
  }

  function exportSummary(year, season, base, week) {
    var rows = [["年度", "计划类型", "基地", "用工类型", "应发放", "预期个税", "实际个税", "实际发放", "退回"]];
    aggregate(year, season, base, week).forEach(function (g) {
      rows.push([year, season, g.base, g.employ, g.payable.toFixed(2), g.tax.toFixed(2), g.actualTax.toFixed(2), g.actual.toFixed(2), g.returned.toFixed(2)]);
    });
    downloadXls(year + season + (base || "") + (week || "") + "基地台账汇总.xls", [["汇总", rows], ["字段说明", [["列名", "来源页面", "说明"], ["应发放", "台账", "基本薪酬与绩效薪酬里，待发放、发放中、已发放、已完成、发放失败且参与结算的 payPrice"], ["实际发放", "台账", "已发放和已完成的 actualPayPrice"], ["退回", "台账", "退回记录的应发，加上发放失败的应发，同一张账单只计一次"]]]]);
  }

  function exportCalc(q, title) {
    var lines = detailLines(q);
    if (!lines.length) {
      if (window.LB && window.LB.toast) window.LB.toast("当前筛选没有可导出的账单");
      return 0;
    }
    var rows = [COLS.map(function (col) { return col[0]; })].concat(lines);
    var name = q.year + q.season + (q.base || "全部基地") + (q.week || "全部周营") + (q.employ || "全部用工") + title + ".xls";
    downloadXls(name, [[title, rows], ["字段说明", guideRows()]]);
    return lines.length;
  }

  function exportTemplate() {
    downloadXls("全职薪酬核算导出模板.xls", [
      ["全职核算", [COLS.map(function (col) { return col[0]; })]],
      ["字段说明", guideRows()]
    ]);
  }

  function selectYear(year) {
    return years().map(function (item) {
      return '<option value="' + item + '"' + (item === year ? " selected" : "") + ">" + item + "</option>";
    }).join("");
  }

  function selectSeason(season) {
    return ["寒假", "暑假"].map(function (item) {
      return '<option value="' + item + '"' + (item === season ? " selected" : "") + ">" + item + "</option>";
    }).join("");
  }

  function selectOptions(list, current, allLabel) {
    var html = '<option value="">' + allLabel + "</option>";
    list.forEach(function (item) {
      html += '<option value="' + esc(item) + '"' + (item === current ? " selected" : "") + ">" + esc(item) + "</option>";
    });
    return html;
  }

  function totalOf(groups) {
    return groups.reduce(function (acc, g) {
      acc.payable = round2(acc.payable + g.payable);
      acc.tax = round2(acc.tax + g.tax);
      acc.actualTax = round2(acc.actualTax + g.actualTax);
      acc.actual = round2(acc.actual + g.actual);
      acc.returned = round2(acc.returned + g.returned);
      return acc;
    }, { payable: 0, tax: 0, actualTax: 0, actual: 0, returned: 0 });
  }

  /* ===== 原型评审第二轮第24条 =====
     台账汇总按计划看，展开后看一办三团。
     - 团队口径：与薪酬核算一致，取薪酬核算批次上的 campTeamId / campTeamName（camp/team/list）。
       演示里按人固定一份团队映射，真实环境读账单上的 campTeamName。
     - 师生比按「师：生」写，形如 1：2。师 = 该基地工作人员数（本次参与结算的账单人数），
       生 = 该基地报读的学员数。算出来不是整数时保留 1 位小数，如 1：10.7。
     - 明细跳「薪酬账单」，带上计划 / 周营 / 团队三个筛选。 */
  var TEAM_OF = {
    LXW8821: "助教团", CQH7601: "导师团", WM8EELU: "助教团", S6MULM1: "助教团",
    LY20414: "后勤团", V1MHF63: "助教团", "3N2006": "助教团", ZH4800: "统筹办",
    GF32KT7: "助教团", GDZE232: "导师团", HJ2988: "项目组", LW6610: "导师团",
    ZN7712: "助教团", QJ4408: "后勤团"
  };
  var TEAMS = ["统筹办", "导师团", "助教团", "后勤团", "项目组"];
  /* 演示用报读学员数（真实环境取该基地营期报读人数）。
     数量级与演示账单人数对齐，比值才可读；公式不因此改变。 */
  var BASE_STUDENTS = { "广东基地A": 24, "华东基地": 12, "广东基地B": 4 };

  /* 展开状态 / 刷新时间 / 自动刷新开关 */
  var openBases = {};
  var lastRefresh = nowText();
  var autoRefresh = false;
  var autoTimer = null;

  function nowText() {
    var d = new Date();
    var p = function (n) { return ("0" + n).slice(-2); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  }

  /* 师生比：师 = 工作人员数，生 = 报读学员数。
     统一写成「1：N」，N = 生 ÷ 师，整数不带小数点，非整数保留 1 位。 */
  function ratioText(staff, students) {
    if (!staff || !students) return "-";
    var n = students / staff;
    var text = Math.abs(n - Math.round(n)) < 0.05 ? String(Math.round(n)) : n.toFixed(1);
    return "1：" + text;
  }

  function teamOf(row) {
    return row.team || TEAM_OF[row.memberId] || "未分组";
  }

  function sumRow(rows) {
    var out = { num: 0, payable: 0, actual: 0, tax: 0, actualTax: 0, returned: 0 };
    rows.forEach(function (r) {
      if (PAYABLE[r.payStatus] && r.issueStatus === "参与结算" && COUNT_TYPE[r.billType]) {
        out.num += 1;
        out.payable += r.payPrice;
        out.tax += r.tax;
      }
      if (ACTUAL[r.payStatus]) {
        out.actual += r.actualPayPrice;
        out.actualTax += r.actualTax;
      }
      out.returned += returnAmount(r);
    });
    return out;
  }

  function renderSummary(root) {
    var q = query();
    var groups = aggregate(q.year, q.season, q.base, q.week);
    var total = totalOf(groups);
    var body = groups.map(function (g, gi) {
      var baseBills = billsOf(q.year, q.season, g.base, g.employ, q.week);
      var stu = BASE_STUDENTS[g.base] || 0;
      var ratio = ratioText(g.num, stu);
      var open = openBases[g.base + "|" + g.employ] ? " is-open" : "";
      var link = href("salary-ledger-bills", { year: q.year, season: q.season, base: g.base, employ: g.employ, week: q.week });
      var row = '<tr class="lb-ledger-base' + open + '" data-ledger="toggle" data-key="' + esc(g.base + "|" + g.employ) + '">';
      row += '<td><button type="button" class="lb-ledger-caret">' + (open ? "▾" : "▸") + "</button>" + esc(g.base) + "</td>";
      row += "<td>" + esc(g.season) + "</td><td>" + esc(g.employ) + "</td>";
      row += '<td class="lb-ledger-money">' + g.num + "</td>";
      row += '<td class="lb-ledger-money">' + ratio + "</td>";
      row += '<td class="lb-ledger-money">' + money(g.payable) + "</td>";
      row += '<td class="lb-ledger-money">' + money(g.actual) + "</td>";
      row += '<td class="lb-ledger-money">' + money(g.tax) + "</td>";
      row += '<td class="lb-ledger-money">' + money(g.actualTax) + "</td>";
      row += '<td class="lb-ledger-money">' + money(g.returned) + "</td>";
      row += '<td><a class="lb-link" href="' + link + '">查看账单</a></td></tr>';

      /* 展开：一办三团的分布。每个团队一行，可再按周营看。 */
      if (openBases[g.base + "|" + g.employ]) {
        row += '<tr class="lb-ledger-expand"><td colspan="11"><div class="lb-teamgrid">';
        TEAMS.forEach(function (tm) {
          var teamBills = baseBills.filter(function (b) { return teamOf(b) === tm; });
          if (!teamBills.length) return;
          var st = sumRow(teamBills);
          var weeks = [];
          teamBills.forEach(function (b) {
            if (weeks.indexOf(b.week) < 0) weeks.push(b.week);
          });
          var billHref = href("salary-bill", { plan: g.base, week: q.week || "", team: tm });
          row += '<div class="lb-teamcard">';
          row += '<div class="lb-teamcard__hd"><b>' + esc(tm) + "</b><em>" + st.num + " 人</em></div>";
          row += '<div class="lb-teamcard__kv"><span>应发</span><b>' + money(st.payable) + "</b></div>";
          row += '<div class="lb-teamcard__kv"><span>实发</span><b>' + money(st.actual) + "</b></div>";
          row += '<div class="lb-teamcard__kv"><span>预计个税</span><b>' + money(st.tax) + "</b></div>";
          row += '<div class="lb-teamcard__kv"><span>实扣个税</span><b>' + money(st.actualTax) + "</b></div>";
          row += '<div class="lb-teamcard__kv"><span>周营</span><b>' + esc(weeks.join("、")) + "</b></div>";
          row += '<a class="lb-link lb-teamcard__link" href="' + billHref + '">看该团队账单</a>';
          row += "</div>";
        });
        /* 七周汇总一行 */
        row += "</div>";
        var weekAgg = [];
        baseBills.forEach(function (b) {
          if (weekAgg.indexOf(b.week) < 0) weekAgg.push(b.week);
        });
        if (weekAgg.length > 1) {
          row += '<div class="lb-teamsum"><b>按周营汇总</b>';
          weekAgg.forEach(function (w) {
            var st = sumRow(baseBills.filter(function (b) { return b.week === w; }));
            row += '<span class="lb-teamsum__item"><i>' + esc(w) + "</i>应发 " + money(st.payable) + " · 实发 " + money(st.actual) + "</span>";
          });
          row += "</div>";
        }
        row += "</td></tr>";
      }
      return row;
    }).join("");
    if (!body) body = '<tr><td colspan="11">这个筛选下没有基地账单</td></tr>';
    else {
      body += '<tr class="lb-ledger-total"><td colspan="5">合计</td><td class="lb-ledger-money">' + money(total.payable) +
        '</td><td class="lb-ledger-money">' + money(total.actual) +
        '</td><td class="lb-ledger-money">' + money(total.tax) +
        '</td><td class="lb-ledger-money">' + money(total.actualTax) +
        '</td><td class="lb-ledger-money">' + money(total.returned) + "</td><td></td></tr>";
    }
    var scope = q.year + "年" + q.season + (q.base ? " · " + q.base : " · 全部基地") + (q.week ? " · " + q.week : " · 全部周营");
    root.innerHTML =
      '<div class="lb-page lb-ledger">' +
      '<div class="lb-toolbar" id="lb-filters">' +
      '<div class="lb-field"><label>年度</label><select class="lb-select" data-ledger="year">' + selectYear(q.year) + "</select></div>" +
      '<div class="lb-field"><label>计划类型<button type="button" class="lb-num-btn" data-note-key="ledger"></button></label><select class="lb-select" data-ledger="season">' + selectSeason(q.season) + "</select></div>" +
      '<div class="lb-field"><label>基地</label><select class="lb-select" data-ledger="base">' + selectOptions(choices(q.year, q.season, "", "base"), q.base, "全部基地") + "</select></div>" +
      '<div class="lb-field"><label>周营</label><select class="lb-select" data-ledger="week">' + selectOptions(choices(q.year, q.season, q.base, "week"), q.week, "全部周营") + "</select></div>" +
      "</div>" +
      '<p class="lb-hint">' + esc(scope) + "。计划类型取计划上的寒暑字段。基地是开营营地。金额取生效薪酬账单上已经算好的应发、个税和实发。点基地行展开看一办三团，展开后再按周营汇总。师生比按「师：生」写，例如 1：2——师是该基地工作人员，生是该基地报读的学员。</p>" +
      '<div class="lb-actions">' +
      '<button type="button" class="lb-btn" data-ledger="export-sum">导出汇总</button>' +
      '<button type="button" class="lb-btn" data-ledger="export-detail">导出明细</button>' +
      '<span class="lb-act"><button type="button" class="lb-btn lb-btn--primary" data-ledger="export-full">导出全职核算</button><button type="button" class="lb-num-btn" data-note-key="fullExport"></button></span>' +
      '<button type="button" class="lb-btn" data-ledger="export-template">下载模板</button>' +
      '<span class="lb-act lb-ledger-refresh"><em id="lb-ledger-at">' + esc(lastRefresh) + "</em>" +
      '<button type="button" class="lb-btn" data-ledger="refresh">刷新</button>' +
      '<button type="button" class="lb-btn' + (autoRefresh ? " lb-btn--primary" : "") + '" data-ledger="auto">' + (autoRefresh ? "自动刷新中（5 分钟）" : "开启每 5 分钟自动刷新") + "</button></span>" +
      "</div>" +
      '<div class="lb-table-wrap"><table class="lb-table"><thead><tr>' +
      "<th>基地</th><th>计划类型</th><th>用工类型</th><th>基地人数</th><th>师生比</th><th>应发</th><th>实发</th><th>预计个税</th><th>实扣个税</th><th>退回</th><th>来源账单</th>" +
      "</tr></thead><tbody>" + body + "</tbody></table></div></div>";
  }

  function renderBills(root) {
    var q = query();
    var list = billsOf(q.year, q.season, q.base, q.employ, q.week);
    var body = list.map(function (row) {
      var note = explain(row);
      var skip = note.indexOf("不计入") >= 0;
      return '<tr class="' + (skip ? "lb-ledger-skip" : "") + '"><td>' + esc(row.code) + "</td><td>" + esc(row.name) +
        "</td><td>" + esc(row.memberId) + "</td><td>" + esc(row.phone) + "</td><td>" + esc(row.idNo) +
        "</td><td>" + esc(row.plan) + " / " + esc(row.week) + "</td><td>" + esc(row.billType) +
        "</td><td>" + esc(row.payStatus) + "</td><td>" + esc(row.issueStatus) + "</td><td>" + (row.freeze ? "是" : "否") +
        '</td><td class="lb-ledger-money">' + money(row.payPrice) + '</td><td class="lb-ledger-money">' + money(row.tax) +
        '</td><td class="lb-ledger-money">' + money(row.waitPayPrice) + '</td><td class="lb-ledger-money">' + money(row.actualTax) +
        '</td><td class="lb-ledger-money">' + money(row.actualPayPrice) + '</td><td class="lb-ledger-money">' + money(returnAmount(row)) +
        "</td><td>" + esc(note) + "</td></tr>";
    }).join("");
    if (!body) body = '<tr><td colspan="17">没有账单</td></tr>';
    root.innerHTML =
      '<div class="lb-page lb-ledger">' +
      '<div class="lb-toolbar">' +
      '<a class="lb-btn" href="' + href("salary-ledger", { year: q.year, season: q.season, base: q.base, week: q.week }) + '">返回台账</a>' +
      '<span class="lb-hint">' + esc(q.year + "年" + q.season + " · " + q.base + " · " + q.employ + (q.week ? " · " + q.week : "")) + "</span>" +
      '<button type="button" class="lb-num-btn" data-note-key="ledger"></button>' +
      '<button type="button" class="lb-btn" data-ledger="export-detail">导出明细</button>' +
      (q.employ === "全职" ? '<button type="button" class="lb-btn lb-btn--primary" data-ledger="export-full">导出全职核算</button><button type="button" class="lb-num-btn" data-note-key="fullExport"></button>' : "") +
      "</div>" +
      '<div class="lb-table-wrap"><table class="lb-table"><thead><tr>' +
      "<th>账单ID</th><th>姓名</th><th>会员ID</th><th>手机号码</th><th>身份证号</th><th>计划/周营</th><th>账单类型</th><th>状态</th><th>是否参与结算</th><th>是否冻结</th>" +
      "<th>应发金额</th><th>预期个税</th><th>预期实发</th><th>实际个税</th><th>实际实发</th><th>退回</th><th>台账计入</th>" +
      "</tr></thead><tbody>" + body + "</tbody></table></div></div>";
  }

  function mount(root, pageId) {
    if (!root) return;
    if (pageId === "salary-ledger-bills") renderBills(root);
    else renderSummary(root);
  }

  function onClick(event) {
    var target = event.target && event.target.closest ? event.target.closest("[data-ledger]") : null;
    if (!target) return;
    var pageId = new URLSearchParams(location.search).get("p");
    if (pageId !== "salary-ledger" && pageId !== "salary-ledger-bills") return;
    event.preventDefault();
    event.stopPropagation();
    var q = query();
    var act = target.getAttribute("data-ledger");
    if (act === "export-sum") {
      exportSummary(q.year, q.season, q.base, q.week);
      return;
    }
    if (act === "export-detail") {
      exportCalc(q, "核算明细");
      return;
    }
    if (act === "export-full") {
      exportCalc({ year: q.year, season: q.season, base: q.base, week: q.week, employ: "全职" }, "全职核算");
      return;
    }
    if (act === "export-template") { exportTemplate(); return; }
    if (act === "toggle") {
      var key = target.getAttribute("data-key");
      openBases[key] = !openBases[key];
      renderSummary(document.getElementById("lb-replica"));
      return;
    }
    if (act === "refresh") {
      lastRefresh = nowText();
      renderSummary(document.getElementById("lb-replica"));
      window.LB.toast("已刷新 · " + lastRefresh);
      return;
    }
    if (act === "auto") {
      autoRefresh = !autoRefresh;
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      if (autoRefresh) {
        autoTimer = setInterval(function () {
          lastRefresh = nowText();
          if (new URLSearchParams(location.search).get("p") === "salary-ledger") {
            renderSummary(document.getElementById("lb-replica"));
          }
        }, 5 * 60 * 1000);
        window.LB.toast("已开启每 5 分钟自动刷新");
      } else {
        window.LB.toast("已关闭自动刷新");
      }
      renderSummary(document.getElementById("lb-replica"));
      return;
    }
  }

  function onChange(event) {
    var target = event.target;
    if (!target || !target.getAttribute) return;
    var kind = target.getAttribute("data-ledger");
    if (kind !== "year" && kind !== "season" && kind !== "base" && kind !== "week") return;
    var q = query();
    if (kind === "year") {
      q.year = Number(target.value);
      q.base = "";
      q.week = "";
    }
    if (kind === "season") {
      q.season = target.value;
      q.base = "";
      q.week = "";
    }
    if (kind === "base") {
      q.base = target.value;
      if (q.week && choices(q.year, q.season, q.base, "week").indexOf(q.week) < 0) q.week = "";
    }
    if (kind === "week") q.week = target.value;
    location.href = href("salary-ledger", { year: q.year, season: q.season, base: q.base, week: q.week });
  }

  if (typeof document !== "undefined") {
    document.addEventListener("click", onClick, true);
    document.addEventListener("change", onChange, true);
  }

  var api = {
    bills: BILLS,
    aggregate: aggregate,
    explain: explain,
    returnAmount: returnAmount,
    payable: payable,
    actual: actual,
    mount: mount,
    exportSummary: exportSummary,
    exportDetail: exportCalc,
    exportCalc: exportCalc,
    detailLines: detailLines,
    columns: COLS
  };

  if (typeof window !== "undefined") window.LB_LEDGER = api;

  function assertClose(name, got, expect) {
    if (round2(got) !== expect) throw new Error(name + " " + got + " != " + expect);
  }

  if (typeof window === "undefined") {
    var groups = aggregate(2026, "暑假");
    var by = {};
    groups.forEach(function (g) { by[g.base + g.employ] = g; });
    assertClose("广东全职应发", by["广东基地A全职"].payable, 13000);
    assertClose("广东全职个税", by["广东基地A全职"].tax, 1100);
    assertClose("广东全职实税", by["广东基地A全职"].actualTax, 1080);
    assertClose("广东全职实发", by["广东基地A全职"].actual, 11920);
    assertClose("广东非全职应发", by["广东基地A非全职"].payable, 4300);
    assertClose("广东非全职退回", by["广东基地A非全职"].returned, 500);
    assertClose("华东全职应发", by["华东基地全职"].payable, 6000);
    assertClose("华东非全职退回", by["华东基地非全职"].returned, 3000);
    assertClose("华东非全职实发", by["华东基地非全职"].actual, 0);
    var winter = aggregate(2026, "寒假");
    assertClose("寒假应发", winter[0].payable, 4800);
    var both = BILLS.filter(function (row) { return row.code === "ZD2607-014"; })[0];
    assertClose("失败且退回只计一次", returnAmount(both), 1500);
    if (explain(BILLS[2]).indexOf("汇总薪酬") < 0) throw new Error("summary");
    var weekGroups = aggregate(2026, "暑假", "广东基地A", "第一周");
    var weekBy = {};
    weekGroups.forEach(function (g) { weekBy[g.employ] = g; });
    assertClose("第一周全职应发", weekBy["全职"].payable, 10000);
    assertClose("第一周非全职应发", weekBy["非全职"].payable, 3000);
    var full = detailLines({ year: 2026, season: "暑假", base: "广东基地A", week: "第一周", employ: "全职" });
    if (full.length !== 2) throw new Error("fulltime rows " + full.length);
    if (COLS.length < 60) throw new Error("cols " + COLS.length);
    var joined = full.map(function (line) { return line.join("|"); }).join("\n");
    if (joined.indexOf("13800001101") < 0 || joined.indexOf("440106199801011226") < 0) throw new Error("identity");
    if (joined.indexOf("往期当周评级差异") >= 0) throw new Error("header leaked");
    if (full[0].length !== COLS.length) throw new Error("width");
    console.log("ledger ok");
  }
})();
