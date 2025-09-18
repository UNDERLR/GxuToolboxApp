import {Course} from "@/type/infoQuery/course/course.ts";
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from "react-native";
import moment from "moment/moment";
import {Color} from "@/js/color.ts";
import {Text, useTheme} from "@rneui/themed";
import {ReactNode, useContext, useEffect, useMemo, useState} from "react";
import Flex from "@/components/un-ui/Flex.tsx";
import {CourseItem} from "@/components/tool/infoQuery/courseSchedule/CourseItem.tsx";
import {CourseScheduleContext} from "@/js/jw/course.ts";
import {UserConfigContext} from "@/components/AppProvider.tsx";

export interface CourseScheduleTableProps<T> {
    /** 课程列表，会自动解析是否本周 */
    courseList?: Course[];
    /** 课程元素自定义样式 */
    courseStyle?: ViewStyle;
    /** 课程元素点击事件 */
    onCoursePress?: (course: Course) => void;
    /** 计算下一节课的回调 */
    onNextCourseCalculated?: (course?: Course) => void;

    /** 学期的第一天 */
    startDay?: moment.MomentInput;
    /** 课表当前周，1-20 */
    currentWeek?: number;
    /** 是否显示表头日期，如果不显示日期，左上角显示为周数，否则为第一天所在月份 */
    showDate?: boolean;
    /** 是否显示时间段高亮 */
    showTimeSpanHighlight?: boolean;
    /** 时候高亮今日，通过第一天和周数计算后和系统时间进行比对 */
    showDayHighlight?: boolean;

    /** 自定义元素列表 */
    itemList?: T[];
    /** 自定义元素点击事件 */
    onItemPress?: (item: T) => void;
    /** 自定义元素渲染 */
    itemRender?: (item: T, onPressHook?: (item: T) => void) => ReactNode;
    /** 判断自定义元素是否在当天渲染 */
    isItemShow?: (item: T, day: moment.Moment, week: number) => boolean;
}

