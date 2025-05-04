import {BottomSheet, Card, ListItem, Slider, Text} from "@rneui/themed";
import {infoQuery} from "../../../../js/jw/infoQuery.ts";
import {StyleSheet, ToastAndroid, View} from "react-native";
import {store} from "../../../../js/store.ts";
import {CourseScheduleQueryRes} from "../../../../type/api/classScheduleAPI.ts";
import {useEffect, useState} from "react";
import {PracticalCourseList} from "./PracticalCourseList.tsx";
import Flex from "../../../un-ui/Flex.tsx";
import {UnIcon} from "../../../un-ui/UnIcon.tsx";
import moment from "moment";
import {Course, useCourseScheduleData} from "../../../../type/infoQuery/course/course.ts";
import {CourseScheduleTable} from "./CourseScheduleTable.tsx";
import {Picker} from "@react-native-picker/picker";
import {SchoolTerms, SchoolYears} from "../../../../type/global.ts";
import {CourseDetail} from "./CourseDetail.tsx";
import {useUserTheme} from "../../../../js/theme.ts";

export function CourseScheduleCard() {
    const {theme, userTheme} = useUserTheme();
    const [apiRes, setApiRes] = useState<CourseScheduleQueryRes>();
    const {courseScheduleData} = useCourseScheduleData();
    const startDay = moment(courseScheduleData.startDay);

    const realCurrentWeek = Math.ceil(moment.duration(moment().diff(startDay)).asWeeks());
    const [year, setYear] = useState(moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year());
    const [term, setTerm] = useState<string>(
        moment().isBetween(moment("02", "MM"), moment("08", "MM"), "month", "[]")
            ? SchoolTerms[1][0]
            : SchoolYears[0][0],
    );
    const [currentWeek, setCurrentWeek] = useState(realCurrentWeek);
    const [courseScheduleSettingVisible, setCourseScheduleSettingVisible] = useState(false);
    const [courseDetailVisible, setCourseDetailVisible] = useState(false);
    const [activeCourse, setActiveCourse] = useState<Course>({});

    const style = StyleSheet.create({
        bottomSheetContainer: {
            backgroundColor: theme.colors.background,
            padding: "5%",
        },
    });

    function getCourseSchedule() {
        infoQuery
            .getCourseSchedule(year, term)
            .then(data => {
                ToastAndroid.show("刷新课表成功", ToastAndroid.SHORT);
                setApiRes(data);
                store.save({key: "courseRes", data});
            })
            .catch(res => {
                ToastAndroid.show(`刷新课表失败，错误码：${res.status}`, ToastAndroid.SHORT);
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
        <Card>
            <Card.Title>
                <Flex justifyContent="space-between">
                    <Text h4>课表</Text>
                    <Flex gap={15} justifyContent="flex-end">
                        { currentWeek !== realCurrentWeek&&
                            <UnIcon
                                name="back"
                                size={24}
                                onPress={() => {
                                    setCurrentWeek(realCurrentWeek);
                                }}
                            />
                        }
                        <UnIcon
                            name="left"
                            size={24}
                            onPress={() => {
                                if (currentWeek > 1) {
                                    setCurrentWeek(currentWeek - 1);
                                }
                            }}
                        />
                        <UnIcon
                            name="right"
                            size={24}
                            onPress={() => {
                                if (currentWeek < 20) {
                                    setCurrentWeek(currentWeek + 1);
                                }
                            }}
                        />
                        <UnIcon name="setting" size={24} onPress={() => setCourseScheduleSettingVisible(true)} />
                        <UnIcon name="sync" size={24} onPress={getCourseSchedule} />
                    </Flex>
                </Flex>
            </Card.Title>
            <Card.Divider />
            <Flex>
                {currentWeek === realCurrentWeek ? (
                    <Text>（第{currentWeek}周）</Text>
                ) : (
                    <Text>
                        （第{currentWeek}周，目前为第{realCurrentWeek}周）
                    </Text>
                )}
                <Text>点击课程查看详情</Text>
            </Flex>
            <CourseScheduleTable
                onCoursePress={showCourseDetail}
                courseList={apiRes?.kbList ?? []}
                currentWeek={currentWeek}
            />
            {apiRes?.sjkList && (
                <>
                    <Card.Divider />
                    <PracticalCourseList courseList={apiRes.sjkList} />
                </>
            )}
            <BottomSheet
                isVisible={courseScheduleSettingVisible}
                onBackdropPress={() => setCourseScheduleSettingVisible(false)}>
                <View style={style.bottomSheetContainer}>
                    <ListItem bottomDivider>
                        <Flex gap={10}>
                            <Text>课表周数</Text>
                            <Text>{currentWeek}</Text>
                            <Flex>
                                <Slider
                                    step={1}
                                    minimumValue={1}
                                    maximumValue={20}
                                    allowTouchTrack
                                    value={currentWeek}
                                    thumbStyle={{
                                        height: 25,
                                        width: 25,
                                        backgroundColor: theme.colors.grey1,
                                        borderColor: theme.colors.background,
                                        borderWidth: 5,
                                    }}
                                    onValueChange={setCurrentWeek}
                                />
                            </Flex>
                        </Flex>
                    </ListItem>
                    <ListItem bottomDivider>
                        <Flex gap={10}>
                            <Text>学期</Text>
                            <View style={{flex: 1}}>
                                <Picker
                                    {...userTheme.components.Picker}
                                    selectedValue={year}
                                    onValueChange={(v, index) => setYear(v)}>
                                    {Array.from(SchoolYears).map(value => {
                                        return <Picker.Item value={+value[0]} label={value[1]} key={value[0]} />;
                                    })}
                                </Picker>
                            </View>
                            <View style={{flex: 1}}>
                                <Picker
                                    {...userTheme.components.Picker}
                                    selectedValue={term}
                                    onValueChange={(v, index) => setTerm(v)}>
                                    {Array.from(SchoolTerms).map(value => {
                                        return <Picker.Item value={value[0]} label={value[1]} key={value[0]} />;
                                    })}
                                </Picker>
                            </View>
                        </Flex>
                    </ListItem>
                </View>
            </BottomSheet>
            <BottomSheet isVisible={courseDetailVisible} onBackdropPress={() => setCourseDetailVisible(false)}>
                <View style={style.bottomSheetContainer}>
                    <CourseDetail course={activeCourse} />
                </View>
            </BottomSheet>
        </Card>
    );
}
