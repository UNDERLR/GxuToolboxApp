import {BottomSheet, Card, Text} from "@rneui/themed";
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

export function CourseScheduleCard() {
    const {theme, userTheme} = useUserTheme();
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
                0.05 + ((theme.mode === "dark" ? 0.6 : 0.7) * userTheme.bgOpacity) / 100,
            ).rgbaString,
            borderRadius: 5,
            paddingHorizontal: 0,
            marginHorizontal: 5,
            elevation: 0,           // Android 去除阴影
            shadowOpacity: 0,       // iOS 去除阴影
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

    function getCourseSchedule() {
        ToastAndroid.show("刷新课表中...", ToastAndroid.SHORT);
        infoQuery.getCourseSchedule(year, term).then(data => {
            ToastAndroid.show("获取课表成功", ToastAndroid.SHORT);
            setApiRes(data);
            store.save({key: "courseRes", data});
        });
    }

    function init() {
        store.load({key: "courseRes"}).then((data: CourseScheduleQueryRes) => {
            setApiRes(data);
        });
    }

    useEffect(() => {
        init();
        getCourseSchedule();
    }, [year, term]);
    return (
        <Card containerStyle={style.card}>
            <Card.Title style={style.cardTitle}>
                <Flex justifyContent="space-between">
                    <Text h4>课表</Text>
                    <Flex gap={15} justifyContent="flex-end">
                        {rest.activePage + 1 !== realCurrentWeek && (
                            <Pressable
                                android_ripple={userTheme.ripple}
                                onPress={() => {
                                    rest.setPage(realCurrentWeek - 1);
                                }}>
                                <Icon name="back" size={24} />
                            </Pressable>
                        )}
                        <Pressable
                            android_ripple={userTheme.ripple}
                            onPress={() => setCourseScheduleSettingVisible(true)}>
                            <Icon name="setting" size={24} />
                        </Pressable>
                        <Pressable android_ripple={userTheme.ripple} onPress={getCourseSchedule}>
                            <Icon name="sync" size={24} />
                        </Pressable>
                    </Flex>
                </Flex>
            </Card.Title>
            <Card.Divider />
            <CourseScheduleView showDate startDay={startDay} courseApiRes={apiRes} pageView={pagerView} />
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
