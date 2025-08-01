import React, {useContext} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {ToolboxIndex} from "@/screens/tool/ToolboxIndex.tsx";
import {ExamInfo} from "@/screens/tool/infoQuery/ExamInfo.tsx";
import {ExamScore} from "@/screens/tool/infoQuery/ExamScore.tsx";
import {Color} from "@/js/color.ts";
import {ClassCourseSchedule} from "@/screens/tool/infoQuery/courseSchedule/ClassCourseSchedule.tsx";
import {StuEvaluation} from "@/screens/tool/eduEvaluation/StuEvaluation.tsx";
import {EvaDetail} from "@/screens/tool/eduEvaluation/EvaDetail.tsx";
import {useTheme} from "@rneui/themed";
import {UserConfigContext} from "@/components/AppProvider.tsx";

const Stack = createNativeStackNavigator();

export function ToolboxStack() {
    const {theme} = useTheme();
    const {userConfig} = useContext(UserConfigContext);
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
            <Stack.Screen
                name="classCourseSchedule"
                component={ClassCourseSchedule}
                options={{title: "班级课表查询"}}
            />

            <Stack.Screen name="examInfo" component={ExamInfo} options={{title: "考试信息查询"}} />
            <Stack.Screen name="examScore" component={ExamScore} options={{title: "考试成绩查询"}} />
            <Stack.Screen name="studentEvaluation" component={StuEvaluation} options={{title: "期末学生评价"}} />
            <Stack.Screen name="EvaDetail" component={EvaDetail} options={{title: "学生评价细节"}} />
        </Stack.Navigator>
    );
}
