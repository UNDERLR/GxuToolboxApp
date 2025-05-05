import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React from "react";
import {MainTab} from "../screens/MainTab.tsx";

const Stack = createNativeStackNavigator();

export function RootStack() {
    return (
        <Stack.Navigator
            initialRouteName="main"
            screenOptions={{
                headerShadowVisible: false,
                contentStyle: {backgroundColor: "transparent"},
            }}>
            <Stack.Screen name="main" options={{headerShown: false}} component={MainTab} />
        </Stack.Navigator>
    );
}
