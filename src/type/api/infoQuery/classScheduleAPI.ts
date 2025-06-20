import {Course, CourseSchedule, PracticalCourse} from "@/type/infoQuery/course/course.ts";
import {Class, Week} from "@/type/infoQuery/base.ts";
import {PageModel, QueryResRoot} from "@/type/global.ts";

/** TODO 声明正确的结构 */
export interface CourseScheduleQueryRes {
    /** 课程标记对应表 */
    xsbjList: Array<any>;
    /** 实践课列表 */
    sjkList: PracticalCourse[];
    /** 课表上的所有课程 */
    kbList: Course[];
}

export interface ClassScheduleQueryRes extends CourseScheduleQueryRes {
    /** 每周的信息 */
    weekNum: Week[];
}

export interface GetCourseScheduleListRes extends QueryResRoot<CourseSchedule & Class & PageModel> {}
