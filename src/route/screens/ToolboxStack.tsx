import React, {useContext} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {ToolboxIndex} from "@/screens/tool/ToolboxIndex.tsx";
import {ExamInfo} from "@/screens/tool/infoQuery/ExamInfo.tsx";
import {ExamScore} from "@/screens/tool/infoQuery/ExamScore.tsx";
import {Color} from "@/js/color.ts";
import {ClassCourseSchedule} from "@/screens/tool/infoQuery/courseSchedule/ClassCourseSchedule.tsx";
import {EvaluationOverview} from "@/screens/tool/eduEvaluation/EvaluationOverview.tsx";
import {EvaluationDetail} from "@/screens/tool/eduEvaluation/EvaluationDetail.tsx";
import {Button, useTheme} from "@rneui/themed";
import {UserConfigContext} from "@/components/AppProvider.tsx";
import {EvaluationComment} from "@/screens/tool/eduEvaluation/EvaluationComment.tsx";
import {BuildingListScreen} from "@/screens/tool/mapNavigation/BuildingListScreen.tsx";
import {CourseScheduleQuery} from "@/screens/tool/infoQuery/courseSchedule/CourseScheduleQuery.tsx";
import {useNavigation} from "@react-navigation/native";
import {jwxt} from "@/js/jw/jwxt.ts";
import {WidgetPreviewScreen} from "@/screens/tool/widgetPreview/WidgetPreviewScreen.tsx";
import {GPAcalculator} from "@/screens/tool/GPAcalculator/GPAcalculator.tsx";
import {RescheduleNotificationScreen} from "@/screens/tool/notification/RescheduleNotificationScreen.tsx";
import {SelfCourseSelection} from "@/screens/tool/selfSelectedCourses/SelfCourseSelection.tsx";

const Stack = createNativeStackNavigator();

export function ToolboxStack() {
    const {theme} = useTheme();
    const {userConfig} = useContext(UserConfigContext);
    const navigation = useNavigation();
    const headerRightEle = () => {
        return (
            <Button
                type="clear"
                containerStyle={{marginRight: 10}}
                onPress={() => {
                    jwxt.openPageInWebView("/xtgl/index_initMenu.html", navigation);
                }}>
                打开教务
            </Button>
        );
    };
    return (
        <Stack.Navigator
            initialRouteName="toolboxIndex"
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: Color(theme.colors.background).setAlpha(
                        ((theme.mode === "dark" ? 0.7 : 0.9) * userConfig.theme.bgOpacity) / 100,
                    ).rgbaString,
                },
                contentStyle: {
                    backgroundColor: Color(theme.colors.background).setAlpha(
                        ((theme.mode === "dark" ? 0.5 : 0.6) * userConfig.theme.bgOpacity) / 100,
                    ).rgbaString,
                },
                animation: "fade",
                animationDuration: 100,
                headerRight: headerRightEle,
            }}>
            <Stack.Screen
                name="toolboxIndex"
                component={ToolboxIndex}
                options={{
                    title: "工具箱",
                    headerStyle: {
                        backgroundColor: Color(theme.colors.background).setAlpha(
                            ((theme.mode === "dark" ? 0.5 : 0.4) * userConfig.theme.bgOpacity) / 100,
                        ).rgbaString,
                    },
                    contentStyle: {
                        backgroundColor: "transparent",
                    },
                }}
            />

            {/*  工具  */}
            <Stack.Screen name="courseScheduleQuery" component={CourseScheduleQuery} options={{title: "课表查询"}} />
            <Stack.Screen
                name="classCourseSchedule"
                component={ClassCourseSchedule}
                options={{title: "班级课表查询"}}
            />

            <Stack.Screen name="examInfo" component={ExamInfo} options={{title: "考试信息查询"}} />
            <Stack.Screen name="examScore" component={ExamScore} options={{title: "考试成绩查询"}} />
            <Stack.Screen name="reschedulingNews" component={RescheduleNotificationScreen} options={{title: "调课信息查询"}} />
            <Stack.Screen name="gpaCalculator" component={GPAcalculator} options={{title: "GPA计算器"}} />
            <Stack.Screen name="WidgetPreviewScreen" component={WidgetPreviewScreen} options={{title: "小部件预览"}} />
            <Stack.Screen name="SelfSelectedCourse" component={SelfCourseSelection} options={{title: "自主选课"}} />

            <Stack.Screen name="EvaluationOverview" component={EvaluationOverview} options={{title: "期末学生评价"}} />
            <Stack.Screen name="EvaluationDetail" component={EvaluationDetail} options={{title: "学生评价细节"}} />
            <Stack.Screen name="EvaluationComment" component={EvaluationComment} options={{title: "填写评语"}} />

            <Stack.Screen name="PositionListScreen" component={BuildingListScreen} options={{title: "地图导航"}} />
        </Stack.Navigator>
    );
}
