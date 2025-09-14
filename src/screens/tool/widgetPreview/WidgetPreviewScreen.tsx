import * as React from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {WidgetPreview} from "react-native-android-widget";

import {CourseScheduleWidget} from "@/widget/CourseScheduleWidget.tsx";
import {Text} from "@rneui/themed";

import { useWidgetTitle } from "@/widget/widgetData";

export function WidgetPreviewScreen() {
    const {todayCourse,tomorrowCourse} = useWidgetTitle();
    return (
        <View style={styles.container}>
            <WidgetPreview
                renderWidget={() => <CourseScheduleWidget todayCourse={todayCourse} tomorrowCourse={tomorrowCourse} />}
                width={370}
                height={370}
            />
            <ScrollView>
                <Text
                    style={{
                        fontSize: 15,
                        marginTop: 10,
                    }}>
                    课程表（初始大小为1 : 1）
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
