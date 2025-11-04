import React, {useContext, useMemo} from "react";
import {Pressable, StyleSheet, ViewStyle} from "react-native";
import {Color} from "@/js/color.ts";
import Flex from "@/components/un-ui/Flex.tsx";
import {Text, useTheme} from "@rneui/themed";
import {Icon} from "@/components/un-ui/Icon.tsx";
import {CourseScheduleContext} from "@/js/jw/course.ts";
import {UserConfigContext} from "@/components/AppProvider.tsx";
import {AttendanceSystemType as AST} from "@/type/api/auth/attendanceSystem.ts";
import {AttendanceCourseClass} from "@/class/auth/attendanceSystem.ts";

interface Props {
    style?: ViewStyle;
    course: AttendanceCourseClass;
    onCoursePress?: (course: AttendanceCourseClass) => void;
}

export function AttendanceCourseItem(props: Props) {
    const {userConfig} = useContext(UserConfigContext);
    const {courseScheduleData, courseScheduleStyle} = useContext(CourseScheduleContext)!;
    const {theme} = useTheme();
    const ColorMap = {
        [2]: theme.colors.success,
        [1]: theme.colors.warning,
        [AST.AttendanceState.Absent]: theme.colors.error,
        [AST.AttendanceState.NotStarted]: theme.colors.primary,
    };
    const {course} = props;
    const span = course.periodArry!.reduceRight((pv, cv) => pv - cv) + 1;
    const y = course.periodArry![0];
    const itemStyle = useMemo(() => {
        return StyleSheet.create({
            course: {
                height: span * userConfig.theme.course.timeSpanHeight - userConfig.theme.course.courseItemMargin * 2,
                position: "absolute",
                backgroundColor: Color(
                    theme.colors.primary,
                ).setAlpha(theme.mode === "light" ? 0.3 : 0.1).rgbaString,
                top:
                    userConfig.theme.course.weekdayHeight +
                    y * userConfig.theme.course.timeSpanHeight +
                    userConfig.theme.course.courseItemMargin,
            },
            text: {
                textAlign: "center",
                color: Color.mix(
                    theme.colors.primary,
                    theme.colors.black,
                    0.5,
                ).rgbaString,
            },
        });
    }, [
        userConfig.theme.course.courseItemMargin,
        userConfig.theme.course.timeSpanHeight,
        userConfig.theme.course.weekdayHeight,
        span,
        theme.colors.grey4,
        theme.mode,
        y,
    ]);
    return (
        // 课程元素
        <Pressable
            onPress={e => {
                props.onCoursePress?.(course);
            }}
            android_ripple={userConfig.theme.ripple}
            style={[props.style, itemStyle.course, courseScheduleStyle.courseItem]}>
            <Flex direction="column" gap={5}>
                {courseScheduleData.courseInfoVisible.name && (
                    <Text style={[itemStyle.text, {fontWeight: 700}]}>
                        {/*<AttendanceStateIcon*/}
                        {/*    defaultColor={itemStyle.text.color}*/}
                        {/*    state={props.course.courseState ?? AST.AttendanceState.NotStarted}*/}
                        {/*/>*/}
                        {course.subjectName}
                    </Text>
                )}
                {courseScheduleData.courseInfoVisible.position && (
                    <Text style={itemStyle.text}>
                        <Icon name="map-marker" style={itemStyle.text} />
                        {"\n" + course.roomName!.replace("-", "\n")}
                    </Text>
                )}
                {courseScheduleData.courseInfoVisible.teacher && (
                    <Text style={itemStyle.text} ellipsizeMode="tail" numberOfLines={5}>
                        <Icon name="account" style={itemStyle.text} />
                        {"\n" + course.teacherName}
                    </Text>
                )}
            </Flex>
        </Pressable>
    );
}

export interface AttendanceStateIconProps {
    state: AST.AttendanceState;
    defaultColor: string;
}
export function AttendanceStateIcon(props: AttendanceStateIconProps) {
    const {theme} = useTheme();
    const iconMap: Record<AST.AttendanceState, React.ReactElement> = {
        [2]: <Icon name="check-circle" color={theme.colors.success} />,
        [1]: <Icon name="clock" color={theme.colors.warning} />,
        [AST.AttendanceState.Absent]: <Icon name="close-circle" color={theme.colors.error} />,
        [AST.AttendanceState.NotStarted]: <Icon name="circle-outline" color={props.defaultColor} />,
    };
    return iconMap[props.state];
}
