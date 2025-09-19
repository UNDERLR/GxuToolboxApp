// src/widget/useWidgetInfo.ts
import {useContext, useEffect, useState} from "react";
import moment from "moment";
import {store} from "@/js/store";
import {Course, CourseScheduleQueryRes} from "@/type/api/infoQuery/classScheduleAPI";
import {CourseScheduleContext} from "@/js/jw/course.ts";
import {UserConfigContext} from "@/components/AppProvider.tsx";

type NextCourse = Course | undefined;

interface Return {
    title: CourseScheduleQueryRes | undefined;
    nextCourse: NextCourse;
    todayCourse: {course: Course; time: moment.Moment}[];
    tomorrowCourse: {course: Course; time: moment.Moment}[];
}

interface CourseInShow {
    name: string;
    beginTime: string;
    endTime: string;
    index: string;
    teacher: string;
    room: string;
}

const PRESET_COLORS = [
    "#007AFF", // Blue
    "#34C759", // Green
    "#FF9500", // Orange
    "#AF52DE", // Purple
    "#5856D6", // Indigo
    "#FF3B30", // Red
    "#FF2D55", // Pink
    "#00C7BE", // Teal
];
export async function testa() {
    console.log("test");
    return await store.load<any>({key: "userConfig"}).catch(e => {
        console.warn(e);
        return null;
    });
}
export function useWidgetInfo() {
    const [title, setTitle] = useState<Course | undefined>(undefined);
    const [nextCourse, setNextCourse] = useState<NextCourse[] | undefined>(undefined);
    const {courseScheduleData} = useContext(CourseScheduleContext)!;
    const {userConfig} = useContext(UserConfigContext);

    const [todayCourse, setTodayCourse] = useState<any[]>();
    const [tomorrowCourse, setTomorrowCourse] = useState<any[]>();

    useEffect(() => {
        (async () => {
            const courseList = await store.load<CourseScheduleQueryRes>({key: "courseRes"}).catch(e => {
                console.warn(e);
                return null;
            });
            const list = courseList?.kbList;
            if (!list) {
                return;
            }

            setTitle(list); // 保存完整课表

            const now = moment();
            const tmr = now.clone().add(1, "day");

            const today: any[] = [];
            const tomorrow: any[] = [];
            const future: {course: Course; time: moment.Moment}[] = [];
            const startTimes = courseScheduleData.timeSpanList.map(span => span.split("\n")[0]);
            const endTimes = courseScheduleData.timeSpanList.map(span => span.split("\n")[1]);
            console.log("now", now.format("YYYY-MM-DD HH:mm:ss"));
            console.log(list[0]);
            list.forEach(course => {
                const dayOfWeek = parseInt(course.xqj, 10);
                const startSection = parseInt(course.jcs.split("-")[0], 10) - 1;
                const endSection = parseInt(course.jcs.split("-")[1], 10) - 1;
                const courseTime = startTimes[startSection];
                const courseEndTime = endTimes[endSection];
                if (!courseTime) {
                    return;
                }

                const [hour, minute] = courseTime.split(":").map(Number);

                parseWeeks(course.zcd).forEach(week => {
                    const courseDate = moment(userConfig.jw.startDay)
                        .add(week - 1, "weeks")
                        .day(dayOfWeek)
                        .hour(hour)
                        .minute(minute)
                        .second(0);
                    const courseEndDate = moment(userConfig.jw.startDay)
                        .add(week - 1, "weeks")
                        .day(dayOfWeek)
                        .hour(Number(courseEndTime.split(":")[0]))
                        .minute(Number(courseEndTime.split(":")[1]))
                        .second(0);

                    // 判断今天还有什么课
                    if (courseDate.isSame(now, "day") && courseDate.isAfter(now)) {
                        console.log("today", course.kcmc, courseDate.format("YYYY-MM-DD"));
                        today.push({
                            name: course.kcmc,
                            beginTime: courseDate.format("HH:mm"),
                            endTime: courseEndDate.format("HH:mm"),
                            index: course.jcs,
                            teacher: course.xm,
                            room: course.cdmc,
                        });
                    }
                    if (courseDate.isSame(tmr, "day")) {
                        console.log("tmr", course.kcmc, courseDate.format("YYYY-MM-DD"));
                        tomorrow.push({
                            name: course.kcmc,
                            beginTime: courseDate.format("HH:mm"),
                            endTime: courseEndDate.format("HH:mm"),
                            index: course.jcs,
                            teacher: course.xm,
                            room: course.cdmc,
                        });
                    }
                });
            });

            future.sort((a, b) => a.time.diff(b.time));
            setNextCourse(future);
            setTodayCourse(today);
            setTomorrowCourse(tomorrow);
            console.log("today", today, today.length);
        })();
    }, []);

    return {title, nextCourse, todayCourse, tomorrowCourse};
}

