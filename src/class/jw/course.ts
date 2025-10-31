import {BaseClass} from "@/class/class.ts";
import {CourseScheduleQueryRes} from "@/type/api/infoQuery/classScheduleAPI.ts";
import {Course, PracticalCourse} from "@/type/infoQuery/course/course.ts";
import moment from "moment/moment";
import {CourseScheduleData} from "@/js/jw/course.ts";
import {QueryModel, UserModel} from "@/type/global.ts";

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

export class CourseClass extends BaseClass<Course> implements Course {
    backgroundColor!: string;
    bklxdjmc!: string;
    cd_id!: string;
    cdbh!: string;
    cdlbmc!: string;
    cdmc!: string;
    cxbj!: string;
    cxbjmc!: string;
    date!: string;
    dateDigit!: string;
    dateDigitSeparator!: string;
    day!: string;
    jc!: string;
    jcor!: string;
    jcs!: string;
    jgh_id!: string;
    jgpxzd!: string;
    jxb_id!: string;
    jxbmc!: string;
    jxbsftkbj!: string;
    jxbzc!: string;
    kcbj!: string;
    kch!: string;
    kch_id!: string;
    kclb!: string;
    kcmc!: string;
    kcxszc!: string;
    kcxz!: string;
    kczxs!: string;
    khfsmc!: string;
    kkzt!: string;
    lh!: string;
    listnav!: string;
    localeKey!: string;
    month!: string;
    oldjc!: string;
    oldzc!: string;
    pageTotal!: number;
    pageable!: boolean;
    pkbj!: string;
    px!: string;
    qqqh!: string;
    queryModel!: QueryModel;
    rangeable!: boolean;
    rk!: string;
    rsdzjs!: number;
    sfjf!: string;
    skfsmc!: string;
    sxbj!: string;
    totalResult!: string;
    userModel!: UserModel;
    xf!: string;
    xkbz!: string;
    xm!: string;
    xnm!: string;
    xqdm!: string;
    xqh1!: string;
    xqh_id!: string;
    xqj!: string;
    xqjmc!: string;
    xqm!: string;
    xqmc!: string;
    xsdm!: string;
    xslxbj!: string;
    year!: string;
    zcd!: string;
    zcmc!: string;
    zfjmc!: string;
    zhxs!: string;
    zxs!: string;
    zxxx!: string;
    zyfxmc!: string;
    zyhxkcbj!: string;
    zzmm!: string;
    zzrl!: string;

    constructor(ori: Course) {
        super(ori);
    }

    /**
     * 获取该课程打卡有效时间（正常和迟到），返回一个Moment对象数组，分别为起始时间和结束时间
     * @param day 当天日期的Moment对象，默认为当前时间，返回根据这个参数复制两个新的Moment对象，新Moment对象的时间为上课时间，日期不变
     */
    getAttendanceTimeSpan(day: moment.Moment = moment()): [moment.Moment, moment.Moment] {
        // 获取节次数组
        const courseSpan = this.jcs.split("-").map(num => +num - 1);
        // 获取并切割开始时间，"08:00\n08:45" -> "08:00" -> ["08", "00"] -> [8, 0]
        const startTimeSpan = CourseScheduleData.timeSpanList[courseSpan[0]]
            .split("\n")[0]
            .split(":")
            .map(num => +num);
        const startTime = day.clone().hour(startTimeSpan[0]).minute(startTimeSpan[1]).add(-20, "m").second(0); // 设置时间后再往前减20m

        // 获取并切割结束时间，"08:00\n08:45" -> "08:45" -> ["08", "45"] -> [8, 45]
        const endTimeSpan = CourseScheduleData.timeSpanList[courseSpan[1]]
            .split("\n")[1]
            .split(":")
            .map(num => +num);
        const endTime = day.clone().hour(endTimeSpan[0]).minute(endTimeSpan[1]).second(0);
        return [startTime, endTime];
    }
}
