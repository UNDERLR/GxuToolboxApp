import {Course} from "@/type/infoQuery/course/course.ts";
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from "react-native";
import moment from "moment/moment";
import {Color} from "@/js/color.ts";
import {Text} from "@rneui/themed";
import {useContext, useEffect, useState} from "react";
import Flex from "@/components/un-ui/Flex.tsx";
import {useUserTheme} from "@/js/theme.ts";
import {CourseItem} from "@/components/tool/infoQuery/courseSchedule/CourseItem.tsx";
import {CourseScheduleContext} from "@/js/jw/course.ts";

interface Props {
    courseList: Course[];
    currentWeek?: number;
    onCoursePress?: (course: Course) => void;
    startDay: moment.MomentInput;
}

interface CourseItem extends Course {
    // 在课程表中显示的背景颜色
    backgroundColor: string;
}

export function CourseScheduleTable(props: Props) {
    const {courseScheduleData, courseScheduleStyle} = useContext(CourseScheduleContext)!;
    const {theme} = useUserTheme();
    const [courseSchedule, setCourseSchedule] = useState<CourseItem[][]>([[], [], [], [], [], [], []]);
    const startDay = moment(props.startDay);
    const [currentTime, setCurrentTime] = useState(moment().format());
    const currentWeek = props.currentWeek ?? Math.ceil(moment.duration(moment().diff(startDay)).asWeeks());
    const currentTimeSpan = getCurrentTimeSpan();

    function init() {
        parseCourses(props.courseList as CourseItem[]);
    }

    useEffect(() => {
        init();
        const id = setInterval(() => setCurrentTime(moment().format()), 1000);
        return () => {
            clearInterval(id);
        };
    }, [props]);

    useEffect(() => {
        randomCourseColor(props.courseList as CourseItem[]);
    }, [props.courseList]);

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

    const timeSpanHighLightTop = {
        top:
            courseScheduleData.style.weekdayHeight +
            (currentTimeSpan ?? 1) * courseScheduleData.style.timeSpanHeight +
            10,
    };

    return (
        <View style={courseScheduleStyle.courseSchedule}>
            {/*时间段高亮*/}
            {typeof currentTimeSpan === "number" && (
                <View style={[timeSpanHighLightTop, courseScheduleStyle.timeSpanHighLight]} />
            )}
            {/*时间表渲染*/}
            <View style={[courseScheduleStyle.timeSpanContainer, courseScheduleStyle.weekdayContainer]}>
                <View style={courseScheduleStyle.weekdayItem}>
                    <Text style={courseScheduleStyle.weekdayText}>
                        {moment(courseScheduleData.startDay).add(currentWeek, "w").month() + 1 + "月"}
                    </Text>
                </View>
                {courseScheduleData.timeSpanList.map((time, index) => {
                    return (
                        <Flex
                            inline
                            key={`timespan-${index}`}
                            style={courseScheduleStyle.timeSpanItem}
                            justifyContent="center">
                            <Text style={courseScheduleStyle.timeSpanText}>{`${index + 1}\n${time}`}</Text>
                        </Flex>
                    );
                })}
            </View>
            {/*课表*/}
            {courseScheduleData.weekdayList.map((weekday, index) => {
                // 判断是否为当天
                const currentDay = moment(courseScheduleData.startDay).add({
                    week: currentWeek - 1,
                    day: index,
                });
                const itemStyle = StyleSheet.create({
                    activeContainer: {
                        ...courseScheduleStyle.weekdayContainer,
                        backgroundColor: Color(theme.colors.primary).setAlpha(0.2).rgbaString,
                    },
                    activeText: {
                        ...courseScheduleStyle.weekdayText,
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
                    <View style={weekdayContainerStyle} key={`day${index}`}>
                        <View style={courseScheduleStyle.weekdayItem}>
                            <Text style={weekdayTextStyle}>
                                {`${weekday}\n${currentDay.month() + 1}-${currentDay.date()}`}
                            </Text>
                        </View>
                        {courseSchedule[index].map((course, i) => (
                            <CourseItem
                                onCoursePress={props.onCoursePress}
                                key={`day${index}-${course.kcmc}-${course.jc}-${Math.random()}`}
                                course={course}
                                index={i}
                            />
                        ))}
                    </View>
                );
            })}
        </View>
    );
}
