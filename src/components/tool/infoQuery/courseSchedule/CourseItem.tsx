import React, {useContext, useEffect, useMemo} from "react";
import {Pressable, StyleSheet} from "react-native";
import {Color} from "@/js/color.ts";
import Flex from "@/components/un-ui/Flex.tsx";
import {Text} from "@rneui/themed";
import {Icon} from "@/components/un-ui/Icon.tsx";
import {Course} from "@/type/infoQuery/course/course.ts";
import {useUserTheme} from "@/js/theme.ts";
import {CourseScheduleContext} from "@/js/jw/course.ts";

interface CourseItem extends Course {
    // 在课程表中显示的背景颜色
    backgroundColor: string;
}

interface Props {
    course: CourseItem;
    index: number;
    onCoursePress?: (course: CourseItem) => void;
}

export function CourseItem(props: Props) {
    const {courseScheduleData, courseScheduleStyle} = useContext(CourseScheduleContext)!;
    const {theme} = useUserTheme();
    const {course, index} = props;
    const span = parseInt(course.jcs.split("-")[1], 10) - parseInt(course.jcs.split("-")[0], 10) + 1;
    const y = +course.jcs.split("-")[0] - 1;
    const itemStyle = useMemo(() => {
        return StyleSheet.create({
            course: {
                height: span * courseScheduleData.style.timeSpanHeight - courseScheduleData.style.courseItemMargin * 2,
                position: "absolute",
                backgroundColor: Color(course.backgroundColor).setAlpha(theme.mode === "light" ? 0.3 : 0.1).rgbaString,
                borderColor: Color.mix(Color(course.backgroundColor), Color(theme.colors.grey4), 0.7).rgbaString,
                top:
                    courseScheduleData.style.weekdayHeight +
                    y * courseScheduleData.style.timeSpanHeight +
                    courseScheduleData.style.courseItemMargin,
            },
            text: {
                textAlign: "center",
            },
        });
    }, [
        course.backgroundColor,
        courseScheduleData.style.courseItemMargin,
        courseScheduleData.style.timeSpanHeight,
        courseScheduleData.style.weekdayHeight,
        span,
        theme.colors.grey4,
        theme.mode,
        y,
    ]);
    useEffect(() => {
    }, [courseScheduleData]);
    return (
        // 课程元素
        <Pressable
            onPress={e => props.onCoursePress?.(course)}
            style={[itemStyle.course, courseScheduleStyle.courseItem]}>
            <Flex direction="column" gap={5}>
                {courseScheduleData.courseInfoVisible.name && <Text style={itemStyle.text}>{course.kcmc}</Text>}
                {courseScheduleData.courseInfoVisible.position && (
                    <Text style={itemStyle.text}>
                        <Icon type="fontawesome" name="map-marker" />
                        {"\n" + course.cdmc.replace("-", "\n")}
                    </Text>
                )}
                {courseScheduleData.courseInfoVisible.teacher && (
                    <Text style={itemStyle.text} ellipsizeMode="tail" numberOfLines={5}>
                        <Icon name="user" />
                        {"\n" + course.xm}
                    </Text>
                )}
            </Flex>
        </Pressable>
    );
}
