import {QueryResRoot} from "../global";
import {Course, PracticalCourse} from "../infoQuery/course/course.ts";

export interface CourseScheduleQueryRes extends QueryResRoot {
    // 课程标记对应表
    xsbjList: Array<any>;
    // 实践课列表
    sjkList: PracticalCourse[];
    // 课表上的所有课程
    kbList: Course[];
}
