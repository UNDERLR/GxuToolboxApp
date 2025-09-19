import React, {useContext} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Color} from "@/js/color.ts";
import {Button, useTheme} from "@rneui/themed";
import {UserConfigContext} from "@/components/AppProvider.tsx";
import {useNavigation} from "@react-navigation/native";
import {jwxt} from "@/js/jw/jwxt.ts";
import {HomeScreen} from "@/screens/HomeScreen.tsx";
import {ScheduleEdit} from "@/screens/home/schedule/ScheduleEdit.tsx";

const Stack = createNativeStackNavigator();

export function HomeStack() {
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
            initialRouteName="HomeScreen"
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
                name="HomeScreen"
                options={{
                    title: "首页",
                }}
                component={HomeScreen}
            />
            <Stack.Screen
                name="ScheduleEdit"
                component={ScheduleEdit}
                options={{
                    title: "日程编辑",
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
        </Stack.Navigator>
    );
}
