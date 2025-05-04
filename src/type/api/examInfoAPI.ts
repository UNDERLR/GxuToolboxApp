import {QueryResRoot} from "../global";
import {ExamInfo} from "../infoQuery/exam/examInfo.ts";

// 考试信息查询返回结果数据类型
export interface ExamInfoQueryRes extends QueryResRoot {
    // 考试信息列表
    items: ExamInfo[];
}
