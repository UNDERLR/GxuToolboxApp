import {useEffect, useState} from "react";
import {ScrollView, StyleProp, StyleSheet, Text, TextStyle, ToastAndroid, View, ViewStyle} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {Button, Divider} from "@rneui/themed";
import {Course, PracticalCourse} from "../type/course.ts";
import {infoQuery} from "../js/jw/infoQuery.ts";
import {BaseColor, Color} from "../js/color.ts";
import {CourseScheduleQueryRes} from "../type/api/classScheduleAPI.ts";
import AntDesign from "react-native-vector-icons/AntDesign.js";
import FontAwesome from "react-native-vector-icons/FontAwesome.js";
import Flex from "../components/un-ui/Flex.tsx";
import moment from "moment";
import {store} from "../js/store.ts";

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
        new Color(BaseColor.pink),
        new Color(BaseColor.lightgreen),
        new Color(BaseColor.skyblue),
        new Color(BaseColor.orange),
        new Color(BaseColor.tan),
        new Color(BaseColor.sandybrown),
        new Color(BaseColor.navy),
        new Color(BaseColor.maroon),
        new Color(BaseColor.mediumspringgreen),
        new Color(BaseColor.slateblue),
        new Color(BaseColor.yellowgreen),
        new Color(BaseColor.red),
        new Color(BaseColor.yellow),
        new Color(BaseColor.gold),
        new Color(BaseColor.lightskyblue),
        new Color(BaseColor.lightsteelblue),
        new Color(BaseColor.limegreen),
        new Color(BaseColor.mediumaquamarine),
        new Color(BaseColor.mediumblue),
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
    const [apiRes, setApiRes] = useState<CourseScheduleQueryRes>();
    const [courseSchedule, setCourseSchedule] = useState<CourseItem[][]>([[], [], [], [], [], [], []]);
    const startDay = moment(staticData.startDay);
    const [currentWeek, setCurrentWeek] = useState<number>(
        Math.ceil(moment.duration(moment().diff(startDay)).asWeeks()),
    );

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
                course.backgroundColor = courseColor[course.kcmc] =
                    staticData.randomColor[randomNum].setAlpha(0.2).rgbaString;
            } else {
                course.backgroundColor = courseColor[course.kcmc];
            }
        });
    }

    return (
        <View>
            <ScrollView>
                <Button onPress={getCourseSchedule}>刷新课表</Button>
                <Button touchSoundDisabled onPress={() => navigation.navigate("login")}>
                    设置教务账密
                </Button>
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
                                color: undefined,
                            },
                        });
                        const weekdayContainerStyle: StyleProp<ViewStyle> = [style.weekdayContainer];
                        const weekdayTextStyle: StyleProp<TextStyle> = [style.weekdayText];
                        if (currentDay.isSame(moment(), "day")) {
                            weekdayContainerStyle[0] = itemStyle.activeContainer;
                            weekdayTextStyle[0] = itemStyle.activeText;
                        }
                        return (
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
                                            backgroundColor: course.backgroundColor,
                                            top:
                                                staticData.style.weekdayHeight +
                                                y * staticData.style.timeSpanHeight +
                                                staticData.style.courseItemMargin / 2,
                                        },
                                        text: {
                                            textAlign: "center",
                                        },
                                    });
                                    return (
                                        <View style={[itemStyle.course, style.courseItem]}>
                                            <Text style={itemStyle.text}>{course.kcmc}</Text>
                                            <Text style={itemStyle.text}>
                                                <FontAwesome name="map-marker" />
                                                {"\n" + course.cdmc.replace("-", "\n")}
                                            </Text>
                                            <Text style={itemStyle.text}>
                                                <AntDesign name="user" />
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
                    <Text style={{textAlign: "center"}}>其他课程</Text>
                    {apiRes?.sjkList.map((course: PracticalCourseItem) => {
                        const itemStyle = StyleSheet.create({
                            course: {
                                backgroundColor: course.backgroundColor,
                            },
                        });
                        return (
                            <View style={[itemStyle.course, style.courseItem, style.practicalCourseItem]}>
                                <Text>{course.qtkcgs}</Text>
                                <Flex gap={5}>
                                    <AntDesign name="clockcircleo" />
                                    <Text>{course.qsjsz}</Text>
                                </Flex>
                                <Flex gap={5}>
                                    <AntDesign name="user" />
                                    <Text>{course.jsxm}</Text>
                                </Flex>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create({
    courseSchedule: {
        flex: 1,
        flexDirection: "row",
    },
    weekdayContainer: {
        flex: 1,
        justifyContent: "flex-start",
    },
    weekdayItem: {
        alignItems: "center",
        justifyContent: "center",
        height: staticData.style.weekdayHeight,
    },
    weekdayText: {
        fontSize: 14,
        textAlign: "center",
        color: "#666666",
    },
    timeSpan: {
        textAlign: "center",
        height: staticData.style.timeSpanHeight,
    },
    courseItem: {
        overflow: "hidden",
        width: "96%",
        borderRadius: 5,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: new Color(BaseColor.lightgrey).setAlpha(0.5).rgbaString,
        padding: 5,
    },
    practicalCourseItem: {
        gap: 3,
        marginHorizontal: "2%",
        marginVertical: 10,
    },
});