export function CourseScheduleTable<T = any>(props: CourseScheduleTableProps<T>) {
    const {userConfig} = useContext(UserConfigContext);
    const {courseScheduleData, courseScheduleStyle} = useContext(CourseScheduleContext)!;
    const {theme} = useTheme();
    const [courseSchedule, setCourseSchedule] = useState<Course[][]>([[], [], [], [], [], [], []]);
    const startDay = moment(props.startDay ?? userConfig.jw.startDay);
    const [currentTime, setCurrentTime] = useState(moment().format());
    const currentWeek = props.currentWeek ?? Math.ceil(moment.duration(moment().diff(startDay)).asWeeks());
    const currentTimeSpan = getCurrentTimeSpan();

    // 计算下一节课
    const nextCourse = useMemo(() => {
        const allCourses = props.courseList ?? [];
        if (!allCourses || allCourses.length === 0) {
            return;
        }

        const now = moment();
        const futureCourses: {course: Course; time: moment.Moment}[] = [];
        const startTimes = courseScheduleData.timeSpanList.map(span => span.split("\n")[0]);

        allCourses.forEach(course => {
            const weekSpans = course.zcd.split(",");
            const dayOfWeek = parseInt(course.xqj, 10);
            const startSection = parseInt(course.jcs.split("-")[0], 10) - 1;
            const courseTime = startTimes[startSection];

            if (!courseTime) {
                return;
            }

            const [hour, minute] = courseTime.split(":").map(Number);

            weekSpans.forEach(weekSpan => {
                const weeks = weekSpan.replace("周", "").split("-").map(Number);
                const startWeek = weeks[0];
                const endWeek = weeks.length > 1 ? weeks[1] : startWeek;

                for (let week = startWeek; week <= endWeek; week++) {
                    const courseDate = moment(userConfig.jw.startDay)
                        .add(week - 1, "weeks")
                        .day(dayOfWeek)
                        .hour(hour)
                        .minute(minute)
                        .second(0);

                    if (courseDate.isAfter(now)) {
                        futureCourses.push({item: course, time: courseDate});
                    }
                }
            });
        });

        if (futureCourses.length === 0) {
            return;
        }

        futureCourses.sort((a, b) => a.time.diff(b.time));
        return futureCourses[0]?.course;
    }, [props.courseList, courseScheduleData.timeSpanList, userConfig.jw.startDay]);

    function init() {
        parseCourses(props.courseList ?? []);
    }

    useEffect(() => {
        init();
        props.onNextCourseCalculated?.(nextCourse);
        // 时间段刷新定时器
        if (props.showTimeSpanHighlight) {
            const id = setInterval(() => setCurrentTime(moment().format()), 5000);
            return () => {
                clearInterval(id);
            };
        }
    }, [props, nextCourse]);

    // 从接口返回的数据解析出当周每天的课程
    function parseCourses(courseList: Course[]) {
        const res = [[], [], [], [], [], [], []] as Course[][];
        if (courseList) {
            courseList.forEach((course: Course) => {
                if (testCourseWeek(course, currentWeek)) {
                    res[parseInt(course.xqj, 10) - 1].push(course);
                }
            });
        }
        setCourseSchedule(res);
    }

    // 判断Course是否是本周课程
    function testCourseWeek(course: Course, week: number = currentWeek): boolean {
        const weekSpans = course.zcd.split(",");
        let res = false;
        weekSpans.forEach(weekSpan => {
            const weeks = weekSpan
                .replace("周", "")
                .split("-")
                .map(weekItem => parseInt(weekItem, 10));
            if ((weeks.length === 1 && weeks[0] === week) || (weeks[0] <= week && week <= weeks[1])) {
                res = true;
                return;
            }
        });
        return res;
    }

    // 计算当前时间段
    function getCurrentTimeSpan() {
        let res = -1;
        courseScheduleData.timeSpanList.forEach((timeSpan, index, list) => {
            const start = index > 0 ? list[index - 1].split("\n")[1] : "00:00";
            const end = timeSpan.split("\n")[1];
            const startTime = moment(start, "hh:mm");
            const endTime = moment(end, "hh:mm");
            if (moment(currentTime).isBetween(startTime, endTime, undefined, "[]")) {
                res = index;
                return;
            }
        });
        return res > -1 ? res : null;
    }

    // 计算时间段的Top
    const timeSpanHighLightTop = {
        top:
            userConfig.theme.course.weekdayHeight +
            (currentTimeSpan ?? 1) * userConfig.theme.course.timeSpanHeight +
            10,
    };

    // 生成短的时间段元素列表
    const shortTimeSpanList: [number | string, string][] = Array(Math.ceil(courseScheduleData.timeSpanList.length / 2))
        .fill(0)
        .map((_, index) =>
            courseScheduleData.timeSpanList[index * 2 + 1] !== undefined
                ? [
                      `${index * 2 + 1} - ${index * 2 + 2}`,
                      courseScheduleData.timeSpanList[index * 2].split("\n")[0] +
                          "\n" +
                          courseScheduleData.timeSpanList[index * 2 + 1].split("\n")[1],
                  ]
                : [index * 2 + 1, courseScheduleData.timeSpanList[index * 2]],
        );

    return (
        <View style={courseScheduleStyle.courseSchedule}>
            {/*时间段高亮*/}
            {typeof currentTimeSpan === "number" && props.showTimeSpanHighlight && (
                <View style={[timeSpanHighLightTop, courseScheduleStyle.timeSpanHighLight]} />
            )}
            {/*时间表渲染*/}
            <View style={[courseScheduleStyle.timeSpanContainer, courseScheduleStyle.weekdayContainer]}>
                <View style={courseScheduleStyle.weekdayItem}>
                    <Text style={courseScheduleStyle.weekdayText}>
                        {props.showDate
                            ? moment(userConfig.jw.startDay).add(currentWeek, "w").month() + 1 + "月"
                            : `第${props.currentWeek}周`}
                    </Text>
                </View>
                {/*时间段*/}
                {userConfig.theme.course.timeSpanHeight > 40
                    ? courseScheduleData.timeSpanList.map((time, index) => (
                          <Flex
                              inline
                              key={`timespan-${index}`}
                              style={courseScheduleStyle.timeSpanItem}
                              justify="center">
                              <Text style={courseScheduleStyle.timeSpanText}>{`${index + 1}\n${time}`}</Text>
                          </Flex>
                      ))
                    : shortTimeSpanList.map((value, index) => (
                          <Flex
                              inline
                              key={`timespan-${index}`}
                              style={[
                                  courseScheduleStyle.timeSpanItem,
                                  {height: userConfig.theme.course.timeSpanHeight * 2},
                              ]}
                              justify="center">
                              <Text style={courseScheduleStyle.timeSpanText}>{`${value[0]}\n${value[1]}`}</Text>
                          </Flex>
                      ))}
            </View>
            {/*课表*/}
            {courseScheduleData.weekdayList.map((weekday, index) => {
                // 判断是否为当天
                const currentDay = moment(userConfig.jw.startDay).add({
                    week: currentWeek - 1,
                    day: index,
                });
                const itemStyle = StyleSheet.create({
                    activeContainer: {
                        backgroundColor: Color(theme.colors.primary).setAlpha(0.2).rgbaString,
                    },
                    activeText: {},
                });
                // 生成合并的样式
                const weekdayContainerStyle: StyleProp<ViewStyle> = [courseScheduleStyle.weekdayContainer];
                const weekdayTextStyle: StyleProp<TextStyle> = [courseScheduleStyle.weekdayText];
                if (currentDay.isSame(moment(), "day") && props.showDayHighlight) {
                    weekdayContainerStyle.push(itemStyle.activeContainer);
                    weekdayTextStyle.push(itemStyle.activeText);
                }
                const currentDayItemList = (props.itemList ?? []).filter(item => props.isItemShow?.(item, currentDay, props.currentWeek));
                return (
                    // 当日课程渲染
                    <View style={weekdayContainerStyle} key={`day${index}`}>
                        <View style={courseScheduleStyle.weekdayItem}>
                            <Text style={weekdayTextStyle}>
                                {props.showDate
                                    ? `${weekday}\n${currentDay.month() + 1}-${currentDay.date()}`
                                    : `${weekday}`}
                            </Text>
                        </View>
                        {courseSchedule[index].map((course, i) => (
                            <CourseItem
                                style={props.courseStyle}
                                onCoursePress={props.onCoursePress}
                                key={`day${index}-${course.jxb_id}-${i}`}
                                course={course}
                                index={i}
                            />
                        ))}

                        {/*课表其他元素*/}
                        {currentDayItemList.map(examInfo => props.itemRender?.(examInfo, props.onItemPress))}
                    </View>
                );
            })}
        </View>
    );
}
