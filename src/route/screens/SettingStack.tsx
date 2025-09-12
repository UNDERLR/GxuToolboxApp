import React, {useContext} from "react";
import {SettingIndex} from "@/screens/setting/SettingIndex.tsx";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {JWAccountScreen} from "@/screens/setting/account/JWAccountScreen.tsx";
import {Color} from "@/js/color.ts";
import {Button, useTheme} from "@rneui/themed";
import {UserConfigContext} from "@/components/AppProvider.tsx";
import {UserPreferenceSettingIndex} from "@/screens/setting/account/UserPreferenceSettingIndex.tsx";
import {CourseItemDetailSettingScreen} from "@/screens/setting/account/CourseItemDetailSettingScreen.tsx";
import {ExamItemDetailSettingScreen} from "@/screens/setting/account/ExamItemDetailSettingScreen.tsx";
import {useNavigation} from "@react-navigation/native";
import {jwxt} from "@/js/jw/jwxt.ts";

const Stack = createNativeStackNavigator();

export function SettingStack() {
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
            initialRouteName="settingIndex"
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
                name="settingIndex"
                component={SettingIndex}
                options={{
                    title: "工具箱设置",
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
            <Stack.Screen
                name="userPreferenceSetting"
                component={UserPreferenceSettingIndex}
                options={{
                    title: "偏好设置",
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

            {/*  账号相关  */}
            <Stack.Screen name="jwAccount" component={JWAccountScreen} options={{title: "教务系统账号设置"}} />

            {/*  偏好设置  */}
            <Stack.Screen
                name="CourseItemDetailSetting"
                component={CourseItemDetailSettingScreen}
                options={{title: "课程元素详情显示"}}
            />
            <Stack.Screen
                name="ExamItemDetailSetting"
                component={ExamItemDetailSettingScreen}
                options={{title: "考试元素详情显示"}}
            />
        </Stack.Navigator>
    );
}
