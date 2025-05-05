import React from "react";
import {SettingIndex} from "../../screens/setting/SettingIndex.tsx";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {JWAccountScreen} from "../../screens/setting/account/JWAccountScreen.tsx";
import {Color} from "../../js/color.ts";
import {useUserTheme} from "../../js/theme.ts";

const Stack = createNativeStackNavigator();

export function SettingStack() {
    const {theme} = useUserTheme();
    return (
        <Stack.Navigator
            initialRouteName="settingIndex"
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: new Color(theme.colors.background).setAlpha(theme.mode === "dark" ? 0.5 : 0.4)
                        .rgbaString,
                },
                contentStyle: {
                    backgroundColor: "transparent",
                },
            }}>
            <Stack.Screen name="settingIndex" component={SettingIndex} options={{title: "工具箱设置"}} />

            {/*  账号相关  */}
            <Stack.Screen name="jwAccount" component={JWAccountScreen} options={{title: "教务系统账号设置"}} />
        </Stack.Navigator>
    );
}
