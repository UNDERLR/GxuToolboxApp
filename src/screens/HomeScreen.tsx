import {useEffect, useState} from "react";
import {ScrollView, StyleProp, StyleSheet, Text, TextStyle, ToastAndroid, View, ViewStyle} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {Button, Divider, useTheme} from "@rneui/themed";
import {Course, PracticalCourse} from "../type/course.ts";
import {infoQuery} from "../js/jw/infoQuery.ts";
import {BaseColor, color, Color} from "../js/color.ts";
import {CourseScheduleQueryRes} from "../type/api/classScheduleAPI.ts";
import Flex from "../components/un-ui/Flex.tsx";
import moment from "moment";
import {store} from "../js/store.ts";
import {UnIcon} from "../components/un-ui/UnIcon.tsx";

interface CourseItem extends Course {
    // 在课程表中显示的背景颜色
    backgroundColor: string;
}

interface PracticalCourseItem extends PracticalCourse {
    // 在课程表中显示的背景颜色
    backgroundColor: string;
}

const staticData = {
    style: {
        timeSpanHeight: 80,
        weekdayHeight: 60,
        courseItemMargin: 4,
    },
    startDay: "2025-02-24",
    randomColor: [
        BaseColor.pink,
        BaseColor.lightgreen,
        BaseColor.skyblue,
        BaseColor.orange,
        BaseColor.tan,
        BaseColor.sandybrown,
        BaseColor.navy,
        BaseColor.maroon,
        BaseColor.mediumspringgreen,
        BaseColor.slateblue,
        BaseColor.yellowgreen,
        BaseColor.red,
        BaseColor.yellow,
        BaseColor.gold,
        BaseColor.lightskyblue,
        BaseColor.lightsteelblue,
        BaseColor.limegreen,
        BaseColor.mediumaquamarine,
        BaseColor.mediumblue,
    ],
    weekdayList: ["一", "二", "三", "四", "五", "六", "日"],
    timeSpanList: [
        "08:00\n08:45",
        "08:55\n09:40",
        "10:00\n10:45",
        "10:55\n11:40",
        "14:30\n15:15",
        "15:25\n16:10",
        "16:20\n17:05",
        "17:15\n18:00",
        "18:10\n18:55",
        "18:45\n19:30",
        "19:40\n20:25",
        "20:30\n21:15",
        "21:20\n22:05",
    ],
};

