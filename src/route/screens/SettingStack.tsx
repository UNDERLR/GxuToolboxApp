import React from "react";
import {SettingIndex} from "../../screens/setting/SettingIndex.tsx";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {JWAccountScreen} from "../../screens/setting/account/JWAccountScreen.tsx";

const Stack = createNativeStackNavigator();

export function SettingStack() {
    return (
        <Stack.Navigator initialRouteName="settingIndex">
            <Stack.Screen name="settingIndex" component={SettingIndex} options={{title: "工具箱设置"}} />

            {/*  账号相关  */}
            <Stack.Screen name="jwAccount" component={JWAccountScreen} options={{title: "教务系统账号设置"}} />
        </Stack.Navigator>
    );
}
