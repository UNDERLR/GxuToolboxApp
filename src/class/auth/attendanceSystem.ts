import {BaseClass} from "@/class/class.ts";
import {AttendanceSystemType} from "@/type/api/auth/attendanceSystem.ts";
import {attendanceSystemApi} from "@/js/auth/attendanceSystem.ts";
import moment from "moment/moment";
import {CourseClass} from "@/class/jw/course.ts";
import AST = AttendanceSystemType;

export interface TermAttendanceData {
    termId: number;
    recordList: AST.AttendanceData[];
}
export class TermAttendanceDataClass extends BaseClass<TermAttendanceData> implements TermAttendanceData {
    recordList!: AST.AttendanceData[];
    termId!: number;

    constructor(list: AST.AttendanceData[], termId: number = 1) {
        super({
            termId,
            recordList: list,
        });
    }

    /**
     * 从记录中获取对应课程对应周的打卡记录，判断时间范围为上课前20分钟到下课，不存在时无返回
     * @param course 目标课程
     * @param week 目标周
     */
    async getAttendanceRecord(course: CourseClass, week: number): Promise<AST.AttendanceData | undefined> {
        const weekSpans = course.zcd.split(",");
        let inTargetWeek = false;
        // 判断目标周是否有这节课
        weekSpans.forEach(weekSpan => {
            const weeks = weekSpan
                .replace(/[^0-9-]/g, "")
                .split("-")
                .map(weekItem => parseInt(weekItem, 10));
            if (
                ((weeks.length === 1 && weeks[0] === week) || (weeks[0] <= week && week <= weeks[1])) &&
                !((/单/.test(weekSpan) && week % 2 === 0) || (/双/.test(weekSpan) && week % 2 === 1))
            ) {
                inTargetWeek = true;
                return;
            }
        });
        if (!inTargetWeek) return; // 不在当周
        // 获取学期日历
        const calender = await attendanceSystemApi.calenderData.getByTermId(this.termId);
        if (!calender) return;
        const day = moment(calender.firstWeekBegin).add({
            w: week - 1,
            d: +course.xqj,
        });
        const [startTime, endTime] = course.getAttendanceTimeSpan(day);
        return this.recordList.find(record => moment(record.atdTime).isBetween(startTime, endTime, null, "[]"));
    }

    /**
     * 获取指定课程在指定周次的考勤状态
     * 实际上，你也可以直接看记录的状态名词属性。你问我为啥会有这个函数，问就是写完才想起来又对应属性。
     * 当然也不是一无是处，这个可以计算未开始的情况。
     * @param course 课程对象，包含课程的相关信息
     * @param week 周数，表示要查询的课程所在周次
     * @returns 返回指定课程在指定周次的课程安排信息
     */
    async getAttendanceState(course: CourseClass, week: number): Promise<AST.AttendanceState> {
        // 获取指定课程在指定周次的考勤记录
        const record = await this.getAttendanceRecord(course, week);

        // 获取当前学期的日历数据
        const calender = await attendanceSystemApi.calenderData.getByTermId(this.termId);
        if (!calender) return AST.AttendanceState.NotStarted;

        // 计算课程具体日期：从学期第一周开始日期加上周数和星期几的偏移量
        const day = moment(calender.firstWeekBegin).add({
            w: week - 1,
            d: +course.xqj,
        });

        // 获取课程的考勤时间范围
        const [startTime, endTime] = course.getAttendanceTimeSpan(day);

        // 根据当前时间判断考勤状态
        const recordTime = moment(record?.atdTime);
        const courseBeginTime = startTime.clone().add(20, "m");
        if (record?.atdStateId === AST.AttendanceState.Absent) return AST.AttendanceState.Absent;
        else if (recordTime.isBefore(startTime)) return AST.AttendanceState.NotStarted;
        else if (recordTime.isBetween(startTime, courseBeginTime, null, "[]")) return AST.AttendanceState.Normal;
        else if (recordTime.isBetween(courseBeginTime, endTime, null, "(]")) return AST.AttendanceState.Late;
        else return AST.AttendanceState.Absent;
    }
}
