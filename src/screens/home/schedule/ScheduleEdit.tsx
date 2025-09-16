import Flex from "@/components/un-ui/Flex";
import {ScrollView, View} from "react-native";
import {Divider, Text} from "@rneui/themed";
import {UnTermSelector} from "@/components/un-ui/UnTermSelector.tsx";
import React, {useContext, useEffect, useState} from "react";
import {UserConfigContext} from "@/components/AppProvider.tsx";
import {CourseScheduleQueryRes} from "@/type/api/infoQuery/classScheduleAPI.ts";
import {courseApi} from "@/js/jw/course.ts";
import {CourseScheduleView} from "@/components/tool/infoQuery/courseSchedule/CourseScheduleView.tsx";
import {usePagerView} from "react-native-pager-view";
import {UnSlider} from "@/components/un-ui/UnSlider.tsx";

export function ScheduleEdit() {
    const {userConfig} = useContext(UserConfigContext);
    const pageView = usePagerView({pagesAmount: 20});

    const [year, setYear] = useState(userConfig.jw.year);
    const [term, setTerm] = useState(userConfig.jw.term);

    const [courseRes, setCourseRes] = useState<CourseScheduleQueryRes>();

    async function getCourses() {
        const res = await courseApi.getCourseSchedule(year, term)
        console.log(res);
        setCourseRes(res);
    }

    async function init() {
        await getCourses();
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <ScrollView contentContainerStyle={{padding: "5%"}}>
            <Flex gap={10} direction="column" alignItems="flex-start">
                <Flex gap={10}>
                    <Text>学期</Text>
                    <View style={{flex: 1}}>
                        <UnTermSelector
                            year={year}
                            term={term}
                            onChange={(year, term) => {
                                setYear(+year);
                                setTerm(term);
                            }}
                        />
                    </View>
                </Flex>
                <Divider />
                <Text h4>日程预览</Text>
                <Flex style={{padding: 10}}>
                    <UnSlider
                        step={1}
                        minimumValue={1}
                        maximumValue={20}
                        allowTouchTrack
                        value={pageView.activePage + 1}
                        onValueChange={v => pageView.setPage(v - 1)}
                    />
                </Flex>
                <CourseScheduleView pageView={pageView} courseApiRes={courseRes} />
            </Flex>
        </ScrollView>
    );
}
