/**
 * v3.4.0 复刻目录：筛选 / 工具栏 / 列 / 行按钮。
 * 按现网列表页抽出，不含功能清单。
 */
window.LB_PAGES = {
  "excellent-honor": {
    "title": "优秀助教/团长管理",
    "filters": [
      { "k": "name", "l": "姓名" },
      { "k": "plan", "l": "计划" },
      { "k": "week", "l": "周营" },
      {
        "k": "type",
        "l": "申请类型",
        "t": "select",
        "o": ["优秀助教", "优秀团长"]
      },
      {
        "k": "scoreBand",
        "l": "综合分",
        "t": "select",
        "o": ["综合分达标", "综合分未达标"]
      }
    ],
    "columns": [
      { "k": "name", "l": "姓名", "t": "link" },
      { "k": "plan", "l": "计划" },
      { "k": "week", "l": "周营" },
      { "k": "type", "l": "申请类型" },
      { "k": "post", "l": "岗位" },
      { "k": "score", "l": "综合分" },
      { "k": "scoreBand", "l": "综合分状态", "t": "tag" },
      { "k": "taskStatus", "l": "任务状态", "t": "tag" }
    ],
    "ops": [
      { "id": "pass", "l": "通过" },
      { "id": "veto", "l": "否决", "danger": 1 }
    ]
  },
  "talent-pool": {
    "title": "人才库",
    "left": "jobs",
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型",
        "t": "select",
        "o": [
          "全职",
          "非全职"
        ]
      },
      {
        "k": "phone",
        "l": "联系电话"
      },
      {
        "k": "gender",
        "l": "性别",
        "t": "select",
        "o": [
          "男",
          "女"
        ]
      },
      {
        "k": "age",
        "l": "年龄",
        "t": "numberRange"
      },
      {
        "k": "city",
        "l": "地区"
      },
      {
        "k": "shade",
        "l": "黑白灰",
        "t": "select",
        "o": ["黑", "灰", "白"]
      },
      {
        "k": "post",
        "l": "最近岗位"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "启用",
          "禁用"
        ]
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增人员",
        "p": 1,
        "form": "staff"
      },
      {
        "id": "ie",
        "l": "导入"
      },
      {
        "id": "export",
        "l": "导出"
      },
      {
        "id": "importArchives",
        "l": "导入用户档案"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "phone",
        "l": "联系电话"
      },
      {
        "k": "gender",
        "l": "性别"
      },
      {
        "k": "age",
        "l": "年龄"
      },
      {
        "k": "settle",
        "l": "是否参与结算"
      },
      {
        "k": "bonus",
        "l": "是否结算绩效奖金"
      },
      {
        "k": "city",
        "l": "地区"
      },
      {
        "k": "post",
        "l": "最近担任岗位"
      },
      {
        "k": "shade",
        "l": "黑白灰"
      },
      {
        "k": "aideMark",
        "l": "优秀助教",
        "t": "tag"
      },
      {
        "k": "leaderMark",
        "l": "优秀团长",
        "t": "tag"
      },
      {
        "k": "times",
        "l": "累计参与"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "editInfo",
        "l": "编辑个人信息",
        "form": "staff"
      },
      {
        "id": "editPost",
        "l": "编辑岗位",
        "form": "postPick"
      },
      {
        "id": "lock",
        "l": "禁用",
        "danger": 1,
        "when": {
          "status": "启用"
        }
      },
      {
        "id": "unlock",
        "l": "启用",
        "when": {
          "status": "禁用"
        }
      }
    ]
  },
  "recruit-record": {
    "title": "人员招募记录",
    "left": "batch",
    "select": true,
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型",
        "t": "select",
        "o": [
          "全职",
          "非全职"
        ]
      },
      {
        "k": "phone",
        "l": "联系电话"
      },
      {
        "k": "gender",
        "l": "性别",
        "t": "select",
        "o": [
          "男",
          "女"
        ]
      },
      {
        "k": "age",
        "l": "年龄",
        "t": "numberRange"
      },
      {
        "k": "plan",
        "l": "计划名称"
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "ie",
        "l": "导入"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "phone",
        "l": "联系电话"
      },
      {
        "k": "gender",
        "l": "性别"
      },
      {
        "k": "age",
        "l": "年龄"
      },
      {
        "k": "batch",
        "l": "所属批次"
      },
      {
        "k": "post",
        "l": "担任岗位"
      },
      {
        "k": "level",
        "l": "薪酬等级"
      },
      {
        "k": "plan",
        "l": "参与计划"
      },
      {
        "k": "week",
        "l": "参与周营"
      },
      {
        "k": "klass",
        "l": "参与班级"
      },
      {
        "k": "group",
        "l": "参与小组"
      },
      {
        "k": "creator",
        "l": "创建人"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": []
  },
  "camp-staff": {
    "title": "领袖营人员管理",
    "left": "plan",
    "select": true,
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型",
        "t": "select",
        "o": [
          "全职",
          "非全职"
        ]
      },
      {
        "k": "phone",
        "l": "联系电话"
      },
      {
        "k": "gender",
        "l": "性别",
        "t": "select",
        "o": [
          "男",
          "女"
        ]
      },
      {
        "k": "age",
        "l": "年龄",
        "t": "numberRange"
      },
      {
        "k": "shade",
        "l": "黑白灰",
        "t": "select",
        "o": ["黑", "灰", "白"]
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增人员",
        "p": 1,
        "form": "staff"
      },
      {
        "id": "batchEdit",
        "l": "批量编辑",
        "menu": [
          "调整计划(营地)",
          "调整岗位",
          "调整周营",
          "调整班级",
          "调整小组"
        ]
      },
      {
        "id": "batchDel",
        "l": "批量删除",
        "danger": 1,
        "confirm": "确认批量删除所选人员？"
      },
      {
        "id": "updateAll",
        "l": "更新信息"
      },
      {
        "id": "ie",
        "l": "导入"
      },
      {
        "id": "export",
        "l": "导出"
      },
      {
        "id": "birthday",
        "l": "生日名单",
        "form": "birthday"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "shade",
        "l": "黑白灰"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "phone",
        "l": "联系电话"
      },
      {
        "k": "settle",
        "l": "是否参与结算"
      },
      {
        "k": "bonus",
        "l": "是否结算绩效奖金"
      },
      {
        "k": "gender",
        "l": "性别"
      },
      {
        "k": "age",
        "l": "年龄"
      },
      {
        "k": "post",
        "l": "担任岗位"
      },
      {
        "k": "level",
        "l": "薪酬等级"
      },
      {
        "k": "team",
        "l": "所属团队"
      },
      {
        "k": "week",
        "l": "所属周营"
      },
      {
        "k": "klass",
        "l": "班级"
      },
      {
        "k": "group",
        "l": "小组"
      },
      {
        "k": "approver",
        "l": "是否审批人"
      },
      {
        "k": "joinType",
        "l": "连营类型"
      },
      {
        "k": "posStatus",
        "l": "岗位状态"
      },
      {
        "k": "frozen",
        "l": "是否冻结"
      },
      {
        "k": "levelStatus",
        "l": "级别状态"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "updateInfo",
        "l": "更新信息"
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该人员？"
      }
    ]
  },
  "class-manage": {
    "title": "班级管理",
    "filters": [
      {
        "k": "klass",
        "l": "班级名称"
      },
      {
        "k": "classId",
        "l": "班级ID"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "待开营",
          "开营中",
          "已结营"
        ]
      },
      {
        "k": "camp",
        "l": "营地"
      },
      {
        "k": "week",
        "l": "周营"
      },
      {
        "k": "qcamp",
        "l": "Q营"
      },
      {
        "k": "open",
        "l": "开营情况",
        "t": "select",
        "o": [
          "未开营",
          "开营中",
          "已结营"
        ]
      },
      {
        "k": "mentorLead",
        "l": "导师团长"
      },
      {
        "k": "mentorLeadId",
        "l": "导师团长ID"
      },
      {
        "k": "mentorVice",
        "l": "导师副团长"
      },
      {
        "k": "mentorViceId",
        "l": "导师副团长ID"
      },
      {
        "k": "mentor",
        "l": "导师"
      },
      {
        "k": "mentorId",
        "l": "导师ID"
      },
      {
        "k": "intern",
        "l": "见习导师"
      },
      {
        "k": "internId",
        "l": "见习导师ID"
      },
      {
        "k": "ttable",
        "l": "班级课表"
      },
      {
        "k": "ttableStatus",
        "l": "课表情况",
        "t": "select",
        "o": [
          "已排课",
          "待排课"
        ]
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "creator",
        "l": "创建人"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增班级",
        "p": 1,
        "form": "class"
      },
      {
        "id": "sync",
        "l": "批量同步设施"
      },
      {
        "id": "disband",
        "l": "批量解散班级",
        "danger": 1,
        "confirm": "确认解散所选班级？"
      },
      {
        "id": "ie",
        "l": "导入导师"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "klass",
        "l": "班级名称",
        "t": "link"
      },
      {
        "k": "classId",
        "l": "班级ID"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "camp",
        "l": "营地"
      },
      {
        "k": "week",
        "l": "周营"
      },
      {
        "k": "qcamp",
        "l": "Q营"
      },
      {
        "k": "open",
        "l": "开营情况"
      },
      {
        "k": "mentorCount",
        "l": "导师人数"
      },
      {
        "k": "mentorLead",
        "l": "导师团长"
      },
      {
        "k": "mentorVice",
        "l": "导师副团长"
      },
      {
        "k": "mentor",
        "l": "导师"
      },
      {
        "k": "intern",
        "l": "见习导师"
      },
      {
        "k": "ttable",
        "l": "班级课表"
      },
      {
        "k": "ttableStatus",
        "l": "课表情况"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "creator",
        "l": "创建人"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "edit",
        "l": "编辑班级",
        "form": "class"
      },
      {
        "id": "syncOne",
        "l": "确认同步实施"
      },
      {
        "id": "disbandOne",
        "l": "解散班级",
        "danger": 1,
        "confirm": "确认解散该班级？"
      }
    ]
  },
  "week-schedule": {
    "title": "周营课表",
    "filters": [
      {
        "k": "week",
        "l": "周营"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "启用",
          "禁用"
        ]
      },
      {
        "k": "plan",
        "l": "所属计划"
      },
      {
        "k": "open",
        "l": "开营情况",
        "t": "select",
        "o": [
          "未开营",
          "开营中",
          "已结营"
        ]
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "week",
        "l": "周营",
        "t": "link"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "plan",
        "l": "营地/计划"
      },
      {
        "k": "open",
        "l": "开营情况"
      },
      {
        "k": "opened",
        "l": "开营班级"
      },
      {
        "k": "scheduled",
        "l": "已排课班级"
      },
      {
        "k": "pending",
        "l": "待排课班级"
      },
      {
        "k": "courses",
        "l": "排课课程"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "site",
        "l": "修改场地",
        "form": "site"
      }
    ]
  },
  "class-schedule": {
    "title": "班级课表",
    "filters": [
      {
        "k": "klass",
        "l": "班级"
      },
      {
        "k": "classId",
        "l": "班级ID"
      },
      {
        "k": "ttable",
        "l": "班级课表"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "启用",
          "禁用"
        ]
      },
      {
        "k": "plan",
        "l": "营地/计划"
      },
      {
        "k": "week",
        "l": "周营"
      },
      {
        "k": "qcamp",
        "l": "Q营班级"
      },
      {
        "k": "open",
        "l": "开营情况",
        "t": "select",
        "o": [
          "未开营",
          "开营中",
          "已结营"
        ]
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "export",
        "l": "导出"
      },
      {
        "id": "confirmCross",
        "l": "确认跨班导师"
      }
    ],
    "columns": [
      {
        "k": "klass",
        "l": "班级",
        "t": "link"
      },
      {
        "k": "classId",
        "l": "班级ID"
      },
      {
        "k": "ttable",
        "l": "班级课表"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "plan",
        "l": "营地/计划"
      },
      {
        "k": "week",
        "l": "周营"
      },
      {
        "k": "qcamp",
        "l": "Q营班级"
      },
      {
        "k": "open",
        "l": "开营情况"
      },
      {
        "k": "courses",
        "l": "排课课程"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "add",
        "l": "课表新增",
        "form": "ttable"
      },
      {
        "id": "edit",
        "l": "课表编辑",
        "form": "ttable"
      },
      {
        "id": "remove",
        "l": "课表删除",
        "danger": 1,
        "confirm": "确认删除该课表？"
      }
    ]
  },
  "cross-mentor": {
    "title": "跨班导师",
    "filters": [
      {
        "k": "name",
        "l": "跨班导师"
      },
      {
        "k": "id",
        "l": "ID"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "上架",
          "下架"
        ]
      },
      {
        "k": "phone",
        "l": "联系电话"
      },
      {
        "k": "gender",
        "l": "性别",
        "t": "select",
        "o": [
          "男",
          "女"
        ]
      },
      {
        "k": "course",
        "l": "可授课课程"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "creator",
        "l": "创建人"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增跨班导师",
        "p": 1,
        "form": "mentor"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "name",
        "l": "跨班导师",
        "t": "link"
      },
      {
        "k": "id",
        "l": "ID"
      },
      {
        "k": "phone",
        "l": "联系电话"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "gender",
        "l": "性别"
      },
      {
        "k": "course",
        "l": "可授课程"
      },
      {
        "k": "remark",
        "l": "备注"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "creator",
        "l": "创建人"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "edit",
        "l": "编辑",
        "form": "mentor"
      },
      {
        "id": "off",
        "l": "下架",
        "danger": 1,
        "when": {
          "status": "上架"
        }
      },
      {
        "id": "on",
        "l": "上架",
        "when": {
          "status": "下架"
        }
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该跨班导师？"
      }
    ]
  },
  "checkin-record": {
    "title": "签到记录",
    "left": "plan",
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "attDate",
        "l": "考勤日期",
        "t": "dateRange"
      },
      {
        "k": "signTime",
        "l": "签到时间",
        "t": "dateRange"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "未打卡",
          "异常",
          "正常"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "batchAdj",
        "l": "批量调整",
        "form": "adjust"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "post",
        "l": "担任岗位"
      },
      {
        "k": "team",
        "l": "所属团队"
      },
      {
        "k": "attDate",
        "l": "考勤日期"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "signTime",
        "l": "签到时间"
      },
      {
        "k": "leaveSign",
        "l": "离营签到时间"
      },
      {
        "k": "plan",
        "l": "所属计划/周营"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "adjusted",
        "l": "是否被调整"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "adjust",
        "l": "调整",
        "form": "adjust"
      },
      {
        "id": "adjLog",
        "l": "调整记录",
        "form": "log"
      }
    ]
  },
  "leave-exception": {
    "title": "请假及疑异处理",
    "left": "plan",
    "filters": [
      {
        "k": "name",
        "l": "申请人"
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "klass",
        "l": "班级"
      },
      {
        "k": "source",
        "l": "来源",
        "t": "select",
        "o": [
          "APP",
          "后台"
        ]
      },
      {
        "k": "kind",
        "l": "类型",
        "t": "select",
        "o": [
          "因私请假",
          "外出报备",
          "疑异处理",
          "提前入营/连营处理",
          "中途离营",
          "生病请假",
          "补卡申请"
        ]
      },
      {
        "k": "reason",
        "l": "原因"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "审批中",
          "已完成",
          "不通过",
          "已取消",
          "已同意",
          "请假中",
          "已作废"
        ]
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "添加处理单",
        "p": 1,
        "form": "dispose"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "starter",
        "l": "发起人"
      },
      {
        "k": "name",
        "l": "申请人/处理对象",
        "t": "link"
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "plan",
        "l": "所属计划/周营"
      },
      {
        "k": "klass",
        "l": "班级/小组"
      },
      {
        "k": "source",
        "l": "来源"
      },
      {
        "k": "kind",
        "l": "类型"
      },
      {
        "k": "reason",
        "l": "原因"
      },
      {
        "k": "period",
        "l": "时间"
      },
      {
        "k": "patchTime",
        "l": "补卡时间"
      },
      {
        "k": "applyDays",
        "l": "申请时长/天数"
      },
      {
        "k": "realDays",
        "l": "实际时长/天数"
      },
      {
        "k": "remark",
        "l": "说明"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "audit",
        "l": "审核",
        "form": "audit"
      },
      {
        "id": "verify",
        "l": "核销"
      },
      {
        "id": "void",
        "l": "作废",
        "danger": 1,
        "confirm": "确认作废该处理单？"
      }
    ]
  },
  "attendance-summary": {
    "title": "考勤汇总",
    "left": "plan",
    "select": true,
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型",
        "t": "select",
        "o": [
          "全职",
          "非全职"
        ]
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "attStatus",
        "l": "状态",
        "t": "select",
        "o": [
          "考勤中",
          "待确认",
          "已确认",
          "已同步"
        ]
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "confirmAtt",
        "l": "确认考勤",
        "p": 1,
        "confirm": "确认所选人员考勤？"
      },
      {
        "id": "export",
        "l": "导出"
      },
      {
        "id": "refresh",
        "l": "刷新考勤汇总",
        "p": 1
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "postTeam",
        "l": "担任岗位/团队"
      },
      {
        "k": "planWeek",
        "l": "所属计划/周营"
      },
      {
        "k": "classGroup",
        "l": "班级/小组"
      },
      {
        "k": "payDays",
        "l": "计薪天数"
      },
      {
        "k": "realDays",
        "l": "实际出勤天数"
      },
      {
        "k": "adj",
        "l": "调整天数"
      },
      {
        "k": "increase",
        "l": "提前入营/连营处理(天)"
      },
      {
        "k": "leave",
        "l": "因私请假(天)"
      },
      {
        "k": "sick",
        "l": "生病请假(天)"
      },
      {
        "k": "doubt",
        "l": "疑异处理(天)"
      },
      {
        "k": "posStatus",
        "l": "岗位状态"
      },
      {
        "k": "attStatus",
        "l": "考勤状态",
        "t": "tag"
      },
      {
        "k": "appr",
        "l": "审批状态"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "excused",
        "l": "因私请假",
        "form": "dispose",
        "when": {
          "attStatus": [
            "考勤中",
            "待确认"
          ]
        }
      },
      {
        "id": "fall",
        "l": "生病请假",
        "form": "dispose",
        "when": {
          "attStatus": [
            "考勤中",
            "待确认"
          ]
        }
      },
      {
        "id": "doubtOp",
        "l": "疑异处理",
        "form": "dispose",
        "when": {
          "attStatus": [
            "考勤中",
            "待确认"
          ]
        }
      },
      {
        "id": "leaveMid",
        "l": "中途离营",
        "danger": 1,
        "form": "dispose",
        "when": {
          "attStatus": [
            "考勤中",
            "待确认"
          ]
        }
      },
      {
        "id": "cancel",
        "l": "取消确认",
        "danger": 1,
        "confirm": "确认取消该人员考勤确认？"
      }
    ],
    "detail": "attendance"
  },
  "early-camp": {
    "title": "提前入营/连营管理",
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "type",
        "l": "工作人员类型",
        "t": "select",
        "o": [
          "全职",
          "非全职"
        ]
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "team",
        "l": "团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "klass",
        "l": "Q营班级"
      }
    ],
    "toolbar": [
      {
        "id": "toAtt",
        "l": "添加至考勤",
        "p": 1
      },
      {
        "id": "ie",
        "l": "导入"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "工作人员类型"
      },
      {
        "k": "post",
        "l": "担任岗位"
      },
      {
        "k": "team",
        "l": "所属团队"
      },
      {
        "k": "planWeek",
        "l": "所属计划/周营"
      },
      {
        "k": "klass",
        "l": "Q营班级"
      },
      {
        "k": "early",
        "l": "提前入营（天）"
      },
      {
        "k": "cont",
        "l": "连营（天）"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "edit",
        "l": "编辑",
        "form": "early"
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该记录？"
      }
    ]
  },
  "perf-pre": {
    "title": "营前绩效",
    "left": "plan",
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型",
        "t": "select",
        "o": [
          "全职",
          "非全职"
        ]
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "std",
        "l": "绩效标准"
      },
      {
        "k": "perfStatus",
        "l": "绩效状态",
        "t": "select",
        "o": [
          "收集中",
          "已确认",
          "已同步"
        ]
      },
      {
        "k": "appr",
        "l": "审批状态",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "ie",
        "l": "导入更新"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "postTeam",
        "l": "担任岗位/团队"
      },
      {
        "k": "planWeek",
        "l": "所属计划/周营"
      },
      {
        "k": "std",
        "l": "绩效标准"
      },
      {
        "k": "items",
        "l": "绩效指标"
      },
      {
        "k": "score",
        "l": "总分"
      },
      {
        "k": "perfStatus",
        "l": "绩效状态",
        "t": "tag"
      },
      {
        "k": "appr",
        "l": "审批状态"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "edit",
        "l": "编辑",
        "form": "perf"
      },
      {
        "id": "save",
        "l": "保存"
      },
      {
        "id": "cancelEdit",
        "l": "取消"
      },
      {
        "id": "log",
        "l": "调整记录",
        "form": "log"
      }
    ]
  },
  "perf-mid": {
    "title": "营中绩效",
    "left": "plan",
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型",
        "t": "select",
        "o": [
          "全职",
          "非全职"
        ]
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "std",
        "l": "绩效标准"
      },
      {
        "k": "perfStatus",
        "l": "绩效状态",
        "t": "select",
        "o": [
          "收集中",
          "已确认",
          "已同步"
        ]
      },
      {
        "k": "appr",
        "l": "审批状态",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "ie",
        "l": "导入更新"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "postTeam",
        "l": "担任岗位/团队"
      },
      {
        "k": "planWeek",
        "l": "所属计划/周营"
      },
      {
        "k": "std",
        "l": "绩效标准"
      },
      {
        "k": "items",
        "l": "绩效指标"
      },
      {
        "k": "score",
        "l": "总分"
      },
      {
        "k": "perfStatus",
        "l": "绩效状态",
        "t": "tag"
      },
      {
        "k": "appr",
        "l": "审批状态"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "edit",
        "l": "编辑",
        "form": "perf"
      },
      {
        "id": "save",
        "l": "保存"
      },
      {
        "id": "cancelEdit",
        "l": "取消"
      },
      {
        "id": "log",
        "l": "调整记录",
        "form": "log"
      }
    ]
  },
  "perf-post": {
    "title": "营后绩效",
    "left": "plan",
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型",
        "t": "select",
        "o": [
          "全职",
          "非全职"
        ]
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "std",
        "l": "绩效标准"
      },
      {
        "k": "perfStatus",
        "l": "绩效状态",
        "t": "select",
        "o": [
          "收集中",
          "已确认",
          "已同步"
        ]
      },
      {
        "k": "appr",
        "l": "审批状态",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "ie",
        "l": "导入更新"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "postTeam",
        "l": "担任岗位/团队"
      },
      {
        "k": "planWeek",
        "l": "所属计划/周营"
      },
      {
        "k": "std",
        "l": "绩效标准"
      },
      {
        "k": "items",
        "l": "绩效指标"
      },
      {
        "k": "score",
        "l": "总分"
      },
      {
        "k": "perfStatus",
        "l": "绩效状态",
        "t": "tag"
      },
      {
        "k": "appr",
        "l": "审批状态"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "edit",
        "l": "编辑",
        "form": "perf"
      },
      {
        "id": "save",
        "l": "保存"
      },
      {
        "id": "cancelEdit",
        "l": "取消"
      },
      {
        "id": "log",
        "l": "调整记录",
        "form": "log"
      }
    ]
  },
  "perf-assess": {
    "title": "绩效考核",
    "left": "plan",
    "select": true,
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型",
        "t": "select",
        "o": [
          "全职",
          "非全职"
        ]
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "std",
        "l": "绩效标准"
      },
      {
        "k": "perfStatus",
        "l": "绩效状态",
        "t": "select",
        "o": [
          "收集中",
          "已确认",
          "已同步",
          "已退回"
        ]
      },
      {
        "k": "appr",
        "l": "审批状态",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "confirm",
        "l": "确认绩效",
        "p": 1,
        "confirm": "确认所选人员绩效？"
      },
      {
        "id": "ie",
        "l": "导入更新"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "postTeam",
        "l": "担任岗位/团队"
      },
      {
        "k": "planWeek",
        "l": "所属计划/周营"
      },
      {
        "k": "std",
        "l": "绩效标准"
      },
      {
        "k": "items",
        "l": "绩效指标"
      },
      {
        "k": "score",
        "l": "总分"
      },
      {
        "k": "perfStatus",
        "l": "绩效状态",
        "t": "tag"
      },
      {
        "k": "appr",
        "l": "审批状态"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "edit",
        "l": "编辑",
        "form": "perf"
      },
      {
        "id": "save",
        "l": "保存"
      },
      {
        "id": "cancelEdit",
        "l": "取消"
      },
      {
        "id": "log",
        "l": "调整记录",
        "form": "log"
      },
      {
        "id": "cancelConfirm",
        "l": "取消确认",
        "danger": 1,
        "confirm": "确认取消该绩效确认？"
      }
    ]
  },
  "staff-rate": {
    "title": "人员评级",
    "left": "plan",
    "select": true,
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型",
        "t": "select",
        "o": [
          "全职",
          "非全职"
        ]
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "待确认",
          "已确认",
          "已同步"
        ]
      },
      {
        "k": "appr",
        "l": "审批状态",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "confirmLevel",
        "l": "确认评级",
        "p": 1
      },
      {
        "id": "syncLevel",
        "l": "同步评级",
        "p": 1
      },
      {
        "id": "ie",
        "l": "导入"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "postTeam",
        "l": "担任岗位/团队"
      },
      {
        "k": "planWeek",
        "l": "所属计划/周营"
      },
      {
        "k": "mentor",
        "l": "导师名称"
      },
      {
        "k": "pastLevel",
        "l": "过往评级"
      },
      {
        "k": "pastTerm",
        "l": "过往评级期数"
      },
      {
        "k": "curLevel",
        "l": "当前评级"
      },
      {
        "k": "changed",
        "l": "是否调整"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "appr",
        "l": "审批状态"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该评级？"
      }
    ]
  },
  "mentor-review": {
    "title": "导师督评",
    "left": "plan",
    "select": true,
    "filters": [
      {
        "k": "name",
        "l": "导师名称"
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "klass",
        "l": "班级名称"
      },
      {
        "k": "supervisor",
        "l": "督导老师"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "收集中",
          "已确认"
        ]
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "confirm",
        "l": "确认督评",
        "p": 1
      },
      {
        "id": "batchScore",
        "l": "批量确认评分"
      },
      {
        "id": "ieArrange",
        "l": "导入安排"
      },
      {
        "id": "ieScore",
        "l": "导入督评"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "name",
        "l": "导师姓名",
        "t": "link"
      },
      {
        "k": "post",
        "l": "担任岗位"
      },
      {
        "k": "planWeek",
        "l": "所属计划/周营"
      },
      {
        "k": "klass",
        "l": "班级"
      },
      {
        "k": "supervisor",
        "l": "督导老师"
      },
      {
        "k": "course",
        "l": "督导课程"
      },
      {
        "k": "supScore",
        "l": "督导评分"
      },
      {
        "k": "peer",
        "l": "互评评分"
      },
      {
        "k": "total",
        "l": "督评总分"
      },
      {
        "k": "self",
        "l": "自评问卷得分"
      },
      {
        "k": "sat",
        "l": "满意度得分"
      },
      {
        "k": "perf",
        "l": "绩效得分"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "confirmScore",
        "l": "确认督导评分"
      },
      {
        "id": "editScore",
        "l": "编辑督导评分",
        "form": "score"
      }
    ]
  },
  "class-assess": {
    "title": "班级考核",
    "left": "plan",
    "filters": [
      {
        "k": "klass",
        "l": "班级名称"
      }
    ],
    "toolbar": [
      {
        "id": "pushApp",
        "l": "发送至APP",
        "p": 1
      },
      {
        "id": "confirm",
        "l": "确认到绩效",
        "p": 1
      },
      {
        "id": "ie",
        "l": "导入评比"
      },
      {
        "id": "export",
        "l": "导出评比"
      }
    ],
    "columns": [
      {
        "k": "klass",
        "l": "班级",
        "t": "link"
      },
      {
        "k": "planWeek",
        "l": "所属计划/周营"
      },
      {
        "k": "mentor",
        "l": "班级导师"
      },
      {
        "k": "aide",
        "l": "班级助教"
      },
      {
        "k": "item",
        "l": "评比项目"
      },
      {
        "k": "score",
        "l": "总分"
      },
      {
        "k": "status",
        "l": "考核状态",
        "t": "tag"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "pushOne",
        "l": "发送至APP"
      },
      {
        "id": "on",
        "l": "生效"
      },
      {
        "id": "off",
        "l": "失效",
        "danger": 1
      }
    ]
  },
  "safety-assess": {
    "title": "安全考核",
    "left": "plan",
    "filters": [
      {
        "k": "klass",
        "l": "班级名称"
      }
    ],
    "toolbar": [
      {
        "id": "confirm",
        "l": "确认到绩效",
        "p": 1
      },
      {
        "id": "ie",
        "l": "导入更新"
      }
    ],
    "columns": [
      {
        "k": "klass",
        "l": "班级"
      },
      {
        "k": "planWeek",
        "l": "所属计划/周营"
      },
      {
        "k": "mentor",
        "l": "班级导师"
      },
      {
        "k": "aide",
        "l": "班级助教"
      },
      {
        "k": "accident",
        "l": "安全事故"
      },
      {
        "k": "fracture",
        "l": "意外骨折"
      },
      {
        "k": "injury",
        "l": "外伤就医"
      },
      {
        "k": "injuryRate",
        "l": "外伤就医比例"
      },
      {
        "k": "signCount",
        "l": "班级签到人数"
      },
      {
        "k": "safeScore",
        "l": "安全评分"
      },
      {
        "k": "status",
        "l": "考核状态",
        "t": "tag"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": []
  },
  "survey-collect": {
    "title": "问卷收集",
    "left": "planSelect",
    "filters": [
      {
        "k": "target",
        "l": "被调查人"
      },
      {
        "k": "targetPost",
        "l": "被调查人岗位"
      },
      {
        "k": "filler",
        "l": "填写人"
      },
      {
        "k": "fillerPost",
        "l": "填写人岗位"
      },
      {
        "k": "klass",
        "l": "班级"
      },
      {
        "k": "paper",
        "l": "问卷名称"
      },
      {
        "k": "paperType",
        "l": "问卷类型",
        "t": "select",
        "o": [
          "互评/他评",
          "自评/总结问卷",
          "学员问卷",
          "家长问卷",
          "督评问卷"
        ]
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "待收集",
          "已收集"
        ]
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "target",
        "l": "被调查人",
        "t": "link"
      },
      {
        "k": "targetPost",
        "l": "被调查人岗位"
      },
      {
        "k": "filler",
        "l": "填写人"
      },
      {
        "k": "fillerPost",
        "l": "填写人岗位"
      },
      {
        "k": "planWeek",
        "l": "所属计划/周营"
      },
      {
        "k": "klass",
        "l": "班级"
      },
      {
        "k": "paperType",
        "l": "问卷类型"
      },
      {
        "k": "paper",
        "l": "问卷名称"
      },
      {
        "k": "score",
        "l": "问卷得分"
      },
      {
        "k": "valid",
        "l": "有效期"
      },
      {
        "k": "collect",
        "l": "收集状态",
        "t": "tag"
      },
      {
        "k": "fill",
        "l": "填写状态"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "resume",
        "l": "恢复填写"
      },
      {
        "id": "pause",
        "l": "暂停填写",
        "danger": 1
      }
    ]
  },
  "salary-calc": {
    "title": "薪酬核算",
    "filters": [
      {
        "k": "plan",
        "l": "计划"
      },
      {
        "k": "week",
        "l": "周营"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增核算批次",
        "p": 1,
        "form": "batch"
      },
      {
        "id": "export",
        "l": "导出"
      },
      {
        "id": "ledger",
        "l": "基地台账"
      }
    ],
    "columns": [
      {
        "k": "batch",
        "l": "核算批次",
        "t": "link"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "billType",
        "l": "账单类型"
      },
      {
        "k": "team",
        "l": "团队"
      },
      {
        "k": "remark",
        "l": "说明"
      },
      {
        "k": "count",
        "l": "核算人数"
      },
      {
        "k": "cancelCount",
        "l": "取消核算"
      },
      {
        "k": "base",
        "l": "基础薪酬"
      },
      {
        "k": "perf",
        "l": "绩效奖励"
      },
      {
        "k": "other",
        "l": "其他工资项"
      },
      {
        "k": "payable",
        "l": "应发金额"
      },
      {
        "k": "creator",
        "l": "创建人"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [],
    "child": "salary-calc-detail"
  },
  "salary-calc-detail": {
    "title": "薪酬核算详情",
    "hidden": true,
    "select": true,
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "id",
        "l": "ID"
      },
      {
        "k": "type",
        "l": "类型",
        "t": "select",
        "o": [
          "全职",
          "非全职"
        ]
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "post",
        "l": "岗位"
      },
      {
        "k": "changed",
        "l": "是否调整",
        "t": "select",
        "o": [
          "是",
          "否"
        ]
      },
      {
        "k": "settle",
        "l": "是否参与结算",
        "t": "select",
        "o": [
          "不参与结算",
          "参与结算"
        ]
      },
      {
        "k": "billStatus",
        "l": "账单状态",
        "t": "select",
        "o": [
          "核算中",
          "审批中",
          "已驳回",
          "待发放",
          "发放中",
          "已发放",
          "已完成",
          "已取消",
          "已作废",
          "发放失败"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "removeBatch",
        "l": "删除批次",
        "danger": 1,
        "confirm": "确认删除该核算批次？"
      },
      {
        "id": "updateData",
        "l": "更新数据",
        "menu": [
          "更新考勤",
          "更新信息",
          "更新绩效",
          "更新审批"
        ]
      },
      {
        "id": "startAppr",
        "l": "发起审批",
        "p": 1
      },
      {
        "id": "restartAppr",
        "l": "重新审批"
      },
      {
        "id": "ie",
        "l": "导入导师费"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "billId",
        "l": "账单ID"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "settle",
        "l": "是否参与结算"
      },
      {
        "k": "post",
        "l": "担任岗位"
      },
      {
        "k": "score",
        "l": "绩效总分"
      },
      {
        "k": "pastLevel",
        "l": "过往评级"
      },
      {
        "k": "curLevel",
        "l": "当周评级"
      },
      {
        "k": "pastPay",
        "l": "往期评级薪酬标准(元/天)"
      },
      {
        "k": "curPay",
        "l": "当周评级薪酬标准(元/天)"
      },
      {
        "k": "days",
        "l": "出勤天数"
      },
      {
        "k": "pastBase",
        "l": "往期评级基本工资"
      },
      {
        "k": "curBase",
        "l": "当周评级基本工资"
      },
      {
        "k": "diff",
        "l": "往期当周评级差异"
      },
      {
        "k": "bonus",
        "l": "绩效奖金"
      },
      {
        "k": "tuition",
        "l": "导师学费"
      },
      {
        "k": "other",
        "l": "其他工资项"
      },
      {
        "k": "weekDue",
        "l": "本周营待付"
      },
      {
        "k": "weekPaid",
        "l": "本周营已付"
      },
      {
        "k": "ratio",
        "l": "发放比例"
      },
      {
        "k": "payable",
        "l": "应发金额"
      },
      {
        "k": "tax",
        "l": "个税"
      },
      {
        "k": "real",
        "l": "实发金额"
      },
      {
        "k": "changed",
        "l": "是否修改"
      },
      {
        "k": "levelStatus",
        "l": "级别状态"
      },
      {
        "k": "billStatus",
        "l": "账单状态",
        "t": "tag"
      },
      {
        "k": "frozen",
        "l": "是否冻结"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "editAmt",
        "l": "编辑金额",
        "form": "amount"
      },
      {
        "id": "addItem",
        "l": "添加工资项",
        "form": "wage"
      },
      {
        "id": "log",
        "l": "调整记录",
        "form": "log"
      },
      {
        "id": "compare",
        "l": "账单对比",
        "form": "compare"
      },
      {
        "id": "cancelSettle",
        "l": "取消核算",
        "danger": 1,
        "confirm": "确认取消核算？"
      }
    ]
  },
  "salary-bill": {
    "title": "薪酬账单",
    "select": true,
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "id",
        "l": "ID"
      },
      {
        "k": "billNo",
        "l": "账单编号"
      },
      {
        "k": "payStatus",
        "l": "发放状态",
        "t": "select",
        "o": [
          "待发放",
          "发放中",
          "已发放",
          "已完成",
          "发放失败"
        ]
      },
      {
        "k": "liveType",
        "l": "居住地类型",
        "t": "select",
        "o": [
          "境内",
          "境外"
        ]
      },
      {
        "k": "payBatch",
        "l": "发放批次"
      },
      {
        "k": "type",
        "l": "类型",
        "t": "select",
        "o": [
          "全职",
          "非全职"
        ]
      },
      {
        "k": "plan",
        "l": "所属计划"
      },
      {
        "k": "week",
        "l": "所属周营"
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "post",
        "l": "担任岗位"
      },
      {
        "k": "batch",
        "l": "核算批次"
      },
      {
        "k": "billType",
        "l": "账单类型",
        "t": "select",
        "o": [
          "正常账单",
          "转结账单",
          "全量账单"
        ]
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "pushApp",
        "l": "推送账单至App",
        "p": 1
      },
      {
        "id": "voidBill",
        "l": "作废账单",
        "danger": 1,
        "confirm": "确认作废所选账单？"
      },
      {
        "id": "exportMerge",
        "l": "导出合并账单"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "liveType",
        "l": "居住地类型"
      },
      {
        "k": "billId",
        "l": "账单ID"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "payBatch",
        "l": "发放批次"
      },
      {
        "k": "frozen",
        "l": "是否冻结"
      },
      {
        "k": "payNote",
        "l": "发放说明"
      },
      {
        "k": "push",
        "l": "推送状态"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "planWeek",
        "l": "所属计划/周营"
      },
      {
        "k": "team",
        "l": "所属团队"
      },
      {
        "k": "post",
        "l": "担任岗位"
      },
      {
        "k": "batch",
        "l": "核算批次"
      },
      {
        "k": "billType",
        "l": "账单类型"
      },
      {
        "k": "score",
        "l": "绩效总分"
      },
      {
        "k": "pastLevel",
        "l": "过往评级"
      },
      {
        "k": "curLevel",
        "l": "当周评级"
      },
      {
        "k": "std",
        "l": "薪酬标准(元/天)"
      },
      {
        "k": "days",
        "l": "出勤天数"
      },
      {
        "k": "base",
        "l": "基本工资"
      },
      {
        "k": "bonus",
        "l": "绩效奖金"
      },
      {
        "k": "tuition",
        "l": "导师学费"
      },
      {
        "k": "other",
        "l": "其他工资项"
      },
      {
        "k": "weekDue",
        "l": "本周营待付"
      },
      {
        "k": "weekPaid",
        "l": "本周营已付"
      },
      {
        "k": "ratio",
        "l": "发放比例"
      },
      {
        "k": "payable",
        "l": "应发金额"
      },
      {
        "k": "taxExpect",
        "l": "预期个税"
      },
      {
        "k": "realExpect",
        "l": "预期实发金额"
      },
      {
        "k": "taxReal",
        "l": "实际个税"
      },
      {
        "k": "real",
        "l": "实际实发金额"
      },
      {
        "k": "levelStatus",
        "l": "级别状态"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "log",
        "l": "调整记录",
        "form": "log"
      },
      {
        "id": "pushOne",
        "l": "推送账单至App"
      },
      {
        "id": "voidOne",
        "l": "作废账单",
        "danger": 1,
        "confirm": "确认作废该账单？"
      }
    ]
  },
  "salary-pay": {
    "title": "薪酬发放",
    "filters": [
      {
        "k": "batch",
        "l": "批次"
      },
      {
        "k": "plan",
        "l": "计划"
      },
      {
        "k": "week",
        "l": "周营"
      },
      {
        "k": "team",
        "l": "团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "billType",
        "l": "账单类型",
        "t": "select",
        "o": [
          "全部账单",
          "待发放账单",
          "发放失败账单"
        ]
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "发放中",
          "已完成"
        ]
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "发放批次新增",
        "p": 1,
        "form": "payBatch"
      },
      {
        "id": "exportMerge",
        "l": "导出合并账单"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "batch",
        "l": "发放批次",
        "t": "link"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "planWeek",
        "l": "发放计划/周营"
      },
      {
        "k": "team",
        "l": "发放团队"
      },
      {
        "k": "scope",
        "l": "发放范围"
      },
      {
        "k": "remark",
        "l": "说明"
      },
      {
        "k": "count",
        "l": "发放人数"
      },
      {
        "k": "amount",
        "l": "发放金额"
      },
      {
        "k": "realCount",
        "l": "实发人数"
      },
      {
        "k": "realAmt",
        "l": "实发金额"
      },
      {
        "k": "failCount",
        "l": "发放失败人数"
      },
      {
        "k": "failAmt",
        "l": "发放失败金额"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "creator",
        "l": "创建人"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [],
    "child": "salary-pay-detail"
  },
  "salary-pay-detail": {
    "title": "薪酬发放详情",
    "hidden": true,
    "select": true,
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "payId",
        "l": "发放ID"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "待发放",
          "已发放",
          "发放失败"
        ]
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "liveType",
        "l": "居住地类型",
        "t": "select",
        "o": [
          "境内",
          "境外"
        ]
      },
      {
        "k": "phone",
        "l": "手机号码"
      },
      {
        "k": "acctType",
        "l": "账户类型",
        "t": "select",
        "o": [
          "个人",
          "公司"
        ]
      },
      {
        "k": "acctName",
        "l": "用户姓名"
      },
      {
        "k": "idNo",
        "l": "身份证号"
      },
      {
        "k": "company",
        "l": "公司名称"
      },
      {
        "k": "credit",
        "l": "信用代码"
      },
      {
        "k": "bank",
        "l": "开户银行"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "batchOp",
        "l": "批量操作",
        "menu": [
          "发放",
          "发放失败"
        ]
      },
      {
        "id": "export",
        "l": "导出"
      },
      {
        "id": "exportLabor",
        "l": "用工数据导出"
      },
      {
        "id": "exportMentor",
        "l": "导师薪酬导出"
      },
      {
        "id": "ie",
        "l": "导入更新"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "liveType",
        "l": "居住地类型"
      },
      {
        "k": "payId",
        "l": "发放ID"
      },
      {
        "k": "status",
        "l": "发放状态",
        "t": "tag"
      },
      {
        "k": "phone",
        "l": "手机号码"
      },
      {
        "k": "acctType",
        "l": "账户类型"
      },
      {
        "k": "payable",
        "l": "应发薪酬"
      },
      {
        "k": "taxExpect",
        "l": "预计个税"
      },
      {
        "k": "taxReal",
        "l": "实扣个税"
      },
      {
        "k": "tuition",
        "l": "导师学费"
      },
      {
        "k": "deduct",
        "l": "扣除小计"
      },
      {
        "k": "real",
        "l": "实发金额"
      },
      {
        "k": "unit",
        "l": "结算单位"
      },
      {
        "k": "bank",
        "l": "开户银行名称"
      },
      {
        "k": "branch",
        "l": "开户行支行"
      },
      {
        "k": "city",
        "l": "开户行所在城市"
      },
      {
        "k": "personalLine",
        "l": "个人帐户联行号"
      },
      {
        "k": "companyLine",
        "l": "公司帐户联行号"
      },
      {
        "k": "card",
        "l": "卡号"
      },
      {
        "k": "bill",
        "l": "关联薪酬账单"
      },
      {
        "k": "payTime",
        "l": "发放时间"
      },
      {
        "k": "payNote",
        "l": "发放备注"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "pay",
        "l": "发放",
        "p": 1
      },
      {
        "id": "payFail",
        "l": "发放失败",
        "danger": 1
      }
    ]
  },
  "post-salary": {
    "title": "岗位基准薪酬",
    "left": "team",
    "special": "post",
    "filters": [
      {
        "k": "category",
        "l": "岗位分类名称"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [],
    "columns": [
      {
        "k": "name",
        "l": "岗位名称",
        "t": "link"
      },
      {
        "k": "category",
        "l": "岗位分类名称"
      },
      {
        "k": "team",
        "l": "所属团队"
      },
      {
        "k": "qcamp",
        "l": "关联Q营",
        "t": "tags"
      },
      {
        "k": "levels",
        "l": "薪酬等级",
        "t": "stack"
      },
      {
        "k": "refs",
        "l": "评定参考项",
        "t": "stack"
      },
      {
        "k": "full",
        "l": "全职薪酬 (元/天)",
        "t": "stack"
      },
      {
        "k": "part",
        "l": "非全职薪酬(元/天)",
        "t": "stack"
      },
      {
        "k": "remark",
        "l": "备注"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "edit",
        "l": "编辑岗位",
        "form": "post"
      },
      {
        "id": "record",
        "l": "历史记录",
        "form": "postHistory"
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该岗位？"
      }
    ],
    "detail": "post"
  },
  "survey-config": {
    "title": "问卷配置",
    "special": "surveyConfig",
    "filters": [
      {
        "k": "paper",
        "l": "问卷"
      },
      {
        "k": "target",
        "l": "被调查对象"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增问卷",
        "p": 1,
        "form": "paper"
      }
    ],
    "columns": [
      {
        "k": "paper",
        "l": "调查问卷",
        "t": "link"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "target",
        "l": "被调查对象"
      },
      {
        "k": "filler",
        "l": "调查对象"
      },
      {
        "k": "remark",
        "l": "说明"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "copy",
        "l": "复制并新增",
        "form": "paper"
      },
      {
        "id": "edit",
        "l": "编辑规则",
        "form": "paper"
      },
      {
        "id": "push",
        "l": "推送问卷"
      },
      {
        "id": "off",
        "l": "禁用",
        "danger": 1,
        "when": {
          "status": "启用"
        }
      },
      {
        "id": "on",
        "l": "启用",
        "when": {
          "status": "禁用"
        }
      }
    ]
  },
  "question-bank": {
    "title": "题库配置",
    "filters": [
      {
        "k": "q",
        "l": "题目"
      },
      {
        "k": "type",
        "l": "类型",
        "t": "select",
        "o": [
          "单选",
          "多选",
          "评分"
        ]
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      },
      {
        "k": "team",
        "l": "所属团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增题目",
        "p": 1,
        "form": "question"
      },
      {
        "id": "ie",
        "l": "导入题库"
      }
    ],
    "columns": [
      {
        "k": "q",
        "l": "题目",
        "t": "link"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "team",
        "l": "所属团队"
      },
      {
        "k": "remark",
        "l": "备注"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "copy",
        "l": "复制并新增",
        "form": "question"
      },
      {
        "id": "edit",
        "l": "编辑",
        "form": "question"
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该题目？"
      }
    ]
  },
  "wage-item": {
    "title": "工资项配置",
    "filters": [
      {
        "k": "item",
        "l": "工资项"
      },
      {
        "k": "cond",
        "l": "发放条件",
        "t": "select",
        "o": [
          "所有员工",
          "全职员工",
          "非全职员工",
          "手动发放"
        ]
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增项目",
        "p": 1,
        "form": "wage"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "item",
        "l": "工资项",
        "t": "link"
      },
      {
        "k": "scope",
        "l": "使用范围"
      },
      {
        "k": "cond",
        "l": "发放条件"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "amount",
        "l": "金额"
      },
      {
        "k": "tax",
        "l": "是否扣税"
      },
      {
        "k": "remark",
        "l": "说明"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "copy",
        "l": "复制并新增",
        "form": "wage"
      },
      {
        "id": "edit",
        "l": "编辑",
        "form": "wage"
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该工资项？"
      }
    ]
  },
  "tax-setting": {
    "title": "个税设置",
    "special": "tax"
  },
  "reason-setting": {
    "title": "申请原因设置",
    "filters": [
      {
        "k": "reason",
        "l": "原因名称"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增原因",
        "p": 1,
        "form": "reason"
      }
    ],
    "columns": [
      {
        "k": "reason",
        "l": "原因名称",
        "t": "link"
      },
      {
        "k": "remark",
        "l": "备注"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "copy",
        "l": "复制并新增",
        "form": "reason"
      },
      {
        "id": "edit",
        "l": "编辑",
        "form": "reason"
      },
      {
        "id": "off",
        "l": "禁用",
        "when": {
          "status": "启用"
        }
      },
      {
        "id": "on",
        "l": "启用",
        "when": {
          "status": "禁用"
        }
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该原因？"
      }
    ]
  },
  "compare-setting": {
    "title": "评比项目设置",
    "filters": [
      {
        "k": "item",
        "l": "评比名称"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增项目",
        "p": 1,
        "form": "compare"
      }
    ],
    "columns": [
      {
        "k": "item",
        "l": "评比项目名称",
        "t": "link"
      },
      {
        "k": "kind",
        "l": "奖扣类型"
      },
      {
        "k": "score",
        "l": "分数"
      },
      {
        "k": "remark",
        "l": "备注"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "edit",
        "l": "编辑",
        "form": "compare"
      },
      {
        "id": "off",
        "l": "禁用",
        "when": {
          "status": "启用"
        }
      },
      {
        "id": "on",
        "l": "启用",
        "when": {
          "status": "禁用"
        }
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该评比项目？"
      }
    ]
  },
  "schedule-tpl": {
    "title": "领袖营课表模板",
    "filters": [
      {
        "k": "name",
        "l": "课表模板"
      },
      {
        "k": "tplId",
        "l": "模板ID"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "启用",
          "禁用"
        ]
      },
      {
        "k": "qcamp",
        "l": "所属Q营"
      },
      {
        "k": "timeTbl",
        "l": "营地时间表"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "creator",
        "l": "创建人"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增模板",
        "p": 1,
        "form": "tpl"
      }
    ],
    "columns": [
      {
        "k": "name",
        "l": "课表模板",
        "t": "link"
      },
      {
        "k": "tplId",
        "l": "模板ID"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "qcamp",
        "l": "所属Q营"
      },
      {
        "k": "timeTbl",
        "l": "营地时间表"
      },
      {
        "k": "courseNum",
        "l": "课程总数"
      },
      {
        "k": "remark",
        "l": "备注"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "creator",
        "l": "创建人"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "edit",
        "l": "编辑",
        "form": "tpl"
      },
      {
        "id": "copy",
        "l": "复制并新增",
        "form": "tpl"
      },
      {
        "id": "off",
        "l": "禁用",
        "when": {
          "status": "启用"
        }
      },
      {
        "id": "on",
        "l": "启用",
        "when": {
          "status": "禁用"
        }
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该模板？"
      }
    ]
  },
  "camp-timetable": {
    "title": "课表配置",
    "filters": [
      {
        "k": "camp",
        "l": "营地"
      },
      {
        "k": "type",
        "l": "类型",
        "t": "select",
        "o": [
          "领袖营",
          "精英营"
        ]
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "启用",
          "禁用"
        ]
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [],
    "columns": [
      {
        "k": "camp",
        "l": "营地",
        "t": "link"
      },
      {
        "k": "type",
        "l": "类型"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "remark",
        "l": "备注"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "edit",
        "l": "编辑",
        "form": "time"
      },
      {
        "id": "sync",
        "l": "同步至其他时间表"
      },
      {
        "id": "importTime",
        "l": "导入时间表"
      },
      {
        "id": "preview",
        "l": "预览",
        "form": "preview"
      }
    ]
  },
  "camp-manage": {
    "title": "营地管理",
    "filters": [
      {
        "k": "camp",
        "l": "营地"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "上架",
          "下架"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "添加",
        "p": 1,
        "form": "camp"
      }
    ],
    "columns": [
      {
        "k": "camp",
        "l": "营地",
        "t": "link"
      },
      {
        "k": "city",
        "l": "城市"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "remark",
        "l": "备注"
      },
      {
        "k": "updated",
        "l": "更新时间"
      }
    ],
    "ops": [
      {
        "id": "edit",
        "l": "编辑",
        "form": "camp"
      },
      {
        "id": "on",
        "l": "上架",
        "when": {
          "status": "下架"
        }
      },
      {
        "id": "off",
        "l": "下架",
        "when": {
          "status": "上架"
        }
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该营地？"
      }
    ]
  },
  "recruit-post": {
    "title": "招聘岗位配置",
    "left": "team",
    "filters": [
      {
        "k": "post",
        "l": "岗位名称"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增岗位",
        "p": 1,
        "form": "recruitPost"
      }
    ],
    "columns": [
      {
        "k": "post",
        "l": "岗位名称",
        "t": "link"
      },
      {
        "k": "team",
        "l": "所属团队"
      },
      {
        "k": "remark",
        "l": "说明"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "copy",
        "l": "复制并新增",
        "form": "recruitPost"
      },
      {
        "id": "edit",
        "l": "编辑",
        "form": "recruitPost"
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该招聘岗位？"
      }
    ]
  },
  "recruit-list": {
    "title": "招募列表",
    "filters": [
      {
        "k": "title",
        "l": "招募标题"
      },
      {
        "k": "rid",
        "l": "招募ID"
      },
      {
        "k": "rstatus",
        "l": "招募状态",
        "t": "select",
        "o": [
          "招募中",
          "待开始",
          "已截止"
        ]
      },
      {
        "k": "status",
        "l": "启用状态",
        "t": "select",
        "o": [
          "启用",
          "禁用"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "添加招募",
        "p": 1,
        "form": "posting"
      }
    ],
    "columns": [
      {
        "k": "title",
        "l": "招募标题",
        "t": "link"
      },
      {
        "k": "rid",
        "l": "招募ID"
      },
      {
        "k": "plan",
        "l": "关联计划"
      },
      {
        "k": "teamType",
        "l": "招募团队类型"
      },
      {
        "k": "period",
        "l": "招募时间"
      },
      {
        "k": "expect",
        "l": "预计人数"
      },
      {
        "k": "applied",
        "l": "已报名人数"
      },
      {
        "k": "hired",
        "l": "录用人数"
      },
      {
        "k": "rstatus",
        "l": "招募状态",
        "t": "tag"
      },
      {
        "k": "status",
        "l": "是否启用"
      },
      {
        "k": "created",
        "l": "创建时间"
      },
      {
        "k": "creator",
        "l": "创建人"
      }
    ],
    "ops": [
      {
        "id": "copy",
        "l": "复制并新增",
        "form": "posting"
      },
      {
        "id": "edit",
        "l": "编辑",
        "form": "posting"
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该招募？"
      }
    ],
    "child": "recruit-detail"
  },
  "recruit-detail": {
    "title": "招聘详情",
    "hidden": true,
    "select": true,
    "filters": [
      {
        "k": "name",
        "l": "姓名"
      },
      {
        "k": "type",
        "l": "人员类型",
        "t": "select",
        "o": [
          "全职",
          "非全职"
        ]
      },
      {
        "k": "week",
        "l": "期望周营"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "待审核",
          "已淘汰",
          "已取消",
          "已储备",
          "已录用"
        ]
      },
      {
        "k": "post",
        "l": "期望岗位"
      },
      {
        "k": "channel",
        "l": "报名渠道",
        "t": "select",
        "o": [
          "小程序",
          "公众号",
          "二维码"
        ]
      }
    ],
    "toolbar": [
      {
        "id": "batchOp",
        "l": "批量操作",
        "menu": [
          "通过",
          "淘汰",
          "至储备库",
          "录用"
        ]
      },
      {
        "id": "ie",
        "l": "导入"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "id",
        "l": "会员ID"
      },
      {
        "k": "phone",
        "l": "联系电话"
      },
      {
        "k": "gender",
        "l": "性别"
      },
      {
        "k": "age",
        "l": "年龄"
      },
      {
        "k": "height",
        "l": "身高"
      },
      {
        "k": "weight",
        "l": "体重"
      },
      {
        "k": "teamType",
        "l": "团队类型"
      },
      {
        "k": "times",
        "l": "累计参与"
      },
      {
        "k": "type",
        "l": "人员类型"
      },
      {
        "k": "post",
        "l": "期望岗位"
      },
      {
        "k": "week",
        "l": "期望周营"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "channel",
        "l": "报名渠道"
      },
      {
        "k": "submit",
        "l": "报名提交时间"
      }
    ],
    "ops": [
      {
        "id": "hire",
        "l": "录用"
      },
      {
        "id": "note",
        "l": "查看备注",
        "form": "note"
      },
      {
        "id": "pass",
        "l": "通过"
      },
      {
        "id": "reject",
        "l": "淘汰",
        "danger": 1
      },
      {
        "id": "pool",
        "l": "至储备库"
      }
    ]
  },
  "staff-train": {
    "title": "人员培训",
    "filters": [
      {
        "k": "name",
        "l": "培训计划"
      },
      {
        "k": "pid",
        "l": "计划ID"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "待开始",
          "进行中",
          "已结束",
          "已取消"
        ]
      },
      {
        "k": "team",
        "l": "培训团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "period",
        "l": "培训时间",
        "t": "dateRange"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "creator",
        "l": "创建人"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增",
        "p": 1,
        "form": "train"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "name",
        "l": "培训计划",
        "t": "link"
      },
      {
        "k": "pid",
        "l": "计划ID"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "team",
        "l": "培训团队"
      },
      {
        "k": "period",
        "l": "培训时间"
      },
      {
        "k": "remark",
        "l": "培训说明"
      },
      {
        "k": "join",
        "l": "参与人数"
      },
      {
        "k": "done",
        "l": "完成人数"
      },
      {
        "k": "rate",
        "l": "完成率"
      },
      {
        "k": "note",
        "l": "备注"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "creator",
        "l": "创建人"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "copy",
        "l": "复制并新增",
        "form": "train"
      },
      {
        "id": "edit",
        "l": "编辑",
        "form": "train"
      },
      {
        "id": "cancel",
        "l": "取消计划",
        "danger": 1,
        "confirm": "确认取消该培训计划？"
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该培训计划？"
      }
    ]
  },
  "accept-exam": {
    "title": "验收考试",
    "filters": [
      {
        "k": "name",
        "l": "考试场次"
      },
      {
        "k": "eid",
        "l": "场次ID"
      },
      {
        "k": "sign",
        "l": "报名状态",
        "t": "select",
        "o": [
          "未开始",
          "报名中",
          "已截止"
        ]
      },
      {
        "k": "exam",
        "l": "考试状态",
        "t": "select",
        "o": [
          "未开始",
          "考试中",
          "已结束",
          "已取消"
        ]
      },
      {
        "k": "team",
        "l": "考试团队",
        "t": "select",
        "o": [
          "统筹办",
          "导师团",
          "助教团",
          "后勤团",
          "项目组"
        ]
      },
      {
        "k": "paper",
        "l": "考卷名称"
      },
      {
        "k": "signTime",
        "l": "报名时间",
        "t": "dateRange"
      },
      {
        "k": "examTime",
        "l": "考试时间",
        "t": "dateRange"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间",
        "t": "dateRange"
      },
      {
        "k": "creator",
        "l": "创建人"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增",
        "p": 1,
        "form": "exam"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "name",
        "l": "考试场次",
        "t": "link"
      },
      {
        "k": "eid",
        "l": "场次ID"
      },
      {
        "k": "sign",
        "l": "报名状态"
      },
      {
        "k": "exam",
        "l": "考试状态",
        "t": "tag"
      },
      {
        "k": "team",
        "l": "考试团队"
      },
      {
        "k": "paper",
        "l": "考卷名称"
      },
      {
        "k": "signTime",
        "l": "报名时间"
      },
      {
        "k": "examTime",
        "l": "考试时间"
      },
      {
        "k": "remark",
        "l": "考试说明"
      },
      {
        "k": "signCount",
        "l": "报名人数"
      },
      {
        "k": "attend",
        "l": "参考人数"
      },
      {
        "k": "pass",
        "l": "及格人数"
      },
      {
        "k": "note",
        "l": "备注"
      },
      {
        "k": "updater",
        "l": "更新人"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "creator",
        "l": "创建人"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "copy",
        "l": "复制并新增",
        "form": "exam"
      },
      {
        "id": "edit",
        "l": "编辑",
        "form": "exam"
      },
      {
        "id": "cancel",
        "l": "取消",
        "danger": 1,
        "confirm": "确认取消该考试？"
      },
      {
        "id": "remove",
        "l": "删除",
        "danger": 1,
        "confirm": "确认删除该考试？"
      }
    ]
  },
  "benchmark": {
    "title": "标杆学员档案室",
    "filters": [
      {
        "k": "name",
        "l": "学员姓名"
      },
      {
        "k": "sid",
        "l": "学员ID"
      },
      {
        "k": "plan",
        "l": "计划名称"
      },
      {
        "k": "week",
        "l": "周营"
      },
      {
        "k": "klass",
        "l": "班级"
      },
      {
        "k": "group",
        "l": "小组"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "select",
        "o": [
          "有效",
          "失效"
        ]
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "add",
        "l": "新增标杆",
        "p": 1,
        "form": "bench"
      },
      {
        "id": "batchOff",
        "l": "批量失效",
        "danger": 1
      },
      {
        "id": "ie",
        "l": "导入"
      },
      {
        "id": "export",
        "l": "导出"
      },
      {
        "id": "posterTpl",
        "l": "灯布模板"
      },
      {
        "id": "gloria",
        "l": "生成光荣榜"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "name",
        "l": "学员姓名",
        "t": "link"
      },
      {
        "k": "sid",
        "l": "学员ID"
      },
      {
        "k": "qcamp",
        "l": "Q营"
      },
      {
        "k": "plan",
        "l": "计划名称"
      },
      {
        "k": "week",
        "l": "周营"
      },
      {
        "k": "term",
        "l": "实际期数"
      },
      {
        "k": "klass",
        "l": "班级"
      },
      {
        "k": "group",
        "l": "小组"
      },
      {
        "k": "qual",
        "l": "资格"
      },
      {
        "k": "phone",
        "l": "学员联系电话"
      },
      {
        "k": "gender",
        "l": "性别"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "how",
        "l": "生成方式"
      },
      {
        "k": "story",
        "l": "事迹描述"
      },
      {
        "k": "poster",
        "l": "灯布"
      },
      {
        "k": "operator",
        "l": "操作人"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "poster",
        "l": "生成灯布"
      },
      {
        "id": "posterView",
        "l": "查看灯布"
      },
      {
        "id": "editStory",
        "l": "修改事迹"
      },
      {
        "id": "off",
        "l": "失效",
        "danger": 1,
        "confirm": "确认将该标杆学员设为失效？"
      }
    ]
  },
  "camp-screen": {
    "title": "领袖营大屏",
    "special": "screen"
  },
  "emotion-reg": {
    "title": "情绪处理登记",
    "left": "plan",
    "filters": [
      {
        "k": "registrar",
        "l": "登记人"
      },
      {
        "k": "target",
        "l": "处理对象"
      },
      {
        "k": "post",
        "l": "登记人岗位"
      },
      {
        "k": "klass",
        "l": "班级名称"
      },
      {
        "k": "created",
        "l": "创建时间",
        "t": "dateRange"
      }
    ],
    "toolbar": [
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "avatar",
        "l": "照片",
        "t": "img"
      },
      {
        "k": "registrar",
        "l": "登记人",
        "t": "link"
      },
      {
        "k": "registrarId",
        "l": "登记人ID"
      },
      {
        "k": "post",
        "l": "登记人岗位"
      },
      {
        "k": "target",
        "l": "处理对象（学员）"
      },
      {
        "k": "klass",
        "l": "班级名称"
      },
      {
        "k": "plan",
        "l": "计划"
      },
      {
        "k": "week",
        "l": "周营"
      },
      {
        "k": "issue",
        "l": "情绪问题表现"
      },
      {
        "k": "times",
        "l": "处理次数"
      },
      {
        "k": "updated",
        "l": "更新时间"
      },
      {
        "k": "created",
        "l": "创建时间"
      }
    ],
    "ops": [
      {
        "id": "supply",
        "l": "添加补充",
        "form": "supply"
      }
    ]
  },
  "student-archive": {
    "title": "学员档案",
    "select": true,
    "filters": [
      { "k": "sid", "l": "学员ID" },
      { "k": "name", "l": "学员姓名" },
      { "k": "gender", "l": "性别", "t": "select", "o": ["男", "女"] },
      { "k": "lamp", "l": "红黄白", "t": "select", "o": ["红", "黄", "白"] }
    ],
    "toolbar": [
      { "id": "add", "l": "选中会员创建档案", "p": 1 },
      { "id": "batchLamp", "l": "批量修改" }
    ],
    "columns": [
      { "k": "sid", "l": "学员ID" },
      { "k": "name", "l": "学员姓名" },
      { "k": "avatar", "l": "照片", "t": "img" },
      { "k": "gender", "l": "性别" },
      { "k": "phone", "l": "学员联系电话" },
      { "k": "birthday", "l": "出生日期" },
      { "k": "age", "l": "年龄" },
      { "k": "city", "l": "居住地" },
      { "k": "mother", "l": "母亲姓名" },
      { "k": "father", "l": "父亲姓名" },
      { "k": "superior", "l": "购买人上级/电话", "t": "stack" },
      { "k": "lamp", "l": "红黄白" },
      { "k": "study", "l": "学习课程" },
      { "k": "bench", "l": "标杆情况" },
      { "k": "emotion", "l": "情绪记录" }
    ],
    "ops": []
  },
  "medical-reg": {
    "title": "就医记录管理",
    "left": "plan",
    "filters": [],
    "toolbar": [
      {
        "id": "add",
        "l": "新增人员",
        "p": 1,
        "form": "medical"
      },
      {
        "id": "ie",
        "l": "导入"
      },
      {
        "id": "export",
        "l": "导出"
      }
    ],
    "columns": [
      {
        "k": "kind",
        "l": "就医类别"
      },
      {
        "k": "ptype",
        "l": "人员类型"
      },
      {
        "k": "name",
        "l": "姓名",
        "t": "link"
      },
      {
        "k": "klass",
        "l": "所在班级"
      },
      {
        "k": "voucher",
        "l": "凭证"
      },
      {
        "k": "when",
        "l": "就医时间"
      },
      {
        "k": "note",
        "l": "用药及情况概述"
      },
      {
        "k": "status",
        "l": "状态",
        "t": "tag"
      },
      {
        "k": "created",
        "l": "创建时间"
      },
      {
        "k": "creator",
        "l": "创建人"
      }
    ],
    "ops": [
      {
        "id": "void",
        "l": "作废",
        "danger": 1,
        "confirm": "确认作废该就医记录？"
      }
    ]
  },
  "salary-ledger": {
    "title": "基地台账",
    "special": "ledger"
  },
  "leave-summary": {
    "title": "离营总表",
    "hidden": true,
    "special": "leaveSummary"
  },
  "salary-ledger-bills": {
    "title": "基地台账明细",
    "hidden": true,
    "special": "ledgerBills"
  },
  "mentor-lesson-archive": {
    "title": "领袖营授课档案",
    "filters": [
      { "k": "mid", "l": "会员ID" },
      { "k": "name", "l": "会员名称" },
      { "k": "phone", "l": "电话号码" },
      { "k": "courseId", "l": "课程ID" },
      { "k": "course", "l": "课程名称" }
    ],
    "toolbar": [
      { "id": "export", "l": "导出" },
      { "id": "import", "l": "导入", "p": 1 },
      { "id": "recordExport", "l": "记录导出" }
    ],
    "columns": [
      { "k": "mentor", "l": "导师信息" },
      { "k": "level", "l": "所在职级" },
      { "k": "area", "l": "所在地区" },
      { "k": "office", "l": "所在运营服务单位" },
      { "k": "course", "l": "授课课程" },
      { "k": "realCount", "l": "真实授课次数" },
      { "k": "virtualCount", "l": "虚拟授课次数" },
      { "k": "totalCount", "l": "总授课次数" },
      { "k": "firstTeach", "l": "第一次授课" },
      { "k": "updated", "l": "更新时间" }
    ],
    "ops": [
      { "id": "record", "l": "查看记录" },
      { "id": "edit", "l": "修订" },
      { "id": "editRecord", "l": "修订记录" }
    ]
  }
};
window.LB_PAGE_CONST = {
  teams: ["统筹办","导师团","助教团","后勤团","项目组"],
  plans: ["2026暑假广州第二期","2026暑假广州第一期","2026寒假深圳第一期"],
  jobs: [
    { id: "all", label: "全部", count: 13 },
    { id: "office", label: "统筹办", count: 3, team: "统筹办" },
    { id: "aide-lead", label: "助教团长", count: 2, team: "助教团" },
    { id: "aide-vice", label: "助教副团", count: 1, team: "助教团" },
    { id: "aide", label: "助教", count: 2, team: "助教团" },
    { id: "mentor-lead", label: "导师团长", count: 1, team: "导师团" },
    { id: "mentor", label: "导师", count: 2, team: "导师团" },
    { id: "log-lead", label: "后勤团长", count: 1, team: "后勤团" }
  ],
  batches: [
    { id: "all", title: "全部", remark: "", createTime: "" },
    { id: "b1", title: "2026暑假广州第二期招募", remark: "助教/导师", createTime: "2026-06-12 10:00:00" },
    { id: "b2", title: "2026暑假广州第一期招募", remark: "后勤", createTime: "2026-05-20 09:12:00" }
  ]
};