export function HomeScreen() {
    const navigation = useNavigation();
    const {theme} = useTheme();
    const [apiRes, setApiRes] = useState<CourseScheduleQueryRes>();
    const [courseSchedule, setCourseSchedule] = useState<CourseItem[][]>([[], [], [], [], [], [], []]);
    const startDay = moment(staticData.startDay);
    const [currentWeek, setCurrentWeek] = useState<number>(
        Math.ceil(moment.duration(moment().diff(startDay)).asWeeks()),
    );

    const style = StyleSheet.create({
        courseSchedule: {
            flex: 1,
            flexDirection: "row",
        },
        weekdayContainer: {
            flex: 1,
            justifyContent: "flex-start",
            borderRadius: 5,
            marginVertical: 10,
        },
        weekdayItem: {
            alignItems: "center",
            justifyContent: "center",
            height: staticData.style.weekdayHeight,
        },
        weekdayText: {
            fontSize: 14,
            textAlign: "center",
            color: theme.colors.grey2,
        },
        timeSpan: {
            textAlign: "center",
            color: theme.colors.grey2,
            height: staticData.style.timeSpanHeight,
        },
        courseItem: {
            overflow: "hidden",
            width: "96%",
            borderRadius: 5,
            borderWidth: 2,
            borderStyle: "solid",
            padding: 5,
        },
        practicalCourseItem: {
            gap: 3,
            marginHorizontal: "2%",
            marginVertical: 10,
        },
        practicalCourseText: {
            color: theme.colors.black,
        },
    });

    function getCourseSchedule() {
        infoQuery
            .getCourseSchedule()
            .then(data => {
                ToastAndroid.show("刷新课表成功", ToastAndroid.SHORT);
                setApiRes(data);
                randomCourseColor(data.kbList as CourseItem[]);
                randomCourseColor(data.sjkList as PracticalCourseItem[]);
                parseCourses(data.kbList as CourseItem[]);
                store.save({key: "courseRes", data});
            })
            .catch(res => {
                ToastAndroid.show(`刷新课表失败，错误码：${res.status}`, ToastAndroid.SHORT);
            });
    }

    function init() {
        store.load({key: "courseRes"}).then((data: CourseScheduleQueryRes) => {
            setApiRes(data);
            randomCourseColor(data.kbList as CourseItem[]);
            randomCourseColor(data.sjkList as PracticalCourseItem[]);
            parseCourses(data.kbList as CourseItem[]);
        });
    }

    useEffect(() => {
        init();
        getCourseSchedule();
    }, []);

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
                let randomNum = Math.floor(Math.random() * staticData.randomColor.length);
                course.backgroundColor = courseColor[course.kcmc] = staticData.randomColor[randomNum];
            } else {
                course.backgroundColor = courseColor[course.kcmc];
            }
        });
    }

    return (
        <View>
            <ScrollView>
                <Button onPress={getCourseSchedule}>刷新课表</Button>
                {/* Course Schedule */}
                <View style={style.courseSchedule}>
                    <View style={style.weekdayContainer}>
                        <View style={style.weekdayItem}>
                            <Text style={style.weekdayText}>
                                {moment(staticData.startDay).add(currentWeek, "w").month() + 1 + "月"}
                            </Text>
                        </View>
                        {staticData.timeSpanList.map((time, index) => {
                            return (
                                <View>
                                    <Text style={style.timeSpan}>{`${index + 1}\n${time}`}</Text>
                                </View>
                            );
                        })}
                    </View>
                    {staticData.weekdayList.map((weekday, index) => {
                        // 判断是否为当天
                        const currentDay = moment(staticData.startDay).add({
                            week: currentWeek - 1,
                            day: index,
                        });
                        const itemStyle = StyleSheet.create({
                            activeContainer: {
                                ...style.weekdayContainer,
                                backgroundColor: new Color(BaseColor.skyblue).setAlpha(0.2).rgbaString,
                            },
                            activeText: {
                                ...style.weekdayText,
                                color: theme.colors.black,
                            },
                        });
                        const weekdayContainerStyle: StyleProp<ViewStyle> = [style.weekdayContainer];
                        const weekdayTextStyle: StyleProp<TextStyle> = [style.weekdayText];
                        if (currentDay.isSame(moment(), "day")) {
                            weekdayContainerStyle[0] = itemStyle.activeContainer;
                            weekdayTextStyle[0] = itemStyle.activeText;
                        }
                        return (
                            // 当日课程渲染
                            <View style={weekdayContainerStyle}>
                                <View style={style.weekdayItem}>
                                    <Text style={weekdayTextStyle}>
                                        {`${weekday}\n${currentDay.month() + 1}-${currentDay.date()}`}
                                    </Text>
                                </View>
                                {courseSchedule[index].map(course => {
                                    const span =
                                        parseInt(course.jcs.split("-")[1], 10) -
                                        parseInt(course.jcs.split("-")[0], 10) +
                                        1;
                                    const y = +course.jcs.split("-")[0] - 1;
                                    const itemStyle = StyleSheet.create({
                                        course: {
                                            height:
                                                span * staticData.style.timeSpanHeight -
                                                staticData.style.courseItemMargin,
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
                                                staticData.style.weekdayHeight +
                                                y * staticData.style.timeSpanHeight +
                                                staticData.style.courseItemMargin / 2,
                                        },
                                        text: {
                                            textAlign: "center",
                                            color: theme.colors.black,
                                        },
                                    });
                                    return (
                                        <View style={[itemStyle.course, style.courseItem]}>
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
                {/* Other Courses */}
                <Divider />
                <View>
                    <Text style={{textAlign: "center", color: theme.colors.black}}>其他课程</Text>
                    {apiRes?.sjkList &&
                        apiRes?.sjkList.map((course: PracticalCourseItem) => {
                            const itemStyle = StyleSheet.create({
                                course: {
                                    backgroundColor: new Color(course.backgroundColor).setAlpha(
                                        theme.mode === "light" ? 0.3 : 0.1,
                                    ).rgbaString,
                                    borderColor: color.mix(
                                        new Color(course.backgroundColor),
                                        new Color(theme.colors.grey4),
                                        0.8,
                                    ).rgbaString,
                                },
                            });
                            return (
                                <View style={[itemStyle.course, style.courseItem, style.practicalCourseItem]}>
                                    <Text style={style.practicalCourseText}>{course.qtkcgs}</Text>
                                    <Flex gap={5}>
                                        <UnIcon name="clockcircleo" />
                                        <Text style={style.practicalCourseText}>{course.qsjsz}</Text>
                                    </Flex>
                                    <Flex gap={5}>
                                        <UnIcon name="user" />
                                        <Text style={style.practicalCourseText}>{course.jsxm}</Text>
                                    </Flex>
                                </View>
                            );
                        })}
                </View>
            </ScrollView>
        </View>
    );
}
