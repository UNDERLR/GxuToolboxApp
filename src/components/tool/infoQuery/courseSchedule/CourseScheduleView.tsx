import React, {ReactNode, useContext, useMemo, useState} from "react";
import {StyleSheet, View} from "react-native";
import Flex from "@/components/un-ui/Flex.tsx";
import {BottomSheet, Text, useTheme} from "@rneui/themed";
import {
    CourseScheduleTable,
    CourseScheduleTableProps,
} from "@/components/tool/infoQuery/courseSchedule/CourseScheduleTable.tsx";
import {usePagerView} from "react-native-pager-view";
import moment from "moment/moment";
import {Course} from "@/type/infoQuery/course/course.ts";
import {CourseDetail} from "@/components/tool/infoQuery/courseSchedule/CourseDetail.tsx";
import {CourseScheduleQueryRes} from "@/type/api/infoQuery/classScheduleAPI.ts";
import {UserConfigContext} from "@/components/AppProvider.tsx";
import {Color} from "@/js/color.ts";
import {CourseScheduleContext} from "@/js/jw/course.ts";

export interface CourseScheduleViewProps<T> extends Omit<CourseScheduleTableProps<T>, "courseList"> {
    /** 横向滚动使用的PageView对象 */
    pageView: ReturnType<typeof usePagerView>;
    /** 进行解析的课表返回体 */
    courseApiRes?: CourseScheduleQueryRes;
    /** 计算下一节课的回调 */
    onNextCourseCalculated?: (course?: Course) => void;

    /** 是否显示下一节课 */
    showNextCourse?: boolean;

    /** 自定义元素详情渲染函数 */
    itemDetailRender?: (item: T) => ReactNode;
}

export function CourseScheduleView<T = any>(props: CourseScheduleViewProps<T>) {
    const {userConfig} = useContext(UserConfigContext);
    const {theme} = useTheme();
    const {AnimatedPagerView, ref, ...rest} = props.pageView;
    const startDay = props.startDay ?? userConfig.jw.startDay;
    const realCurrentWeek = Math.ceil(moment.duration(moment().diff(startDay)).asWeeks());
    const {courseScheduleData, courseScheduleStyle} = useContext(CourseScheduleContext)!;

    const [courseDetailVisible, setCourseDetailVisible] = useState(false);
    const [activeCourse, setActiveCourse] = useState<Course>({} as Course);

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
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderColor: Color.mix(theme.colors.primary, theme.colors.background, 0.8).rgbaString,
            borderWidth: 1,
            padding: "2.5%",
        },
        nextCourse: {
            textAlign: "center",
            borderColor: Color.mix(theme.colors.primary, theme.colors.background, 0.6).rgbaString,
            borderWidth: 1,
            borderRadius: 15,
            paddingVertical: "2%",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "3%",
            paddingHorizontal: "8%",
        },
    });

    function showCourseDetail(course: Course) {
        setActiveCourse(course);
        setCourseDetailVisible(true);
        props.onCoursePress?.(course);
    }

    const [itemDetailVisible, setItemDetailVisible] = useState(false);
    const [activeItem, setActiveItem] = useState<T>({} as T);

    function showItemDetail(item: T) {
        setActiveItem(item);
        setItemDetailVisible(true);
        props.onItemPress?.(item);
    }

    const isCurrentTerm = moment().isBetween(
        userConfig.jw.startDay,
        moment(userConfig.jw.startDay).add(20, "w"),
        "d",
        "[]",
    );

    // 计算下一节课
    const nextCourse = useMemo(() => {
        const allCourses = props.courseApiRes?.kbList ?? [];
        if (!allCourses || allCourses.length === 0) {
            return;
        }

        const now = moment();
        const futureCourses: {course: Course; time: moment.Moment}[] = [];
        const startTimes = courseScheduleData.timeSpanList.map(span => span.split("\n")[0]);

        allCourses.forEach(course => {
            const weekSpans = course.zcd.split(",");
            const dayOfWeek = parseInt(course.xqj, 10);
            const startSection = parseInt(course.jcs.split("-")[0], 10) - 1;
            const courseTime = startTimes[startSection];

            if (!courseTime) {
                return;
            }

            const [hour, minute] = courseTime.split(":").map(Number);

            weekSpans.forEach(weekSpan => {
                const weeks = weekSpan.replace("周", "").split("-").map(Number);
                const startWeek = weeks[0];
                const endWeek = weeks.length > 1 ? weeks[1] : startWeek;

                for (let week = startWeek; week <= endWeek; week++) {
                    const courseDate = moment(userConfig.jw.startDay)
                        .add(week - 1, "weeks")
                        .day(dayOfWeek)
                        .hour(hour)
                        .minute(minute)
                        .second(0);

                    if (courseDate.isAfter(now)) {
                        futureCourses.push({course: course, time: courseDate});
                    }
                }
            });
        });

        if (futureCourses.length === 0) {
            return;
        }
        futureCourses.sort((a, b) => a.time.diff(b.time));
        props.onNextCourseCalculated?.(futureCourses[0]?.course);
        return futureCourses[0]?.course;
    }, [props.courseApiRes?.kbList, courseScheduleData.timeSpanList, userConfig.jw.startDay]);

    return (
        <View style={{width: "100%"}}>
            {nextCourse && props.showNextCourse && (
                <View style={style.nextCourse}>
                    <Text style={{fontSize: 13}}>
                        下一节：{nextCourse.kcmc} #{nextCourse.cdmc}
                    </Text>
                </View>
            )}
            <AnimatedPagerView
                testID="course-schedule-tabel-pager-view"
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
                                <Flex inline justify="center" gap={5}>
                                    {props.showDate && (
                                        <Text>
                                            {moment().isBefore(userConfig.jw.startDay) && "当前学期未开始"}
                                            {moment().isAfter(moment(userConfig.jw.startDay).add(20, "w")) &&
                                                "当前学期已结束"}
                                            {isCurrentTerm &&
                                                (index + 1 === realCurrentWeek
                                                    ? `（第${index + 1}周）`
                                                    : `（第${index + 1}周，目前为第${realCurrentWeek}周）`)}
                                            {!isCurrentTerm && `（第${index + 1}周）`}
                                        </Text>
                                    )}
                                    <Text>点击元素查看详情</Text>
                                </Flex>
                                <CourseScheduleTable<T>
                                    {...props}
                                    courseList={props.courseApiRes?.kbList}
                                    onCoursePress={showCourseDetail}
                                    currentWeek={index + 1}
                                    onItemPress={showItemDetail}
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
            {/* 自定义元素详情 */}
            <BottomSheet isVisible={itemDetailVisible} onBackdropPress={() => setItemDetailVisible(false)}>
                <View style={style.bottomSheetContainer}>{props.itemDetailRender?.(activeItem)}</View>
            </BottomSheet>
        </View>
    );
}
