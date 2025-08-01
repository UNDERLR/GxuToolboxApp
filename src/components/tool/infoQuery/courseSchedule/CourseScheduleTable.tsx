import {Course} from "@/type/infoQuery/course/course.ts";
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from "react-native";
import moment from "moment/moment";
import {Color} from "@/js/color.ts";
import {Text, useTheme} from "@rneui/themed";
import {useContext, useEffect, useState} from "react";
import Flex from "@/components/un-ui/Flex.tsx";
import {CourseItem} from "@/components/tool/infoQuery/courseSchedule/CourseItem.tsx";
import {CourseScheduleContext} from "@/js/jw/course.ts";
import {ExamInfo} from "@/type/infoQuery/exam/examInfo.ts";
import {CourseScheduleExamItem} from "@/components/tool/infoQuery/examInfo/CourseScheduleExamItem.tsx";
import {UserConfigContext} from "@/components/AppProvider.tsx";

interface Props {
    courseList: Course[];
    currentWeek?: number;
    onCoursePress?: (course: Course) => void;
    startDay: moment.MomentInput;
    showDate?: boolean;
    // 非课程类型
    examList?: ExamInfo[];
    onExamPress?: (examInfo: ExamInfo) => void;
}

interface CourseItem extends Course {
    // 在课程表中显示的背景颜色
    backgroundColor: string;
}

export function CourseScheduleTable(props: Props) {
    const {userConfig} = useContext(UserConfigContext);
    const {courseScheduleData, courseScheduleStyle} = useContext(CourseScheduleContext)!;
    const {theme} = useTheme();
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
            userConfig.theme.course.weekdayHeight +
            (currentTimeSpan ?? 1) * userConfig.theme.course.timeSpanHeight +
            10,
    };

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
            {typeof currentTimeSpan === "number" && (
                <View style={[timeSpanHighLightTop, courseScheduleStyle.timeSpanHighLight]} />
            )}
            {/*时间表渲染*/}
            <View style={[courseScheduleStyle.timeSpanContainer, courseScheduleStyle.weekdayContainer]}>
                <View style={courseScheduleStyle.weekdayItem}>
                    <Text style={courseScheduleStyle.weekdayText}>
                        {props.showDate
                            ? moment(courseScheduleData.startDay).add(currentWeek, "w").month() + 1 + "月"
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
                              justifyContent="center">
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
                              justifyContent="center">
                              <Text style={courseScheduleStyle.timeSpanText}>{`${value[0]}\n${value[1]}`}</Text>
                          </Flex>
                      ))}
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
                const currentDayExamList = (props.examList ?? []).filter(examInfo =>
                    moment(examInfo.kssj.replace(/\(.*?\)/, "")).isSame(currentDay, "d"),
                );
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
                                onCoursePress={props.onCoursePress}
                                key={`day${index}-${course.kcmc}-${course.jc}-${course.jxb_id}`}
                                course={course}
                                index={i}
                            />
                        ))}

                        {/*课表其他元素*/}
                        {currentDayExamList.map(examInfo => (
                            <CourseScheduleExamItem
                                key={`day${index}-${examInfo.ksmc}-${examInfo.kcmc}`}
                                examInfo={examInfo}
                                onPress={props.onExamPress}
                            />
                        ))}
                    </View>
                );
            })}
        </View>
    );
}
