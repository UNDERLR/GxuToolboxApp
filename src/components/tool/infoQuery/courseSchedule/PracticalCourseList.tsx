import {PracticalCourse, useCourseScheduleStyle} from "../../../../type/infoQuery/course/course.ts";
import {StyleSheet, View} from "react-native";
import {BaseColor, color, Color} from "../../../../js/color.ts";
import Flex from "../../../un-ui/Flex.tsx";
import {Icon} from "../../../un-ui/Icon.tsx";
import {Text, useTheme} from "@rneui/themed";
import {useEffect, useState} from "react";

interface Props {
    courseList: PracticalCourse[];
}

interface PracticalCourseItem extends PracticalCourse {
    // 在课程表中显示的背景颜色
    backgroundColor: string;
}

const staticData = {
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
};

export function PracticalCourseList(props: Props) {
    const {theme} = useTheme();
    const [courseList, setCourseList] = useState<PracticalCourseItem[]>([]);
    useEffect(() => {
        randomCourseColor(props.courseList as PracticalCourseItem[]);
        setCourseList(props.courseList as PracticalCourseItem[]);
    }, [props.courseList]);

    const {courseScheduleStyle} = useCourseScheduleStyle();

    function randomCourseColor(courseList: PracticalCourseItem[]) {
        //使得相同课程的颜色相同
        const courseColor: Record<string, string> = {};
        courseList.forEach((course: PracticalCourseItem) => {
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
            <Text style={{textAlign: "center"}}>其他课程</Text>
            {courseList.map((course: PracticalCourseItem) => {
                const itemStyle = StyleSheet.create({
                    course: {
                        backgroundColor: Color(course.backgroundColor).setAlpha(theme.mode === "light" ? 0.3 : 0.1)
                            .rgbaString,
                        borderColor: Color.mix(Color(course.backgroundColor), Color(theme.colors.grey4), 0.8)
                            .rgbaString,
                    },
                });
                return (
                    <View
                        key={course.kcmc}
                        style={[
                            itemStyle.course,
                            courseScheduleStyle.courseItem,
                            courseScheduleStyle.practicalCourseItem,
                        ]}>
                        <Text>{course.qtkcgs}</Text>
                        <Flex gap={5}>
                            <Icon name="clockcircleo" />
                            <Text>{course.qsjsz}</Text>
                        </Flex>
                        <Flex gap={5}>
                            <Icon name="user" />
                            <Text>{course.jsxm}</Text>
                        </Flex>
                    </View>
                );
            })}
        </View>
    );
}
