import {BottomSheet, Card, ListItem, Slider, Text, useTheme} from "@rneui/themed";
import {infoQuery} from "../../../../js/jw/infoQuery.ts";
import {StyleSheet, ToastAndroid, View} from "react-native";
import {store} from "../../../../js/store.ts";
import {CourseScheduleQueryRes} from "../../../../type/api/classScheduleAPI.ts";
import {useEffect, useState} from "react";
import {PracticalCourseList} from "./PracticalCourseList.tsx";
import Flex from "../../../un-ui/Flex.tsx";
import {UnIcon} from "../../../un-ui/UnIcon.tsx";
import moment from "moment";
import {useCourseScheduleData} from "../../../../type/course.ts";
import {CourseScheduleTable} from "./CourseScheduleTable.tsx";
import PagerView from "react-native-pager-view";
import {Color} from "../../../../js/color.ts";
import {Picker} from "@react-native-picker/picker";
import {SchoolTerms, SchoolYears} from "../../../../type/global.ts";

export function CourseScheduleCard() {
    const {theme} = useTheme();
    const [apiRes, setApiRes] = useState<CourseScheduleQueryRes>();
    const {courseScheduleData} = useCourseScheduleData();
    const startDay = moment(courseScheduleData.startDay);

    const realCurrentWeek = Math.ceil(moment.duration(moment().diff(startDay)).asWeeks());
    const [year, setYear] = useState(moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year());
    const [term, setTerm] = useState<1 | 2 | 3>(
        moment().isBetween(moment("02", "MM"), moment("08", "MM"), "month", "[]") ? 2 : 1,
    );
    const [currentWeek, setCurrentWeek] = useState(realCurrentWeek);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

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

    useEffect(() => {
        init();
        getCourseSchedule();
    }, []);
    return (
        <Card>
            <Card.Title>
                <Flex justifyContent="space-between">
                    <Text h4>课表</Text>
                    {currentWeek === realCurrentWeek ? (
                        <Text>（第{currentWeek}周）</Text>
                    ) : (
                        <Text>
                            （第{currentWeek}周，目前为第{realCurrentWeek}周）
                        </Text>
                    )}
                    <Flex gap={15} justifyContent="flex-end">
                        <UnIcon
                            name="left"
                            size={24}
                            onPress={() => {
                                if (currentWeek > 1) {
                                    setCurrentWeek(currentWeek - 1);
                                }
                            }}
                            color={
                                currentWeek <= 1 ? new Color(theme.colors.black).setAlpha(0.5).rgbaString : undefined
                            }
                        />
                        <UnIcon
                            name="right"
                            size={24}
                            onPress={() => {
                                if (currentWeek < 20) {
                                    setCurrentWeek(currentWeek + 1);
                                }
                            }}
                            color={
                                currentWeek >= 20 ? new Color(theme.colors.black).setAlpha(0.5).rgbaString : undefined
                            }
                        />
                        <UnIcon name="setting" size={24} onPress={() => setBottomSheetVisible(true)} />
                        <UnIcon type="fontawesome" name="repeat" size={24} onPress={getCourseSchedule} />
                    </Flex>
                </Flex>
            </Card.Title>
            <PagerView></PagerView>
            <Card.Divider />
            <CourseScheduleTable courseList={apiRes?.kbList ?? []} currentWeek={currentWeek} />
            {apiRes?.sjkList && (
                <>
                    <Card.Divider />
                    <PracticalCourseList courseList={apiRes.sjkList} />
                </>
            )}
            <BottomSheet
                modalProps={{}}
                isVisible={bottomSheetVisible}
                onBackdropPress={() => setBottomSheetVisible(false)}>
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
                            <View style={{flex:1}}>
                                <Picker selectedValue={year} onValueChange={(v, index) => setYear(index + 1)}>
                                    {Array.from(SchoolYears).map(value => {
                                        return <Picker.Item value={+value[0]} label={value[1]} key={value[0]}/>;
                                    })}
                                </Picker>
                            </View>
                            <View style={{flex:1}}>
                                <Picker selectedValue={+SchoolTerms[term][0]} onValueChange={(v, index) => setTerm(index + 1)}>
                                    {Array.from(SchoolTerms).map(value => {
                                        return <Picker.Item value={+value[0]} label={value[1]} key={value[0]}/>;
                                    })}
                                </Picker>
                            </View>
                        </Flex>
                    </ListItem>
                </View>
            </BottomSheet>
        </Card>
    );
}
