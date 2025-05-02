import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {HomeScreen} from "../screens/HomeScreen.tsx";
import React from "react";
import {HomeHeaderRight} from "../components/header/HomeHeaderRight.tsx";
import {SettingStack} from "./screens/SettingStack.tsx";

const Stack = createNativeStackNavigator();

export function RootStack() {
    return (
        <Stack.Navigator initialRouteName="home">
            <Stack.Screen
                name="home"
                component={HomeScreen}
                options={{
                    title: "首页",
                    headerRight: () => <HomeHeaderRight />,
                }}
            />
            <Stack.Screen name="setting" component={SettingStack} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}
