import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {HomeScreen} from "./HomeScreen.tsx";
import {HomeHeaderRight} from "../components/header/HomeHeaderRight.tsx";
import {UnIcon} from "../components/un-ui/UnIcon.tsx";
import {SettingStack} from "../route/screens/SettingStack.tsx";
import {ToolboxStack} from "../route/screens/ToolboxStack.tsx";

const Tab = createBottomTabNavigator();

export function MainTab() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="home"
                options={{
                    title: "首页",
                    headerRight: HomeHeaderRight,
                    tabBarIcon: props => UnIcon({name: "home", ...props}),
                }}
                component={HomeScreen}
            />
            <Tab.Screen
                name="tool"
                options={{
                    headerShown: false,
                    title: "工具箱",
                    tabBarIcon: props => UnIcon({name: "inbox", ...props}),
                }}
                component={ToolboxStack}
            />
            <Tab.Screen
                name="setting"
                options={{
                    title: "设置",
                    headerShown: false,
                    tabBarIcon: props => UnIcon({name: "setting", ...props}),
                }}
                component={SettingStack}
            />
        </Tab.Navigator>
    );
}
