import {BottomSheet, Card, ListItem, Text} from "@rneui/themed";
import {infoQuery} from "@/js/jw/infoQuery.ts";
import {Pressable, StyleSheet, ToastAndroid, View} from "react-native";
import {store} from "@/js/store.ts";
import {CourseScheduleQueryRes} from "@/type/api/classScheduleAPI.ts";
import {useEffect, useMemo, useState} from "react";
import {PracticalCourseList} from "./PracticalCourseList.tsx";
import Flex from "@/components/un-ui/Flex.tsx";
import {Icon} from "@/components/un-ui/Icon.tsx";
import moment from "moment";
import {
    Course,
    CourseScheduleContext, DefaultCourseScheduleData,
    generateCourseScheduleStyle,
    useCourseScheduleData,
} from "@/type/infoQuery/course/course.ts";
import {CourseScheduleTable} from "./CourseScheduleTable.tsx";
import {Picker} from "@react-native-picker/picker";
import {SchoolTerms, SchoolYears} from "@/type/global.ts";
import {CourseDetail} from "./CourseDetail.tsx";
import {useUserTheme} from "@/js/theme.ts";
import {Color} from "@/js/color.ts";
import {usePagerView} from "react-native-pager-view";
import {UnSlider} from "@/components/un-ui/UnSlider.tsx";

export function CourseScheduleCard() {
    const {theme, userTheme} = useUserTheme();
    const {AnimatedPagerView, ref, ...rest} = usePagerView({pagesAmount: 20});

    const [apiRes, setApiRes] = useState<CourseScheduleQueryRes>();
    const {courseScheduleData, updateCourseScheduleData} = useCourseScheduleData();
    const [courseScheduleStyle, setCourseScheduleStyle] = useState(
        generateCourseScheduleStyle(courseScheduleData, theme),
    );
    const startDay = moment(courseScheduleData.startDay);
    useEffect(() => {
        let newStyle = generateCourseScheduleStyle(courseScheduleData, theme);
        setCourseScheduleStyle(newStyle);
    }, [courseScheduleData, theme]);

    const realCurrentWeek = Math.ceil(moment.duration(moment().diff(startDay)).asWeeks());
    const [year, setYear] = useState(moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year());
    const [term, setTerm] = useState<string>(
        moment().isBetween(moment("02", "MM"), moment("08", "MM"), "month", "[]")
            ? SchoolTerms[1][0]
            : SchoolYears[0][0],
    );
    const [courseScheduleSettingVisible, setCourseScheduleSettingVisible] = useState(false);
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

    function showCourseDetail(course: Course) {
        setActiveCourse(course);
        setCourseDetailVisible(true);
    }

    useEffect(() => {
        init();
        getCourseSchedule();
    }, [year, term]);
    return (
        <CourseScheduleContext.Provider value={{courseScheduleData, courseScheduleStyle}}>
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
                                        courseList={apiRes?.kbList ?? []}
                                        currentWeek={index + 1}
                                    />
                                </View>
                            )),
                        [rest.pages, realCurrentWeek, apiRes?.kbList],
                    )}
                </AnimatedPagerView>
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
                    <View style={style.bottomSheetContainer}>
                        <ListItem bottomDivider>
                            <Text>课程元素高度</Text>
                            <Flex>
                                <UnSlider
                                    step={1}
                                    minimumValue={5}
                                    maximumValue={100}
                                    allowTouchTrack
                                    value={courseScheduleData.style.timeSpanHeight}
                                    onValueChange={v =>
                                        updateCourseScheduleData({
                                            ...courseScheduleData,
                                            style: {...courseScheduleData.style, timeSpanHeight: v},
                                        })
                                    }
                                />
                            </Flex>
                        </ListItem>
                        <ListItem>
                            <Flex gap={10}>
                                <Text>学期</Text>
                                <View style={{flex: 1}}>
                                    <Picker
                                        {...userTheme.components.Picker}
                                        selectedValue={year}
                                        onValueChange={v => setYear(v)}>
                                        {Array.from(SchoolYears).map(value => {
                                            return <Picker.Item value={+value[0]} label={value[1]} key={value[0]} />;
                                        })}
                                    </Picker>
                                </View>
                                <View style={{flex: 1}}>
                                    <Picker
                                        {...userTheme.components.Picker}
                                        selectedValue={term}
                                        onValueChange={v => setTerm(v)}>
                                        {Array.from(SchoolTerms).map(value => {
                                            return <Picker.Item value={value[0]} label={value[1]} key={value[0]} />;
                                        })}
                                    </Picker>
                                </View>
                            </Flex>
                        </ListItem>
                        <ListItem>
                            <Flex gap={10}>
                                <Text>课表周数</Text>
                                <Flex>
                                    <UnSlider
                                        step={1}
                                        minimumValue={1}
                                        maximumValue={20}
                                        allowTouchTrack
                                        value={rest.activePage + 1}
                                        onValueChange={v => rest.setPage(v - 1)}
                                    />
                                </Flex>
                            </Flex>
                        </ListItem>
                    </View>
                </BottomSheet>
                {/* 课表课程信息 */}
                <BottomSheet isVisible={courseDetailVisible} onBackdropPress={() => setCourseDetailVisible(false)}>
                    <View style={style.bottomSheetContainer}>
                        <CourseDetail course={activeCourse} />
                    </View>
                </BottomSheet>
            </Card>
        </CourseScheduleContext.Provider>
    );
}
