import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React from "react";
import {SettingStack} from "./screens/SettingStack.tsx";
import {MainTab} from "../screens/MainTab.tsx";

const Stack = createNativeStackNavigator();

export function RootStack() {
    return (
        <Stack.Navigator initialRouteName="main">
            <Stack.Screen name="main" options={{headerShown: false}} component={MainTab} />
            <Stack.Screen name="setting" component={SettingStack} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}
