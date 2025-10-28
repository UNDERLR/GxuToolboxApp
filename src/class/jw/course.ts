import {BaseClass} from "@/class/class.ts";
import {CourseScheduleQueryRes} from "@/type/api/infoQuery/classScheduleAPI.ts";
import {Course, PracticalCourse} from "@/type/infoQuery/course/course.ts";
import moment from "moment/moment";

/** 课表类，从 `CourseScheduleQueryRes` 解析 */
export class CourseScheduleClass extends BaseClass<CourseScheduleQueryRes> implements CourseScheduleQueryRes {
    kbList!: Course[];
    sjkList!: PracticalCourse[];
    xsbjList!: Array<any>;

    constructor(apiRes: CourseScheduleQueryRes) {
        super(apiRes);
    }

    /**
     * 根据周数获取课表
     * @param week 1-20
     */
    getCourseListByWeek(week: number): Course[][] {
        const res = [[], [], [], [], [], [], []] as Course[][];

        function testCourseWeek(course: Course): boolean {
            const weekSpans = course.zcd.split(",");
            let res = false;
            weekSpans.forEach(weekSpan => {
                const weeks = weekSpan
                    .replace(/[^0-9-]/g, "")
                    .split("-")
                    .map(weekItem => parseInt(weekItem, 10));
                if (
                    ((weeks.length === 1 && weeks[0] === week) || (weeks[0] <= week && week <= weeks[1])) &&
                    !((/单/.test(weekSpan) && week % 2 === 0) || (/双/.test(weekSpan) && week % 2 === 1))
                ) {
                    res = true;
                    return;
                }
            });
            return res;
        }

        this.kbList.forEach(course => {
            if (testCourseWeek(course)) {
                res[parseInt(course.xqj, 10) - 1].push(course);
            }
        });
        return res;
    }

    /**
     * 获取某一天的课表
     * @param date 目标日期
     * @param startDay 课表开始第一天
     */
    getCourseListByDay(date: moment.MomentInput, startDay: moment.MomentInput): Course[] {
        const dateMoment = moment(date);
        const week = Math.ceil(moment.duration(dateMoment.diff(startDay)).asWeeks()) + 1;
        const weekCourseList = this.getCourseListByWeek(week);
        const weekday = dateMoment.weekday();
        return weekCourseList[weekday > 0 ? weekday - 1 : 6];
    }
}
