window.APP_PAGES = [
  {
    "path": "pages/load/index",
    "title": "领袖营工作",
    "kind": "load",
    "labels": [
      "领袖营工作",
      "返回"
    ],
    "links": []
  },
  {
    "path": "pages/tabBar/pending",
    "title": "领袖营工作",
    "kind": "pending",
    "labels": [
      "领袖营工作",
      "已签到",
      "未签到",
      "岗位",
      "切换",
      "暂时没有待办"
    ],
    "links": [
      "/pages/work/toggleCamp/index",
      "/pages/work/askForLeave/detail",
      "/pages/work/reporting/detail",
      "/pages/work/suspicious/detail",
      "/pages/work/fallForLeave/detail",
      "/pages/work/replaceCard/detail",
      "/pages/work/lessonsSupervise/list"
    ]
  },
  {
    "path": "pages/tabBar/work",
    "title": "领袖营工作",
    "kind": "work",
    "labels": [
      "领袖营工作",
      "工作",
      "迎接欢送",
      "导师工作",
      "版本名称",
      "版本号",
      "当前环境",
      "注：只有测试环境和uat存在"
    ],
    "links": [
      "/pages/work/toggleCamp/index",
      "/pages/work/supervise/index",
      "/pages/work/categoryClass/index",
      "/pages/work/suspicious/index",
      "/pages/work/examine/index",
      "/pages/work/reporting/index",
      "/pages/work/askForLeave/index",
      "/pages/work/fallForLeave/index",
      "/pages/work/bill/index",
      "/pages/work/studentSignIn/index"
    ]
  },
  {
    "path": "pages/work/reporting/index",
    "title": "外出报备",
    "kind": "list",
    "labels": [
      "输入报备事由",
      "申请报备",
      "工作报备"
    ],
    "links": [
      "/pages/work/reporting/form"
    ]
  },
  {
    "path": "pages/work/reporting/form",
    "title": "工作报备",
    "kind": "form",
    "labels": [
      "工作报备",
      "报备原因",
      "请选择报备原因",
      "报备开始时间",
      "请选择报备开始时间",
      "报备结束时间",
      "请选择报备结束时间",
      "报备事由",
      "请输入报备事由",
      "附件"
    ],
    "links": []
  },
  {
    "path": "pages/work/reporting/detail",
    "title": "工作报备",
    "kind": "detail",
    "labels": [
      "处理情况",
      "申请人",
      "报备原因",
      "报备时间",
      "报备事由",
      "附件"
    ],
    "links": []
  },
  {
    "path": "pages/work/categoryClass/index",
    "title": "助教分班",
    "kind": "list",
    "labels": [
      "助教分组",
      "学员数据",
      "收集情况",
      "班级小组",
      "助教",
      "未安排助教",
      "离营问卷",
      "家长问卷",
      "暂无分组",
      "暂无班级"
    ],
    "links": [
      "/pages/work/categoryClass/growthJournal/statistics",
      "/pages/work/emotion/archive"
    ]
  },
  {
    "path": "pages/work/categoryClass/studentList",
    "title": "学员列表",
    "kind": "list",
    "labels": [
      "学员列表",
      "搜索学员ID/电话号码",
      "取消",
      "改期",
      "复训",
      "新训",
      "未分配",
      "移动至"
    ],
    "links": [
      "/pages/work/categoryClass/moveGroupList"
    ]
  },
  {
    "path": "pages/work/categoryClass/moveGroupList",
    "title": "移动分组",
    "kind": "list",
    "labels": [
      "移动分组",
      "班级小组",
      "暂无班级小组",
      "人）",
      "助教",
      "未安排助教"
    ],
    "links": []
  },
  {
    "path": "pages/work/categoryClass/growthJournal/statistics",
    "title": "日志统计",
    "kind": "list",
    "labels": [
      "日志/印记统计",
      "预览"
    ],
    "links": []
  },
  {
    "path": "pages/work/categoryClass/growthJournal/index",
    "title": "学员成长",
    "kind": "list",
    "labels": [
      "学员成长",
      "切换周营",
      "暂无记录",
      "我知道了"
    ],
    "links": [
      "/pages/work/categoryClass/growthImprint/entrance",
      "/pages/work/categoryClass/growthJournal/leaveCamp"
    ]
  },
  {
    "path": "pages/work/categoryClass/growthJournal/detail",
    "title": "日志详情",
    "kind": "detail",
    "labels": [
      "暂无反馈",
      "条反馈"
    ],
    "links": []
  },
  {
    "path": "pages/work/categoryClass/growthJournal/form",
    "title": "发布日志",
    "kind": "form",
    "labels": [
      "记录时间",
      "请选择",
      "发布班级",
      "写下这一刻的想法吧",
      "图片",
      "语音",
      "确认提交",
      "试听",
      "暂停",
      "重录",
      "保存"
    ],
    "links": []
  },
  {
    "path": "pages/work/categoryClass/growthJournal/leaveCamp",
    "title": "离营详情",
    "kind": "list",
    "labels": [
      "离营详情",
      "离营方式",
      "未填写",
      "接离方式",
      "凭证",
      "接待",
      "航班楼",
      "航班号",
      "火车站",
      "班次",
      "陪伴员",
      "陪伴人",
      "带队人",
      "其他需求"
    ],
    "links": []
  },
  {
    "path": "pages/work/suspicious/index",
    "title": "疑异处理",
    "kind": "list",
    "labels": [
      "输入疑异事由",
      "申请疑异",
      "我发起的",
      "我处理的",
      "关于我的",
      "疑异处理"
    ],
    "links": [
      "/pages/work/suspicious/form"
    ]
  },
  {
    "path": "pages/work/supervise/index",
    "title": "督评结果",
    "kind": "list",
    "labels": [
      "督评结果",
      "督评总分",
      "督评课程",
      "点击输入我的收获与回应",
      "输入您收到的督评意见以及您对该条意见的回应",
      "发布"
    ],
    "links": []
  },
  {
    "path": "pages/work/lessonsSupervise/form",
    "title": "授课督评-督评意见",
    "kind": "form",
    "labels": [
      "确认提交",
      "督评建议",
      "请输入督评评价",
      "语音",
      "图片",
      "拍摄",
      "手机相册选择",
      "取消",
      "重录",
      "保存",
      "您还没提交，是否保存后续填写呢？",
      "不保存",
      "重新填写",
      "继续编辑",
      "继续编辑你的建议吗？"
    ],
    "links": [
      "/pages/work/success/index"
    ]
  },
  {
    "path": "pages/work/lessonsSupervise/list",
    "title": "督评督导",
    "kind": "list",
    "labels": [
      "督评督导",
      "请搜索姓名",
      "搜索",
      "督评对象"
    ],
    "links": []
  },
  {
    "path": "pages/work/lessonsSupervise/detail",
    "title": "督评督导",
    "kind": "detail",
    "labels": [
      "的督导督评",
      "督评建议",
      "授课导师的收获与回应",
      "发布时间"
    ],
    "links": []
  },
  {
    "path": "pages/work/lessonsSupervise/index",
    "title": "授课督评",
    "kind": "list",
    "labels": [
      "授课督评",
      "督评对象",
      "督评总分",
      "确认"
    ],
    "links": [
      "/pages/work/lessonsSupervise/form"
    ]
  },
  {
    "path": "pages/work/lessonsSupervise/formIndex",
    "title": "授课督评",
    "kind": "form",
    "labels": [
      "授课督评",
      "督评对象",
      "督评总分",
      "确认"
    ],
    "links": []
  },
  {
    "path": "pages/work/examine/index",
    "title": "班级考核",
    "kind": "list",
    "labels": [
      "班级考核",
      "我提交的"
    ],
    "links": [
      "/pages/work/examine/mySubmit"
    ]
  },
  {
    "path": "pages/work/examine/form",
    "title": "班级考核",
    "kind": "form",
    "labels": [
      "班级考核",
      "确认提交",
      "具体奖/扣事项",
      "请输入具体奖/扣事项"
    ],
    "links": []
  },
  {
    "path": "pages/work/evaluation/index",
    "title": "调研问卷",
    "kind": "list",
    "labels": [
      "调研问卷",
      "加载中...",
      "您已完成所有被评人问卷填写",
      "问卷被调查人",
      "请输入姓名搜索",
      "搜索",
      "我已完成问卷填写"
    ],
    "links": [
      "/pages/work/evaluation/insert"
    ]
  },
  {
    "path": "pages/work/evaluation/insert",
    "title": "调研问卷-填写问卷",
    "kind": "form",
    "labels": [
      "调研问卷",
      "的调研问卷",
      "当前对象",
      "上一个"
    ],
    "links": []
  },
  {
    "path": "pages/work/success/index",
    "title": "填写问卷-成功",
    "kind": "success",
    "labels": [],
    "links": []
  },
  {
    "path": "pages/work/student/index",
    "title": "学生评价问卷",
    "kind": "list",
    "labels": [
      "学生评价问卷",
      "问卷说明",
      "扫码填写",
      "去填写",
      "暂无学员",
      "完成"
    ],
    "links": [
      "/pages/work/student/info"
    ]
  },
  {
    "path": "pages/work/student/qrCode",
    "title": "学生评价问卷-扫码填写",
    "kind": "list",
    "labels": [
      "扫码填写",
      "扫码填写学生评价问卷"
    ],
    "links": []
  },
  {
    "path": "pages/work/student/info",
    "title": "学生评价问卷-学员信息确认",
    "kind": "detail",
    "labels": [
      "调研问卷",
      "学员信息确认",
      "学员姓名",
      "所属营地",
      "所属班级",
      "学员组别",
      "学员角色",
      "学员",
      "问卷说明",
      "我已确认，开始填写"
    ],
    "links": []
  },
  {
    "path": "pages/work/student/insert",
    "title": "学生评价问卷-学员问卷填写",
    "kind": "form",
    "labels": [
      "调研问卷",
      "综合调研",
      "的调研问卷",
      "当前对象",
      "上一个",
      "是否退出问卷的填写",
      "退出后，填写的选项不会进行保存"
    ],
    "links": []
  },
  {
    "path": "pages/work/questionnaire/index",
    "title": "其他问卷填写",
    "kind": "list",
    "labels": [
      "调研问卷",
      "的调研问卷",
      "确认"
    ],
    "links": []
  },
  {
    "path": "pages/work/categoryClass/detail",
    "title": "助教分班-查看",
    "kind": "detail",
    "labels": [
      "助教分组",
      "小组",
      "本组助教",
      "调整助教",
      "调整学员",
      "暂无学员",
      "健康状况",
      "营服尺码",
      "离营方式",
      "家长问卷",
      "母亲",
      "父亲"
    ],
    "links": [
      "/pages/work/categoryClass/moveGroupList",
      "/pages/work/categoryClass/benchmarkStudents"
    ]
  },
  {
    "path": "pages/work/suspicious/form",
    "title": "疑异处理",
    "kind": "form",
    "labels": [
      "疑异处理",
      "疑异原因",
      "请选择疑异原因",
      "姓名",
      "请选择姓名",
      "开始时间",
      "请选择开始时间",
      "结束时间",
      "请选择结束时间",
      "总时长",
      "小时",
      "事由",
      "请输入事由",
      "附件"
    ],
    "links": []
  },
  {
    "path": "pages/work/suspicious/detail",
    "title": "疑异处理",
    "kind": "detail",
    "labels": [
      "处理情况",
      "处理对象",
      "疑异原因",
      "发生时间",
      "总时长",
      "小时",
      "处理事由",
      "附件"
    ],
    "links": []
  },
  {
    "path": "pages/work/askForLeave/index",
    "title": "因私请假",
    "kind": "list",
    "labels": [
      "输入请假事由",
      "申请请假",
      "因私请假"
    ],
    "links": [
      "/pages/work/askForLeave/form"
    ]
  },
  {
    "path": "pages/work/askForLeave/form",
    "title": "因私请假",
    "kind": "form",
    "labels": [
      "因私请假",
      "请假原因",
      "请选择请假原因",
      "请假开始时间",
      "请选择请假开始时间",
      "请假结束时间",
      "请选择请假结束时间",
      "请假时长",
      "小时",
      "请假事由",
      "请输入请假事由",
      "附件"
    ],
    "links": []
  },
  {
    "path": "pages/work/askForLeave/detail",
    "title": "因私请假",
    "kind": "detail",
    "labels": [
      "特别提醒：申请请假后务必到统筹办办公室领取",
      "外出放行条",
      "方可外出。",
      "处理情况",
      "申请人",
      "请假原因",
      "请假时间",
      "请假时长",
      "小时",
      "到岗时间",
      "实际请假时长",
      "请假事由",
      "销假说明",
      "附件",
      "销假附件"
    ],
    "links": []
  },
  {
    "path": "pages/work/fallForLeave/index",
    "title": "生病请假",
    "kind": "list",
    "labels": [
      "输入请假事由",
      "申请请假",
      "生病请假"
    ],
    "links": [
      "/pages/work/fallForLeave/form"
    ]
  },
  {
    "path": "pages/work/fallForLeave/form",
    "title": "生病请假",
    "kind": "form",
    "labels": [
      "生病请假",
      "请假原因",
      "请选择请假原因",
      "请假开始时间",
      "请选择请假开始时间",
      "请假结束时间",
      "请选择请假结束时间",
      "请假时长",
      "小时",
      "请假事由",
      "请输入请假事由",
      "附件"
    ],
    "links": []
  },
  {
    "path": "pages/work/fallForLeave/detail",
    "title": "生病请假",
    "kind": "detail",
    "labels": [
      "特别提醒：申请请假后务必到统筹办办公室领取",
      "外出放行条",
      "方可外出。",
      "处理情况",
      "申请人",
      "请假原因",
      "请假时间",
      "请假时长",
      "小时",
      "到岗时间",
      "实际请假时长",
      "请假事由",
      "销假说明",
      "附件",
      "销假附件"
    ],
    "links": []
  },
  {
    "path": "pages/work/replaceCard/index",
    "title": "补卡申请",
    "kind": "list",
    "labels": [
      "输入补卡事由",
      "申请补卡",
      "补卡"
    ],
    "links": [
      "/pages/work/replaceCard/form"
    ]
  },
  {
    "path": "pages/work/replaceCard/form",
    "title": "补卡申请",
    "kind": "form",
    "labels": [
      "补卡",
      "补卡时间",
      "请选择补卡时间",
      "补卡事由",
      "请输入补卡事由"
    ],
    "links": []
  },
  {
    "path": "pages/work/replaceCard/detail",
    "title": "补卡申请",
    "kind": "detail",
    "labels": [
      "处理情况",
      "申请人",
      "补卡时间",
      "补卡事由"
    ],
    "links": []
  },
  {
    "path": "pages/work/categoryClass/edit",
    "title": "助教分班-编辑",
    "kind": "list",
    "labels": [
      "搜索",
      "取消",
      "确认"
    ],
    "links": []
  },
  {
    "path": "pages/work/toggleCamp/index",
    "title": "更换营地",
    "kind": "list",
    "labels": [
      "更换营地",
      "当前",
      "保存设置"
    ],
    "links": [
      "/pages/tabBar/pending",
      "/pages/tabBar/work"
    ]
  },
  {
    "path": "pages/work/examine/markDetail",
    "title": "分数明细",
    "kind": "detail",
    "labels": [
      "分数明细",
      "当天排名",
      "加分和",
      "扣分和",
      "加减分明细"
    ],
    "links": []
  },
  {
    "path": "pages/work/examine/classDetail",
    "title": "班级考核",
    "kind": "detail",
    "labels": [
      "助教分组",
      "导师团长、导师副团",
      "助教团长、助教副团",
      "总排名",
      "考评总分123",
      "班级排名",
      "排名"
    ],
    "links": []
  },
  {
    "path": "pages/work/bill/index",
    "title": "薪酬账单",
    "kind": "list",
    "labels": [
      "请搜索计划/周营名称",
      "搜索",
      "应发",
      "实发",
      "已发",
      "付款于"
    ],
    "links": []
  },
  {
    "path": "pages/work/bill/detail",
    "title": "薪酬账单",
    "kind": "detail",
    "labels": [
      "全职员工薪酬合并当月工资发放",
      "应发金额",
      "扣除个税金额",
      "扣除导师学费",
      "扣除合计金额",
      "实发金额"
    ],
    "links": []
  },
  {
    "path": "pages/work/memberAdjust/list",
    "title": "接送方式",
    "kind": "list",
    "labels": [
      "迎接欢送人员调整"
    ],
    "links": []
  },
  {
    "path": "pages/work/memberAdjust/detail",
    "title": "工作人员列表",
    "kind": "detail",
    "labels": [
      "新增",
      "工作人员",
      "学员",
      "重新检查",
      "确认提交",
      "请确认是否把",
      "换成",
      "选择新的接送方式"
    ],
    "links": []
  },
  {
    "path": "pages/work/memberAdjust/createMember",
    "title": "新增工作人员",
    "kind": "form",
    "labels": [
      "新增工作人员",
      "已选择",
      "保存设置",
      "重新检查",
      "确认提交"
    ],
    "links": []
  },
  {
    "path": "pages/work/signInTask/list",
    "title": "迎接欢送",
    "kind": "list",
    "labels": [
      "迎接欢送"
    ],
    "links": []
  },
  {
    "path": "pages/work/signInTask/detail",
    "title": "签到管理",
    "kind": "detail",
    "labels": [
      "签到管理",
      "变更记录",
      "搜索学员姓名/航班号/班次",
      "签到情况（",
      "全选",
      "已选",
      "名，确认签到"
    ],
    "links": []
  },
  {
    "path": "pages/work/signInTask/studentInfo",
    "title": "学员信息",
    "kind": "form",
    "labels": [
      "学员信息",
      "航站楼",
      "火车站",
      "大巴接送",
      "入营方式",
      "修改",
      "复制",
      "到达时间",
      "接离方式",
      "凭证",
      "无人陪伴",
      "带队人",
      "带队人电话",
      "居住地",
      "报读人姓名",
      "报读人电话"
    ],
    "links": [
      "/pages/work/success/index"
    ]
  },
  {
    "path": "pages/work/signInTask/record",
    "title": "通知信息",
    "kind": "list",
    "labels": [
      "通知信息",
      "改成",
      "更新时间",
      "更新人"
    ],
    "links": []
  },
  {
    "path": "pages/work/studentSignIn/index",
    "title": "学员签到",
    "kind": "list",
    "labels": [
      "学员签到",
      "学员总人数",
      "已签到人数",
      "未签到人数",
      "搜索学员姓名",
      "全选",
      "已选",
      "名，确认签到"
    ],
    "links": [
      "/pages/work/success/index"
    ]
  },
  {
    "path": "pages/work/studentConfirm/index",
    "title": "确认班级人数",
    "kind": "list",
    "labels": [
      "确认班级人数",
      "学员新复训情况",
      "新训学员",
      "复训学员",
      "学员酒店大堂签到",
      "已签到人数",
      "未签到人数",
      "学员班级确认情况",
      "已确认人数",
      "未确认人数",
      "学员签到情况（",
      "全选",
      "已选",
      "名，确认签到"
    ],
    "links": []
  },
  {
    "path": "pages/work/examine/mySubmit",
    "title": "examine",
    "kind": "form",
    "labels": [
      "我的提交",
      "查询班级名称",
      "搜索",
      "奖励",
      "扣分",
      "评比项目",
      "评比时间"
    ],
    "links": [
      "/pages/work/examine/detail"
    ]
  },
  {
    "path": "pages/work/examine/detail",
    "title": "examine",
    "kind": "detail",
    "labels": [
      "助教分组",
      "评比班级",
      "扣奖类型",
      "评比项目",
      "分数",
      "评比时间",
      "具体奖/扣事项",
      "凭证上传"
    ],
    "links": []
  },
  {
    "path": "pages/pending/leaderCampLeaveEarlyApplyConfirm/index",
    "title": "leaderCampLeaveEarlyApplyConfirm",
    "kind": "list",
    "labels": [
      "提前离营申请确认",
      "离/退营由当事人本人客观真实填写。",
      "此表格经签名后表示申请学员正式暂离营，暂离营期间学",
      "费、行政生活费不退。",
      "暂离营期间学员的个人安全由学员本人及家长自行负责",
      "与广州六马教育信息咨询有限公司无关。",
      "离营签名后，离营安全交通及费用自行负责。",
      "家长需签名确认，家长授权他人代接、文字确认均同等有",
      "效。",
      "上课人信息",
      "姓名",
      "学习资格",
      "营班级",
      "小组",
      "家长信息",
      "母亲姓名"
    ],
    "links": []
  },
  {
    "path": "pages/work/questionnaireGather/overview",
    "title": "问卷收集概览",
    "kind": "list",
    "labels": [
      "问卷收集概览",
      "数据总览",
      "收集率",
      "暂无数据",
      "班级列表",
      "未查询到相关数据"
    ],
    "links": []
  },
  {
    "path": "pages/work/questionnaireGather/overviewDetail",
    "title": "问卷收集详情",
    "kind": "detail",
    "labels": [
      "问卷收集详情",
      "我的班级",
      "导师团长、导师副团",
      "助教团长、助教副团",
      "收集情况",
      "助教团问卷",
      "详情",
      "导师团问卷",
      "未查询到相关数据"
    ],
    "links": []
  },
  {
    "path": "pages/work/questionnaireGather/staffDetail",
    "title": "问卷收集明细",
    "kind": "detail",
    "labels": [
      "问卷收集明细",
      "联系电话",
      "完成时间",
      "暂无数据"
    ],
    "links": []
  },
  {
    "path": "pages/work/categoryClass/benchmarkStudents",
    "title": "标杆学员评比",
    "kind": "form",
    "labels": [
      "标杆学员评比",
      "学员姓名",
      "班级名称",
      "组数",
      "主要事迹",
      "请输入评选标杆学员主要事迹",
      "学员照片（最多3张）",
      "确认提交"
    ],
    "links": []
  },
  {
    "path": "pages/work/emotion/index",
    "title": "情绪处理管理",
    "kind": "list",
    "labels": [
      "情绪处理管理"
    ],
    "links": []
  },
  {
    "path": "pages/work/emotion/archive",
    "title": "情绪处理档案",
    "kind": "list",
    "labels": [
      "情绪处理档案",
      "搜索登记人/处理对象"
    ],
    "links": []
  },
  {
    "path": "pages/work/emotion/form",
    "title": "情绪处理登记",
    "kind": "form",
    "labels": [
      "情绪处理登记",
      "学员姓名",
      "请选择",
      "班级",
      "小组",
      "记录时间",
      "问题表现",
      "说明孩子的情绪问题表现",
      "次处理",
      "移除",
      "处理时间",
      "处理过程及结果",
      "请输入处理过程及结果",
      "添加处理过程",
      "确认提交",
      "您还没提交，是否保存后续填写呢？"
    ],
    "links": [
      "/pages/work/categoryClass/edit"
    ]
  },
  {
    "path": "pages/work/emotion/detail",
    "title": "情绪处理详情",
    "kind": "detail",
    "labels": [
      "情绪处理登记",
      "学员姓名",
      "班级",
      "小组",
      "记录时间",
      "问题表现",
      "次处理",
      "处理时间",
      "处理过程及结果",
      "统筹办补充",
      "补充于"
    ],
    "links": []
  },
  {
    "path": "pages/aiAssistant/index",
    "title": "领袖营助手",
    "kind": "page",
    "labels": [],
    "links": []
  },
  {
    "path": "pages/aiAssistant/history",
    "title": "领袖营助手会话历史",
    "kind": "page",
    "labels": [],
    "links": []
  },
  {
    "path": "pages/work/categoryClass/growthImprint/entrance",
    "title": "成长印记",
    "kind": "list",
    "labels": [
      "成长印记",
      "完型成长印记",
      "立即查看",
      "已结营，无法编辑",
      "继续编辑"
    ],
    "links": []
  },
  {
    "path": "pages/work/categoryClass/growthImprint/form",
    "title": "成长印记",
    "kind": "form",
    "labels": [
      "成长印记填写",
      "您还没提交，是否保存后续填写呢？",
      "不保存",
      "保存"
    ],
    "links": []
  },
  {
    "path": "pages/work/categoryClass/growthImprint/report",
    "title": "成长印记",
    "kind": "list",
    "labels": [
      "亲爱的",
      "学员!结营不是终点，而是带着成长印记奔赴新旅程的起",
      "在这六天六夜里",
      "你突破自我的勇气、团结协作的温暖、",
      "认真探索的模样",
      "都已成为专属成长印记。",
      "你带着这份收获与热爱",
      "在未来的日子里继续发光",
      "每一步都走得坚定又闪耀!",
      "出勤率",
      "电子产品",
      "卫生清洁",
      "和孩子度过的七天六夜中",
      "孩子的卫生情况达到了",
      "身体健康",
      "健康状况良好，继续保持哦！"
    ],
    "links": []
  },
  {
    "path": "pages/work/categoryClass/growthImprint/success",
    "title": "成长印记",
    "kind": "success",
    "labels": [
      "成长印记",
      "已完成成长印记填写",
      "预览查看ta的印记报告"
    ],
    "links": []
  }
];
