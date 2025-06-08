import {QueryResRoot} from "@/type/global.ts";
import {ExamInfo} from "@/type/infoQuery/exam/examInfo.ts";
import {ExamScore} from "@/type/infoQuery/exam/examScore.ts";

// 考试信息查询返回结果数据类型
export interface ExamInfoQueryRes extends QueryResRoot {
    // 考试信息列表
    items: ExamInfo[];
}

// 考试成绩查询返回结果数据类型
export interface ExamScoreQueryRes extends QueryResRoot {
    // 考试信息列表
    items: ExamScore[];
}
