import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {HomeScreen} from "./HomeScreen.tsx";
import {Icon} from "@/components/un-ui/Icon.tsx";
import {SettingStack} from "@/route/screens/SettingStack.tsx";
import {ToolboxStack} from "@/route/screens/ToolboxStack.tsx";
import {Color} from "@/js/color.ts";
import {Button, useTheme} from "@rneui/themed";
import {useContext} from "react";
import {UserConfigContext} from "@/components/AppProvider.tsx";
import {useNavigation} from "@react-navigation/native";
import {jwxt} from "@/js/jw/jwxt.ts";
import {HomeStack} from "@/route/screens/HomeStack.tsx";

const Tab = createBottomTabNavigator();

export function MainTab() {
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
                    elevation: 0, // Android 去除阴影
                    shadowOpacity: 0, // iOS 去除阴影
                },
                headerRight: headerRightEle,
            }}>
            <Tab.Screen
                name="home"
                options={{
                    headerShown: false,
                    title: "首页",
                    tabBarIcon: props => Icon({name: "home", ...props}),
                }}
                component={HomeStack}
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
