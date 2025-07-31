import {BottomSheet, Card, Text, useTheme} from "@rneui/themed";
import {infoQuery} from "@/js/jw/infoQuery.ts";
import {Pressable, StyleSheet, ToastAndroid} from "react-native";
import {store} from "@/js/store.ts";
import {CourseScheduleQueryRes} from "@/type/api/infoQuery/classScheduleAPI.ts";
import {useContext, useEffect, useState} from "react";
import {PracticalCourseList} from "./PracticalCourseList.tsx";
import Flex from "@/components/un-ui/Flex.tsx";
import {Icon} from "@/components/un-ui/Icon.tsx";
import moment from "moment";
import {SchoolTerms, SchoolTermValue} from "@/type/global.ts";
import {useUserTheme} from "@/js/theme.ts";
import {Color} from "@/js/color.ts";
import {usePagerView} from "react-native-pager-view";
import {CourseCardSetting} from "@/components/tool/infoQuery/courseSchedule/CourseCardSetting.tsx";
import {CourseScheduleContext} from "@/js/jw/course.ts";
import {CourseScheduleView} from "@/components/tool/infoQuery/courseSchedule/CourseScheduleView.tsx";
import {ExamInfo} from "@/type/infoQuery/exam/examInfo.ts";
import {ExamInfoQueryRes} from "@/type/api/infoQuery/examInfoAPI.ts";
import {UserConfigContext} from "@/components/AppProvider.tsx";

export function ScheduleCard() {
    const {userConfig} = useContext(UserConfigContext);
    const {theme} = useTheme();
    const pagerView = usePagerView({pagesAmount: 20});
    const {...rest} = pagerView;

    const [apiRes, setApiRes] = useState<CourseScheduleQueryRes>();
    const {courseScheduleData} = useContext(CourseScheduleContext)!;
    const startDay = moment(courseScheduleData.startDay);

    const realCurrentWeek = Math.ceil(moment.duration(moment().diff(startDay)).asWeeks());
    const [year, setYear] = useState(moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year());
    const [term, setTerm] = useState<SchoolTermValue>(
        moment().isBetween(moment("02", "MM"), moment("08", "MM"), "month", "[]")
            ? SchoolTerms[1][0]
            : SchoolTerms[0][0],
    );
    const [courseScheduleSettingVisible, setCourseScheduleSettingVisible] = useState(false);

    const style = StyleSheet.create({
        card: {
            backgroundColor: Color(theme.colors.background).setAlpha(
                0.05 + ((theme.mode === "dark" ? 0.6 : 0.7) * userConfig.theme.bgOpacity) / 100,
            ).rgbaString,
            borderColor: Color.mix(theme.colors.primary, theme.colors.background, 0.7).rgbaString,
            borderRadius: 5,
            paddingHorizontal: 0,
            marginHorizontal: 5,
            elevation: 0, // Android 去除阴影
            shadowOpacity: 0, // iOS 去除阴影
        },
        cardTitle: {
            paddingHorizontal: 15,
        },
        pagerView: {
            width: "100%",
            height: userConfig.theme.course.timeSpanHeight * 13 + userConfig.theme.course.weekdayHeight + 50,
        },
        bottomSheetContainer: {
            backgroundColor: theme.colors.background,
            padding: "5%",
            borderRadius: 8,
            borderColor: Color.mix(theme.colors.primary, theme.colors.background, 0.8).rgbaString,
            borderWidth: 1,
            marginHorizontal: "4%",
            marginBottom: "5%",
        },
    });

    const [examList, setExamList] = useState<ExamInfo[]>([]);

    async function getExamList() {
        const data = await infoQuery.getExamInfo(year, term);
        if (data?.items) {
            ToastAndroid.show("获取考试信息成功", ToastAndroid.SHORT);
            setExamList(data.items);
            await store.save({key: "examInfo", data});
        } else {
            ToastAndroid.show("获取考试信息失败", ToastAndroid.SHORT);
        }
    }

    async function getCourseSchedule() {
        const data = await infoQuery.getCourseSchedule(year, term);
        if (data?.kbList) {
            ToastAndroid.show("获取课表成功", ToastAndroid.SHORT);
            setApiRes(data);
            await store.save({key: "courseRes", data});
        } else {
            ToastAndroid.show("获取课表失败", ToastAndroid.SHORT);
        }
    }

    async function init() {
        const courseData: CourseScheduleQueryRes = await store.load({key: "courseRes"});
        setApiRes(courseData);
        const examData: ExamInfoQueryRes = await store.load({key: "examInfo"});
        setExamList(examData.items);
        await loadData();
    }

    async function loadData() {
        await getCourseSchedule();
        await getExamList();
    }

    useEffect(() => {
        init();
    }, [year, term]);
    return (
        <Card containerStyle={style.card}>
            <Card.Title style={style.cardTitle}>
                <Flex justifyContent="space-between">
                    <Text h4>日程表</Text>
                    <Flex gap={15} justifyContent="flex-end">
                        {rest.activePage + 1 !== realCurrentWeek && (
                            <Pressable
                                android_ripple={userConfig.theme.ripple}
                                onPress={() => {
                                    rest.setPage(realCurrentWeek - 1);
                                }}>
                                <Icon name="back" size={24} />
                            </Pressable>
                        )}
                        <Pressable
                            android_ripple={userConfig.theme.ripple}
                            onPress={() => setCourseScheduleSettingVisible(true)}>
                            <Icon name="setting" size={24} />
                        </Pressable>
                        <Pressable android_ripple={userConfig.theme.ripple} onPress={loadData}>
                            <Icon name="sync" size={24} />
                        </Pressable>
                    </Flex>
                </Flex>
            </Card.Title>
            <Card.Divider />
            <CourseScheduleView
                showDate
                startDay={startDay}
                courseApiRes={apiRes}
                pageView={pagerView}
                examList={examList}
            />
            {apiRes?.sjkList && (
                <>
                    <Card.Divider />
                    <PracticalCourseList courseList={apiRes.sjkList} />
                </>
            )}
            {/* 课表卡片设置 */}
            <BottomSheet
                isVisible={courseScheduleSettingVisible}
                onBackdropPress={() => setCourseScheduleSettingVisible(false)}>
                <CourseCardSetting
                    containerStyle={style.bottomSheetContainer}
                    year={year}
                    term={term}
                    pageViewRest={rest}
                    onYearChange={setYear}
                    onTermChange={setTerm}
                />
            </BottomSheet>
        </Card>
    );
}
