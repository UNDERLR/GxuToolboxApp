import {Course, useCourseScheduleData, useCourseScheduleStyle} from "../../../../type/course.ts";
import {StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import moment from "moment/moment";
import {BaseColor, color, Color} from "../../../../js/color.ts";
import {UnIcon} from "../../../un-ui/UnIcon.tsx";
import {useTheme} from "@rneui/themed";
import {useEffect, useState} from "react";

interface Props {
    courseList: Course[];
    currentWeek?: number;
}

interface CourseItem extends Course {
    // 在课程表中显示的背景颜色
    backgroundColor: string;
}

export function CourseScheduleTable(props: Props) {
    const {theme} = useTheme();
    const [courseSchedule, setCourseSchedule] = useState<CourseItem[][]>([[], [], [], [], [], [], []]);
    const {courseScheduleData} = useCourseScheduleData();
    const {courseScheduleStyle} = useCourseScheduleStyle();
    const startDay = moment(courseScheduleData.startDay);
    const [currentWeek, setCurrentWeek] = useState<number>(
        props.currentWeek ?? Math.ceil(moment.duration(moment().diff(startDay)).asWeeks()),
    );

    function init() {
        randomCourseColor(props.courseList as CourseItem[]);
        parseCourses(props.courseList as CourseItem[]);
    }

    useEffect(() => {
        init();
    }, [props]);

    function parseCourses(courseList: CourseItem[]) {
        const res = [[], [], [], [], [], [], []] as CourseItem[][];
        if (courseList) {
            courseList.forEach((course: CourseItem) => {
                if (testCourseWeek(course, currentWeek)) {
                    res[parseInt(course.xqj, 10) - 1].push(course);
                }
            });
        }
        setCourseSchedule(res);
    }

    function testCourseWeek(course: CourseItem, week: number = currentWeek): boolean {
        const weekSpans = course.zcd.split(",");
        let res = false;
        weekSpans.forEach(weekSpan => {
            const weeks = weekSpan
                .replace("周", "")
                .split("-")
                .map(week => parseInt(week, 10));
            if ((weeks.length === 1 && weeks[0] === week) || (weeks[0] <= week && week <= weeks[1])) {
                res = true;
                return;
            }
        });
        return res;
    }

    function randomCourseColor(courseList: CourseItem[]) {
        //使得相同课程的颜色相同
        const courseColor: Record<string, string> = {};
        courseList.forEach((course: CourseItem) => {
            if (!courseColor[course.kcmc]) {
                let randomNum = Math.floor(Math.random() * courseScheduleData.randomColor.length);
                course.backgroundColor = courseColor[course.kcmc] = courseScheduleData.randomColor[randomNum];
            } else {
                course.backgroundColor = courseColor[course.kcmc];
            }
        });
    }

    return (
        <View style={courseScheduleStyle.courseSchedule}>
            <View style={courseScheduleStyle.weekdayContainer}>
                <View style={courseScheduleStyle.weekdayItem}>
                    <Text style={courseScheduleStyle.weekdayText}>
                        {moment(courseScheduleData.startDay).add(currentWeek, "w").month() + 1 + "月"}
                    </Text>
                </View>
                {courseScheduleData.timeSpanList.map((time, index) => {
                    return (
                        <View>
                            <Text style={courseScheduleStyle.timeSpan}>{`${index + 1}\n${time}`}</Text>
                        </View>
                    );
                })}
            </View>
            {courseScheduleData.weekdayList.map((weekday, index) => {
                // 判断是否为当天
                const currentDay = moment(courseScheduleData.startDay).add({
                    week: currentWeek - 1,
                    day: index,
                });
                const itemStyle = StyleSheet.create({
                    activeContainer: {
                        ...courseScheduleStyle.weekdayContainer,
                        backgroundColor: new Color(BaseColor.skyblue).setAlpha(0.2).rgbaString,
                    },
                    activeText: {
                        ...courseScheduleStyle.weekdayText,
                        color: theme.colors.black,
                    },
                });
                const weekdayContainerStyle: StyleProp<ViewStyle> = [courseScheduleStyle.weekdayContainer];
                const weekdayTextStyle: StyleProp<TextStyle> = [courseScheduleStyle.weekdayText];
                if (currentDay.isSame(moment(), "day")) {
                    weekdayContainerStyle[0] = itemStyle.activeContainer;
                    weekdayTextStyle[0] = itemStyle.activeText;
                }
                return (
                    // 当日课程渲染
                    <View style={weekdayContainerStyle}>
                        <View style={courseScheduleStyle.weekdayItem}>
                            <Text style={weekdayTextStyle}>
                                {`${weekday}\n${currentDay.month() + 1}-${currentDay.date()}`}
                            </Text>
                        </View>
                        {courseSchedule[index].map(course => {
                            const span =
                                parseInt(course.jcs.split("-")[1], 10) - parseInt(course.jcs.split("-")[0], 10) + 1;
                            const y = +course.jcs.split("-")[0] - 1;
                            const itemStyle = StyleSheet.create({
                                course: {
                                    height:
                                        span * courseScheduleData.style.timeSpanHeight -
                                        courseScheduleData.style.courseItemMargin,
                                    position: "absolute",
                                    backgroundColor: new Color(course.backgroundColor).setAlpha(
                                        theme.mode === "light" ? 0.3 : 0.1,
                                    ).rgbaString,
                                    borderColor: color.mix(
                                        new Color(course.backgroundColor),
                                        new Color(theme.colors.grey4),
                                        0.7,
                                    ).rgbaString,
                                    top:
                                        courseScheduleData.style.weekdayHeight +
                                        y * courseScheduleData.style.timeSpanHeight +
                                        courseScheduleData.style.courseItemMargin / 2,
                                },
                                text: {
                                    textAlign: "center",
                                    color: theme.colors.black,
                                },
                            });
                            return (
                                <View style={[itemStyle.course, courseScheduleStyle.courseItem]}>
                                    <Text style={itemStyle.text}>{course.kcmc}</Text>
                                    <Text style={itemStyle.text}>
                                        <UnIcon type="fontawesome" name="map-marker" />
                                        {"\n" + course.cdmc.replace("-", "\n")}
                                    </Text>
                                    <Text style={itemStyle.text}>
                                        <UnIcon name="user" />
                                        {"\n" + course.xm}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );
}
