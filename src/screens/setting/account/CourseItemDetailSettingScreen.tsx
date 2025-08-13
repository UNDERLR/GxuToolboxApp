import {KeyboardAvoidingView, ScrollView, View} from "react-native";
import {Button, Divider, Text} from "@rneui/themed";
import {useEffect, useState} from "react";
import {Course} from "@/type/infoQuery/course/course.ts";
import {store} from "@/js/store.ts";
import Flex from "@/components/un-ui/Flex.tsx";
import {UnPicker} from "@/components/un-ui/UnPicker.tsx";
import {Picker} from "@react-native-picker/picker";

export function CourseItemDetailSettingScreen() {
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [activeCourseIndex, setActiveCourseIndex] = useState(0);

    async function init() {
        const courseRes = await store.load({
            key: "courseRes",
        });
        console.log(courseRes);
        setCourseList(courseRes?.kbList ?? []);
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <KeyboardAvoidingView style={{padding: "5%"}}>
            <ScrollView style={{paddingBottom: "5%"}}>
                <Flex gap={10}>
                    <Text>示例课程</Text>
                    <View style={{flex: 1}}>
                        <UnPicker selectedValue={activeCourseIndex} onValueChange={setActiveCourseIndex}>
                            {courseList.map((course, index) => (
                                <Picker.Item label={course.kcmc} value={index} key={`course-${index}`} />
                            ))}
                        </UnPicker>
                    </View>
                </Flex>
                <Divider/>
                <Text>已添加的条目</Text>
                <Divider/>
                <Text>已添加的条目</Text>
            </ScrollView>
            <Button>保存</Button>
        </KeyboardAvoidingView>
    );
}
