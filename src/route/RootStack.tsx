import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React, {lazy} from "react";
import {WebViewScreen} from "@/screens/WebViewScreen.tsx";

const Stack = createNativeStackNavigator();

export function RootStack() {
    return (
        <Stack.Navigator
            initialRouteName="main"
            screenOptions={{
                headerShadowVisible: false,
                contentStyle: {backgroundColor: "transparent"},
            }}>
            <Stack.Screen name="main" options={{headerShown: false}} component={lazy(()=>import("@/screens/MainTab.tsx"))} />
            <Stack.Screen
                name="webViewScreen"
                options={{
                    title: "内置浏览器",
                }}
                component={lazy(()=>import("@/screens/WebViewScreen.tsx"))}
            />
        </Stack.Navigator>
    );
}
