import React, {useContext, useMemo, useState} from "react";
import {StyleSheet, View} from "react-native";
import Flex from "@/components/un-ui/Flex.tsx";
import {BottomSheet, Text} from "@rneui/themed";
import {CourseScheduleTable} from "@/components/tool/infoQuery/courseSchedule/CourseScheduleTable.tsx";
import {usePagerView} from "react-native-pager-view";
import {Color} from "@/js/color.ts";
import {CourseScheduleContext} from "@/js/jw/course.ts";
import {useUserTheme} from "@/js/theme.ts";
import moment from "moment/moment";
import {Course} from "@/type/infoQuery/course/course.ts";
import {CourseDetail} from "@/components/tool/infoQuery/courseSchedule/CourseDetail.tsx";
import {CourseScheduleQueryRes} from "@/type/api/infoQuery/classScheduleAPI.ts";

interface Props {
    startDay: moment.MomentInput;
    onCoursePress?: (course: Course) => void;
    pageView: ReturnType<typeof usePagerView>;
    courseApiRes?: CourseScheduleQueryRes;
}

export function CourseScheduleView(props: Props) {
    const {theme, userTheme} = useUserTheme();
    const {courseScheduleData, courseScheduleStyle} = useContext(CourseScheduleContext)!;
    const {AnimatedPagerView, ref, ...rest} = props.pageView;
    const realCurrentWeek = Math.ceil(moment.duration(moment().diff(props.startDay)).asWeeks());

    const [courseDetailVisible, setCourseDetailVisible] = useState(false);
    const [activeCourse, setActiveCourse] = useState<Course>({} as Course);

    const style = StyleSheet.create({
        card: {
            backgroundColor: Color(theme.colors.background).setAlpha(
                0.05 + ((theme.mode === "dark" ? 0.6 : 0.7) * userTheme.bgOpacity) / 100,
            ).rgbaString,
            borderRadius: 5,
            paddingHorizontal: 0,
            marginHorizontal: 5,
        },
        cardTitle: {
            paddingHorizontal: 15,
        },
        pagerView: {
            width: "100%",
            height: courseScheduleData.style.timeSpanHeight * 13 + courseScheduleData.style.weekdayHeight + 50,
        },
        bottomSheetContainer: {
            backgroundColor: theme.colors.background,
            padding: "5%",
        },
    });

    function showCourseDetail(course: Course) {
        setActiveCourse(course);
        setCourseDetailVisible(true);
        props.onCoursePress?.(course);
    }

    return (
        <View>
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
                                <Flex inline>
                                    {index + 1 === realCurrentWeek ? (
                                        <Text>（第{index + 1}周）</Text>
                                    ) : (
                                        <Text>
                                            （第{index + 1}周，目前为第{realCurrentWeek}周）
                                        </Text>
                                    )}
                                    <Text>点击课程查看详情</Text>
                                </Flex>
                                <CourseScheduleTable
                                    onCoursePress={showCourseDetail}
                                    courseList={props.courseApiRes?.kbList ?? []}
                                    currentWeek={index + 1}
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
        </View>
    );
}