export async function getWidgetData() {
    const timeSpanList = [
        "08:00\n08:45",
        "08:55\n09:40",
        "10:00\n10:45",
        "10:55\n11:40",
        "14:30\n15:15",
        "15:20\n16:05",
        "16:25\n17:10",
        "17:15\n18:00",
        "18:10\n18:55",
        "18:45\n19:30",
        "19:40\n20:25",
        "20:30\n21:15",
        "21:20\n22:05",
    ];
    const courseList = await store.load<CourseScheduleQueryRes>({key: "courseRes"}).catch(e => {
        console.warn(e);
        return null;
    });
    const list = courseList?.kbList;
    if (!list) {
        return;
    }
    const startDay = await store.load<any>({key: "userConfig"}).catch(e => {
        console.warn(e);
        return null;
    });
    const now = moment();
    const tmr = now.clone().add(1, "day");

    const today: any[] = [];
    const tomorrow: any[] = [];
    const startTimes = timeSpanList.map(span => span.split("\n")[0]);
    const endTimes = timeSpanList.map(span => span.split("\n")[1]);
    console.log("now", now.format("YYYY-MM-DD HH:mm:ss"));
    console.log(list[0]);
    list.forEach(course => {
        const dayOfWeek = parseInt(course.xqj, 10);
        const startSection = parseInt(course.jcs.split("-")[0], 10) - 1;
        const endSection = parseInt(course.jcs.split("-")[1], 10) - 1;
        const courseTime = startTimes[startSection];
        const courseEndTime = endTimes[endSection];
        if (!courseTime) {
            return;
        }

        const [hour, minute] = courseTime.split(":").map(Number);

        parseWeeks(course.zcd).forEach(week => {
            const courseDate = moment(startDay)
                .add(week - 1, "weeks")
                .day(dayOfWeek)
                .hour(hour)
                .minute(minute)
                .second(0);
            const courseEndDate = moment(startDay)
                .add(week - 1, "weeks")
                .day(dayOfWeek)
                .hour(Number(courseEndTime.split(":")[0]))
                .minute(Number(courseEndTime.split(":")[1]))
                .second(0);

            // 判断今天还有什么课
            if (courseDate.isSame(now, "day") && courseDate.isAfter(now)) {
                console.log("today", course.kcmc, courseDate.format("YYYY-MM-DD"));
                today.push({
                    name: course.kcmc,
                    beginTime: courseDate.format("HH:mm"),
                    endTime: courseEndDate.format("HH:mm"),
                    index: course.jcs,
                    teacher: course.xm,
                    room: course.cdmc,
                });
            }
            if (courseDate.isSame(tmr, "day")) {
                console.log("tmr", course.kcmc, courseDate.format("YYYY-MM-DD"));
                tomorrow.push({
                    name: course.kcmc,
                    beginTime: courseDate.format("HH:mm"),
                    endTime: courseEndDate.format("HH:mm"),
                    index: course.jcs,
                    teacher: course.xm,
                    room: course.cdmc,
                });
            }
        });
    });
    return {today, tomorrow};
}

export function parseWeeks(weekStr: string): number[] {
    const result: number[] = [];
    // 按逗号拆成多段
    const segments = weekStr.split(",");

    for (const seg of segments) {
        // 去掉括号、周 字样
        const clean = seg.replace(/周|\(.*?\)/g, "").trim();
        if (!clean) {
            continue;
        }

        if (clean.includes("-")) {
            // 1-3 形式
            const [start, end] = clean.split("-").map(Number);
            const range = Array.from({length: end - start + 1}, (_, i) => start + i);
            // 判断奇偶
            if (seg.includes("(单)")) {
                result.push(...range.filter(n => n % 2 === 1));
            } else if (seg.includes("(双)")) {
                result.push(...range.filter(n => n % 2 === 0));
            } else {
                result.push(...range);
            }
        } else {
            // 单周数字
            const n = Number(clean);
            if (!Number.isNaN(n)) {
                result.push(n);
            }
        }
    }

    // 去重并升序
    return Array.from(new Set(result)).sort((a, b) => a - b);
}

function getHashCode(str) {
    let hash = 0;
    if (str.length === 0) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    // 确保结果是正数
    return Math.abs(hash);
}

/**
 * 根据课程名称，从预设颜色数组中稳定地选择一个颜色。
 * @param {string} courseName 课程名称
 * @returns {string} 颜色的十六进制代码 (e.g., '#007AFF')
 */
export function getColorForCourse(courseName) {
    if (!courseName) {
        // 如果课程名为空，返回一个默认颜色
        return PRESET_COLORS[0];
    }

    // 2. 根据课程名的哈希值，在颜色数组中取模，得到一个固定的索引
    const index = getHashCode(courseName) % PRESET_COLORS.length;

    // 3. 返回该索引对应的颜色
    return PRESET_COLORS[index];
}
