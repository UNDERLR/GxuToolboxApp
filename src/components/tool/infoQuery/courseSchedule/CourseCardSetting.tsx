import React, {useContext} from "react";
import {StyleProp, View, ViewStyle} from "react-native";
import {CheckBox, ListItem, Text} from "@rneui/themed";
import Flex from "@/components/un-ui/Flex.tsx";
import {UnSlider} from "@/components/un-ui/UnSlider.tsx";
import {Picker} from "@react-native-picker/picker";
import {SchoolTerms, SchoolTermValue, SchoolYears} from "@/type/global.ts";
import {usePagerView} from "react-native-pager-view";
import {UnDateTimePicker} from "@/components/un-ui/UnDateTimePicker.tsx";
import moment from "moment/moment";
import {CourseScheduleContext} from "@/js/jw/course.ts";
import {UnPicker} from "@/components/un-ui/UnPicker.tsx";

interface Props {
    containerStyle?: StyleProp<ViewStyle>;
    year?: number;
    term?: SchoolTermValue;
    onYearChange?: (year: number) => void;
    onTermChange?: (term: SchoolTermValue) => void;
    onPageChange?: (page: number) => void;
    pageViewRest: Omit<ReturnType<typeof usePagerView>, "AnimatedPagerView" | "ref">;
}

export function CourseCardSetting(props: Props) {
    const {courseScheduleData, updateCourseScheduleData} = useContext(CourseScheduleContext)!;

    const infoVisibleOptions: Record<keyof typeof courseScheduleData.courseInfoVisible, string> = {
        name: "课程名称",
        position: "上课地点",
        teacher: "教师名称",
    };
    const changeCourseInfoVisible = (key: keyof typeof courseScheduleData.courseInfoVisible, v: boolean) => {
        const newCourseInfoVisible = {...courseScheduleData.courseInfoVisible};
        newCourseInfoVisible[key] = v;
        updateCourseScheduleData({
            ...courseScheduleData,
            courseInfoVisible: newCourseInfoVisible,
        });
    };

    return (
        <View style={props.containerStyle}>
            <ListItem.Subtitle>
                <Text>课程信息可见性</Text>
            </ListItem.Subtitle>
            <ListItem>
                <Flex direction="column" gap={10} alignItems="flex-start">
                    <Flex>
                        {Array(Object.keys(courseScheduleData.courseInfoVisible).length)
                            .fill(null)
                            .map((_, index) => {
                                const key = Object.keys(courseScheduleData.courseInfoVisible)[
                                    index
                                ] as keyof typeof courseScheduleData.courseInfoVisible;
                                const value = courseScheduleData.courseInfoVisible[key];
                                return (
                                    <CheckBox
                                        containerStyle={{padding: 0}}
                                        title={infoVisibleOptions[key]}
                                        checked={value}
                                        iconRight
                                        size={15}
                                        onPress={() => {
                                            changeCourseInfoVisible(key, !value);
                                        }}
                                    />
                                );
                            })}
                    </Flex>
                </Flex>
            </ListItem>
            <ListItem.Subtitle>
                <Text>课程元素高度</Text>
            </ListItem.Subtitle>
            <ListItem>
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
            <ListItem.Subtitle>
                <Text>课程表学期设置</Text>
            </ListItem.Subtitle>
            <ListItem>
                <Flex direction="column">
                    <Flex gap={10}>
                        <Text>学期</Text>
                        <View style={{flex: 1}}>
                            <UnPicker selectedValue={props.year} onValueChange={props.onYearChange}>
                                {SchoolYears.map(value => {
                                    return <Picker.Item value={+value[0]} label={value[1]} key={value[0]} />;
                                })}
                            </UnPicker>
                        </View>
                        <View style={{flex: 1}}>
                            <UnPicker selectedValue={props.term} onValueChange={props.onTermChange}>
                                {SchoolTerms.map(value => {
                                    return <Picker.Item value={value[0]} label={value[1]} key={value[0]} />;
                                })}
                            </UnPicker>
                        </View>
                    </Flex>
                    <Flex gap={10}>
                        <Text>课表起始日</Text>
                        <Flex justifyContent="flex-end">
                            <UnDateTimePicker
                                value={moment(courseScheduleData.startDay).valueOf()}
                                onChange={v => {
                                    updateCourseScheduleData({
                                        ...courseScheduleData,
                                        startDay: moment(v).format("YYYY-MM-DD"),
                                    });
                                }}
                                mode="single"
                                onlyDate
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </ListItem>
            <ListItem.Subtitle>
                <Text>课表周数</Text>
            </ListItem.Subtitle>
            <ListItem>
                <Flex gap={10}>
                    <Flex>
                        <UnSlider
                            step={1}
                            minimumValue={1}
                            maximumValue={20}
                            allowTouchTrack
                            value={props.pageViewRest.activePage + 1}
                            onValueChange={v => props.pageViewRest.setPage(v - 1)}
                        />
                    </Flex>
                </Flex>
            </ListItem>
        </View>
    );
}
