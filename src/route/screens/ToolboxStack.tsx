import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {ToolboxIndex} from "../../screens/tool/ToolboxIndex.tsx";
import {ExamInfo} from "../../screens/tool/infoQuery/ExamInfo.tsx";
import {ExamScore} from "../../screens/tool/infoQuery/ExamScore.tsx";

const Stack = createNativeStackNavigator();

export function ToolboxStack() {
    return (
        <Stack.Navigator initialRouteName="toolboxIndex">
            <Stack.Screen name="toolboxIndex" component={ToolboxIndex} options={{title: "工具箱"}} />

            {/*  工具  */}
            <Stack.Screen name="examInfo" component={ExamInfo} options={{title: "考试信息查询"}}/>
            <Stack.Screen name="examScore" component={ExamScore} options={{title: "考试成绩查询"}}/>
        </Stack.Navigator>
    );
}
