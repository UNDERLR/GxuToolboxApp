import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {HomeScreen} from "./HomeScreen.tsx";
import {HomeHeaderRight} from "@/components/header/HomeHeaderRight.tsx";
import {Icon} from "@/components/un-ui/Icon.tsx";
import {SettingStack} from "@/route/screens/SettingStack.tsx";
import {ToolboxStack} from "@/route/screens/ToolboxStack.tsx";
import {useUserTheme} from "@/js/theme.ts";
import {Color} from "@/js/color.ts";
import {useTheme} from "@rneui/themed";
import {useContext} from "react";
import {UserConfigContext} from "@/components/AppProvider.tsx";

const Tab = createBottomTabNavigator();

export function MainTab() {
    const {theme} = useTheme();
    const {userConfig} = useContext(UserConfigContext);
    return (
        <Tab.Navigator
            screenOptions={{
                headerShadowVisible: false,
                tabBarActiveTintColor: theme.colors.primary,
                headerStyle: {
                    backgroundColor: Color(theme.colors.background).setAlpha(
                        ((theme.mode === "dark" ? 0.5 : 0.4) * userConfig.theme.bgOpacity) / 100,
                    ).rgbaString,
                },
                sceneStyle: {
                    backgroundColor: Color(theme.colors.background).setAlpha(
                        ((theme.mode === "dark" ? 0.8 : 0.4) * userConfig.theme.bgOpacity) / 100,
                    ).rgbaString,
                },
                tabBarStyle: {
                    backgroundColor: Color(theme.colors.background).setAlpha(
                        ((theme.mode === "dark" ? 0.9 : 0.75) * userConfig.theme.bgOpacity) / 100,
                    ).rgbaString,
                    elevation: 0,           // Android 去除阴影
                    shadowOpacity: 0,       // iOS 去除阴影
                },
            }}>
            <Tab.Screen
                name="home"
                options={{
                    title: "首页",
                    headerRight: HomeHeaderRight,
                    tabBarIcon: props => Icon({name: "home", ...props}),
                }}
                component={HomeScreen}
            />
            <Tab.Screen
                name="tool"
                options={{
                    headerShown: false,
                    title: "工具箱",
                    tabBarIcon: props => Icon({name: "inbox", ...props}),
                }}
                component={ToolboxStack}
            />
            <Tab.Screen
                name="setting"
                options={{
                    title: "设置",
                    headerShown: false,
                    tabBarIcon: props => Icon({name: "setting", ...props}),
                }}
                component={SettingStack}
            />
        </Tab.Navigator>
    );
}
