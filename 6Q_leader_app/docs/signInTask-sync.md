# 迎接欢送 · 离营方式同步到欢送（第 10 条）

对照源码：`D:\Cursor\private-source\sixQEducation-lsc`（只读，不拷入本仓库）。

## 1. 页面与路由

| 端 | 路由 | 说明 |
| --- | --- | --- |
| 工作台入口 | `pages/tabBar/work.vue` → `迎接学员` / `欢送学员` | 分别跳 `/pages/work/signInTask/detail?type=1` 与 `?type=2` |
| 签到管理（迎接/欢送共用） | `pages/work/signInTask/detail.vue` | 同一个页面按 `type` 分支，标题固定「签到管理」 |
| 变更记录 | `pages/work/signInTask/record.vue` | `type` 由上一页带入，标题「通知信息」 |
| 学员签到详情 | `pages/work/signInTask/studentInfo.vue` | 含「修改」接送方式入口 |
| 修改接送方式 | `pages/work/signInTask/components/ModifyPickUpPopup.vue` | 弹窗标题「修改接送方式」 |
| 助教分组学员卡片 | `pages/work/categoryClass/detail.vue` | 卡片显示「离营方式」 |
| 助教分组离营详情 | `pages/work/categoryClass/components/LeavelDetailPopup.vue` | 底部上浮「离营详情」 |

`type` 差异必须全部按现网分支，不要只做一套文案：

| 位置 | `type=1` 迎接 | `type=2` 欢送 |
| --- | --- | --- |
| 方式行 | 迎接方式：机场接送 | 欢送方式：机场接离 |
| 学员状态 | 1 未到达 / 2 已到达 / 3 撤销签到 | 1 未离开 / 2 已离开 / 3 撤销签到 |
| 主按钮 | 去签到 | 去签离（现网按钮文案同为签到，按需统一） |
| 确认弹窗 | 是否已到达 | 是否已离开 |
| 统计 | 已签到 / 未签到 | 已签离 / 未签离 |
| 成功页 | `pages/work/success/index?type=8` | 同左 |
| 撤销 | `type=7` | `type=9` |

## 2. 相关接口

| 接口 | 用途 | 位置 |
| --- | --- | --- |
| `GET leaderCamp/api/travel/task/sign/list` | 欢送/迎接学员列表。参数 `campPlanWeekId`、`type`、`campsPlacePickupId`、`travelWay` | `detail.vue` |
| `GET leaderCamp/api/travel/task/sign/detail` | 学员签到详情 | `studentInfo.vue` |
| `POST leaderCamp/api/travel/task/sign/submit` | 确认签到/签离，参数 `campPlanWeekId`、`type`、`ids`、`remark`、`voucher` | `ConfirmSignInPopup.vue` |
| `POST leaderCamp/api/travel/task/sign/cancel` | 撤销签到/签离，参数 `signId` | `RevocationSignInDialog.vue` |
| `PUT leaderCamp/api/travel/task/sign/modifyPickUp` | 修改接送方式（欢送端改的是签到任务上的接送方式，不改离营问卷原值） | `ModifyPickUpPopup.vue` |
| `GET leaderCamp/api/travel/task/sign/travelWayList` | 修改接送方式的可选站点 | 同上 |
| `GET leaderCamp/api/travel/task/sign/recordList` | 变更记录列表 | `record.vue` |
| `GET leaderCamp/api/travel/task/sign/isUnReadRecord` | 变更记录未读红点 | `detail.vue` |
| `GET leaderCamp/api/assistant/group/studentLeaveDetail` | 助教分组「离营详情」数据 | `growthJournal/leaveCamp.vue` |

## 3. 离营方式的数据来源

离营方式由学员（家长）在离营问卷里填写，落在报名侧：

- 字段：`travelWay`（1 机场接离 / 2 火车高铁接离 / 3 大巴接离 / 4 营地自离 / 5 连营），`campsPlacePickupId` / `campsPlacePickupName`（站点）。
- 助教分组 `categoryClass/detail.vue` 卡片直接展示「离营方式」，点开显示 `LeavelDetailPopup`（离营方式、接离方式、凭证、接待、陪伴员、其他需求）。
- 欢送页按 `type=2` 取 `sendTravelWay` / `sendCampsPlacePickupId` 拉名单。

**本次口径：欢送页的「离营方式」是只读同步，取自同一份离营问卷，不在欢送端修改原始填写值。** 欢送端「修改」走 `modifyPickUp`，改的是签到任务上的接送方式，与问卷原值分离；页面按现网显示「接送信息调整，由『旧』改为『新』」，并写入变更记录。

## 4. 必须新增/补齐的字段：修改时间

欢送端展示离营方式时，需要能说明这份方式是何时、被谁改过。开发需要落以下字段（命名建议）：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `leaveWayUpdateTime` | datetime | 离营方式或站点最后一次修改时间 |
| `leaveWayUpdateUserId` / `leaveWayUpdateUserName` | bigint / varchar | 最后修改人 |
| `leaveWaySource` | tinyint | 1 学员填写，2 家营修改，3 欢送端修改接送方式 |

写入时机：

1. 学员/家长提交或修改离营问卷 → 写 `leaveWaySource=1`，更新修改时间与修改人。
2. 家营在后台改离营方式 → `leaveWaySource=2`，更新修改时间与修改人。
3. 欢送端 `modifyPickUp` → `leaveWaySource=3`，同时写变更记录（`recordList` 可查）。

展示：欢送页离营详情最后一行「最后修改时间」；总表学员名单列「修改时间」。后端无值时显示 `-`，不要前端拼当前时间。

## 5. 欢送总表

- 入口：欢送学员页右上角「总表」。
- 口径：**基地就是不同的计划**，一个计划一行。
- 汇总列：应欢送、机场、车站、大巴、自离、连营、未填写，另显示已签离人数。
- 下钻：点某一行，上方统计切到该计划，下方学员名单只显示该计划学员；可再按离营方式筛选、按姓名/学员ID/站点搜索。
- 汇总数与名单同源，都从同一份学员 + 离营问卷数据统计，不允许前端写死。
- 建议后端提供聚合接口（示例，命名待开发确认）：`GET leaderCamp/api/travel/task/leave/summary?campPlanWeekIds=`，返回按计划分组的各离营方式计数；名单复用 `sign/list`。
