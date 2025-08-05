import React, {useContext, useMemo, useState} from "react";
import {StyleSheet, View} from "react-native";
import Flex from "@/components/un-ui/Flex.tsx";
import {BottomSheet, useTheme, Text} from "@rneui/themed";
import {CourseScheduleTable} from "@/components/tool/infoQuery/courseSchedule/CourseScheduleTable.tsx";
import {usePagerView} from "react-native-pager-view";
import moment from "moment/moment";
import {Course} from "@/type/infoQuery/course/course.ts";
import {CourseDetail} from "@/components/tool/infoQuery/courseSchedule/CourseDetail.tsx";
import {CourseScheduleQueryRes} from "@/type/api/infoQuery/classScheduleAPI.ts";
import {ExamInfo} from "@/type/infoQuery/exam/examInfo.ts";
import {ExamDetail} from "@/components/tool/infoQuery/examInfo/ExamDetail.tsx";
import {UserConfigContext} from "@/components/AppProvider.tsx";
import {Color} from "@/js/color.ts";

interface Props {
    startDay: moment.MomentInput;
    onCoursePress?: (course: Course) => void;
    pageView: ReturnType<typeof usePagerView>;
    courseApiRes?: CourseScheduleQueryRes;
    showDate?: boolean;

    examList?: ExamInfo[];
    onExamPress?: (examInfo: ExamInfo) => void;
}

export function CourseScheduleView(props: Props) {
    const {userConfig} = useContext(UserConfigContext);
    const {theme} = useTheme();
    const {AnimatedPagerView, ref, ...rest} = props.pageView;
    const [startDay, setStartDay] = useState(props.startDay);
    const realCurrentWeek = Math.ceil(moment.duration(moment().diff(startDay)).asWeeks());

    const [courseDetailVisible, setCourseDetailVisible] = useState(false);
    const [activeCourse, setActiveCourse] = useState<Course>({} as Course);
    const [nextCourse, setNextCourse] = useState<Course | null>(null);

    const style = StyleSheet.create({
        pagerView: {
            width: "100%",
            height:
                userConfig.theme.course.timeSpanHeight * (userConfig.theme.course.timeSpanHeight <= 40 ? 14 : 13) +
                userConfig.theme.course.weekdayHeight +
                50,
        },
        bottomSheetContainer: {
            backgroundColor: theme.colors.background,
            borderRadius: 8,
            borderColor: Color.mix(theme.colors.primary, theme.colors.background, 0.8).rgbaString,
            borderWidth: 1,
            marginHorizontal: "4%",
            marginBottom: "5%",
            padding: "5%",
        },
    });

    function showCourseDetail(course: Course) {
        setActiveCourse(course);
        setCourseDetailVisible(true);
        props.onCoursePress?.(course);
    }

    const [examDetailVisible, setExamDetailVisible] = useState(false);
    const [activeExam, setActiveExam] = useState<ExamInfo>({} as ExamInfo);

    function showExamDetail(examInfo: ExamInfo) {
        setActiveExam(examInfo);
        setExamDetailVisible(true);
        props.onExamPress?.(examInfo);
    }

    const isAtThisTerm = moment().isBetween(
        userConfig.jw.startDay,
        moment(userConfig.jw.startDay).add(20, "w"),
        "d",
        "[]",
    );
    return (
        <View>
            {nextCourse && (
                <Text>
                    下一节课：{nextCourse.kcmc} @{nextCourse.cdmc}
                </Text>
            )}
            <AnimatedPagerView
                testID="pager-view"
                ref={ref}
                style={style.pagerView}
                initialPage={realCurrentWeek - 1}
                layoutDirection="ltr"
                overdrag={rest.overdragEnabled}
                scrollEnabled={rest.scrollEnabled}
                pageMargin={10}
                onPageSelected={rest.onPageSelected}
                onPageScrollStateChanged={rest.onPageScrollStateChanged}
                offscreenPageLimit={2}
                overScrollMode="never"
                orientation="horizontal">
                {useMemo(
                    () =>
                        rest.pages.map((_, index) => (
                            <View testID="pager-view-content" key={index} collapsable={false}>
                                {props.showDate && (
                                    <Flex inline justifyContent="center" gap={5}>
                                        <Text>
                                            {moment().isBefore(userConfig.jw.startDay) && "当前学期未开始"}
                                            {moment().isAfter(moment(userConfig.jw.startDay).add(20, "w")) &&
                                                "当前学期已结束"}
                                            {isAtThisTerm &&
                                                (index + 1 === realCurrentWeek
                                                    ? `（第${index + 1}周）`
                                                    : `（第${index + 1}周，目前为第${realCurrentWeek}周）`)}
                                            {!isAtThisTerm && `（第${index + 1}周）`}
                                        </Text>
                                        <Text>点击课程查看详情</Text>
                                    </Flex>
                                )}
                                <CourseScheduleTable
                                    showDate={props.showDate}
                                    startDay={startDay}
                                    onCoursePress={showCourseDetail}
                                    courseList={props.courseApiRes?.kbList ?? []}
                                    currentWeek={index + 1}
                                    examList={props.examList}
                                    onExamPress={showExamDetail}
                                    onNextCourseCalculated={setNextCourse}
                                />
                            </View>
                        )),
                    [rest.pages, realCurrentWeek, props.courseApiRes?.kbList],
                )}
            </AnimatedPagerView>
            {/* 课表课程信息 */}
            <BottomSheet isVisible={courseDetailVisible} onBackdropPress={() => setCourseDetailVisible(false)}>
                <View style={style.bottomSheetContainer}>
                    <CourseDetail course={activeCourse} />
                </View>
            </BottomSheet>
            {/* 考试信息 */}
            <BottomSheet isVisible={examDetailVisible} onBackdropPress={() => setExamDetailVisible(false)}>
                <View style={style.bottomSheetContainer}>
                    <ExamDetail examInfo={activeExam} />
                </View>
            </BottomSheet>
        </View>
    );
}
